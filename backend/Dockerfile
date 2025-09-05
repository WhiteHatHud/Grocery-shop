# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install uv
RUN pip install uv

# Copy dependency files
COPY pyproject.toml .
COPY uv.lock* .

# Install dependencies
RUN uv venv .venv && \
    . .venv/bin/activate && \
    uv sync --frozen

# Copy application code
COPY . .

# Expose port (Render will set PORT env variable)
EXPOSE 8000

# Use PORT environment variable from Render
CMD ["/app/.venv/bin/python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]