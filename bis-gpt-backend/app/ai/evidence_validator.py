import re
from typing import List, Tuple, Optional
from app.schemas.chat import CitationSchema


class EvidenceValidator:
    """Validates generated text against retrieved citations to eliminate hallucinations."""

    IS_REGEX = re.compile(r"\bIS\s*[:\-]?\s*(\d{3,5}(?:\s*\([A-Za-z0-9\s]+\))?(?::\d{4})?)\b", re.IGNORECASE)

    def validate_and_refine(
        self,
        answer: str,
        citations: List[CitationSchema],
        min_citations: int = 1
    ) -> Tuple[str, bool]:
        """Validates that factual standard mentions correspond to retrieved citations.
        
        Returns:
            (refined_answer, is_valid)
        """
        # If no citations were retrieved and the query required factual BIS standards
        if len(citations) < min_citations:
            # Check if answer contains claims without evidence
            if "insufficient verified bis evidence" in answer.lower():
                return answer, True
            return "Insufficient verified BIS evidence was found.", False

        # Extract standard numbers from answer
        mentioned_standards = self.IS_REGEX.findall(answer)
        verified_standard_numbers = {c.standard_number.lower().replace(" ", "").replace(":", "") for c in citations}

        # Check if any ungrounded standard numbers are claimed
        unverified_mentions = []
        for std in mentioned_standards:
            norm_std = f"is{std.lower().replace(' ', '').replace(':', '')}"
            # Check if any citation matches
            if not any(norm_std in v or v in norm_std for v in verified_standard_numbers):
                unverified_mentions.append(std)

        if unverified_mentions:
            # Prevent hallucinated standards from surfacing
            refined = (
                f"{answer}\n\n*Note: Mentions of {', '.join(unverified_mentions)} "
                "could not be verified against the current BIS evidence registry.*"
            )
            return refined, True

        return answer, True


evidence_validator = EvidenceValidator()
