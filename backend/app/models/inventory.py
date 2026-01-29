"""
Tracks stock per product per store: quantity, spoilt items, payment status (paid/unpaid).
Clerks record inventory; recorded_by_id links to the User who created the record.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, Numeric, Boolean, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    quantity = Column(Integer, default=0, nullable=False)
    quantity_spoilt = Column(Integer, default=0, nullable=False)
    is_paid = Column(Boolean, default=False, nullable=False)  # supplier payment status
    notes = Column(String(500), nullable=True)
    recorded_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = relationship("Product", back_populates="inventory_items")
    store = relationship("Store", back_populates="inventory_items")
    recorded_by = relationship("User", backref="inventory_records")
