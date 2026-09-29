from fastapi import APIRouter
from app.api.routes import auth, chat, standards, certification, laboratories, hallmarking, health

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(chat.router)
api_router.include_router(standards.router)
api_router.include_router(certification.router)
api_router.include_router(laboratories.router)
api_router.include_router(hallmarking.router)

__all__ = ["api_router"]
