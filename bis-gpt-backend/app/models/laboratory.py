import uuid
from typing import List
from sqlalchemy import String, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base, TimestampMixin


class Laboratory(Base, TimestampMixin):
    __tablename__ = "laboratories"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    lab_type: Mapped[str] = mapped_column(String(100), nullable=False)  # 'Central Laboratory', 'Regional Laboratory'
    region: Mapped[str] = mapped_column(String(50), index=True, nullable=False)  # 'North', 'West', 'South', 'East'
    address: Mapped[str] = mapped_column(String(500), nullable=False)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(100), nullable=False)
    disciplines: Mapped[List[str]] = mapped_column(JSON, default=list)
    product_scopes: Mapped[List[str]] = mapped_column(JSON, default=list)
