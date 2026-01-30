# Roles: merchant (superuser), admin (store admin), clerk (data entry).
# - Merchant: owns stores; no merchant_id or store_id.
# - Admin: belongs to a merchant (merchant_id), optionally to a store (store_id).
# - Clerk: belongs to a store (store_id) and thus to that store's merchant.

from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)  # null until invited user sets password
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), nullable=False)  # merchant,admin,clerk
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Admin/Clerk: who they belong to
    merchant_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=True)

    # Self-referential: merchant's admins
    merchant = relationship("User", remote_side=[id], backref="admins")
    # Clerks/admins linked to a store (string "Store" avoids circular import)
    store = relationship("Store", backref="clerks", foreign_keys=[store_id])
