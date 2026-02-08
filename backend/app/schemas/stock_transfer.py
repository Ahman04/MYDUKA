"""
Pydantic schemas for stock transfers.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class StockTransferCreate(BaseModel):
    from_store_id: int
    to_store_id: int
    product_id: int
    quantity: int = Field(..., gt=0)
    notes: Optional[str] = None


class StockTransferStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None


class StockTransferResponse(BaseModel):
    id: int
    from_store_id: int
    to_store_id: int
    product_id: int
    quantity: int
    status: str
    notes: Optional[str]
    created_by: int
    approved_by: Optional[int]
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
