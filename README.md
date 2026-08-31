# Document Requirements Analyzer

A traceability-focused application for extracting, organizing, and managing requirements from technical documents.

This project is being built as a full-stack software engineering portfolio project using Next.js, FastAPI, and PostgreSQL.

## Project structure

- `backend/` — FastAPI service. See [backend/README.md](backend/README.md) for setup and run instructions.
- `frontend/` — Next.js app. See [frontend/README.md](frontend/README.md) for setup and run instructions.

## Running the project locally

The frontend talks to the backend over HTTP, so both need to be running at the same time, each in its own terminal.

1. **Start the backend** (see [backend/README.md](backend/README.md) for full detail):

   ```bash
   cd backend
   python -m venv .venv
   source .venv/Scripts/activate   # or .venv/bin/activate on macOS/Linux
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

   Runs at `http://127.0.0.1:8000`. Verify with `curl http://127.0.0.1:8000/health`.

2. **Start the frontend** (see [frontend/README.md](frontend/README.md) for full detail), in a separate terminal:

   ```bash
   cd frontend
   cp .env.example .env.local
   npm install
   npm run dev
   ```

   Runs at `http://localhost:3000`. The `.env.local` file points the frontend at the backend via `NEXT_PUBLIC_API_URL`.

3. Open `http://localhost:3000` in your browser — it should show the backend's health status.
