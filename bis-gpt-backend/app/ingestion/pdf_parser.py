import re
from typing import List, Dict, Any


class BISPDFParser:
    """Extracts text sections, titles, and clause numbers from BIS standards documents."""

    CLAUSE_REGEX = re.compile(r"^(\d+(?:\.\d+)*)\s+([A-Z][A-Za-z0-9\s,\-]+)$", re.MULTILINE)

    def parse_text_to_sections(self, raw_text: str) -> List[Dict[str, Any]]:
        """Splits raw document text into clauses and sub-clauses."""
        lines = raw_text.splitlines()
        sections: List[Dict[str, Any]] = []

        current_clause = "1.0"
        current_title = "Scope and General Requirements"
        current_buffer: List[str] = []
        page_estimate = 1

        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue

            # Detect page markers
            if "page" in line_str.lower() and re.search(r"\bpage\s+\d+\b", line_str.lower()):
                page_estimate += 1
                continue

            match = self.CLAUSE_REGEX.match(line_str)
            if match:
                # Save previous section
                if current_buffer:
                    sections.append({
                        "clause_number": current_clause,
                        "clause_title": current_title,
                        "page_number": page_estimate,
                        "content": "\n".join(current_buffer)
                    })
                    current_buffer = []

                current_clause = match.group(1)
                current_title = match.group(2)
            else:
                current_buffer.append(line_str)

        if current_buffer:
            sections.append({
                "clause_number": current_clause,
                "clause_title": current_title,
                "page_number": page_estimate,
                "content": "\n".join(current_buffer)
            })

        return sections


bis_pdf_parser = BISPDFParser()
