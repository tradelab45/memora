from uuid import UUID
import httpx
from fastapi.testclient import TestClient
from app.main import app
from app.core.auth import Principal, require_user
from app.core.config import Settings, get_settings

client = TestClient(app)


def test_health_and_request_id():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "version": "0.1.0"}
    assert UUID(response.headers["X-Request-ID"])


def test_auth_required():
    response = client.get("/v1/memories")
    assert response.status_code == 401
    assert response.headers["WWW-Authenticate"] == "Bearer"


def test_auth_fails_closed_without_configuration():
    app.dependency_overrides[get_settings] = lambda: Settings(
        _env_file=None, supabase_url="", supabase_publishable_key=""
    )
    try:
        assert client.get("/v1/me", headers={"Authorization": "Bearer fake"}).status_code == 503
    finally:
        app.dependency_overrides.clear()


def test_auth_rejects_expired_token(monkeypatch):
    app.dependency_overrides[get_settings] = lambda: Settings(
        _env_file=None, supabase_url="https://example.supabase.co", supabase_publishable_key="test"
    )
    async def fake_get(self, url, **kwargs):
        return httpx.Response(401)
    monkeypatch.setattr(httpx.AsyncClient, "get", fake_get)
    try:
        assert client.get("/v1/me", headers={"Authorization": "Bearer expired"}).status_code == 401
    finally:
        app.dependency_overrides.clear()


def test_verified_session_returns_owner(monkeypatch):
    owner = "11111111-1111-4111-8111-111111111111"
    app.dependency_overrides[get_settings] = lambda: Settings(
        _env_file=None, supabase_url="https://example.supabase.co", supabase_publishable_key="test"
    )
    async def fake_get(self, url, **kwargs):
        assert url.endswith("/auth/v1/user")
        assert kwargs["headers"]["Authorization"] == "Bearer valid"
        return httpx.Response(200, json={"id": owner})
    monkeypatch.setattr(httpx.AsyncClient, "get", fake_get)
    try:
        response = client.get("/v1/me", headers={"Authorization": "Bearer valid"})
        assert response.status_code == 200
        assert response.json() == {"user_id": owner}
    finally:
        app.dependency_overrides.clear()


def test_persistence_contract_is_explicitly_unimplemented():
    app.dependency_overrides[require_user] = lambda: Principal(user_id=UUID(int=1))
    try:
        response = client.get("/v1/books")
        assert response.status_code == 501
        assert response.headers["content-type"].startswith("application/problem+json")
    finally:
        app.dependency_overrides.clear()


def test_biometric_payloads_are_rejected_without_echoing_data():
    app.dependency_overrides[require_user] = lambda: Principal(user_id=UUID(int=1))
    try:
        response = client.post("/v1/people", json={"display_name": "Dad", "face_embedding": [0.1]})
        assert response.status_code == 422
        assert "face_embedding" not in response.text
    finally:
        app.dependency_overrides.clear()
