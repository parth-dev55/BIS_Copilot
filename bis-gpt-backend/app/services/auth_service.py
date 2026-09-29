from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, Token
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.exceptions import AuthenticationFailedException


class AuthService:
    """Authentication and user management service."""

    async def register_user(self, db: AsyncSession, user_in: UserRegister) -> User:
        stmt = select(User).where(User.email == user_in.email)
        result = await db.execute(stmt)
        if result.scalar_one_or_none():
            raise AuthenticationFailedException(detail="Email is already registered")

        user = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            full_name=user_in.full_name,
            is_active=True
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    async def authenticate_user(self, db: AsyncSession, login_in: UserLogin) -> Token:
        stmt = select(User).where(User.email == login_in.email)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user or not verify_password(login_in.password, user.hashed_password):
            raise AuthenticationFailedException(detail="Invalid email or password")

        if not user.is_active:
            raise AuthenticationFailedException(detail="Account is inactive")

        token = create_access_token(subject=user.id)
        return Token(
            access_token=token,
            token_type="bearer",
            user_id=user.id,
            email=user.email
        )

    async def get_user_by_id(self, db: AsyncSession, user_id: str) -> Optional[User]:
        stmt = select(User).where(User.id == user_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()


auth_service = AuthService()
