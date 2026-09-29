from typing import List, Dict, Any


class BISChunker:
    """Chunks structured BIS sections into RAG-ready units preserving clause and page context."""

    def __init__(self, target_chunk_size: int = 500, overlap_words: int = 50):
        self.target_chunk_size = target_chunk_size
        self.overlap_words = overlap_words

    def chunk_section(self, section: Dict[str, Any]) -> List[Dict[str, Any]]:
        clause = section.get("clause_number", "1.0")
        title = section.get("clause_title", "")
        page = section.get("page_number", 1)
        text = section.get("content", "")

        words = text.split()
        if len(words) <= self.target_chunk_size:
            return [{
                "clause_number": clause,
                "page_number": page,
                "content": f"[Clause {clause} - {title}]\n{text}"
            }]

        chunks = []
        start = 0
        while start < len(words):
            end = min(start + self.target_chunk_size, len(words))
            chunk_text = " ".join(words[start:end])
            chunks.append({
                "clause_number": clause,
                "page_number": page,
                "content": f"[Clause {clause} - {title} (Contd.)]\n{chunk_text}"
            })
            start += (self.target_chunk_size - self.overlap_words)

        return chunks


bis_chunker = BISChunker()
