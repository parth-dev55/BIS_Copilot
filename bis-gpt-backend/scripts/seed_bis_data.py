import asyncio
import json
from pathlib import Path
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings
from app.db.base import Base
from app.models.standard import Standard
from app.models.laboratory import Laboratory
from app.ingestion.ingestion_pipeline import bis_ingestion_pipeline


async def seed_database():
    print(f"Connecting to database at: {settings.DATABASE_URL}")
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    # 1. Create tables
    async with engine.begin() as conn:
        print("Creating tables if not present...")
        await conn.run_sync(Base.metadata.create_all)

    # 2. Read seed data
    seed_file = Path(__file__).parent.parent / "data" / "seed_standards.json"
    if not seed_file.exists():
        print(f"Seed file not found at {seed_file}")
        return

    with open(seed_file, "r", encoding="utf-8") as f:
        seed_data = json.load(f)

    async with session_factory() as session:
        # Seed Standards
        print(f"Seeding {len(seed_data['standards'])} standards...")
        for s_data in seed_data["standards"]:
            # Check if exists
            std = Standard(
                is_number=s_data["is_number"],
                title=s_data["title"],
                product_name=s_data["product_name"],
                category=s_data["category"],
                scheme=s_data["scheme"],
                mandatory_qco=s_data["mandatory_qco"],
                qco_title=s_data.get("qco_title"),
                qco_ministry=s_data.get("qco_ministry"),
                description_plain=s_data["description_plain"],
                key_testing_parameters=s_data.get("key_testing_parameters", []),
                recommended_labs=s_data.get("recommended_labs", []),
                source_url=s_data["source_url"],
                portal_url=s_data["portal_url"]
            )
            session.add(std)

            # Ingest RAG Document & Chunks
            doc_text = (
                f"STANDARD: {s_data['is_number']}\n"
                f"TITLE: {s_data['title']}\n"
                f"PRODUCT: {s_data['product_name']}\n"
                f"DESCRIPTION: {s_data['description_plain']}\n"
                f"SCHEME: {s_data['scheme']}\n"
                f"MANDATORY QCO: {s_data['mandatory_qco']} - {s_data.get('qco_title', '')}\n"
                f"CRITICAL TESTING PARAMETERS:\n" + "\n".join(f"- {p}" for p in s_data.get("key_testing_parameters", []))
            )
            await bis_ingestion_pipeline.ingest_document(
                db=session,
                title=s_data["title"],
                standard_number=s_data["is_number"],
                raw_text=doc_text,
                source_url=s_data["source_url"]
            )

        # Seed Laboratories
        print(f"Seeding {len(seed_data['laboratories'])} laboratories...")
        for l_data in seed_data["laboratories"]:
            lab = Laboratory(
                name=l_data["name"],
                lab_type=l_data["lab_type"],
                region=l_data["region"],
                address=l_data["address"],
                contact_email=l_data["contact_email"],
                phone=l_data["phone"],
                disciplines=l_data.get("disciplines", []),
                product_scopes=l_data.get("product_scopes", [])
            )
            session.add(lab)

        await session.commit()
        print("Database seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
