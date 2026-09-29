import numpy as np
from typing import List, Dict, Any, Tuple
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.rag import DocumentChunk, Document
from app.rag.embeddings import bge_embedder


class VectorStore:
    """Vector search manager with support for in-memory cosine and database chunk embeddings."""

    @staticmethod
    def cosine_similarity(v1: List[float], v2: List[float]) -> float:
        a = np.array(v1)
        b = np.array(v2)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(a, b) / (norm_a * norm_b))

    async def search(
        self,
        db: AsyncSession,
        query: str,
        top_k: int = 10
    ) -> List[Tuple[Dict[str, Any], float]]:
        """Computes query embedding and retrieves top_k nearest chunks."""
        query_vec = await bge_embedder.get_embedding(query)

        # Query chunks with their parent documents
        stmt = (
            select(DocumentChunk, Document)
            .join(Document, DocumentChunk.document_id == Document.id)
        )
        result = await db.execute(stmt)
        rows = result.all()

        scored: List[Tuple[Dict[str, Any], float]] = []
        for chunk, doc in rows:
            if not chunk.embedding:
                continue
            sim = self.cosine_similarity(query_vec, chunk.embedding)
            chunk_dict = {
                "id": chunk.id,
                "document_id": doc.id,
                "standard_number": doc.standard_number,
                "document_title": doc.title,
                "clause_number": chunk.clause_number,
                "page_number": chunk.page_number,
                "content": chunk.content,
                "source_url": doc.source_url,
            }
            scored.append((chunk_dict, sim))

        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:top_k]


vector_store = VectorStore()
