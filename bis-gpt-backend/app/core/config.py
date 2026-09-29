from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "BIS-GPT — AI-Powered BIS Compliance Copilot"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # Security & Auth
    SECRET_KEY: str = "bis-gpt-insecure-secret-key-change-for-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/bis_gpt_db"
    SYNC_DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/bis_gpt_db"

    # vLLM / Qwen Server (OpenAI-compatible)
    QWEN_API_BASE_URL: str = "http://localhost:8000/v1"
    QWEN_API_KEY: str = "none"
    QWEN_MODEL_NAME: str = "Qwen/Qwen2.5-7B-Instruct"
    QWEN_MAX_TOKENS: int = 1024
    QWEN_TEMPERATURE: float = 0.2

    # Embeddings (BGE-M3)
    EMBEDDING_MODEL_NAME: str = "BAAI/bge-m3"
    EMBEDDING_DIMENSION: int = 1024
    EMBEDDING_API_URL: str = ""
    USE_MOCK_EMBEDDINGS_FALLBACK: bool = True

    # RAG Settings
    BM25_TOP_K: int = 10
    VECTOR_TOP_K: int = 10
    RERANK_TOP_K: int = 5
    MIN_RELEVANCE_SCORE: float = 0.35

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
