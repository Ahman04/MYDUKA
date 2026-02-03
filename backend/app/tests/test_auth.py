from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_health_check_returns_healthy():
    response = client.get("/health_check")

    assert response.status_code == 200
    assert response.json() == {"result": "healthy"}


def test_login_with_admin_demo_credentials_returns_tokens_and_role():
    response = client.post(
        "/auth/login",
        json={"email": "admin@myduka.com", "password": "admin123"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "admin"
    assert isinstance(data["access_token"], str)
    assert isinstance(data["refresh_token"], str)


def test_login_with_invalid_credentials_returns_401():
    response = client.post(
        "/auth/login",
        json={"email": "bad@myduka.com", "password": "wrong"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"
