"""
Pydantic schemas for return requests.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ReturnCreate(BaseModel):
    store_id: int
    product_id: int
    quantity: int = Field(..., gt=0)
    return_type: str = "supplier"
    reason: Optional[str] = None


class ReturnStatusUpdate(BaseModel):
    status: str
    reason: Optional[str] = None


class ReturnResponse(BaseModel):
    id: int
    store_id: int
    product_id: int
    quantity: int
    return_type: str
    status: str
    reason: Optional[str]
    created_by: int
    handled_by: Optional[int]
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
