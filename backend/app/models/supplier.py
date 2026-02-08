"""
SQLAlchemy model for Supplier entity.
"""
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=True, index=True)

    name = Column(String(255), nullable=False, index=True)
    contact_name = Column(String(255), nullable=True)
    phone = Column(String(40), nullable=True)
    email = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    store = relationship("Store")

    def __repr__(self):
        return f"<Supplier(id={self.id}, name={self.name})>"
