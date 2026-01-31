# Database and authentication dependencies

from typing import Optional, Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import decode_token
from app.models.user import User

# HTTP Bearer token scheme
security = HTTPBearer()

# Dependency to get database session
def get_db() -> Generator[Session, None, None]:
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency to get current authenticated user from JWT token
# This dependency is used to get the current authenticated user from the JWT token
# It is used to get the current authenticated user from the JWT token
# It is used to get the current authenticated user from the JWT token   
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Dependency to get current authenticated user from JWT token."""
    token = credentials.credentials
    payload = decode_token(token, token_type="access")
    user_id: int = payload.get("sub")
    # If user_id is None, raise an HTTPException
    # The HTTPException is a 401 Unauthorized error
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        # The headers are the headers of the HTTPException
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    return user

# Dependency to ensure current user is a merchant
# This dependency is used to ensure that the current user is a merchant
def get_current_active_merchant(
    current_user: User = Depends(get_current_user)
) -> User:
    """Dependency to ensure current user is a merchant."""
    if current_user.role != "merchant":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Merchant role required."
        )
    return current_user

# Dependency to ensure current user is an admin or merchant
def get_current_active_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """Dependency to ensure current user is an admin or merchant."""
    if current_user.role not in ["admin", "merchant"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Admin or Merchant role required."
        )
    return current_user

# Dependency to ensure current user is a clerk, admin, or merchant
def get_current_active_clerk(
    current_user: User = Depends(get_current_user)
) -> User:
    """Dependency to ensure current user is a clerk, admin, or merchant."""
    if current_user.role not in ["clerk", "admin", "merchant"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Clerk, Admin, or Merchant role required."
        )
    return current_user

# Optional dependency to get current user
# This dependency is used to get the current authenticated user from the JWT token
# It is used to get the current authenticated user from the JWT token  
def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Optional dependency to get current user (returns None if not authenticated)."""
    if credentials is None:
        return None
    
    try:
        token = credentials.credentials
        payload = decode_token(token, token_type="access")
        user_id: int = payload.get("sub")
        
        if user_id is None:
            return None
        # If user_id is not None, get the user from the database
        user = db.query(User).filter(User.id == user_id).first()
        # If user is not None and is active, return the user
        if user and user.is_active:
            return user
        return None
    except HTTPException:
        return None