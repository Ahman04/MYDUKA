"""Inventory management routes for recording stock."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import check_permission, enforce_store_scope, get_current_user
from app.models.inventory import Inventory, PaymentStatus
from app.models.product import Product
from app.models.store import Store
from app.models.user import User
from app.schemas.reports import InventoryCreate, InventoryResponse, InventoryUpdate

router = APIRouter(prefix="/api/inventory", tags=["inventory"])


@router.post("/", response_model=InventoryResponse, status_code=status.HTTP_201_CREATED)
async def record_inventory(
    inventory_data: InventoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Record a new inventory entry."""
    product = db.query(Product).filter(Product.id == inventory_data.product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    store = db.query(Store).filter(Store.id == inventory_data.store_id).first()
    if not store:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found")

    enforce_store_scope(current_user, store.id)

    new_inventory = Inventory(
        product_id=inventory_data.product_id,
        store_id=inventory_data.store_id,
        created_by=current_user.id,
        quantity_received=inventory_data.quantity_received,
        quantity_in_stock=inventory_data.quantity_in_stock,
        quantity_spoilt=inventory_data.quantity_spoilt,
        payment_status=inventory_data.payment_status,
        buying_price=inventory_data.buying_price,
        selling_price=inventory_data.selling_price,
        remarks=inventory_data.remarks,
    )

    db.add(new_inventory)
    db.commit()
    db.refresh(new_inventory)
    return InventoryResponse.model_validate(new_inventory)


@router.get("/", response_model=List[InventoryResponse])
async def list_inventory(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 20,
    store_id: int | None = None,
    payment_status: str | None = None,
):
    """List inventory records by role scope and optional filters."""
    query = db.query(Inventory)

    if current_user.role == "clerk":
        query = query.filter(Inventory.created_by == current_user.id)
    elif current_user.role == "admin" and current_user.store_id is not None:
        query = query.filter(Inventory.store_id == current_user.store_id)

    if store_id is not None:
        enforce_store_scope(current_user, store_id)
        query = query.filter(Inventory.store_id == store_id)

    if payment_status is not None:
        query = query.filter(Inventory.payment_status == payment_status)

    records = query.order_by(Inventory.created_at.desc()).offset(skip).limit(limit).all()
    return [InventoryResponse.model_validate(record) for record in records]


@router.get("/{inventory_id}", response_model=InventoryResponse)
async def get_inventory(
    inventory_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = db.query(Inventory).filter(Inventory.id == inventory_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory record not found")

    if current_user.role == "clerk" and record.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot view other clerks' records")

    enforce_store_scope(current_user, record.store_id)
    return InventoryResponse.model_validate(record)


@router.put("/{inventory_id}", response_model=InventoryResponse)
async def update_inventory(
    inventory_id: int,
    inventory_data: InventoryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = db.query(Inventory).filter(Inventory.id == inventory_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory record not found")

    if current_user.role == "clerk" and record.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot update other clerks' records")

    enforce_store_scope(current_user, record.store_id)

    if inventory_data.quantity_in_stock is not None:
        record.quantity_in_stock = inventory_data.quantity_in_stock
    if inventory_data.quantity_spoilt is not None:
        record.quantity_spoilt = inventory_data.quantity_spoilt
    if inventory_data.payment_status is not None:
        record.payment_status = inventory_data.payment_status
    if inventory_data.remarks is not None:
        record.remarks = inventory_data.remarks

    db.commit()
    db.refresh(record)
    return InventoryResponse.model_validate(record)


@router.patch("/{inventory_id}/payment-status", response_model=InventoryResponse)
async def update_payment_status(
    inventory_id: int,
    payload: dict,
    current_user: User = Depends(check_permission("admin")),
    db: Session = Depends(get_db),
):
    """Update payment status for an inventory entry."""
    payment_status = payload.get("payment_status")
    if payment_status not in {PaymentStatus.PAID.value, PaymentStatus.UNPAID.value}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid payment status")

    record = db.query(Inventory).filter(Inventory.id == inventory_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory record not found")

    enforce_store_scope(current_user, record.store_id)
    record.payment_status = payment_status
    db.commit()
    db.refresh(record)
    return InventoryResponse.model_validate(record)


@router.delete("/{inventory_id}")
async def delete_inventory(
    inventory_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete an inventory record if user has access to it."""
    record = db.query(Inventory).filter(Inventory.id == inventory_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory record not found")

    if current_user.role == "clerk" and record.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot delete other clerks' records")

    enforce_store_scope(current_user, record.store_id)
    db.delete(record)
    db.commit()
    return {"message": "Inventory record deleted successfully"}


@router.get("/store/{store_id}/paid", response_model=List[InventoryResponse])
async def get_paid_inventory(
    store_id: int,
    current_user: User = Depends(check_permission("admin")),
    db: Session = Depends(get_db),
):
    enforce_store_scope(current_user, store_id)
    records = (
        db.query(Inventory)
        .filter(Inventory.store_id == store_id, Inventory.payment_status == PaymentStatus.PAID)
        .all()
    )
    return [InventoryResponse.model_validate(record) for record in records]


@router.get("/store/{store_id}/unpaid", response_model=List[InventoryResponse])
async def get_unpaid_inventory(
    store_id: int,
    current_user: User = Depends(check_permission("admin")),
    db: Session = Depends(get_db),
):
    enforce_store_scope(current_user, store_id)
    records = (
        db.query(Inventory)
        .filter(Inventory.store_id == store_id, Inventory.payment_status == PaymentStatus.UNPAID)
        .all()
    )
    return [InventoryResponse.model_validate(record) for record in records]
