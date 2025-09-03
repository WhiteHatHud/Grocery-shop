# Grocery Shop Project

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Grocery-shop
```

### 2. Spin up backend and frontend (recommended: Docker Compose)
```bash
docker compose up --build
```
- This will build and start the backend (FastAPI), frontend (React), and PostgreSQL database.

### 3. Manual (local) development
#### Backend
```bash
cd backend
uv run uvicorn main:app --reload
```
#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the application
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Frontend:** [http://localhost:8081](http://localhost:8081)

---

## Notes
- Make sure you have Docker, Node.js, and Python 3.11+ installed for local development.
- Environment variables for database and API are set in `.env` files in each service.
- For image uploads, use direct image URLs or the backend image proxy endpoint.
