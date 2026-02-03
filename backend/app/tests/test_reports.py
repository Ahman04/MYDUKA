from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_admin_stats_returns_expected_fields():
    response = client.get(
        "/admin/stats",
        headers={"Authorization": "Bearer fake-admin-token"},
    )

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["active_clerks"], int)
    assert isinstance(data["pending_requests"], int)
    assert isinstance(data["unpaid_products"], int)
    assert isinstance(data["store_value"], (int, float))


def test_merchant_payment_summary_returns_paid_and_unpaid_values():
    response = client.get(
        "/merchant/reports/payment-summary",
        headers={"Authorization": "Bearer fake-merchant-token"},
    )

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["paid_total"], (int, float))
    assert isinstance(data["unpaid_total"], (int, float))


def test_product_performance_report_returns_chart_data_points():
    response = client.get(
        "/merchant/reports/performance?store_id=1",
        headers={"Authorization": "Bearer fake-merchant-token"},
    )

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert {"product", "sales", "profit"} <= set(data[0].keys())
