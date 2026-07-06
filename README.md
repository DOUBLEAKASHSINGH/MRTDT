# Medical Research Translator (MRT AI)

MRT AI is an enterprise-grade, full-stack, RAG-powered (Retrieval-Augmented Generation) platform engineered to retrieve, analyze, and synthesize highly dense, technical biomedical literature into empathetic, plain-English patient summaries. 

Backed by a robust **6-Agent CrewAI pipeline**, a specialized vector embedding layer, and real-time medical API grounding integrations, MRT AI bridges the communication gap between clinical discovery and patient comprehension.

---

## The Problem We Are Solving

1. **The Patient Translation Barrier:** Patients facing complex diagnoses are frequently handed dense, clinical trial literature, pathology reports, or academic journal articles full of impenetrable jargon. This creates immense cognitive friction and post-appointment panic.
2. **The Hallucination Window of Generic LLMs:** Standard chat interfaces (like ChatGPT or Claude) analyze uploaded documents in a vacuum. When encountering unfamiliar medical anomalies or specific drug regimens, they synthesize "convincing but dangerously hallucinated" clinical facts, missing crucial safety profiles or real-world timelines.
3. **The "Frozen in Time" Knowledge Gap:** Medical knowledge advances daily. Generic models rely on fixed training cutoff dates, making them completely blind to active clinical trials, newly declared adverse side-effects, or emergent FDA black-box warnings.
4. **The Doctor Time Constraint:** Modern medical professionals are structurally limited to brief patient consultations. They lack the time to run extensive background searches across disparate global clinical registries to assemble custom plain-language guidebooks for every single patient.

---

## The Moat (Defensible Engineering Advantage)

Unlike typical single-prompt AI wrappers, MRT AI establishes a highly defensible technical moat across three structural design layers:

* **Programmatic Multi-Agent Separation:** By breaking down text synthesis into a sequential pipeline of 6 isolated agents, the application forces rigorous peer-review and data hand-offs. Agents are programmatically banned from guessing; an agent cannot output content unless it is strictly grounded by the previous agent's facts or an external data schema.
* **Live Global API Grounding Matrix:** The core orchestration layer doesn't rely on pre-trained memory. It actively hits real-world clinical nodes live during execution:
  * **ClinicalTrials.gov API** to verify ongoing human studies, matching criteria, and recruiting locations.
  * **openFDA API** to ingest active drug warnings, recall mandates, and adverse event profiles.
  * **NCBI PubMed API** to reference baseline NIH guideline alignment.
* **Deterministic Structured Report Synthesis:** Instead of returning free-form markdown that looks like a generic chatbot output, the system outputs a fixed data manifest. This manifest is programmatically compiled into a standardized, production-ready, downloadable PDF using strict corporate styling boundaries.

---

## Architecture

* **Frontend:** React (Vite) multi-page architecture styled with Tailwind CSS, using Lucide Icons for real-time tracking visualization and React Router for view orchestration.
* **Backend:** FastAPI (Python) high-performance async framework.
* **Authentication:** Firebase Authentication (Client SDK token generation + Python Admin SDK verification).
* **Database & Vector Index:** ChromaDB (Vector Search & Document Chunk Embedding) using localized SentenceTransformer weights.
* **AI Engine:** CrewAI multi-agent state execution powered by `gemini-1.5-flash`.

---

## Local Development Setup

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

## Production Deployment Guide

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

5. **Multi-Agent Latency UI Deception**:
   A sequential traversal through 6 distinct agent loops (with 4 making external API connections) requires anywhere from 15 to 45 seconds depending on upstream provider queues.
   - *Mitigation*: A standard global spinner induces user fatigue and high bounce rates. The frontend implements a time-bound state-machine engine that synchronizes with the typical runtime performance profiles of each agent. By flashing explicit functional status descriptions linked to relevant icons (e.g., checking safety sheets, querying molecular trial registries), the user is provided with continuous psychological validation of system progress.

6. **OAuth2 Compliance & Token Lifecycle**:
   To meet security standards, the application decouples standard JSON request payloads from authentication entry points. The `/auth/login` endpoint strictly requires `application/x-www-form-urlencoded` payloads via `OAuth2PasswordRequestForm`. Downstream verification is enforced globally via FastAPI dependency injection, keeping token validation detached from core domain logic.

---

## Troubleshooting Common Issues

### 1. Is the FastAPI Backend Actually Running?
A "Failed to fetch" error almost always means the server is offline or unreachable.

**The Fix**: Open a separate terminal window, navigate to your backend directory, and ensure your server is actively running.

Usually, this is the command: 
```bash
uvicorn app.main:app --reload --port 8001
```

Look for the line in the terminal that says: `Application startup complete` and note the URL (e.g. `http://127.0.0.1:8001` or `http://0.0.0.0:8001`). Ensure this matches your frontend's `VITE_API_URL`.

### Deploying the Frontend to Vercel

The React SPA is optimized for Vercel.

1. Connect your GitHub repository to Vercel.
2. Select the `frontend` directory as the Root Directory.
3. **Build Settings**: Vercel will automatically detect Vite (`npm run build`).
4. **Environment Variables**:
   - `VITE_API_URL`: Set this to your live Render backend URL (e.g., `https://mrtdt-backend.onrender.com`).
5. Deploy!

---

## Auth Integration Details
The React frontend handles authentication seamlessly:
- When a user logs in, the FastAPI backend verifies the credentials and returns a securely signed JWT token.
- The React SPA saves this token to `localStorage`.
- All subsequent sensitive requests (like uploading PDFs or triggering the CrewAI analysis) append `Authorization: Bearer <token>` to the HTTP request headers.
- If the token is invalid or missing, FastAPI's `get_current_user` dependency blocks the request and returns a `401 Unauthorized` status.
