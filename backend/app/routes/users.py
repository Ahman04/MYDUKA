# Users routes
# Get current user info route
# Invite user route
# List users route
# Get user by ID route
# Update user route
# Delete user route
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.dependencies import get_db, get_current_user, get_current_active_merchant, get_current_active_admin
from app.core.security import create_invitation_token, get_password_hash
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserSetPassword
from app.models.user import User
from app.models.store import Store

router = APIRouter(prefix="/users", tags=["Users"])

# Get current user info route
@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current authenticated user information"""
    return current_user

# Invite user route
@router.post("/invite", response_model=dict)
def invite_user(
    user_data: UserCreate,
    current_user: User = Depends(get_current_active_merchant),
    db: Session = Depends(get_db)
):
    """Merchant invites admin or clerk"""
    if user_data.role not in ["admin", "clerk"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only invite admins or clerks"
        )
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Validate store_id for clerks
    if user_data.role == "clerk":
        if not user_data.store_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Clerks must be assigned to a store"
            )
        # Verify store belongs to merchant
        store = db.query(Store).filter(Store.id == user_data.store_id).first()
        if not store or store.merchant_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Store not found or does not belong to you"
            )
    
    # Create user (inactive until password is set)
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        role=user_data.role,
        merchant_id=current_user.id,
        store_id=user_data.store_id if user_data.role == "clerk" else None,
        is_active=False  # Inactive until password is set
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create invitation token
    invitation_token = create_invitation_token(
        email=user_data.email,
        role=user_data.role,
        merchant_id=current_user.id
    )
    
    # TODO: Send email with invitation token
    # email_service.send_invitation(user_data.email, invitation_token)
    
    return {
        "message": "User invited successfully",
        "invitation_token": invitation_token,  # Remove in production, send via email
        "user": UserResponse.from_orm(new_user)
    }

# List users route
@router.get("/", response_model=List[UserResponse])
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    role: Optional[str] = None,
    current_user: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
):
    """List users with pagination"""
    query = db.query(User)
    
    # Merchants can see all their admins/clerks
    if current_user.role == "merchant":
        query = query.filter(
            (User.merchant_id == current_user.id) | (User.id == current_user.id)
        )
    # Admins can see clerks in their store
    elif current_user.role == "admin":
        query = query.filter(
            (User.store_id == current_user.store_id) | (User.id == current_user.id)
        )
    
    if role:
        query = query.filter(User.role == role)
    
    users = query.offset(skip).limit(limit).all()
    return users

# Get user by ID route
@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    current_user: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Permission check
    if current_user.role == "merchant":
        if user.merchant_id != current_user.id and user.id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    elif current_user.role == "admin":
        if user.store_id != current_user.store_id and user.id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    return user

# Update user route
@router.patch("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
):
    """Update user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Permission check
    if current_user.role == "merchant":
        if user.merchant_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    elif current_user.role == "admin":
        if user.store_id != current_user.store_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    # Update fields
    if user_update.full_name is not None:
        user.full_name = user_update.full_name
    if user_update.is_active is not None:
        user.is_active = user_update.is_active
    
    db.commit()
    db.refresh(user)
    return user
    
#Delete user route
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(get_current_active_merchant),
    db: Session = Depends(get_db)
):
    """Delete user (only merchants)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.merchant_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only delete users you manage"
        )
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}