"""
Pydantic schemas for analytics and reporting.
"""
from datetime import date
from typing import Optional

from pydantic import BaseModel


class StorePerformanceItem(BaseModel):
    store_id: int
    store_name: str
    total_sales: float
    total_profit: float
    orders: int


class ProductPerformanceItem(BaseModel):
    product_id: int
    product_name: str
    quantity_sold: int
    total_sales: float
    total_profit: float


class PaymentTrendPoint(BaseModel):
    date: date
    paid_total: float
    unpaid_total: float


class FinancialSummaryResponse(BaseModel):
    total_sales: float
    total_cost: float
    gross_profit: float
    total_expenses: float
    net_profit: float


class ExpenseCategoryItem(BaseModel):
    category: str
    total_amount: float


class SalesTrendPoint(BaseModel):
    date: date
    total_sales: float
    total_profit: float
