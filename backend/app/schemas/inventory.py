# Inventory schemas
# Inventory create schema
# Inventory update schema
# Inventory response schema

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InventoryCreate(BaseModel):
    product_id: int
    store_id: int
    quantity: int = 0
    quantity_spoilt: int = 0
    is_paid: bool = False

class InventoryUpdate(BaseModel):
    quantity: Optional[int] = None
    quantity_spoilt: Optional[int] = None
    is_paid: Optional[bool] = None
    notes: Optional[str] = None

class InventoryResponse(BaseModel):
    id: int
    product_id: int
    store_id: int
    quantity: int
    quantity_spoilt: int
    is_paid: bool
    notes: Optional[str]
    recorded_by_id: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True