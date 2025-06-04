from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # База данных
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/green_db")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Пути
    UPLOAD_DIR: str = "uploads"
    LEADS_FILE: str = "leads.json"
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://localhost:8000",  # FastAPI dev server
        "http://127.0.0.1:8000",
    ]
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings() 