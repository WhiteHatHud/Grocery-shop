from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
import os

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    # Application
    APP_NAME: str = "Recipe Tech Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Admin
    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str
    
    # Database - UPDATED: Remove hardcoded default, let it come from env
    DATABASE_URL: str
    
    # CORS - UPDATED: Added both www and non-www versions
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000", 
        "http://localhost:8000", 
        "http://localhost:8080", 
        "https://www.wfhubby.com",
        "https://wfhubby.com"  # Added non-www version
    ]

    # API
    API_PREFIX: str = ""
    DOCS_URL: str = "/docs"
    REDOC_URL: str = "/redoc"
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    # UPDATED: Validate and fix DATABASE_URL
    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def validate_database_url(cls, v):
        if not v:
            # Fallback for local development only
            return "sqlite:///./app.db"
        # Fix postgres:// to postgresql:// for SQLAlchemy
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v
    
    #S3 Bucket
    # AWS S3 Settings
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str
    S3_BUCKET_NAME: str
    

settings = Settings()

# Debug print (remove in production)
print(f"Loaded DATABASE_URL: {settings.DATABASE_URL[:30]}..." if settings.DATABASE_URL else "No DATABASE_URL!")