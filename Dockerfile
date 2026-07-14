# ---- Stage 1: Build frontend ----
FROM node:20-slim AS frontend-build

WORKDIR /frontend

# Copy package files and install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: Backend ----
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libcairo2 \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy built frontend assets to static directory (where backend mounts them)
COPY --from=frontend-build /frontend/dist /app/frontend/static

# Copy backend source code
COPY src/ ./src/

# Create reports directory (used by PDF/Excel generation)
RUN mkdir -p reports

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/src

# Expose port
EXPOSE 8000

# Start the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
