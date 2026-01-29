# engine: connects to PostgreSQL using the URL from config.
# SessionLocal: factory for creating a new DB session per request.
# Base: all models will inherit from this so SQLAlchemy (and Alembic) know about them.

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import get_settings

settings = get_settings()
engine = create_engine(
    settings.database_url,
    echo=settings.debug,  # set True to log SQL in dev
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Yields a DB session; use this as a FastAPI dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
