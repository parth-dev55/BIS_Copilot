from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.rag import Document, DocumentChunk
from app.ingestion.pdf_parser import bis_pdf_parser
from app.ingestion.chunker import bis_chunker
from app.rag.embeddings import bge_embedder
from app.rag.keyword_search import bm25_search


class BISIngestionPipeline:
    """End-to-end ingestion pipeline: Parse -> Chunk -> Embed -> Store -> Index."""

    async def ingest_document(
        self,
        db: AsyncSession,
        title: str,
        standard_number: str,
        raw_text: str,
        source_url: str,
        doc_type: str = "standard"
    ) -> Document:
        # 1. Create parent Document record
        doc = Document(
            title=title,
            standard_number=standard_number,
            doc_type=doc_type,
            source_url=source_url
        )
        db.add(doc)
        await db.flush()

        # 2. Parse text into sections
        sections = bis_pdf_parser.parse_text_to_sections(raw_text)

        # 3. Create chunks
        all_chunks: List[Dict[str, Any]] = []
        for sec in sections:
            sec_chunks = bis_chunker.chunk_section(sec)
            all_chunks.extend(sec_chunks)

        if not all_chunks:
            # Fallback single chunk
            all_chunks = [{
                "clause_number": "1.0",
                "page_number": 1,
                "content": raw_text
            }]

        # 4. Generate batch embeddings
        chunk_texts = [c["content"] for c in all_chunks]
        embeddings = await bge_embedder.get_embeddings(chunk_texts)

        # 5. Insert DocumentChunk models
        chunk_objects = []
        bm25_items = []
        for idx, (chunk_data, emb) in enumerate(zip(all_chunks, embeddings)):
            db_chunk = DocumentChunk(
                document_id=doc.id,
                chunk_index=idx,
                clause_number=chunk_data.get("clause_number"),
                page_number=chunk_data.get("page_number"),
                content=chunk_data["content"],
                embedding=emb
            )
            db.add(db_chunk)
            chunk_objects.append(db_chunk)

            bm25_items.append({
                "id": f"{doc.id}-{idx}",
                "document_id": doc.id,
                "standard_number": standard_number,
                "document_title": title,
                "clause_number": chunk_data.get("clause_number"),
                "page_number": chunk_data.get("page_number"),
                "content": chunk_data["content"],
                "source_url": source_url
            })

        await db.flush()

        # 6. Update BM25 index with new items
        current_bm25 = bm25_search.corpus_chunks
        bm25_search.index_chunks(current_bm25 + bm25_items)

        return doc


bis_ingestion_pipeline = BISIngestionPipeline()
