"""
Pydantic schemas for expenses.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ExpenseCreate(BaseModel):
    store_id: int
    category: str = Field(..., min_length=1, max_length=120)
    amount: float = Field(..., gt=0)
    description: Optional[str] = None
    incurred_at: Optional[datetime] = None


class ExpenseResponse(BaseModel):
    id: int
    store_id: int
    created_by: int
    category: str
    amount: float
    description: Optional[str]
    incurred_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
