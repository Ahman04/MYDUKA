# Inventory routes
# Create inventory route
# List inventory route
# Get inventory by ID route
# Update inventory route
# Delete inventory route
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.dependencies import get_db, get_current_user, get_current_active_clerk
from app.schemas.inventory import InventoryCreate, InventoryUpdate, InventoryResponse
from app.models.inventory import Inventory
from app.models.product import Product
from app.models.store import Store
from app.models.user import User

router = APIRouter(prefix="/inventory", tags=["Inventory"])

# Create inventory route
@router.post("/", response_model=InventoryResponse)
def create_inventory(
    inventory_data: InventoryCreate,
    current_user: User = Depends(get_current_active_clerk),
    db: Session = Depends(get_db)
):
    """Create inventory record (clerks, admins, merchants)"""
    # Verify product exists
    product = db.query(Product).filter(Product.id == inventory_data.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Verify store exists and matches product
    store = db.query(Store).filter(Store.id == inventory_data.store_id).first()
    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found"
        )
    
    if product.store_id != inventory_data.store_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product does not belong to this store"
        )
    
    # Permission check
    if current_user.role == "clerk" and inventory_data.store_id != current_user.store_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    elif current_user.role == "admin" and inventory_data.store_id != current_user.store_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    new_inventory = Inventory(
        product_id=inventory_data.product_id,
        store_id=inventory_data.store_id,
        quantity=inventory_data.quantity,
        quantity_spoilt=inventory_data.quantity_spoilt,
        is_paid=inventory_data.is_paid,
        recorded_by_id=current_user.id
    )
    
    db.add(new_inventory)
    db.commit()
    db.refresh(new_inventory)
    return new_inventory

# List inventory route
@router.get("/", response_model=List[InventoryResponse])
def list_inventory(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    store_id: Optional[int] = None,
    product_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List inventory records with pagination"""
    query = db.query(Inventory)
    
    # Filter by store based on user role
    if current_user.role == "clerk":
        query = query.filter(Inventory.store_id == current_user.store_id)
    elif current_user.role == "admin":
        query = query.filter(Inventory.store_id == current_user.store_id)
    elif current_user.role == "merchant":
        # Merchants can see all inventory in their stores
        store_ids = db.query(Store.id).filter(Store.merchant_id == current_user.id).subquery()
        query = query.filter(Inventory.store_id.in_(store_ids))
    
    if store_id:
        query = query.filter(Inventory.store_id == store_id)
    if product_id:
        query = query.filter(Inventory.product_id == product_id)
    
    inventory_items = query.order_by(Inventory.created_at.desc()).offset(skip).limit(limit).all()
    return inventory_items

# Get inventory by ID route
@router.get("/{inventory_id}", response_model=InventoryResponse)
def get_inventory(
    inventory_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get inventory record by ID"""
    inventory = db.query(Inventory).filter(Inventory.id == inventory_id).first()
    if not inventory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory record not found"
        )
    
    # Permission check
    store = db.query(Store).filter(Store.id == inventory.store_id).first()
    if current_user.role == "clerk" and inventory.store_id != current_user.store_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    elif current_user.role == "admin" and inventory.store_id != current_user.store_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    elif current_user.role == "merchant" and store.merchant_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    return inventory
