import re
import json
from typing import Dict, Any, Optional
from app.ai.prompts import QUERY_UNDERSTANDING_SYSTEM_PROMPT
from app.ai.qwen_client import qwen_client


class QueryUnderstandingEngine:
    """Analyzes user input to extract domain entities and determine intent."""

    # Fast regex patterns for explicit Indian Standard numbers (e.g. IS 10500, IS 1417:2016, IS:694)
    IS_REGEX = re.compile(r"\bIS\s*[:\-]?\s*(\d{3,5}(?:\s*\([A-Za-z0-9\s]+\))?(?::\d{4})?)\b", re.IGNORECASE)

    # Known common BIS materials & products for heuristic fallback
    MATERIALS = ["pvc", "hdpe", "steel", "gold", "silver", "copper", "aluminum", "rubber", "plastic", "leather"]
    PRODUCTS = ["pipe", "pipes", "cable", "cables", "wire", "water", "helmet", "helmets", "battery", "batteries", "toy", "toys", "iron", "bulb", "led", "cement", "tmt"]
    APPLICATIONS = ["drinking", "potable", "drainage", "sewage", "electrical", "wiring", "irrigation", "construction", "domestic"]

    async def analyze_query(self, message: str) -> Dict[str, Any]:
        """Analyzes query using LLM structured extraction, falling back to rule-based heuristics."""
        clean_msg = message.strip()

        # Quick rule-based pre-parse
        extracted_is = None
        is_match = self.IS_REGEX.search(clean_msg)
        if is_match:
            extracted_is = f"IS {is_match.group(1)}"

        # Try structured LLM extraction
        try:
            llm_prompt = [
                {"role": "system", "content": QUERY_UNDERSTANDING_SYSTEM_PROMPT},
                {"role": "user", "content": f"Analyze query: '{clean_msg}'"}
            ]
            response_text = await qwen_client.generate_chat_completion(
                messages=llm_prompt,
                temperature=0.1,
                max_tokens=256,
            )
            # Try parsing JSON from LLM response
            json_start = response_text.find("{")
            json_end = response_text.rfind("}") + 1
            if json_start != -1 and json_end != -1:
                parsed = json.loads(response_text[json_start:json_end])
                if extracted_is and not parsed.get("entities", {}).get("standard_number"):
                    parsed.setdefault("entities", {})["standard_number"] = extracted_is
                return parsed
        except Exception:
            pass

        # Robust heuristic fallback
        return self._heuristic_analysis(clean_msg, extracted_is)

    def _heuristic_analysis(self, message: str, explicit_is: Optional[str]) -> Dict[str, Any]:
        lower = message.lower()

        # Intent detection
        intent = "general_inquiry"
        if any(w in lower for w in ["which standard", "standard applies", "is number", "what standard", "recommend standard"]):
            intent = "standard_lookup"
        elif any(w in lower for w in ["how to get", "process", "certification", "license", "scheme", "apply", "manakonline"]):
            intent = "certification_guide"
        elif any(w in lower for w in ["lab", "testing", "where to test", "sahibabad", "nabl"]):
            intent = "lab_locator"
        elif any(w in lower for w in ["gold", "hallmark", "huid", "carat", "karat", "jewellery"]):
            intent = "hallmarking_rule"

        # Entity extraction
        detected_material = next((m for m in self.MATERIALS if m in lower), None)
        detected_product = next((p for p in self.PRODUCTS if p in lower), None)
        detected_app = next((a for a in self.APPLICATIONS if a in lower), None)
        
        # Ambiguity check
        is_ambiguous = False
        missing_info = []

        # Example from brief: "Which BIS standard applies to pipes?" -> Missing material and application
        if detected_product in ["pipe", "pipes"]:
            if not detected_material and not detected_app:
                is_ambiguous = True
                missing_info = ["pipe_material", "application"]
        elif detected_product in ["cable", "cables", "wire"]:
            if not detected_app and "voltage" not in lower:
                is_ambiguous = True
                missing_info = ["voltage_rating", "application"]

        return {
            "intent": intent,
            "entities": {
                "product": detected_product,
                "material": detected_material,
                "application": detected_app,
                "industry": None,
                "standard_number": explicit_is,
                "location": None
            },
            "is_ambiguous": is_ambiguous,
            "missing_critical_info": missing_info
        }


query_understanding_engine = QueryUnderstandingEngine()
