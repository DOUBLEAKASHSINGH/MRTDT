import requests
import time
import subprocess
import os

BASE_URL = "http://localhost:8001"

import sys
import subprocess
def test_auth_flow():
    # Start server
    server = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--port", "8001"],
        cwd=os.path.dirname(os.path.abspath(__file__))
    )
    time.sleep(20)  # Wait for server to start (ChromaDB loads weights)
    try:
        # 1. Signup
        print("\n--- Testing Signup ---")
        res = requests.post(f"{BASE_URL}/auth/signup", json={"email": "test@example.com", "password": "password123"})
        print("Signup:", res.status_code, res.json())
        
        # 2. Login
        print("\n--- Testing Login ---")
        res = requests.post(f"{BASE_URL}/auth/login", data={"username": "test@example.com", "password": "password123"})
        print("Login:", res.status_code, res.json())
        token = res.json().get("access_token")

        # 3. Analyze Without Token (Should fail)
        print("\n--- Testing Protected Route (No Token) ---")
        res = requests.post(f"{BASE_URL}/analyze?question=test")
        print("Analyze No Token:", res.status_code, res.json())

        # 4. Analyze With Token (Should succeed/reach CrewAI)
        # Note: We won't let it run full CrewAI to save time, just check if it gets past auth. 
        # Actually it will run CrewAI if it gets past auth. Let's just check the headers.
        print("\n--- Testing Protected Route (With Token) ---")
        headers = {"Authorization": f"Bearer {token}"}
        # To avoid a slow LLM call, we'll just assume if it doesn't return 401, auth works.
        # But we'll run it anyway and it might take 10s.
        res = requests.post(f"{BASE_URL}/analyze?question=test", headers=headers)
        print("Analyze With Token:", res.status_code)
        
    except Exception as e:
        print("Error:", e)
    finally:
        server.terminate()

if __name__ == "__main__":
    test_auth_flow()
