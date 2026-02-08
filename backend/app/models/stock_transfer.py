"""
SQLAlchemy model for stock transfers between stores.
"""
from datetime import datetime, timezone
import enum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class TransferStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class StockTransfer(Base):
    __tablename__ = "stock_transfers"

    id = Column(Integer, primary_key=True, index=True)
    from_store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)
    to_store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)

    status = Column(String(20), default=TransferStatus.PENDING)
    notes = Column(Text, nullable=True)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
    completed_at = Column(DateTime, nullable=True)

    from_store = relationship("Store", foreign_keys=[from_store_id])
    to_store = relationship("Store", foreign_keys=[to_store_id])
    product = relationship("Product")

    def __repr__(self):
        return f"<StockTransfer(id={self.id}, status={self.status})>"
