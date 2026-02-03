"""
Pydantic schemas for Inventory and SupplyRequest validation
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class PaymentStatus(str, Enum):
    """Payment status"""
    PAID = "paid"
    UNPAID = "unpaid"


class SupplyRequestStatus(str, Enum):
    """Supply request status"""
    PENDING = "pending"
    APPROVED = "approved"
    DECLINED = "declined"


# ===== Inventory Schemas =====
class InventoryCreate(BaseModel):
    """Schema for recording inventory entry"""
    product_id: int
    store_id: int
    quantity_received: int = Field(..., ge=0)
    quantity_in_stock: int = Field(..., ge=0)
    quantity_spoilt: int = Field(..., ge=0)
    payment_status: PaymentStatus = PaymentStatus.UNPAID
    buying_price: float = Field(..., gt=0)
    selling_price: float = Field(..., gt=0)
    remarks: Optional[str] = None


class InventoryUpdate(BaseModel):
    """Schema for updating inventory"""
    quantity_in_stock: Optional[int] = None
    quantity_spoilt: Optional[int] = None
    payment_status: Optional[PaymentStatus] = None
    remarks: Optional[str] = None


class InventoryResponse(BaseModel):
    """Schema for inventory response"""
    id: int
    product_id: int
    store_id: int
    quantity_received: int
    quantity_in_stock: int
    quantity_spoilt: int
    payment_status: str
    buying_price: float
    selling_price: float
    remarks: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ===== Supply Request Schemas =====
class SupplyRequestCreate(BaseModel):
    """Schema for creating supply request"""
    product_id: int
    store_id: int
    quantity_requested: int = Field(..., gt=0)
    reason: Optional[str] = None


class SupplyRequestApprove(BaseModel):
    """Schema for approving supply request"""
    admin_notes: Optional[str] = None


class SupplyRequestDecline(BaseModel):
    """Schema for declining supply request"""
    admin_notes: str = Field(..., min_length=1)


class SupplyRequestResponse(BaseModel):
    """Schema for supply request response"""
    id: int
    product_id: int
    store_id: int
    requested_by: int
    quantity_requested: int
    reason: Optional[str]
    status: str
    admin_notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    approved_at: Optional[datetime]
    
    class Config:
        from_attributes = True
