#!/usr/bin/env bash
set -e

echo "Starting BIS-GPT Backend in Development Mode..."
export PYTHONPATH=.

# Seed mock database if not already populated
python3 scripts/seed_bis_data.py || true

# Start FastAPI server with live auto-reload
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
