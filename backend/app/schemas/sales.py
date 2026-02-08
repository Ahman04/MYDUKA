"""
Pydantic schemas for sales.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class SaleCreate(BaseModel):
    store_id: int
    product_id: int
    quantity: int = Field(..., gt=0)
    unit_price: Optional[float] = None
    notes: Optional[str] = None


class SaleResponse(BaseModel):
    id: int
    store_id: int
    product_id: int
    created_by: int
    quantity: int
    unit_price: float
    unit_cost: float
    total_price: float
    total_cost: float
    notes: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
