import pytest


@pytest.mark.asyncio
async def test_register_and_login_flow(client):
    # 1. Register
    reg_payload = {
        "email": "innovator@sih.gov.in",
        "password": "SecurePassword123",
        "full_name": "Parth Chaudhari"
    }
    res = await client.post("/api/v1/auth/register", json=reg_payload)
    assert res.status_code == 201
    data = res.json()
    assert data["email"] == "innovator@sih.gov.in"
    assert "id" in data

    # 2. Duplicate registration should fail
    res_dup = await client.post("/api/v1/auth/register", json=reg_payload)
    assert res_dup.status_code == 401

    # 3. Login
    login_payload = {
        "email": "innovator@sih.gov.in",
        "password": "SecurePassword123"
    }
    res_login = await client.post("/api/v1/auth/login", json=login_payload)
    assert res_login.status_code == 200
    token_data = res_login.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    # 4. Get Current Profile
    res_me = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res_me.status_code == 200
    assert res_me.json()["email"] == "innovator@sih.gov.in"
