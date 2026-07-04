# Medical Research Translator (MRT AI)

MRT AI is a full-stack, AI-powered application designed to retrieve, analyze, and synthesize highly technical medical literature into plain-English patient summaries. It uses a robust 6-Agent CrewAI pipeline, backed by ChromaDB vector search and real-time integration with ClinicalTrials.gov and the FDA Open Safety API.

## Architecture 🏗️

- **Frontend**: React (Vite) Single-Page Application (Tailwind CSS, Lucide Icons, React Markdown)
- **Backend**: FastAPI (Python)
- **Database**: SQLite (User Auth) + ChromaDB (Vector Search for medical PDFs)
- **AI Engine**: CrewAI Orchestration powered by `gemini-1.5-flash`

---

## 🚀 Local Development Setup

### 1. Backend (FastAPI + CrewAI)

**Prerequisites**: Python 3.10+

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Export your Gemini API Key (Required for CrewAI):
   ```bash
   export GEMINI_API_KEY="your_api_key_here"  # On Windows: set GEMINI_API_KEY="your_api_key_here"
   ```
5. Start the Uvicorn server:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
   ```

*(Note: On first startup, it will download SentenceTransformer weights for ChromaDB embeddings and auto-ingest a sample PDF. This takes ~15-20 seconds).*

### 2. Frontend (React + Vite)

**Prerequisites**: Node.js 18+

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:8001
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🌐 Production Deployment Guide

### Deploying the Backend to Render

The FastAPI backend can be easily deployed using Render's Web Services.

1. Connect your GitHub repository to Render and create a new **Web Service**.
2. **Settings**:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. **Environment Variables**:
   - `GEMINI_API_KEY`: Your Gemini API Key.
   - `PYTHON_VERSION`: `3.11.0` (Recommended)
4. **Ephemeral Filesystem Strategy**: 
   Because cloud platforms like Render operate on ephemeral containers, any local SQLite data (`users.db`) and ChromaDB vector segments will vanish upon instance idling or deployment updates.
   - *Mitigation*: The application uses a programmatic bootstrap phase during startup. By hooking into the FastAPI `@asynccontextmanager` lifespan, the system automatically triggers a background fetch to the NCBI PMC database for a highly relevant default paper (e.g., `PMC8043444`). This ensures the vector index contains baseline medical embeddings instantly upon booting, removing operational friction for live evaluations.

### Deploying the Frontend to Vercel

The React SPA is optimized for Vercel.

1. Connect your GitHub repository to Vercel.
2. Select the `frontend` directory as the Root Directory.
3. **Build Settings**: Vercel will automatically detect Vite (`npm run build`).
4. **Environment Variables**:
   - `VITE_API_URL`: Set this to your live Render backend URL (e.g., `https://mrtdt-backend.onrender.com`).
5. Deploy!

---

## 🔐 Auth Integration Details
The React frontend handles authentication seamlessly:
- When a user logs in, the FastAPI backend verifies the credentials and returns a securely signed JWT token.
- The React SPA saves this token to `localStorage`.
- All subsequent sensitive requests (like uploading PDFs or triggering the CrewAI analysis) append `Authorization: Bearer <token>` to the HTTP request headers.
- If the token is invalid or missing, FastAPI's `get_current_user` dependency blocks the request and returns a `401 Unauthorized` status.
