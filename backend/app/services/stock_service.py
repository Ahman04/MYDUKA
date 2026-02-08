"""
Helpers for adjusting inventory with timeline events.
"""
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.inventory import Inventory
from app.models.inventory_event import InventoryEvent


def utc_now():
    return datetime.now(timezone.utc)


def increase_stock(
    db: Session,
    store_id: int,
    product_id: int,
    quantity: int,
    buying_price: float,
    selling_price: float,
    actor_id: int,
    event_type: str,
    details: str | None = None,
    payment_status: str = "unpaid",
) -> Inventory:
    inventory = Inventory(
        product_id=product_id,
        store_id=store_id,
        created_by=actor_id,
        quantity_received=quantity,
        quantity_in_stock=quantity,
        quantity_spoilt=0,
        payment_status=payment_status,
        buying_price=buying_price,
        selling_price=selling_price,
        remarks=details,
    )
    db.add(inventory)
    db.flush()

    db.add(
        InventoryEvent(
            inventory_id=inventory.id,
            product_id=product_id,
            store_id=store_id,
            actor_id=actor_id,
            event_type=event_type,
            old_quantity_in_stock=0,
            new_quantity_in_stock=quantity,
            old_payment_status=None,
            new_payment_status=payment_status,
            details=details,
        )
    )
    return inventory


def decrease_stock(
    db: Session,
    store_id: int,
    product_id: int,
    quantity: int,
    actor_id: int,
    event_type: str,
    details: str | None = None,
):
    records = (
        db.query(Inventory)
        .filter(
            Inventory.store_id == store_id,
            Inventory.product_id == product_id,
            Inventory.quantity_in_stock > 0,
        )
        .order_by(Inventory.updated_at.desc())
        .all()
    )
    total_available = sum(record.quantity_in_stock for record in records)
    if total_available < quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock for this operation",
        )

    remaining = quantity
    for record in records:
        if remaining <= 0:
            break
        take = min(record.quantity_in_stock, remaining)
        old_qty = record.quantity_in_stock
        record.quantity_in_stock = old_qty - take
        record.updated_at = utc_now()
        db.add(
            InventoryEvent(
                inventory_id=record.id,
                product_id=record.product_id,
                store_id=record.store_id,
                actor_id=actor_id,
                event_type=event_type,
                old_quantity_in_stock=old_qty,
                new_quantity_in_stock=record.quantity_in_stock,
                old_payment_status=record.payment_status,
                new_payment_status=record.payment_status,
                details=details,
            )
        )
        remaining -= take
