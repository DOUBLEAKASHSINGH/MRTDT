from contextlib import asynccontextmanager
import os
import uuid
from typing import List, Any
from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.ingestion.pdf_parser import process_pdf
from app.db.chroma import store_chunks
from app.agents.crew_setup import create_expanded_medical_crew
from app.ingestion.pmc_api import fetch_and_ingest
from app.auth.dependencies import get_current_user

app = FastAPI(title="Medical Research Translator API")

# 1. Wide-open CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str

def process_multiple_uploads(file_paths: List[str]):
    for file_path in file_paths:
        try:
            document_id = f"upload_{uuid.uuid4().hex[:8]}"
            print(f"Processing background upload for {document_id}")
            # 3. Extract and chunk text using PyMuPDF pipeline and LangChain
            chunks = process_pdf(file_path)
            # Store in ChromaDB collection 'medical_papers'
            store_chunks(document_id, chunks)
        except Exception as e:
            print(f"Failed to process upload {file_path}: {e}")

# 4. Analyze endpoint accepting JSON body
@app.post("/analyze")
async def analyze(request: QueryRequest, user: dict = Depends(get_current_user)):
    try:
        crew = create_expanded_medical_crew()
        result = await crew.kickoff_async(inputs={"question": request.question})
        return {"answer": str(result.raw)}
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=str(e))

import glob
from fastapi.responses import FileResponse

@app.get("/download-latest-report")
async def download_latest_report():
    list_of_files = glob.glob('reports/*.pdf')
    if not list_of_files:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="No report found")
    latest_file = max(list_of_files, key=os.path.getctime)
    return FileResponse(path=latest_file, media_type="application/pdf", filename="Clinical_Report.pdf")

# 2. Upload endpoint accepting a list of files
@app.post("/upload")
async def upload(background_tasks: BackgroundTasks, files: List[UploadFile] = File(...), user: dict = Depends(get_current_user)):
    upload_dir = "../data/raw"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        
    saved_file_paths = []
    
    # Loop through every uploaded PDF
    for file in files:
        file_path = os.path.join(upload_dir, f"paper_{uuid.uuid4().hex[:8]}_{file.filename}")
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
        saved_file_paths.append(file_path)
        
    # Trigger background ingestion
    background_tasks.add_task(process_multiple_uploads, saved_file_paths)

    
    return {
        "status": "indexing", 
        "files_received": len(files),
        "filenames": [f.filename for f in files]
    }
