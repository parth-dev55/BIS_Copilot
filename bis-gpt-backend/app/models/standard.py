import uuid
from typing import Optional, List
from sqlalchemy import String, Text, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base, TimestampMixin


class Standard(Base, TimestampMixin):
    __tablename__ = "standards"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    is_number: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    product_name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    scheme: Mapped[str] = mapped_column(String(100), nullable=False)
    mandatory_qco: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    qco_title: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    qco_ministry: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    description_plain: Mapped[str] = mapped_column(Text, nullable=False)
    
    # List of key testing parameters
    key_testing_parameters: Mapped[List[str]] = mapped_column(JSON, default=list)
    recommended_labs: Mapped[List[str]] = mapped_column(JSON, default=list)
    source_url: Mapped[str] = mapped_column(String(500), nullable=False)
    portal_url: Mapped[str] = mapped_column(String(500), nullable=False)
