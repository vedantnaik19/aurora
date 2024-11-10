FROM python:3.11-slim

WORKDIR /app

# Install system dependencies including PyMuPDF requirements
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    libglib2.0-0 \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxcb1 \
    libxkbcommon0 \
    libatspi2.0-0 \
    libx11-6 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libmupdf-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Set Python path
ENV PYTHONPATH=/app

# Install poetry with pip and configure it
RUN pip install --no-cache-dir poetry==1.4.2 \
    && poetry config virtualenvs.create false

# Copy only dependency files first
COPY pyproject.toml ./

# Install dependencies with verbose output for debugging
RUN poetry install --no-interaction --no-ansi --verbose

# Install playwright and browsers
RUN poetry run playwright install --with-deps chromium
RUN poetry run playwright install-deps

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Update CMD to use uvicorn directly
CMD ["poetry", "run", "python", "backend/server.py"]
