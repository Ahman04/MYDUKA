"""
SQLAlchemy models for Purchase Orders.
"""
from datetime import datetime, timezone
import enum

from sqlalchemy import Boolean, Column, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class PurchaseOrderStatus(str, enum.Enum):
    DRAFT = "draft"
    SENT = "sent"
    RECEIVED = "received"
    CANCELLED = "cancelled"


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    status = Column(String(20), default=PurchaseOrderStatus.DRAFT)
    notes = Column(Text, nullable=True)
    total_cost = Column(Float, nullable=False, default=0.0)

    sent_at = Column(DateTime, nullable=True)
    received_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    supplier = relationship("Supplier")
    store = relationship("Store")
    created_by_user = relationship("User")
    items = relationship("PurchaseOrderItem", back_populates="purchase_order", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<PurchaseOrder(id={self.id}, status={self.status})>"


class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"

    id = Column(Integer, primary_key=True, index=True)
    purchase_order_id = Column(Integer, ForeignKey("purchase_orders.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)

    quantity = Column(Integer, nullable=False)
    unit_cost = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=True)
    line_total = Column(Float, nullable=False, default=0.0)

    purchase_order = relationship("PurchaseOrder", back_populates="items")
    product = relationship("Product")

    def __repr__(self):
        return f"<PurchaseOrderItem(id={self.id}, product_id={self.product_id})>"
