from typing import List, Optional
from pydantic import BaseModel, Field


class LaboratoryBase(BaseModel):
    name: str
    lab_type: str
    region: str
    address: str
    contact_email: str
    phone: str
    disciplines: List[str] = Field(default_factory=list)
    product_scopes: List[str] = Field(default_factory=list)


class LaboratoryCreate(LaboratoryBase):
    pass


class LaboratoryResponse(LaboratoryBase):
    id: str

    class Config:
        from_attributes = True


class LabSearchParams(BaseModel):
    query: Optional[str] = None
    region: Optional[str] = None
    discipline: Optional[str] = None
    limit: int = 20
    offset: int = 0
