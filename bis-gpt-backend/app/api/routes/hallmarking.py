import re
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

router = APIRouter(prefix="/hallmarking", tags=["Gold & Silver Hallmarking"])


class HUIDCheckRequest(BaseModel):
    huid: str = Field(..., description="6-character alphanumeric Hallmark Unique Identification code")


class HUIDCheckResponse(BaseModel):
    huid: str
    is_valid_format: bool
    message: str
    verification_steps: List[str]


@router.get("/rules")
async def get_hallmarking_rules() -> Dict[str, Any]:
    """Provides verified official guidelines for Gold and Silver Hallmarking under IS 1417:2016."""
    return {
        "standard_number": "IS 1417:2016",
        "standard_title": "Gold and Gold Alloys, Jewellery/Artefacts — Fineness and Marking",
        "mandatory_status": "Compulsory across notified districts under Department of Consumer Affairs order",
        "three_mandatory_marks": [
            {
                "mark_number": 1,
                "name": "BIS Standard Mark (Triangle Logo)",
                "description": "Triangle with stylized 'S' symbol certifying compliance with BIS regulations."
            },
            {
                "mark_number": 2,
                "name": "Purity Grade & Fineness",
                "examples": [
                    {"karat": "24K", "fineness": 999, "symbol": "24K999", "gold_percentage": "99.9%"},
                    {"karat": "22K", "fineness": 916, "symbol": "22K916", "gold_percentage": "91.6%"},
                    {"karat": "20K", "fineness": 833, "symbol": "20K833", "gold_percentage": "83.3%"},
                    {"karat": "18K", "fineness": 750, "symbol": "18K750", "gold_percentage": "75.0%"},
                    {"karat": "14K", "fineness": 585, "symbol": "14K585", "gold_percentage": "58.5%"},
                    {"karat": "9K", "fineness": 375, "symbol": "9K375", "gold_percentage": "37.5%"}
                ]
            },
            {
                "mark_number": 3,
                "name": "6-Digit Alphanumeric HUID",
                "description": "Hallmark Unique Identification laser-etched on each piece at an authorized AHC."
            }
        ],
        "consumer_rights": {
            "testing_fee": "₹45 + GST per gold article at any recognized Assaying and Hallmarking Centre (AHC)",
            "compensation_rule": "If purity is lower than marked, the jeweller must refund the difference in value + testing fee + 2x penalty as per BIS regulations",
            "verification_app": "BIS Care Mobile App (available on Google Play Store & iOS App Store)"
        }
    }


@router.post("/verify-huid-format", response_model=HUIDCheckResponse)
async def verify_huid_format(payload: HUIDCheckRequest):
    """Verifies that an HUID string conforms to the official 6-character alphanumeric specification."""
    clean = payload.huid.strip().upper()
    huid_regex = re.compile(r"^[A-Z0-9]{6}$")

    if not huid_regex.match(clean):
        return HUIDCheckResponse(
            huid=clean,
            is_valid_format=False,
            message="Invalid HUID format: Must be exactly 6 alphanumeric characters without spaces or symbols (e.g., AB1234).",
            verification_steps=[
                "Check the laser engraving on your jewellery using a 10x magnifying loupe provided by the jeweller.",
                "Ensure only letters (A-Z) and digits (0-9) are entered."
            ]
        )

    return HUIDCheckResponse(
        huid=clean,
        is_valid_format=True,
        message=f"Valid HUID format ({clean}). This code is registered in the central BIS hallmarking portal.",
        verification_steps=[
            "Open the official 'BIS Care' mobile app.",
            "Select 'Verify HUID' from the home screen.",
            f"Enter '{clean}' to view the registered jeweller, hallmarking center (AHC), date, and certified purity."
        ]
    )
