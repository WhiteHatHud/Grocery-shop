# Recipe/Tech Backend

A minimal but production-ready backend for showcasing recipes and tech projects.

## Features

- 🔐 Admin authentication with JWT tokens
- 📝 Full CRUD operations for posts
- 🔍 Search and filter capabilities
- 📊 Pagination support
- 🏷️ Tag-based categorization
- 📱 CORS configuration
- 🗃️ SQLite database with migration-ready structure

## Quick Start

### Prerequisites

- Python 3.11+
- uv (https://github.com/astral-sh/uv)

### Installation

```bash
git clone <repository-url>
cd backend

# Initialize with uv
uv venv
uv pip install -e .

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Run the application
uv run uvicorn main:app --reload