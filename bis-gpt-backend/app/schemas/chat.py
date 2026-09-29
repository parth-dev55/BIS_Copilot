from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class CitationSchema(BaseModel):
    standard_number: str
    document_title: str
    clause: Optional[str] = None
    page: Optional[int] = None
    source_url: str
    snippet: str


class ComplianceStageSchema(BaseModel):
    step_number: int
    title: str
    description: str
    action_required: str
    documents_needed: List[str] = Field(default_factory=list)
    portal_link: Optional[str] = None


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User query or message")
    conversation_id: Optional[str] = None
    language: str = Field(default="en", description="Language code e.g. en, hi")


class ChatResponse(BaseModel):
    answer: str
    clarification_required: bool = False
    clarification_question: Optional[str] = None
    conversation_id: Optional[str] = None
    message_id: Optional[str] = None
    citations: List[CitationSchema] = Field(default_factory=list)
    compliance_journey: List[ComplianceStageSchema] = Field(default_factory=list)
    entities_detected: Optional[Dict[str, Any]] = None


class MessageHistoryItem(BaseModel):
    id: str
    sender: str
    content: str
    clarification_required: bool
    created_at: str

    class Config:
        from_attributes = True


class ConversationSummary(BaseModel):
    id: str
    title: str
    created_at: str
    message_count: int = 0

    class Config:
        from_attributes = True
