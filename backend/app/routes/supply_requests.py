# Supply requests routes
# Create supply request route
# List supply requests route
# Update supply request route

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.dependencies import get_db, get_current_user, get_current_active_clerk, get_current_active_admin
from app.schemas.supply_request import SupplyRequestCreate, SupplyRequestUpdate, SupplyRequestResponse
from app.models.supply_request import SupplyRequest
from app.models.product import Product
from app.models.store import Store
from app.models.user import User

router = APIRouter(prefix="/supply-requests", tags=["Supply Requests"])

# Create supply request route
@router.post("/", response_model=SupplyRequestResponse)
def create_supply_request(
    request_data: SupplyRequestCreate,
    current_user: User = Depends(get_current_active_clerk),
    db: Session = Depends(get_db)
):
    """Create a supply request (clerks)"""
    # Verify product exists
    product = db.query(Product).filter(Product.id == request_data.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Verify store exists and matches product
    store = db.query(Store).filter(Store.id == request_data.store_id).first()
    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found"
        )
    
    if product.store_id != request_data.store_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product does not belong to this store"
        )
    
    # Permission check - clerks can only request for their store
    if current_user.role == "clerk" and request_data.store_id != current_user.store_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    new_request = SupplyRequest(
        product_id=request_data.product_id,
        store_id=request_data.store_id,
        requested_by_id=current_user.id,
        quantity=request_data.quantity,
        reason=request_data.reason,
        status="pending"
    )
    
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

# List supply requests route
@router.get("/", response_model=List[SupplyRequestResponse])
def list_supply_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List supply requests with pagination"""
    query = db.query(SupplyRequest)
    
    # Filter by store based on user role
    if current_user.role == "clerk":
        query = query.filter(SupplyRequest.store_id == current_user.store_id)
    elif current_user.role == "admin":
        query = query.filter(SupplyRequest.store_id == current_user.store_id)
    elif current_user.role == "merchant":
        # Merchants can see all requests in their stores
        store_ids = db.query(Store.id).filter(Store.merchant_id == current_user.id).subquery()
        query = query.filter(SupplyRequest.store_id.in_(store_ids))
    
    if status_filter:
        query = query.filter(SupplyRequest.status == status_filter)
    
    requests = query.order_by(SupplyRequest.created_at.desc()).offset(skip).limit(limit).all()
    return requests
# Update supply request route
@router.patch("/{request_id}", response_model=SupplyRequestResponse)
def update_supply_request(
    request_id: int,
    request_update: SupplyRequestUpdate,
    current_user: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
):
    """Approve or decline supply request (admins/merchants)"""
    supply_request = db.query(SupplyRequest).filter(SupplyRequest.id == request_id).first()
    if not supply_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supply request not found"
        )
    
    # Permission check
    store = db.query(Store).filter(Store.id == supply_request.store_id).first()
    if current_user.role == "admin" and supply_request.store_id != current_user.store_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    elif current_user.role == "merchant" and store.merchant_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    if supply_request.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Request has already been processed"
        )
    
    # Update status
    if request_update.status not in ["approved", "declined"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be 'approved' or 'declined'"
        )
    
    supply_request.status = request_update.status
    supply_request.reviewed_by_id = current_user.id
    supply_request.reviewed_at = datetime.utcnow()
    if request_update.reason:
        supply_request.reason = request_update.reason
    
    db.commit()
    db.refresh(supply_request)
    return supply_request