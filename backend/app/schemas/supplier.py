"""
Pydantic schemas for Supplier.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class SupplierCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    store_id: Optional[int] = None
    contact_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    store_id: Optional[int] = None
    contact_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    is_active: Optional[bool] = None


class SupplierResponse(BaseModel):
    id: int
    store_id: Optional[int]
    name: str
    contact_name: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    address: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
