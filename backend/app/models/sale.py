"""
SQLAlchemy model for sales entries.
"""
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    unit_cost = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    total_cost = Column(Float, nullable=False)

    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    store = relationship("Store")
    product = relationship("Product")

    def __repr__(self):
        return f"<Sale(id={self.id}, product_id={self.product_id}, total={self.total_price})>"
