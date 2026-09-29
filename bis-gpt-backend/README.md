# BIS-GPT Backend — AI-Powered BIS Compliance Copilot

Production-grade, modular, and scalable Python/FastAPI backend designed for the Smart India Hackathon (SIH) project: **"BIS-GPT — AI-Powered BIS Compliance Copilot"**.

---

## 🏗 Architecture & Core Flow

```
Frontend (Next.js / React)
        ↓
     FastAPI (/api/v1/chat)
        ↓
 Query Understanding (Intent + Entity Extraction)
        ↓
 Clarification Engine (Minimum Disambiguation)
        ↓
 Hybrid RAG
   ├── BM25 (Okapi Keyword Search)
   └── BGE-M3 (1024-dim Dense Embeddings) + pgvector
        ↓
 Reranker (Reciprocal Rank Fusion - RRF)
        ↓
 BIS Evidence Layer (Document, Standard, Clause, Page, URL)
        ↓
 Qwen2.5-7B-Instruct (via vLLM / OpenAI-compatible endpoint)
        ↓
 Evidence / Citation Validation (Zero Hallucination Shield)
        ↓
 Final Answer + Structured Compliance Journey
```

---

## 🛠 Tech Stack

- **Framework:** Python 3.11+, FastAPI, Pydantic v2
- **Database & ORM:** PostgreSQL 16 + pgvector, SQLAlchemy 2.x (Async), Alembic
- **LLM Engine:** Qwen2.5-7B-Instruct served via vLLM (OpenAI-compatible)
- **Embeddings & Search:** BGE-M3 (1024 dimensions), Rank-BM25, Reciprocal Rank Fusion (RRF)
- **Authentication:** JWT Bearer (HS256) with passlib/bcrypt
- **Testing:** Pytest, pytest-asyncio, HTTPX AsyncClient
- **Containerization:** Docker, Docker Compose

---

## 📂 Project Structure

```
bis-gpt-backend/
├── app/
│   ├── main.py                     # FastAPI application factory & lifespan
│   ├── core/
│   │   ├── config.py               # Pydantic v2 Settings from .env
│   │   ├── security.py             # JWT token handling & bcrypt hashing
│   │   └── exceptions.py           # Structured HTTP exception definitions
│   ├── api/
│   │   ├── deps.py                 # DB session & JWT authentication dependencies
│   │   └── routes/
│   │       ├── auth.py             # /register, /login, /me
│   │       ├── chat.py             # POST /chat, conversation history
│   │       ├── standards.py        # /standards lookup & QCO filter
│   │       ├── certification.py    # /certification/schemes roadmap
│   │       ├── laboratories.py     # /laboratories search by scope & region
│   │       ├── hallmarking.py      # /hallmarking/rules & /verify-huid-format
│   │       └── health.py           # /health & /ready probes
│   ├── schemas/                    # Pydantic v2 request & response schemas
│   ├── models/                     # SQLAlchemy 2.x models (User, Conv, Rag, Standard)
│   ├── db/                         # Async engine & sessionmaker
│   ├── services/                   # Business logic (ChatService, AuthService, etc.)
│   ├── ai/
│   │   ├── qwen_client.py          # Abstract vLLM/OpenAI client with fallback
│   │   ├── prompts.py              # BIS system instructions
│   │   ├── query_understanding.py  # Intent & entity extraction
│   │   ├── clarification_engine.py # Minimum targeted question generator
│   │   └── evidence_validator.py   # Grounding & citation verifier
│   ├── rag/
│   │   ├── embeddings.py           # BGE-M3 multilingual vectorizer
│   │   ├── keyword_search.py       # BM25Okapi sparse retrieval
│   │   ├── vector_store.py         # pgvector & cosine similarity store
│   │   ├── reranker.py             # RRF rank fusion
│   │   └── retriever.py            # High-level verified citation extractor
│   └── ingestion/
│       ├── pdf_parser.py           # Clause & section parser
│       ├── chunker.py              # Semantic clause-aware chunker
│       └── ingestion_pipeline.py   # Full ingestion pipeline
├── tests/                          # Comprehensive Pytest test suite
├── scripts/
│   ├── seed_bis_data.py            # Seeds verified BIS standards & labs
│   └── run_dev.sh                  # Development run script
├── data/
│   └── seed_standards.json         # Authentic BIS seed dataset
├── .env.example                    # Sample environment variables
├── requirements.txt                # Python dependencies
├── Dockerfile                      # Application container definition
├── docker-compose.yml              # Multi-container orchestration (API + pgvector + vLLM)
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Python 3.11+
- PostgreSQL with `pgvector` extension (or Docker)

### 2. Environment Setup
```bash
cd bis-gpt-backend
cp .env.example .env

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Database Initialization & Seeding
Start PostgreSQL with pgvector using Docker:
```bash
docker run -d --name bis-pgvector -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=bis_gpt_db \
  pgvector/pgvector:pg16
```

Run database seeder:
```bash
python scripts/seed_bis_data.py
```

### 4. Running the Development Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive API documentation will be available at:
- **Swagger UI:** [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)
- **ReDoc:** [http://localhost:8000/api/v1/redoc](http://localhost:8000/api/v1/redoc)

---

## 🤖 Qwen2.5-7B-Instruct (vLLM Setup)

To serve Qwen2.5-7B-Instruct with high throughput on GPU via vLLM:

```bash
docker run --gpus all \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  -p 8001:8000 \
  --ipc=host \
  vllm/vllm-openai:latest \
  --model Qwen/Qwen2.5-7B-Instruct \
  --max-model-len 4096 \
  --gpu-memory-utilization 0.90
```

Configure your `.env`:
```env
QWEN_API_BASE_URL="http://localhost:8001/v1"
QWEN_MODEL_NAME="Qwen/Qwen2.5-7B-Instruct"
```

*Note:* If vLLM is not running, the system automatically engages the built-in BIS response generator so you can test all API flows without requiring a dedicated GPU machine.

---

## 📡 API Usage Examples

### 1. Chat with BIS Copilot (Standard Query)
```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the mandatory Indian Standard for packaged drinking water?",
    "conversation_id": null,
    "language": "en"
  }'
```

**Response:**
```json
{
  "answer": "Packaged Drinking Water is governed by IS 14543:2016 (and potable municipal water by IS 10500:2012)...",
  "clarification_required": false,
  "citations": [
    {
      "standard_number": "IS 14543:2016",
      "document_title": "Packaged Drinking Water (Other than Packaged Natural Mineral Water)",
      "clause": "1.0",
      "page": 1,
      "source_url": "https://standardsbis.bsbedge.com",
      "snippet": "Mandatory standard for commercial water packaging facilities and 20L water jar distributors in India..."
    }
  ],
  "compliance_journey": [
    {
      "step_number": 1,
      "title": "Identify Indian Standard & SIT",
      "description": "Confirm applicable specification and Scheme of Inspection and Testing (SIT)...",
      "action_required": "Procure official standard and set up in-house lab.",
      "documents_needed": ["Factory layout plan", "Calibrated testing equipment list"],
      "portal_link": "https://standardsbis.bsbedge.com"
    }
  ]
}
```

### 2. Clarification Engine in Action (Ambiguous Query)
```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Which BIS standard applies to pipes?",
    "conversation_id": null,
    "language": "en"
  }'
```

**Response:**
```json
{
  "answer": "To recommend the exact Indian Standard for pipes, could you specify the pipe material (e.g., PVC, HDPE, Ductile Iron, or Galvanized Steel) and intended application (e.g., potable drinking water, underground sewerage, or agricultural irrigation)?",
  "clarification_required": true,
  "clarification_question": "To recommend the exact Indian Standard for pipes, could you specify the pipe material...",
  "citations": [],
  "compliance_journey": []
}
```

### 3. Verify Gold Hallmarking HUID Format
```bash
curl -X POST http://localhost:8000/api/v1/hallmarking/verify-huid-format \
  -H "Content-Type: application/json" \
  -d '{"huid": "AB1234"}'
```

### 4. Search Standards & Mandatory QCOs
```bash
curl -G http://localhost:8000/api/v1/standards \
  --data-urlencode "query=helmet" \
  --data-urlencode "mandatory_only=true"
```

---

## 🧪 Running Tests

Execute the unit and integration tests with Pytest:

```bash
pytest tests/ -v
```

All tests mock the Qwen LLM and use an in-memory database to ensure deterministic, fast execution without external dependencies.
