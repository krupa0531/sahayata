# Sahayata Backend

FastAPI backend for the Sahayata app — UPI-based credit scoring, sachet loans, and social security for gig workers.

## Setup

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt
python run.py
```

Server runs at `http://127.0.0.1:8000`

API docs: `http://127.0.0.1:8000/docs`

## Frontend connection

The Sahayata React app proxies `/api` to this server (see `sahayata-app/vite.config.js`).

Run both:

```bash
# Terminal 1 — backend
cd backend && python run.py

# Terminal 2 — frontend
cd sahayata-app && npm run dev
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/auth/register` | Register worker account |
| POST | `/api/auth/login` | Login and get JWT token |
| POST | `/api/auth/otp/request` | Send mobile-verification OTP (explicit SMS consent required) |
| POST | `/api/auth/otp/verify` | Verify mobile OTP (OTP is never stored) |
| GET | `/api/auth/me` | Current user (requires Bearer token) |
| POST | `/api/kyc/documents` | Upload Aadhaar, PAN, e-Shram, or bank-statement document (auth required) |
| GET | `/api/kyc/documents` | List the current user's submitted KYC documents (auth required) |
| GET | `/api/dashboard` | Hero stats and ticker |
| GET | `/api/voice-assistant/loan-guidance?language=hi` | Safe spoken loan guidance (`en`, `hi`, or `gu`) |
| GET | `/api/schemes` | Government schemes list |
| POST | `/api/eligibility` | Calculate loan eligibility tier |
| GET | `/api/repayment-plans` | Flexible daily/monthly repayment plans |
| POST | `/api/credit/analyze` | Full UPI credit scoring pipeline |
| GET | `/api/credit/demo` | Demo credit analysis |
| GET | `/api/credit/warnings` | Anomaly warnings (Isolation Forest) |
| POST | `/api/rag/query` | Source-cited RBI, scheme and app-policy guidance |
| POST | `/api/rag/sources` | Add a reviewed RAG source (admin token required) |
| POST | `/api/applications` | Submit loan application |
| GET | `/api/applications` | List applications |
| GET | `/api/applications/demo` | Demo application timeline |
| GET | `/api/applications/{id}` | Application status by ID |
| GET | `/api/social-security/demo` | PM-SYM pension + overdraft data |
| GET | `/api/transactions/weekly` | 7-day UPI sales data |
| GET | `/api/tracker/stats` | Avg sales, consistency, txns today |
| POST | `/api/social-security/withdraw` | Overdraft withdrawal (auth required) |

## UPI Credit Scoring Architecture (ML)

Real-time pipeline across backend API and ML modules:

### 1. Feature Engineering (`ml/upi_features.py`)

From UPI transaction logs (account aggregator / bank statements):

- **Daily Throughput** — average daily revenue
- **Transaction Volume** — unique customers per day (footfall)
- **Consistency Score** — transacting days / total days
- **Customer Retention** — repeat customer percentage

### 2. Credit Scoring (`ml/credit_scorer.py`)

**RandomForestClassifier** trained on labelled vendor profiles:

```
Max Loan = Average Monthly Revenue × Risk Multiplier
```

| Risk | Multiplier |
|------|------------|
| Low | 2.0x |
| Medium | 1.0x |
| High | 0.5x |
| Reject | 0 (no loan) |

### 3. Anomaly Detection (`ml/anomaly_detector.py`)

**Isolation Forest** flags suspicious high-value inflows:

- Pattern check — repeat customer vs unknown payer
- Velocity check — rapid withdrawal after large credit (fraud indicator)
- Dashboard warning: *"Suspicious high-value inflow detected. Verified source needed before next disbursement."*

### 4. Flexible Repayment (`ml/flexible_repayment.py`)

| Mode | Deduction |
|------|-----------|
| Daily Fixed (EDI) | Fixed amount via eNACH / UPI Autopay |
| Daily Flexible | Variable % of daily collection, ML-adjusted by weekday |
| Monthly EMI | Fixed date auto-debit, max 28% monthly profit |

Weekend sales days get higher deduction; slow days (e.g. Tuesday) get reduced deduction.

**Example analyze request:**

```bash
curl -X POST http://127.0.0.1:8000/api/credit/analyze \
  -H "Content-Type: application/json" \
  -d '{"profile_id": "DEMO-VENDOR", "loan_amount": 15000}'
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SAHAYATA_SECRET_KEY` | dev secret | JWT signing key |
| `SAHAYATA_TOKEN_EXPIRE_MINUTES` | 1440 | Token expiry |
| `SAHAYATA_CORS_ORIGINS` | localhost:5173 | Comma-separated CORS origins |
| `SAHAYATA_RAG_ADMIN_TOKEN` | unset | Required to revise RAG sources through the API |
| `OPENAI_API_KEY` | unset | Optional; generates summaries using retrieved approved content only |

## Verified policy RAG

`POST /api/rag/query` answers only from active, versioned sources and returns the official link, source type, effective date and excerpt used. It never makes a loan/KYC/fraud decision. The seeded sources are RBI borrower-protection guidance, official Government scheme discovery guidance and Sahayata's app policies.

```json
{"question": "Kya mujhe loan approve ho gaya hai?", "language": "hi"}
```

Add reviewed RBI, scheme or lender documents only after validating their official URL and effective date. Set `SAHAYATA_RAG_ADMIN_TOKEN`, then call `/api/rag/sources` with that token in the `X-Rag-Admin-Token` header. Do not upload KYC documents, bank statements, OTPs, passwords, PINs or CVVs to this knowledge base.

## Voice assistant (ElevenLabs male voice)

The backend returns localized text from `/api/voice-assistant/loan-guidance` and audio from `/api/voice-assistant/loan-guidance/audio`.

Set `ELEVENLABS_API_KEY` on the backend machine to use ElevenLabs' real male voice (default: Adam) with `eleven_multilingual_v2` for English, Hindi, and Gujarati. Do not put this secret in frontend code. Optional variables are listed in `.env.example`.

If no ElevenLabs key is configured, the API uses the free Edge neural-voice fallback: `Prabhat` (English), `Madhur` (Hindi), and `Niranjan` (Gujarati).

```js
function playLoanGuidance(language = "hi") {
  const audio = new Audio(`/api/voice-assistant/loan-guidance/audio?language=${language}`);
  audio.play();
}
```

Use separate buttons for `en`, `hi`, and `gu`. OTPs must only be entered by the user on the official website; never request or speak an OTP to an assistant or agent.

## Database

SQLite file: `sahayata.db` (auto-created on first run with demo seed data).

Demo application ID: `SAH-DEMO001`

Demo UPI profile: `DEMO-VENDOR` (90 days of transactions + anomaly spike)

PostgreSQL schema: `schema.postgresql.sql`

## Tests

```bash
python -m unittest discover -s tests -v
```
