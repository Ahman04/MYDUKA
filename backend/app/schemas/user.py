# User schemas
# User create schema
# User update schema
# User set password schema
# User login schema
# User response schema

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Request Schemas
class UserCreate(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str  # merchant, admin, clerk
    password: Optional[str] = None  # None for invited users
# Update Schema
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

# Set Password Schema
class UserSetPassword(BaseModel):
    password: str
# Login Schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Response Schemas
class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    role: str
    is_active: bool
    merchant_id: Optional[int] = None
    store_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
# Config
    class Config:
        from_attributes = True  # For SQLAlchemy models

# Token Response Schema
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"