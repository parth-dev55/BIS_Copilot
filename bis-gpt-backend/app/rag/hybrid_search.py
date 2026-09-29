from typing import List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.rag.keyword_search import bm25_search
from app.rag.vector_store import vector_store
from app.rag.reranker import hybrid_reranker
from app.core.config import settings


class HybridSearchOrchestrator:
    """Coordinates BM25 + Vector Search + Reranker."""

    async def search(
        self,
        db: AsyncSession,
        query: str,
        bm25_top_k: int = 10,
        vector_top_k: int = 10,
        rerank_top_k: int = 5
    ) -> List[Tuple[Dict[str, Any], float]]:
        # 1. Sparse BM25 Search
        bm25_results = bm25_search.search(query, top_k=bm25_top_k)

        # 2. Dense Vector Search
        vector_results = await vector_store.search(db, query, top_k=vector_top_k)

        # 3. Fuse & Rerank via RRF
        reranked = hybrid_reranker.rerank(bm25_results, vector_results, top_k=rerank_top_k)

        return reranked


hybrid_search = HybridSearchOrchestrator()
