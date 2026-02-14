
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager
from backend.settings import settings

# Database URL should be in settings, for now using a placeholder or sqlite for local dev if not provided
DATABASE_URL = getattr(settings, "DATABASE_URL", "sqlite:///./verstige_local.db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    from backend.models.db_models import Base
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
