from typing import List
from pydantic import BaseModel, Field
from app.schemas.chat import ComplianceStageSchema


class CertificationSchemeResponse(BaseModel):
    id: str
    scheme_code: str
    name: str
    target_audience: str
    applicable_products: str
    portal_url: str
    estimated_timeline: str
    key_fees: str
    common_pitfalls: List[str] = Field(default_factory=list)
    steps: List[ComplianceStageSchema] = Field(default_factory=list)
