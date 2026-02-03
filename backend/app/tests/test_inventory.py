from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_create_product_requires_authentication():
    response = client.post(
        "/clerk/products",
        json={
            "name": "Rice - 5kg",
            "category": "Grains",
            "buy_price": 450,
            "sell_price": 600,
            "stock": 120,
            "spoilt_items": 0,
            "payment_status": "paid",
        },
    )

    assert response.status_code == 401


def test_create_product_with_clerk_role_returns_created_item():
    response = client.post(
        "/clerk/products",
        headers={"Authorization": "Bearer fake-clerk-token"},
        json={
            "name": "Sugar - 2kg",
            "category": "Sweeteners",
            "buy_price": 180,
            "sell_price": 240,
            "stock": 200,
            "spoilt_items": 0,
            "payment_status": "paid",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Sugar - 2kg"
    assert data["category"] == "Sweeteners"


def test_list_clerk_products_returns_paginated_shape():
    response = client.get("/clerk/products?page=1&page_size=10")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["items"], list)
    assert isinstance(data["total"], int)
    assert data["page"] == 1
    assert data["page_size"] == 10
