import os
import json
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

# Initialize Firebase Admin SDK
# Try to load credentials from the FIREBASE_SERVICE_ACCOUNT_JSON env var first
# which is the standard secure practice for Render deployments.
firebase_credentials_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")

if firebase_credentials_json:
    try:
        cert_dict = json.loads(firebase_credentials_json)
        cred = credentials.Certificate(cert_dict)
        firebase_admin.initialize_app(cred)
    except json.JSONDecodeError:
        print("ERROR: FIREBASE_SERVICE_ACCOUNT_JSON is not a valid JSON string.")
else:
    # Fallback to local file if it exists, though environment variable is preferred
    local_cert_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "firebase-service-account.json")
    if os.path.exists(local_cert_path):
        cred = credentials.Certificate(local_cert_path)
        firebase_admin.initialize_app(cred)
    else:
        print("WARNING: No Firebase Admin credentials found. Backend authentication will fail.")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        # Verify the Firebase token
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
