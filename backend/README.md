# Backend

FastAPI service for the Document Requirements Analyzer.

## Prerequisites

- Python 3.11+ (any recent 3.x works)

## Setup

From the `backend/` directory:

```bash
python -m venv .venv
```

Activate the virtual environment:

- **Bash / Git Bash (Windows):** `source .venv/Scripts/activate`
- **PowerShell (Windows):** `.venv\Scripts\Activate.ps1`
- **macOS / Linux:** `source .venv/bin/activate`

Install dependencies:

```bash
pip install -r requirements.txt
```

> If you ever regenerate `requirements.txt` from PowerShell, use
> `pip freeze | Out-File -Encoding utf8 requirements.txt` — a plain `>` redirect
> in PowerShell defaults to UTF-16, which pip cannot parse.

## Running the server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## Verifying it works

```bash
curl http://127.0.0.1:8000/health
```

Expected response:

```json
{"status": "ok"}
```

You can also check the auto-generated interactive docs at
`http://127.0.0.1:8000/docs`.

## Connecting the frontend

The frontend reads the backend URL from `NEXT_PUBLIC_API_URL` (see
`frontend/.env.example`). By default this points at
`http://127.0.0.1:8000`, matching uvicorn's default host/port above.
