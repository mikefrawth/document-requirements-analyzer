# Import the FastAPI class
from fastapi import FastAPI

# Create a FastAPI application instance named app
# Give it the title "Document Requirements Analyzer API"
app = FastAPI(title="Document Requirements Analzer API")


# Register an HTTP GET endpoint at /health
@app.get("/health")

# When /health is requested:
#     Return a JSON-compatible dictionary containing:
#         status: "ok"
def health_check() -> dict[str, str]:
    return {"status": "ok"}
