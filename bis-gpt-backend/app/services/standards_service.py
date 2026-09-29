from typing import List, Optional
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.standard import Standard
from app.schemas.standards import StandardSearchParams


class StandardsService:
    """Service for searching, filtering, and retrieving Indian Standards and QCOs."""

    async def search_standards(
        self,
        db: AsyncSession,
        params: StandardSearchParams
    ) -> List[Standard]:
        stmt = select(Standard)

        if params.query:
            q = f"%{params.query}%"
            stmt = stmt.where(
                or_(
                    Standard.is_number.ilike(q),
                    Standard.product_name.ilike(q),
                    Standard.title.ilike(q),
                    Standard.description_plain.ilike(q)
                )
            )

        if params.category:
            stmt = stmt.where(Standard.category == params.category)

        if params.mandatory_only:
            stmt = stmt.where(Standard.mandatory_qco == True)

        stmt = stmt.limit(params.limit).offset(params.offset)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_is_number(self, db: AsyncSession, is_number: str) -> Optional[Standard]:
        stmt = select(Standard).where(Standard.is_number == is_number)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_id(self, db: AsyncSession, standard_id: str) -> Optional[Standard]:
        stmt = select(Standard).where(Standard.id == standard_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()


standards_service = StandardsService()
