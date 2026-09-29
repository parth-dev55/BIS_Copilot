from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.schemas.standards import StandardResponse, StandardSearchParams
from app.services.standards_service import standards_service
from app.core.exceptions import EntityNotFoundException

router = APIRouter(prefix="/standards", tags=["Indian Standards & QCOs"])


@router.get("", response_model=List[StandardResponse])
async def list_and_search_standards(
    query: str = Query(None, description="Search term for standard number, product, or description"),
    category: str = Query(None, description="Category filter e.g. Food & Water, Electronics & IT"),
    mandatory_only: bool = Query(False, description="Filter only standards under mandatory QCO"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """Search and filter Indian Standards (IS) and Quality Control Orders (QCOs)."""
    params = StandardSearchParams(
        query=query,
        category=category,
        mandatory_only=mandatory_only,
        limit=limit,
        offset=offset
    )
    standards = await standards_service.search_standards(db, params)
    return standards


@router.get("/{is_number}", response_model=StandardResponse)
async def get_standard_by_number(
    is_number: str,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve details for a specific Indian Standard by IS number (e.g. IS 10500:2012)."""
    # Clean input if spaces or colons encoded
    clean_num = is_number.strip()
    std = await standards_service.get_by_is_number(db, clean_num)
    if not std:
        raise EntityNotFoundException("Standard", clean_num)
    return std
