# Reports routes
# Get reports route

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import datetime, timedelta
from app.core.dependencies import get_db, get_current_user, get_current_active_admin
from app.schemas.reports import ReportFilters, ReportResponse
from app.models.inventory import Inventory
from app.models.product import Product
from app.models.store import Store
from app.models.user import User

router = APIRouter(prefix="/reports", tags=["Reports"])

# Get reports route
@router.get("/", response_model=ReportResponse)
def get_reports(
    period: str = Query("monthly", regex="^(weekly|monthly|yearly)$"),
    filters: ReportFilters = Depends(),
    current_user: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
):
    """Generate reports with filters"""
    # Build base query
    query = db.query(Inventory).join(Product)
    
    # Apply role-based filters
    if current_user.role == "clerk":
        query = query.filter(Inventory.store_id == current_user.store_id)
    elif current_user.role == "admin":
        query = query.filter(Inventory.store_id == current_user.store_id)
    elif current_user.role == "merchant":
        store_ids = db.query(Store.id).filter(Store.merchant_id == current_user.id).subquery()
        query = query.filter(Inventory.store_id.in_(store_ids))
    
    # Apply filters
    if filters.store_id:
        query = query.filter(Inventory.store_id == filters.store_id)
    if filters.product_id:
        query = query.filter(Inventory.product_id == filters.product_id)
    if filters.start_date:
        query = query.filter(Inventory.created_at >= filters.start_date)
    if filters.end_date:
        query = query.filter(Inventory.created_at <= filters.end_date)
    
    # Calculate date range based on period
    end_date = filters.end_date or datetime.utcnow()
    if period == "weekly":
        start_date = filters.start_date or (end_date - timedelta(days=7))
    elif period == "monthly":
        start_date = filters.start_date or (end_date - timedelta(days=30))
    else:  # yearly
        start_date = filters.start_date or (end_date - timedelta(days=365))
    
    query = query.filter(and_(Inventory.created_at >= start_date, Inventory.created_at <= end_date))
    
    # Get inventory records
    inventory_items = query.all()
    
    # Calculate totals
    total_revenue = sum(
        float(item.quantity * item.product.selling_price) 
        for item in inventory_items 
        if item.product.selling_price
    )
    
    total_costs = sum(
        float(item.quantity * item.product.buying_price) 
        for item in inventory_items 
        if item.product.buying_price
    )
    
    profit = total_revenue - total_costs
    
    # Prepare data points for charts
    data_points = []
    for item in inventory_items:
        data_points.append({
            "date": item.created_at.isoformat(),
            "product_id": item.product_id,
            "product_name": item.product.name,
            "quantity": item.quantity,
            "revenue": float(item.quantity * item.product.selling_price) if item.product.selling_price else 0,
            "cost": float(item.quantity * item.product.buying_price) if item.product.buying_price else 0
        })
    # Return report response
    return ReportResponse(
        period=period,
        total_revenue=total_revenue,
        total_costs=total_costs,
        profit=profit,
        data_points=data_points
    )