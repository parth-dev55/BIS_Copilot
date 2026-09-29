from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(tags=["System Health"])


@router.get("/health")
async def health_check():
    """Liveness check endpoint."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.APP_ENV
    }


@router.get("/ready")
async def readiness_check():
    """Readiness probe checking system dependencies."""
    return {
        "status": "ready",
        "qwen_endpoint": settings.QWEN_API_BASE_URL,
        "embedding_model": settings.EMBEDDING_MODEL_NAME
    }
