import re
from typing import List, Dict, Any, Tuple
from rank_bm25 import BM25Okapi


class BM25KeywordSearch:
    """In-memory BM25 index over BIS document chunks."""

    def __init__(self):
        self.corpus_chunks: List[Dict[str, Any]] = []
        self.tokenized_corpus: List[List[str]] = []
        self.bm25: BM25Okapi = None

    def tokenize(self, text: str) -> List[str]:
        """Simple clean tokenization."""
        clean = re.sub(r"[^\w\s]", " ", text.lower())
        tokens = [t for t in clean.split() if len(t) > 2]
        return tokens

    def index_chunks(self, chunks: List[Dict[str, Any]]) -> None:
        """Indexes or refreshes chunks in the BM25 model."""
        self.corpus_chunks = chunks
        self.tokenized_corpus = [self.tokenize(c["content"]) for c in chunks]
        if self.tokenized_corpus:
            self.bm25 = BM25Okapi(self.tokenized_corpus)
        else:
            self.bm25 = None

    def search(self, query: str, top_k: int = 10) -> List[Tuple[Dict[str, Any], float]]:
        """Searches BM25 index and returns list of (chunk, score)."""
        if not self.bm25 or not self.corpus_chunks:
            return []

        tokens = self.tokenize(query)
        if not tokens:
            return []

        scores = self.bm25.get_scores(tokens)
        scored_pairs = list(zip(self.corpus_chunks, scores))
        scored_pairs.sort(key=lambda x: x[1], reverse=True)
        return scored_pairs[:top_k]


bm25_search = BM25KeywordSearch()
