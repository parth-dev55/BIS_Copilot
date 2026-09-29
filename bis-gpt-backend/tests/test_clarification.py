import pytest
from app.ai.query_understanding import query_understanding_engine
from app.ai.clarification_engine import clarification_engine


@pytest.mark.asyncio
async def test_pipe_ambiguity_triggers_clarification():
    message = "Which BIS standard applies to pipes?"
    analysis = await query_understanding_engine.analyze_query(message)

    assert analysis["is_ambiguous"] is True
    assert "pipe_material" in analysis["missing_critical_info"]

    is_needed, question = clarification_engine.check_clarification_needed(analysis, message)
    assert is_needed is True
    assert "pipe material" in question.lower()
    assert "pvc" in question.lower()


@pytest.mark.asyncio
async def test_clear_query_does_not_trigger_clarification():
    message = "What is the requirement for packaged drinking water under IS 10500?"
    analysis = await query_understanding_engine.analyze_query(message)

    is_needed, question = clarification_engine.check_clarification_needed(analysis, message)
    assert is_needed is False
    assert question is None
