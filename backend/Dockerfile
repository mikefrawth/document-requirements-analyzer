# Base image: minimal Debian + Python 3.12 preinstalled
FROM python:3.12-slim

# All following commands run relative to /app inside the container
WORKDIR /app

# Copy just the dependency list first so Docker can cache this layer —
# it only reruns pip install if requirements.txt actually changes
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Now copy the actual application code
COPY app ./app

# Documents that this container listens on 8000 (doesn't publish it — that's compose's job)
EXPOSE 8000

# Start the ASGI server: bind to all interfaces so it's reachable from outside
# the container, and auto-reload on code changes for dev
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]