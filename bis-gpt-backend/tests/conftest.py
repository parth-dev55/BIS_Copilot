import pytest
import pytest_asyncio
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.ai.qwen_client import BaseLLMClient, qwen_client


class MockQwenClient(BaseLLMClient):
    """Mock LLM client returning deterministic BIS answers for testing."""

    async def generate_chat_completion(self, messages, temperature=0.2, max_tokens=1024, response_format=None):
        return (
            "According to **IS 10500:2012** (Drinking Water — Specification), "
            "potable drinking water must undergo mandatory microbiological and heavy metal testing. "
            "Certification is governed under Scheme-I (ISI Mark) on the Manakonline portal."
        )


@pytest.fixture(autouse=True)
def override_qwen_for_tests(monkeypatch):
    """Ensure Qwen calls are mocked during tests as specified in feature 11."""
    mock = MockQwenClient()
    monkeypatch.setattr("app.services.chat_service.qwen_client", mock)


# In-memory SQLite async engine for tests
TEST_DB_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture(scope="function")
async def async_db() -> AsyncGenerator[AsyncSession, None]:
    engine = create_async_engine(TEST_DB_URL, echo=False)
    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with session_factory() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def client(async_db: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_db():
        yield async_db

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()
