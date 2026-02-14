import os
import logging
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    METATRADER_FILES_DIR: str = os.getenv("MT_FILES_DIR", "")
    SERVER_PORT: int = int(os.getenv("PORT", 8000))

    if not METATRADER_FILES_DIR:
        logging.warning("MT_FILES_DIR not set in environment variables.")


settings = Settings()
