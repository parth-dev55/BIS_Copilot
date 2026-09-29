from typing import List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.chat import CitationSchema
from app.rag.hybrid_search import hybrid_search


class BISRetriever:
    """High-level retriever that returns verified citations with exact document, clause, page, and URL."""

    async def retrieve_evidence(
        self,
        db: AsyncSession,
        query: str,
        top_k: int = 5
    ) -> List[CitationSchema]:
        results = await hybrid_search.search(db, query, rerank_top_k=top_k)

        citations: List[CitationSchema] = []
        for chunk, score in results:
            citation = CitationSchema(
                standard_number=chunk.get("standard_number", "IS Standard"),
                document_title=chunk.get("document_title", "Bureau of Indian Standards Specification"),
                clause=chunk.get("clause_number"),
                page=chunk.get("page_number"),
                source_url=chunk.get("source_url", "https://standardsbis.bsbedge.com"),
                snippet=chunk.get("content", "")[:350]
            )
            citations.append(citation)

        return citations


bis_retriever = BISRetriever()
