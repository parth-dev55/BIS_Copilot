import pytest


@pytest.mark.asyncio
async def test_chat_clarification_flow(client):
    # When an ambiguous query is passed, clarification_required must be True
    payload = {
        "message": "Which BIS standard applies to pipes?",
        "conversation_id": None,
        "language": "en"
    }
    res = await client.post("/api/v1/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["clarification_required"] is True
    assert "pipe material" in data["answer"].lower()
    assert data["conversation_id"] is not None


@pytest.mark.asyncio
async def test_chat_full_compliance_flow(client):
    # When a specific query is passed, mock Qwen returns the answer and journey
    payload = {
        "message": "How do I certify potable drinking water under IS 10500:2012?",
        "conversation_id": None,
        "language": "en"
    }
    res = await client.post("/api/v1/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["clarification_required"] is False
    assert len(data["compliance_journey"]) > 0
    assert data["compliance_journey"][0]["step_number"] == 1
    assert "IS 10500" in data["answer"]


@pytest.mark.asyncio
async def test_health_endpoints(client):
    res_health = await client.get("/api/v1/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"

    res_ready = await client.get("/api/v1/ready")
    assert res_ready.status_code == 200
    assert res_ready.json()["status"] == "ready"
