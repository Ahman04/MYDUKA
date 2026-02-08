"""
SQLAlchemy model for product returns.
"""
from datetime import datetime, timezone
import enum

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class ReturnType(str, enum.Enum):
    SUPPLIER = "supplier"
    CUSTOMER = "customer"


class ReturnStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    COMPLETED = "completed"
    REJECTED = "rejected"


class ReturnRequest(Base):
    __tablename__ = "returns"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)

    return_type = Column(String(20), default=ReturnType.SUPPLIER)
    status = Column(String(20), default=ReturnStatus.PENDING)
    reason = Column(Text, nullable=True)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    handled_by = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
    completed_at = Column(DateTime, nullable=True)

    store = relationship("Store")
    product = relationship("Product")

    def __repr__(self):
        return f"<ReturnRequest(id={self.id}, status={self.status}, type={self.return_type})>"
