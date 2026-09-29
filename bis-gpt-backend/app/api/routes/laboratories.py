from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.models.laboratory import Laboratory
from app.schemas.laboratories import LaboratoryResponse, LabSearchParams

router = APIRouter(prefix="/laboratories", tags=["Recognized Testing Laboratories"])


@router.get("", response_model=List[LaboratoryResponse])
async def list_laboratories(
    query: str = Query(None, description="Search term for lab name, product scope, or city"),
    region: str = Query(None, description="Region filter: North, West, South, East"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """Search official BIS Central, Regional, and recognized partner testing laboratories."""
    stmt = select(Laboratory)

    if query:
        q = f"%{query}%"
        stmt = stmt.where(
            or_(
                Laboratory.name.ilike(q),
                Laboratory.address.ilike(q),
                Laboratory.lab_type.ilike(q)
            )
        )

    if region and region.lower() != "all":
        stmt = stmt.where(Laboratory.region.ilike(region))

    stmt = stmt.limit(limit).offset(offset)
    result = await db.execute(stmt)
    labs = result.scalars().all()
    return list(labs)


@router.get("/{lab_id}", response_model=LaboratoryResponse)
async def get_laboratory(lab_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve laboratory details by identifier."""
    lab = await db.get(Laboratory, lab_id)
    if not lab:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Laboratory '{lab_id}' not found.")
    return lab
