from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SupplyRequestCreate(BaseModel):
    product_id: int
    store_id: int
    quantity: int
    reason: Optional[str] = None

class SupplyRequestUpdate(BaseModel):
    status: str  # pending, approved, declined
    reason: Optional[str] = None

class SupplyRequestResponse(BaseModel):
    id: int
    product_id: int
    store_id: int
    requested_by_id: int
    quantity: int
    reason: Optional[str]
    status: str
    reviewed_by_id: Optional[int]
    reviewed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
