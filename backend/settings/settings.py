import os
import logging
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    METATRADER_FILES_DIR: str = os.getenv("MT_FILES_DIR", "")
    SERVER_PORT: int = int(os.getenv("PORT", 8000))
    
    # Database (Default to local SQLite if not provided)
    DATABASE_URL: str = "sqlite:///./verstige_local.db"
    
    # Supabase (API)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    if not METATRADER_FILES_DIR:
        logging.warning("MT_FILES_DIR not set in environment variables.")


settings = Settings()
