from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_optional_current_user
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ConversationSummary,
    MessageHistoryItem
)
from app.services.chat_service import chat_service
from app.models.user import User
from app.models.conversation import Conversation, Message
from app.core.exceptions import EntityNotFoundException

router = APIRouter(tags=["Chat & Compliance Copilot"])


@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_endpoint(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Core BIS Copilot Chat endpoint.
    
    Executes:
    Query Understanding -> Clarification Engine -> Hybrid RAG -> Qwen LLM -> Evidence Validation.
    """
    user_id = current_user.id if current_user else None
    response = await chat_service.process_chat_message(db, request, user_id=user_id)
    return response


@router.get("/conversations", response_model=List[ConversationSummary])
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
    limit: int = Query(20, ge=1, le=100)
):
    """Lists conversations for current user or recent active sessions."""
    stmt = select(Conversation).order_by(Conversation.updated_at.desc()).limit(limit)
    if current_user:
        stmt = stmt.where(Conversation.user_id == current_user.id)

    result = await db.execute(stmt)
    convs = result.scalars().all()

    return [
        ConversationSummary(
            id=c.id,
            title=c.title,
            created_at=c.created_at.isoformat(),
            message_count=len(c.messages) if c.messages else 0
        )
        for c in convs
    ]


@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageHistoryItem])
async def get_conversation_messages(
    conversation_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Retrieves message history for a specific conversation."""
    stmt = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
    )
    result = await db.execute(stmt)
    messages = result.scalars().all()

    if not messages:
        # Check if conversation exists
        conv = await db.get(Conversation, conversation_id)
        if not conv:
            raise EntityNotFoundException("Conversation", conversation_id)

    return [
        MessageHistoryItem(
            id=m.id,
            sender=m.sender,
            content=m.content,
            clarification_required=m.clarification_required,
            created_at=m.created_at.isoformat()
        )
        for m in messages
    ]
