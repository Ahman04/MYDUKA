"""
SQLAlchemy model for expenses.
"""
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    category = Column(String(120), nullable=False, index=True)
    description = Column(Text, nullable=True)
    amount = Column(Float, nullable=False)
    incurred_at = Column(DateTime, default=utc_now)
    created_at = Column(DateTime, default=utc_now)

    store = relationship("Store")

    def __repr__(self):
        return f"<Expense(id={self.id}, amount={self.amount})>"
