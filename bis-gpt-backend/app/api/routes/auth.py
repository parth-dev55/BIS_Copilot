from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.schemas.auth import UserRegister, UserLogin, Token, UserResponse
from app.services.auth_service import auth_service
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user account."""
    user = await auth_service.register_user(db, user_in)
    return user


@router.post("/login", response_model=Token)
async def login(
    login_in: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """Authenticate and obtain JWT access token."""
    token = await auth_service.authenticate_user(db, login_in)
    return token


@router.get("/me", response_model=UserResponse)
async def read_current_user(
    current_user: User = Depends(get_current_user)
):
    """Retrieve currently authenticated user profile."""
    return current_user
