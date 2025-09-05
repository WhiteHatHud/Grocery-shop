#!/bin/bash

echo "Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Install uv in the virtual environment if needed
if ! command -v uv &> /dev/null; then
    echo "Installing uv..."
    pip install uv
fi

# Sync dependencies
echo "Syncing backend dependencies..."
uv sync

cd ..

echo "Setting up frontend..."
cd frontend
npm install

cd ..
echo "Setup complete! Run 'npm run dev' to start both servers"