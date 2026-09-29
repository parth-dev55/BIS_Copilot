from typing import List, Optional
from pydantic import BaseModel, Field


class StandardBase(BaseModel):
    is_number: str
    title: str
    product_name: str
    category: str
    scheme: str
    mandatory_qco: bool = False
    qco_title: Optional[str] = None
    qco_ministry: Optional[str] = None
    description_plain: str
    key_testing_parameters: List[str] = Field(default_factory=list)
    recommended_labs: List[str] = Field(default_factory=list)
    source_url: str
    portal_url: str


class StandardCreate(StandardBase):
    pass


class StandardResponse(StandardBase):
    id: str

    class Config:
        from_attributes = True


class StandardSearchParams(BaseModel):
    query: Optional[str] = None
    category: Optional[str] = None
    mandatory_only: Optional[bool] = False
    limit: int = 20
    offset: int = 0
