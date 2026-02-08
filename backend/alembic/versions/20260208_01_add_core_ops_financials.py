"""add core operations and financial tables

Revision ID: 20260208_01
Revises: 20260204_01
Create Date: 2026-02-08 18:30:00
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260208_01"
down_revision: Union[str, None] = "20260204_01"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "suppliers",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("store_id", sa.Integer(), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("contact_name", sa.String(length=255), nullable=True),
        sa.Column("phone", sa.String(length=40), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_suppliers_id"), "suppliers", ["id"], unique=False)
    op.create_index(op.f("ix_suppliers_store_id"), "suppliers", ["store_id"], unique=False)
    op.create_index(op.f("ix_suppliers_name"), "suppliers", ["name"], unique=False)

    op.create_table(
        "purchase_orders",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("supplier_id", sa.Integer(), nullable=False),
        sa.Column("store_id", sa.Integer(), nullable=False),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("total_cost", sa.Float(), nullable=False),
        sa.Column("sent_at", sa.DateTime(), nullable=True),
        sa.Column("received_at", sa.DateTime(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_purchase_orders_id"), "purchase_orders", ["id"], unique=False)
    op.create_index(op.f("ix_purchase_orders_supplier_id"), "purchase_orders", ["supplier_id"], unique=False)
    op.create_index(op.f("ix_purchase_orders_store_id"), "purchase_orders", ["store_id"], unique=False)
    op.create_index(op.f("ix_purchase_orders_created_by"), "purchase_orders", ["created_by"], unique=False)

    op.create_table(
        "purchase_order_items",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("purchase_order_id", sa.Integer(), nullable=False),
        sa.Column("product_id", sa.Integer(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("unit_cost", sa.Float(), nullable=False),
        sa.Column("unit_price", sa.Float(), nullable=True),
        sa.Column("line_total", sa.Float(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_purchase_order_items_id"), "purchase_order_items", ["id"], unique=False)
    op.create_index(
        op.f("ix_purchase_order_items_purchase_order_id"),
        "purchase_order_items",
        ["purchase_order_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_purchase_order_items_product_id"),
        "purchase_order_items",
        ["product_id"],
        unique=False,
    )

    op.create_table(
        "stock_transfers",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("from_store_id", sa.Integer(), nullable=False),
        sa.Column("to_store_id", sa.Integer(), nullable=False),
        sa.Column("product_id", sa.Integer(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.Column("approved_by", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_stock_transfers_id"), "stock_transfers", ["id"], unique=False)
    op.create_index(op.f("ix_stock_transfers_from_store_id"), "stock_transfers", ["from_store_id"], unique=False)
    op.create_index(op.f("ix_stock_transfers_to_store_id"), "stock_transfers", ["to_store_id"], unique=False)
    op.create_index(op.f("ix_stock_transfers_product_id"), "stock_transfers", ["product_id"], unique=False)
    op.create_index(op.f("ix_stock_transfers_created_by"), "stock_transfers", ["created_by"], unique=False)
    op.create_index(op.f("ix_stock_transfers_approved_by"), "stock_transfers", ["approved_by"], unique=False)

    op.create_table(
        "returns",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("store_id", sa.Integer(), nullable=False),
        sa.Column("product_id", sa.Integer(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("return_type", sa.String(length=20), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=True),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.Column("handled_by", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_returns_id"), "returns", ["id"], unique=False)
    op.create_index(op.f("ix_returns_store_id"), "returns", ["store_id"], unique=False)
    op.create_index(op.f("ix_returns_product_id"), "returns", ["product_id"], unique=False)
    op.create_index(op.f("ix_returns_created_by"), "returns", ["created_by"], unique=False)
    op.create_index(op.f("ix_returns_handled_by"), "returns", ["handled_by"], unique=False)

    op.create_table(
        "sales",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("store_id", sa.Integer(), nullable=False),
        sa.Column("product_id", sa.Integer(), nullable=False),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("unit_price", sa.Float(), nullable=False),
        sa.Column("unit_cost", sa.Float(), nullable=False),
        sa.Column("total_price", sa.Float(), nullable=False),
        sa.Column("total_cost", sa.Float(), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_sales_id"), "sales", ["id"], unique=False)
    op.create_index(op.f("ix_sales_store_id"), "sales", ["store_id"], unique=False)
    op.create_index(op.f("ix_sales_product_id"), "sales", ["product_id"], unique=False)
    op.create_index(op.f("ix_sales_created_by"), "sales", ["created_by"], unique=False)

    op.create_table(
        "expenses",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("store_id", sa.Integer(), nullable=False),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.Column("category", sa.String(length=120), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.Column("incurred_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_expenses_id"), "expenses", ["id"], unique=False)
    op.create_index(op.f("ix_expenses_store_id"), "expenses", ["store_id"], unique=False)
    op.create_index(op.f("ix_expenses_created_by"), "expenses", ["created_by"], unique=False)
    op.create_index(op.f("ix_expenses_category"), "expenses", ["category"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_expenses_category"), table_name="expenses")
    op.drop_index(op.f("ix_expenses_created_by"), table_name="expenses")
    op.drop_index(op.f("ix_expenses_store_id"), table_name="expenses")
    op.drop_index(op.f("ix_expenses_id"), table_name="expenses")
    op.drop_table("expenses")

    op.drop_index(op.f("ix_sales_created_by"), table_name="sales")
    op.drop_index(op.f("ix_sales_product_id"), table_name="sales")
    op.drop_index(op.f("ix_sales_store_id"), table_name="sales")
    op.drop_index(op.f("ix_sales_id"), table_name="sales")
    op.drop_table("sales")

    op.drop_index(op.f("ix_returns_handled_by"), table_name="returns")
    op.drop_index(op.f("ix_returns_created_by"), table_name="returns")
    op.drop_index(op.f("ix_returns_product_id"), table_name="returns")
    op.drop_index(op.f("ix_returns_store_id"), table_name="returns")
    op.drop_index(op.f("ix_returns_id"), table_name="returns")
    op.drop_table("returns")

    op.drop_index(op.f("ix_stock_transfers_approved_by"), table_name="stock_transfers")
    op.drop_index(op.f("ix_stock_transfers_created_by"), table_name="stock_transfers")
    op.drop_index(op.f("ix_stock_transfers_product_id"), table_name="stock_transfers")
    op.drop_index(op.f("ix_stock_transfers_to_store_id"), table_name="stock_transfers")
    op.drop_index(op.f("ix_stock_transfers_from_store_id"), table_name="stock_transfers")
    op.drop_index(op.f("ix_stock_transfers_id"), table_name="stock_transfers")
    op.drop_table("stock_transfers")

    op.drop_index(op.f("ix_purchase_order_items_product_id"), table_name="purchase_order_items")
    op.drop_index(op.f("ix_purchase_order_items_purchase_order_id"), table_name="purchase_order_items")
    op.drop_index(op.f("ix_purchase_order_items_id"), table_name="purchase_order_items")
    op.drop_table("purchase_order_items")

    op.drop_index(op.f("ix_purchase_orders_created_by"), table_name="purchase_orders")
    op.drop_index(op.f("ix_purchase_orders_store_id"), table_name="purchase_orders")
    op.drop_index(op.f("ix_purchase_orders_supplier_id"), table_name="purchase_orders")
    op.drop_index(op.f("ix_purchase_orders_id"), table_name="purchase_orders")
    op.drop_table("purchase_orders")

    op.drop_index(op.f("ix_suppliers_name"), table_name="suppliers")
    op.drop_index(op.f("ix_suppliers_store_id"), table_name="suppliers")
    op.drop_index(op.f("ix_suppliers_id"), table_name="suppliers")
    op.drop_table("suppliers")
