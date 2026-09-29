from typing import Dict, Any, Optional, Tuple


class ClarificationEngine:
    """Detects missing critical information and formulates the minimum necessary disambiguation question."""

    CLARIFICATION_TEMPLATES = {
        "pipe_material": (
            "To recommend the exact Indian Standard for pipes, could you specify the pipe material "
            "(e.g., PVC, HDPE, Ductile Iron, or Galvanized Steel) and intended application "
            "(e.g., potable drinking water, underground sewerage, or agricultural irrigation)?"
        ),
        "voltage_rating": (
            "To pinpoint the correct Indian Standard for electrical cables/wires, what is the working voltage "
            "(e.g., domestic up to 1100 V under IS 694 or high voltage power cables) and insulation type (PVC or XLPE)?"
        ),
        "battery_chemistry": (
            "Could you clarify the battery type and application? (e.g., secondary lithium-ion cells for electronics "
            "under IS 16046, or lead-acid batteries for automotive/inverter usage under IS 14257)?"
        )
    }

    def check_clarification_needed(self, analysis: Dict[str, Any], raw_message: str) -> Tuple[bool, Optional[str]]:
        """Returns (clarification_required, clarification_question)."""
        is_ambiguous = analysis.get("is_ambiguous", False)
        missing_info = analysis.get("missing_critical_info", [])

        if not is_ambiguous or not missing_info:
            return False, None

        # Check matched templates
        for missing_key in missing_info:
            if missing_key in self.CLARIFICATION_TEMPLATES:
                return True, self.CLARIFICATION_TEMPLATES[missing_key]

        # Generic minimum question if custom template not matched
        entities = analysis.get("entities", {})
        product = entities.get("product") or "your product"
        return True, (
            f"To provide the exact Indian Standard and certification requirements for {product}, "
            "could you clarify the primary material and intended industrial application?"
        )


clarification_engine = ClarificationEngine()
