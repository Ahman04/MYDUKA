"""
Stores will have products and inventory.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    merchant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    merchant = relationship("User", backref="stores")
    products = relationship("Product", back_populates="store", cascade="all, delete-orphan")
    inventory_items = relationship("Inventory", back_populates="store", cascade="all, delete-orphan")
    supply_requests = relationship("SupplyRequest", back_populates="store", cascade="all, delete-orphan")
