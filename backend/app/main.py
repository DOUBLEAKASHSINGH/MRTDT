from contextlib import asynccontextmanager
import os
import uuid
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.ingestion.pdf_parser import process_pdf
from app.db.chroma import store_chunks
from app.agents.crew_setup import create_expanded_medical_crew
from app.ingestion.pmc_api import fetch_and_ingest

from app.db.database import engine, Base
from app.auth.routes import router as auth_router
from app.auth.dependencies import get_current_user
from app.db.models import User

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-index a sample paper on startup (Phase 6 Render workaround)
    print("Starting auto-ingestion for ephemeral filesystem...")
    try:
        fetch_and_ingest("PMC8043444")
        print("Auto-ingestion complete!")
    except Exception as e:
        print(f"Auto-ingestion failed: {e}")
    yield
    print("Shutting down...")

app = FastAPI(title="Medical Research Translator API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

def upload_task(file_path: str, document_id: str):
    try:
        # Extract and chunk text using PyMuPDF pipeline
        chunks = process_pdf(file_path)
        # Store in ChromaDB
        store_chunks(document_id, chunks)
    except Exception as e:
        print(f"Failed to process upload {document_id}: {e}")

@app.post("/analyze")
async def analyze(question: str, current_user: User = Depends(get_current_user)):
    crew = create_expanded_medical_crew()
    result = crew.kickoff(inputs={"question": question})
    return {"answer": str(result.raw)}

@app.post("/upload")
async def upload(background_tasks: BackgroundTasks, file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    # save temp
    upload_dir = "../data/raw"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        
    document_id = f"upload_{uuid.uuid4().hex[:8]}"
    file_path = os.path.join(upload_dir, f"paper_{document_id}.pdf")
    
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)
        
    # extract text with PyMuPDF, chunk, embed, add to collection
    background_tasks.add_task(upload_task, file_path, document_id)
    
    return {"status": "indexed", "filename": file.filename}
