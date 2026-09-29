from typing import List, Dict, Any, Tuple


class RRFHybridReranker:
    """Combines BM25 and Vector search results using Reciprocal Rank Fusion (RRF)."""

    def __init__(self, rrf_k: int = 60):
        self.rrf_k = rrf_k

    def rerank(
        self,
        bm25_results: List[Tuple[Dict[str, Any], float]],
        vector_results: List[Tuple[Dict[str, Any], float]],
        top_k: int = 5
    ) -> List[Tuple[Dict[str, Any], float]]:
        """Applies RRF formula: RRF_score = sum(1 / (k + rank))."""
        scores: Dict[str, float] = {}
        chunk_map: Dict[str, Dict[str, Any]] = {}

        # Process BM25 ranks
        for rank, (chunk, _) in enumerate(bm25_results):
            cid = chunk["id"]
            chunk_map[cid] = chunk
            scores[cid] = scores.get(cid, 0.0) + (1.0 / (self.rrf_k + rank + 1))

        # Process Vector ranks
        for rank, (chunk, _) in enumerate(vector_results):
            cid = chunk["id"]
            chunk_map[cid] = chunk
            scores[cid] = scores.get(cid, 0.0) + (1.0 / (self.rrf_k + rank + 1))

        # Sort by fused score
        fused = [(chunk_map[cid], score) for cid, score in scores.items()]
        fused.sort(key=lambda x: x[1], reverse=True)

        return fused[:top_k]


hybrid_reranker = RRFHybridReranker()
