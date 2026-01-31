# Authentication routes
# Login route
# Register route
# Set password route
# Refresh token route
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.core.security import (
    verify_password, get_password_hash,
    create_access_token, create_refresh_token,
    decode_token, decode_invitation_token
)
from app.schemas.user import UserLogin, UserCreate, TokenResponse, UserResponse, UserSetPassword
from app.models.user import User

# Authentication router
router = APIRouter(prefix="/auth", tags=["Authentication"])

# Login endpoint
@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login endpoint - returns JWT tokens"""
    user = db.query(User).filter(User.email == credentials.email).first()
    # Check if user exists
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    # Check if user has a password
    if not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password not set. Please set your password first."
        )
    # Check if password is correct
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create tokens
    access_token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    refresh_token = create_refresh_token({"sub": user.id})
    # Return tokens
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )
# Register endpoint
@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new merchant (only merchants can self-register)"""
    if user_data.role != "merchant":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only merchants can self-register. Admins and clerks must be invited."
        )
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = None
    if user_data.password:
        hashed_password = get_password_hash(user_data.password)
    
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        role=user_data.role,
        hashed_password=hashed_password,
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

# Set password endpoint
@router.post("/set-password/{token}", response_model=UserResponse)
def set_password(token: str, password_data: UserSetPassword, db: Session = Depends(get_db)):
    """Set password using invitation token"""
    try:
        payload = decode_invitation_token(token)
        email = payload.get("email")
        role = payload.get("role")
        merchant_id = payload.get("merchant_id")
        
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        if not user:
            # Create user from invitation
            user = User(
                email=email,
                role=role,
                merchant_id=merchant_id,
                hashed_password=get_password_hash(password_data.password),
                is_active=True
            )
            db.add(user)
        else:
            # Update existing user password
            user.hashed_password = get_password_hash(password_data.password)
            if not user.is_active:
                user.is_active = True
        
        db.commit()
        db.refresh(user)
        return user
        
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired invitation token"
        )
   
    # Refresh token endpoint
@router.post("/refresh", response_model=TokenResponse)
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    """Refresh access token using refresh token"""
    try:
        payload = decode_token(refresh_token, token_type="refresh")
        user_id = payload.get("sub")
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # Create new access token
        access_token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
        new_refresh_token = create_refresh_token({"sub": user.id})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer"
        )
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )