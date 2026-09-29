import pytest
from app.rag.keyword_search import BM25KeywordSearch
from app.rag.embeddings import bge_embedder
from app.rag.vector_store import VectorStore


def test_bm25_search():
    bm25 = BM25KeywordSearch()
    sample_chunks = [
        {"id": "c1", "content": "IS 10500 defines drinking water microbiological limits for E. coli."},
        {"id": "c2", "content": "IS 4151 covers protective helmets for two-wheeler motorcycle riders."},
        {"id": "c3", "content": "IS 1417 specifies gold hallmarking rules and mandatory 6-digit HUID code."}
    ]
    bm25.index_chunks(sample_chunks)

    results = bm25.search("gold hallmarking HUID", top_k=1)
    assert len(results) == 1
    assert results[0][0]["id"] == "c3"

    results_water = bm25.search("drinking water coliforms", top_k=1)
    assert len(results_water) == 1
    assert results_water[0][0]["id"] == "c1"


@pytest.mark.asyncio
async def test_bge_embeddings():
    v1 = await bge_embedder.get_embedding("Drinking water testing standards")
    v2 = await bge_embedder.get_embedding("Drinking water testing standards")
    v3 = await bge_embedder.get_embedding("Motorcycle helmet impact resistance")

    assert len(v1) == 1024
    sim_exact = VectorStore.cosine_similarity(v1, v2)
    assert sim_exact >= 0.99  # Identical texts yield cosine ~ 1.0

    sim_diff = VectorStore.cosine_similarity(v1, v3)
    assert sim_diff < sim_exact
