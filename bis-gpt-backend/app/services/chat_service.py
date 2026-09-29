import uuid
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.conversation import Conversation, Message
from app.models.rag import Citation
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    CitationSchema,
    ComplianceStageSchema
)
from app.ai.query_understanding import query_understanding_engine
from app.ai.clarification_engine import clarification_engine
from app.ai.evidence_validator import evidence_validator
from app.ai.qwen_client import qwen_client
from app.ai.prompts import BIS_SYSTEM_PROMPT
from app.rag.retriever import bis_retriever


class ChatService:
    """End-to-end BIS Compliance Copilot Chat Orchestrator."""

    async def process_chat_message(
        self,
        db: AsyncSession,
        request: ChatRequest,
        user_id: Optional[str] = None
    ) -> ChatResponse:
        message_text = request.message.strip()

        # 1. Manage Conversation Session
        conversation = await self._get_or_create_conversation(
            db, request.conversation_id, user_id, message_text
        )

        # Record User Message
        user_msg = Message(
            conversation_id=conversation.id,
            sender="user",
            content=message_text
        )
        db.add(user_msg)
        await db.flush()

        # 2. Query Understanding (Entity & Intent Extraction)
        analysis = await query_understanding_engine.analyze_query(message_text)

        # 3. Clarification Engine (Check if minimum question is required)
        is_ambiguous, clarification_q = clarification_engine.check_clarification_needed(
            analysis, message_text
        )

        if is_ambiguous and clarification_q:
            # Save clarification message
            asst_msg = Message(
                conversation_id=conversation.id,
                sender="assistant",
                content=clarification_q,
                clarification_required=True
            )
            db.add(asst_msg)
            await db.commit()

            return ChatResponse(
                answer=clarification_q,
                clarification_required=True,
                clarification_question=clarification_q,
                conversation_id=conversation.id,
                message_id=asst_msg.id,
                citations=[],
                compliance_journey=[],
                entities_detected=analysis.get("entities")
            )

        # 4. Hybrid RAG (BM25 + BGE-M3 Vector + Reranker)
        citations = await bis_retriever.retrieve_evidence(
            db=db,
            query=message_text,
            top_k=4
        )

        # 5. BIS Evidence Layer Construction
        evidence_context = self._build_evidence_context(citations)

        # 6. Inference via Qwen2.5-7B-Instruct (vLLM Client)
        messages_payload = [
            {"role": "system", "content": f"{BIS_SYSTEM_PROMPT}\n\nVERIFIED BIS EVIDENCE CONTEXT:\n{evidence_context}"},
            {"role": "user", "content": message_text}
        ]

        raw_llm_answer = await qwen_client.generate_chat_completion(
            messages=messages_payload,
            temperature=0.2,
            max_tokens=1024
        )

        # 7. Evidence / Citation Validation
        final_answer, is_valid = evidence_validator.validate_and_refine(
            answer=raw_llm_answer,
            citations=citations,
            min_citations=0  # Allow general inquiries with disclaimer if no citations
        )

        # 8. Formulate Structured Compliance Journey
        compliance_journey = self._build_compliance_journey(analysis, citations)

        # 9. Persist Assistant Response & Citations in DB
        asst_msg = Message(
            conversation_id=conversation.id,
            sender="assistant",
            content=final_answer,
            clarification_required=False,
            compliance_journey=[c.model_dump() for c in compliance_journey]
        )
        db.add(asst_msg)
        await db.flush()

        for cit in citations:
            db_citation = Citation(
                message_id=asst_msg.id,
                standard_number=cit.standard_number,
                document_title=cit.document_title,
                clause=cit.clause,
                page=cit.page,
                source_url=cit.source_url,
                snippet=cit.snippet
            )
            db.add(db_citation)

        await db.commit()

        return ChatResponse(
            answer=final_answer,
            clarification_required=False,
            clarification_question=None,
            conversation_id=conversation.id,
            message_id=asst_msg.id,
            citations=citations,
            compliance_journey=compliance_journey,
            entities_detected=analysis.get("entities")
        )

    async def _get_or_create_conversation(
        self,
        db: AsyncSession,
        conv_id: Optional[str],
        user_id: Optional[str],
        title_hint: str
    ) -> Conversation:
        if conv_id:
            conv = await db.get(Conversation, conv_id)
            if conv:
                return conv

        title = title_hint[:40] if len(title_hint) > 40 else title_hint
        new_conv = Conversation(
            user_id=user_id,
            title=title
        )
        db.add(new_conv)
        await db.flush()
        return new_conv

    def _build_evidence_context(self, citations: List[CitationSchema]) -> str:
        if not citations:
            return "No specific document clauses found in the local BIS registry."

        blocks = []
        for idx, c in enumerate(citations, 1):
            clause_info = f" [Clause {c.clause}]" if c.clause else ""
            page_info = f" (Page {c.page})" if c.page else ""
            blocks.append(
                f"[Evidence #{idx}] {c.standard_number} - {c.document_title}{clause_info}{page_info}\n"
                f"Source: {c.source_url}\nExcerpt: {c.snippet}"
            )
        return "\n\n".join(blocks)

    def _build_compliance_journey(
        self,
        analysis: Dict[str, Any],
        citations: List[CitationSchema]
    ) -> List[ComplianceStageSchema]:
        """Maps query context to the standard BIS certification journey stages."""
        entities = analysis.get("entities", {})
        product = entities.get("product") or "Product"

        return [
            ComplianceStageSchema(
                step_number=1,
                title="Identify Indian Standard & SIT",
                description=f"Confirm applicable specification and Scheme of Inspection and Testing (SIT) for {product}.",
                action_required="Procure official standard document from standardsbis.bsbedge.com and set up in-house lab.",
                documents_needed=["Factory layout plan", "List of manufacturing machinery", "List of calibrated in-house test equipment"],
                portal_link="https://standardsbis.bsbedge.com"
            ),
            ComplianceStageSchema(
                step_number=2,
                title="Online Application Submission",
                description="Register and file Form-I on the official e-BIS Manakonline portal.",
                action_required="Submit application fee and upload corporate and manufacturing facility records.",
                documents_needed=["MSME/Udyam or Factory license", "Brand trademark registration or authorization letter", "Firm registration PAN/CIN/GST"],
                portal_link="https://www.manakonline.in"
            ),
            ComplianceStageSchema(
                step_number=3,
                title="Factory Audit & Sample Testing",
                description="BIS technical officer visits factory for physical audit and independent sample drawing.",
                action_required="Demonstrate in-house testing capability and dispatch counter-sample to recognized BIS lab.",
                documents_needed=["Calibration certificates of gauges", "Quality manual SOPs", "Raw material test records"],
                portal_link="https://bis.gov.in/laboratory-services/"
            ),
            ComplianceStageSchema(
                step_number=4,
                title="Grant of License (CML / R-Number)",
                description="Upon passing audit and laboratory test results, BIS grants the Certificate of Manufacturing License.",
                action_required="Pay annual license fee and minimum marking fee before applying the ISI Mark on product labels.",
                documents_needed=["Agreement of Terms & Conditions", "Bank guarantee if applicable"],
                portal_link="https://www.manakonline.in"
            )
        ]


chat_service = ChatService()
