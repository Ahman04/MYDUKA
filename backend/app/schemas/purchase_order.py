"""
Pydantic schemas for purchase orders.
"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class PurchaseOrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    unit_cost: float = Field(..., gt=0)
    unit_price: Optional[float] = None


class PurchaseOrderCreate(BaseModel):
    supplier_id: int
    store_id: int
    notes: Optional[str] = None
    items: List[PurchaseOrderItemCreate]


class PurchaseOrderStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None


class PurchaseOrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_cost: float
    unit_price: Optional[float]
    line_total: float

    model_config = ConfigDict(from_attributes=True)


class PurchaseOrderResponse(BaseModel):
    id: int
    supplier_id: int
    store_id: int
    created_by: int
    status: str
    notes: Optional[str]
    total_cost: float
    sent_at: Optional[datetime]
    received_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    items: List[PurchaseOrderItemResponse]

    model_config = ConfigDict(from_attributes=True)


class PurchaseOrderListItem(BaseModel):
    id: int
    supplier_id: int
    supplier_name: str
    store_id: int
    store_name: str
    status: str
    total_cost: float
    created_at: datetime
    sent_at: Optional[datetime]
    received_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
