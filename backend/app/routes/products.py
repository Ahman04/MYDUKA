# Products routes
# Create product route
# List products route
# Get product by ID route
# Update product route
# Delete product route

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.dependencies import get_db, get_current_user, get_current_active_admin
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.models.product import Product
from app.models.store import Store
from app.models.user import User

router = APIRouter(prefix="/products", tags=["Products"])

# Create product route
@router.post("/", response_model=ProductResponse)
def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
):
    """Create a new product"""
    # Verify store exists and user has access
    store = db.query(Store).filter(Store.id == product_data.store_id).first()
    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found"
        )
    
    # Permission check
    if current_user.role == "admin":
        if store.id != current_user.store_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    elif current_user.role == "merchant":
        if store.merchant_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    new_product = Product(
        name=product_data.name,
        buying_price=product_data.buying_price,
        selling_price=product_data.selling_price,
        store_id=product_data.store_id
    )
    
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# List products route
@router.get("/", response_model=List[ProductResponse])
def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    store_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List products with pagination"""
    query = db.query(Product)
    
    # Filter by store based on user role
    if current_user.role == "clerk":
        query = query.filter(Product.store_id == current_user.store_id)
    elif current_user.role == "admin":
        query = query.filter(Product.store_id == current_user.store_id)
    elif current_user.role == "merchant":
        # Merchants can see all products in their stores
        store_ids = db.query(Store.id).filter(Store.merchant_id == current_user.id).subquery()
        query = query.filter(Product.store_id.in_(store_ids))
    
    if store_id:
        query = query.filter(Product.store_id == store_id)
    
    products = query.offset(skip).limit(limit).all()
    return products

# Get product by ID route
@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Permission check
    store = db.query(Store).filter(Store.id == product.store_id).first()
    if current_user.role == "clerk" and product.store_id != current_user.store_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    elif current_user.role == "admin" and product.store_id != current_user.store_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    elif current_user.role == "merchant" and store.merchant_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    return product

# Update product route
@router.patch("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_update: ProductUpdate,
    current_user: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
):
    """Update product"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Permission check
    store = db.query(Store).filter(Store.id == product.store_id).first()
    if current_user.role == "admin" and product.store_id != current_user.store_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    elif current_user.role == "merchant" and store.merchant_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    # Update fields
    if product_update.name is not None:
        product.name = product_update.name
    if product_update.buying_price is not None:
        product.buying_price = product_update.buying_price
    if product_update.selling_price is not None:
        product.selling_price = product_update.selling_price
    
    db.commit()
    db.refresh(product)
    return product

# Delete product route
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    current_user: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
):
    """Delete product"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Permission check
    store = db.query(Store).filter(Store.id == product.store_id).first()
    if current_user.role == "admin" and product.store_id != current_user.store_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    elif current_user.role == "merchant" and store.merchant_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}