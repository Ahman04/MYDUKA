"""
Database configuration and session management
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from typing import Generator
from .config import settings

# Create database engine
if settings.database_driver == "sqlite":
    engine = create_engine(
        settings.database_url,
        echo=settings.debug,
        pool_pre_ping=True,
    )
else:
    engine = create_engine(
        settings.database_url,
        echo=settings.debug,
        pool_pre_ping=True,
    )

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base class for all models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to get database session
    Usage: In your route: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
