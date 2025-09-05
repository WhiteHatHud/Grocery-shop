### `main.py`
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from core.config import settings
from db.database import engine
from db.init_db import init_db
from models import Base
from routers import auth, admin, posts, health

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up...")
    Base.metadata.create_all(bind=engine)
    init_db()
    yield
    # Shutdown
    logger.info("Shutting down...")

app = FastAPI(
    title=settings.APP_NAME,
    description="A simple content backend for recipes and tech projects",
    version=settings.APP_VERSION,
    docs_url=settings.DOCS_URL,
    redoc_url=settings.REDOC_URL,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8081", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
api_prefix = settings.API_PREFIX or ""
app.include_router(health.router, prefix=f"{api_prefix}/health", tags=["health"])
app.include_router(auth.router, prefix=f"{api_prefix}/auth", tags=["auth"])
app.include_router(admin.router, prefix=f"{api_prefix}/admin", tags=["admin"])
app.include_router(posts.router, prefix=f"{api_prefix}/posts", tags=["posts"])

@app.get("/")
async def root():
    return {
        "message": "Recipe/Tech Backend API",
        "version": settings.APP_VERSION,
        "docs": settings.DOCS_URL
    }