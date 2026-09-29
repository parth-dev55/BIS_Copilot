from typing import List
from fastapi import APIRouter, HTTPException, status
from app.schemas.certification import CertificationSchemeResponse
from app.schemas.chat import ComplianceStageSchema

router = APIRouter(prefix="/certification", tags=["Certification Schemes"])

# Canonical BIS certification schemes verified data
CANONICAL_SCHEMES = [
    CertificationSchemeResponse(
        id="scheme-1",
        scheme_code="Scheme-I (ISI Mark)",
        name="Product Certification Scheme for Domestic Manufacturers",
        target_audience="Domestic manufacturers with production plants in India",
        applicable_products="Packaged drinking water, motorcycle helmets, steel bars, PVC cables, toys, cement",
        portal_url="https://www.manakonline.in",
        estimated_timeline="30 to 60 days (Simplified procedure: ~30 days)",
        key_fees="Application: ₹1,000 | Inspection: ₹7,000/day | Annual: ₹1,000 + Product Marking Fee",
        common_pitfalls=[
            "Uncalibrated in-house test gauges",
            "Lack of qualified testing personnel in factory",
            "Trademark authorization discrepancy",
            "Failing microbiological or heavy metal limits during independent testing"
        ],
        steps=[
            ComplianceStageSchema(
                step_number=1,
                title="In-House Testing Setup (SIT Compliance)",
                description="Procure required testing equipment matching the Scheme of Inspection and Testing.",
                action_required="Establish internal quality control laboratory with calibrated instruments.",
                documents_needed=["Manufacturing machinery list", "Testing equipment calibration certificates", "Factory layout plan"],
                portal_link="https://standardsbis.bsbedge.com"
            ),
            ComplianceStageSchema(
                step_number=2,
                title="Online Application on Manakonline",
                description="Submit Form-I on the official e-BIS portal with necessary documentation and application fee.",
                action_required="Upload corporate registration and factory address proof.",
                documents_needed=["MSME/Udyam certificate or Factory license", "GST/PAN proof", "Brand trademark registration"],
                portal_link="https://www.manakonline.in"
            ),
            ComplianceStageSchema(
                step_number=3,
                title="Factory Audit by BIS Officer",
                description="BIS inspecting officer visits the factory to inspect manufacturing processes and draw test samples.",
                action_required="Demonstrate testing procedures in front of the officer.",
                documents_needed=["Quality manual SOPs", "Raw material test records", "Instrument calibration logs"],
                portal_link="https://bis.gov.in"
            ),
            ComplianceStageSchema(
                step_number=4,
                title="Independent Laboratory Testing",
                description="Sealed sample is dispatched to a BIS recognized laboratory for full specification testing.",
                action_required="Pay testing fee directly to the assigned testing laboratory.",
                documents_needed=["Sample dispatch receipt"],
                portal_link="https://bis.gov.in/laboratory-services/"
            ),
            ComplianceStageSchema(
                step_number=5,
                title="Grant of License (CML Number)",
                description="Upon satisfactory audit and test reports, BIS issues the Certificate of Manufacturing License.",
                action_required="Pay annual marking fee and apply the ISI mark on product packaging.",
                documents_needed=["Agreement of Terms & Conditions", "Bank guarantee if applicable"],
                portal_link="https://www.manakonline.in"
            )
        ]
    ),
    CertificationSchemeResponse(
        id="scheme-2",
        scheme_code="Scheme-II (CRS)",
        name="Compulsory Registration Scheme for Electronics & IT Goods",
        target_audience="Domestic and foreign manufacturers of electronics and IT hardware",
        applicable_products="Laptops, smartphones, secondary lithium batteries, LED lamps, smart watches",
        portal_url="https://www.crsbis.in",
        estimated_timeline="15 to 25 days after lab test report generation",
        key_fees="Application: ₹53,100 per test report/series | Renewal: ₹56,640 for 2 years",
        common_pitfalls=[
            "Submitting test reports older than 90 days",
            "Series grouping guideline non-compliance",
            "Mismatch between production BOM and tested sample"
        ],
        steps=[
            ComplianceStageSchema(
                step_number=1,
                title="Sample Safety Testing in BIS Recognized Lab",
                description="Submit product units to any accredited lab in India for safety evaluation.",
                action_required="Obtain valid Test Report issued within 90 days.",
                documents_needed=["Technical specification sheet", "Schematics and PCB layout", "Critical component list with approvals"],
                portal_link="https://www.crsbis.in"
            ),
            ComplianceStageSchema(
                step_number=2,
                title="Appoint Authorized Indian Representative (AIR)",
                description="Foreign entities must appoint a legal representative residing in India.",
                action_required="Execute AIR agreement on non-judicial stamp paper.",
                documents_needed=["AIR nomination agreement", "AIR identity & address proofs"],
                portal_link="https://www.crsbis.in"
            ),
            ComplianceStageSchema(
                step_number=3,
                title="Online Registration on CRS Portal",
                description="File application on crsbis.in, link test report and pay statutory fees.",
                action_required="Complete model series declaration.",
                documents_needed=["Original test report", "Brand owner authorization letter"],
                portal_link="https://www.crsbis.in"
            ),
            ComplianceStageSchema(
                step_number=4,
                title="Grant of Registration (R-Number)",
                description="BIS issues R-Number allowing usage of standard CRS label.",
                action_required="Affix the standard mark with R-Number on product and box packaging.",
                documents_needed=["Label artwork showing standard mark"],
                portal_link="https://www.crsbis.in"
            )
        ]
    )
]


@router.get("/schemes", response_model=List[CertificationSchemeResponse])
async def list_certification_schemes():
    """Retrieve verified step-by-step BIS certification workflows."""
    return CANONICAL_SCHEMES


@router.get("/schemes/{scheme_id}", response_model=CertificationSchemeResponse)
async def get_certification_scheme(scheme_id: str):
    """Retrieve details and roadmap for a specific scheme (e.g. scheme-1, scheme-2)."""
    for s in CANONICAL_SCHEMES:
        if s.id == scheme_id or s.scheme_code.lower().startswith(scheme_id.lower()):
            return s
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Scheme '{scheme_id}' not found.")
