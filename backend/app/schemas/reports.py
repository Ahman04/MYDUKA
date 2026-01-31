# Reports schemas
# Report filters schema
# Report response schema
# Report data points schema
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ReportFilters(BaseModel):
    store_id: Optional[int] = None
    product_id: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class ReportResponse(BaseModel):
    period: str  # weekly, monthly, yearly
    total_revenue: float
    total_costs: float
    profit: float
    data_points: List[Dict[str, Any]]  # For charts