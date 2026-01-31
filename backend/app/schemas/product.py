# Product schemas
# Product create schema
# Product update schema
# Product response schema
from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime

class ProductCreate(BaseModel):
    name: str
    buying_price: Optional[Decimal] = None
    selling_price: Optional[Decimal] = None
    store_id: int

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    buying_price: Optional[Decimal] = None
    selling_price: Optional[Decimal] = None

class ProductResponse(BaseModel):
    id: int
    name: str
    buying_price: Optional[Decimal]
    selling_price: Optional[Decimal]
    store_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True