import hashlib
import json
import logging
import os
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from typing import Annotated, Optional

from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from auth import get_current_user, require_user
from config import CORS_ORIGINS, RAG_ADMIN_TOKEN
from credit_services import analyze_upi_credit, get_credit_warnings, get_flexible_repayment_plans, parse_upi_csv
from database import get_ai_conversations_stats, init_db, record_ai_conversation_session
from otp_service import (
    OtpConfigurationError,
    OtpProviderError,
    OtpRateLimitError,
    normalize_indian_mobile,
    request_sms_otp,
    verify_sms_otp,
)
from schemas import (
    AboutContent,
    AnomalyWarning,
    ApplicationCreate,
    ApplicationResponse,
    ApplicationStatus,
    ApplicationSummary,
    AuthResponse,
    CreditAnalyzeRequest,
    DashboardResponse,
    EligibilityRequest,
    EligibilityResponse,
    FlexibleRepaymentResponse,
    FooterContent,
    HelpContent,
    HomeContent,
    KycDocumentResponse,
    MessageResponse,
    OtpRequest,
    OtpVerificationResponse,
    OtpVerify,
    RepaymentPlan,
    RagQuery,
    RagQueryResponse,
    RagSourceCreate,
    SchemeItem,
    SocialSecuritySummary,
    TextToSpeechRequest,
    TrackerStats,
    UpiCreditAnalysisResponse,
    UserLogin,
    UserRegister,
    UserResponse,
    VoiceAssistantResponse,
    WeeklyTransaction,
    UpiHistoryRequest,
    WorkerSchemeEvaluationRequest,
    WorkerSchemeEvaluationResponse,
)
from rag_service import answer as answer_rag_question
from rag_service import seed_knowledge_base, upsert_source
from services import (
    calculate_eligibility,
    create_application,
    get_about_content,
    get_application_status,
    get_demo_application_status,
    get_demo_dashboard,
    get_footer_content,
    get_help_content,
    get_home_content,
    get_repayment_plans,
    get_schemes,
    get_social_security_summary,
    get_tracker_stats,
    get_male_voice,
    get_voice_guidance,
    get_weekly_transactions,
    list_applications,
    list_kyc_documents,
    login_user,
    register_user,
    save_kyc_document,
    fetch_upi_history,
    evaluate_worker_eligibility_report,
    get_admin_workers_list,
    get_admin_dashboard_stats,
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Sahayata API",
    version="1.0.0",
    description="Backend for gig workers and daily wage earners — UPI credit scoring, loans, and social security.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()
    seed_knowledge_base()


@app.get("/health")
def health():
    return {"status": "ok", "service": "sahayata-api"}


def _require_rag_admin(x_rag_admin_token: str | None) -> None:
    if not RAG_ADMIN_TOKEN:
        raise HTTPException(status_code=503, detail="RAG administration is not configured")
    if x_rag_admin_token != RAG_ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid RAG administration token")


@app.post("/api/rag/query", response_model=RagQueryResponse)
def rag_query(payload: RagQuery):
    """Return guidance only from active, reviewed policy sources with citations."""
    return answer_rag_question(payload.question, payload.language)


@app.post("/api/rag/sources", status_code=201)
def add_rag_source(
    payload: RagSourceCreate,
    x_rag_admin_token: Annotated[str | None, Header()] = None,
):
    """Add or revise a reviewed source. This endpoint is deliberately admin-gated."""
    _require_rag_admin(x_rag_admin_token)
    upsert_source(payload.model_dump())
    return {"message": "RAG source saved and indexed", "source_id": payload.id}


@app.post("/api/auth/otp/request", response_model=MessageResponse, status_code=202)
def request_otp(payload: OtpRequest):
    """Send a mobile-verification OTP after explicit SMS consent."""
    try:
        request_sms_otp(payload.mobile)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except OtpConfigurationError as exc:
        raise HTTPException(status_code=503, detail="OTP service is not configured") from exc
    except OtpRateLimitError as exc:
        raise HTTPException(status_code=429, detail=str(exc)) from exc
    except OtpProviderError as exc:
        logger.warning("OTP send request failed: %s", exc)
        raise HTTPException(status_code=502, detail="Unable to send OTP. Please try again.") from exc

    return {"message": "OTP sent. Do not share this code with anyone."}


@app.post("/api/auth/otp/verify", response_model=OtpVerificationResponse)
def verify_otp(payload: OtpVerify):
    """Verify a mobile OTP. The backend never logs or stores the OTP value."""
    try:
        verified = verify_sms_otp(payload.mobile, payload.code)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except OtpConfigurationError as exc:
        raise HTTPException(status_code=503, detail="OTP service is not configured") from exc
    except OtpProviderError as exc:
        logger.warning("OTP verification request failed: %s", exc)
        raise HTTPException(status_code=502, detail="Unable to verify OTP. Please try again.") from exc

    if not verified:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    return {"verified": True, "message": "Mobile number verified successfully."}


@app.get("/api/voice-assistant/loan-guidance", response_model=VoiceAssistantResponse)
def voice_assistant_loan_guidance(language: str = "hi"):
    """Localized loan guidance for a frontend using the free Web Speech API."""
    return get_voice_guidance(language)


def _elevenlabs_audio(text: str) -> bytes:
    """Generate audio server-side so the ElevenLabs key never reaches the browser."""
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        raise RuntimeError("ELEVENLABS_API_KEY is not configured")

    voice_id = os.getenv("ELEVENLABS_VOICE_ID", "pNInz6obpgDQGcFmaJgB")
    model_id = os.getenv("ELEVENLABS_MODEL_ID", "eleven_multilingual_v2")
    payload = json.dumps(
        {
            "text": text,
            "model_id": model_id,
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.8,
                "style": 0.0,
                "use_speaker_boost": True,
            },
        }
    ).encode("utf-8")
    request = Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream?output_format=mp3_44100_128",
        data=payload,
        headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=30) as response:
            return response.read()
    except HTTPError as exc:
        raise RuntimeError(f"ElevenLabs rejected the request ({exc.code})") from exc
    except URLError as exc:
        raise RuntimeError("ElevenLabs could not be reached") from exc


# Cache directory inside backend/tmp/
TTS_CACHE_DIR = Path(__file__).parent / "tmp" / "tts_cache"

def get_cached_tts(text: str, language: str) -> Optional[bytes]:
    """Retrieve cached audio bytes if they exist."""
    try:
        TTS_CACHE_DIR.mkdir(parents=True, exist_ok=True)
        text_hash = hashlib.md5(f"{language}:{text}".encode("utf-8")).hexdigest()
        cache_file = TTS_CACHE_DIR / f"{text_hash}.mp3"
        if cache_file.exists():
            return cache_file.read_bytes()
    except Exception as e:
        logger.warning("Failed to read from TTS cache: %s", e)
    return None

def save_to_tts_cache(text: str, language: str, audio_bytes: bytes):
    """Save generated audio bytes to cache."""
    try:
        TTS_CACHE_DIR.mkdir(parents=True, exist_ok=True)
        text_hash = hashlib.md5(f"{language}:{text}".encode("utf-8")).hexdigest()
        cache_file = TTS_CACHE_DIR / f"{text_hash}.mp3"
        cache_file.write_bytes(audio_bytes)
    except Exception as e:
        logger.warning("Failed to write to TTS cache: %s", e)


@app.get("/api/voice-assistant/loan-guidance/audio")
async def voice_assistant_loan_guidance_audio(language: str = "hi", include_welcome: bool = False):
    """Return ElevenLabs speech when configured, otherwise use the free fallback."""
    guidance = get_voice_guidance(language)
    text = guidance["text"]
    if include_welcome:
        welcome = {
            "en": "Welcome to the Sahayata app.",
            "hi": "सहायता ऐप में आपका स्वागत है।",
            "gu": "સહાયતા એપમાં તમારું સ્વાગત છે।",
        }[guidance["language"]]
        text = f"{welcome} {text}"

    # 1. Check disk cache first
    cached_audio = get_cached_tts(text, guidance["language"])
    if cached_audio:
        return Response(
            content=cached_audio,
            media_type="audio/mpeg",
            headers={"X-TTS-Provider": "cache"},
        )

    # 2. If not cached, generate using ElevenLabs (if configured)
    if os.getenv("ELEVENLABS_API_KEY"):
        try:
            # The request is deliberately made only on the backend; the browser sees audio only.
            audio = await run_in_threadpool(_elevenlabs_audio, text)
            save_to_tts_cache(text, guidance["language"], audio)
            return Response(
                content=audio,
                media_type="audio/mpeg",
                headers={"X-TTS-Provider": "elevenlabs"},
            )
        except RuntimeError as exc:
            # Keep voice guidance available when the premium provider rejects a
            # key, voice, or model. The free Indian neural voice below is the
            # intended reliable fallback.
            logger.warning("ElevenLabs TTS failed; using Edge TTS fallback: %s", exc)

    # 3. Use Edge TTS fallback
    try:
        import edge_tts
    except ImportError as exc:
        raise HTTPException(
            status_code=503,
            detail="Voice service is not installed. Run: uv sync",
        ) from exc

    communicator = edge_tts.Communicate(
        text=text,
        voice=get_male_voice(guidance["language"]),
    )
    try:
        # Generate before responding. Raising from an async streaming generator
        # closes the HTTP connection and makes the browser report a vague audio
        # error instead of the actual backend failure.
        audio_chunks = []
        async for event in communicator.stream():
            if event["type"] == "audio":
                audio_chunks.append(event["data"])
        audio = b"".join(audio_chunks)
        if not audio:
            raise RuntimeError("Edge TTS returned no audio data")
        
        # Save to disk cache
        save_to_tts_cache(text, guidance["language"], audio)
    except Exception as exc:
        logger.exception("Edge TTS audio generation failed")
        raise HTTPException(
            status_code=502,
            detail=f"Unable to generate voice audio: {exc}",
        ) from exc

    return Response(
        content=audio,
        media_type="audio/mpeg",
        headers={"X-TTS-Provider": "edge-tts"},
    )


@app.post("/api/voice-assistant/speak")
async def speak_page_text(payload: TextToSpeechRequest):
    """Speak text from any webpage speaker in the language currently selected by the user."""
    language = get_voice_guidance(payload.language)["language"]
    
    # 1. Check disk cache first
    cached_audio = get_cached_tts(payload.text, language)
    if cached_audio:
        return Response(
            content=cached_audio,
            media_type="audio/mpeg",
            headers={"X-TTS-Provider": "cache"},
        )

    try:
        import edge_tts
    except ImportError as exc:
        raise HTTPException(status_code=503, detail="Voice service is not installed") from exc

    communicator = edge_tts.Communicate(text=payload.text, voice=get_male_voice(language))
    try:
        chunks = []
        async for event in communicator.stream():
            if event["type"] == "audio":
                chunks.append(event["data"])
        audio = b"".join(chunks)
        if not audio:
            raise RuntimeError("Edge TTS returned no audio data")
        
        # Save to disk cache
        save_to_tts_cache(payload.text, language, audio)
    except Exception as exc:
        logger.exception("Page text-to-speech generation failed")
        raise HTTPException(status_code=502, detail="Unable to generate voice audio") from exc

    return Response(content=audio, media_type="audio/mpeg", headers={"X-TTS-Provider": "edge-tts"})


@app.post("/api/auth/register", response_model=AuthResponse, status_code=201)
def register(payload: UserRegister):
    result = register_user(payload.full_name, payload.mobile, payload.email, payload.password)
    if not result:
        raise HTTPException(status_code=409, detail="Mobile number already registered")
    return result


@app.post("/api/auth/login", response_model=AuthResponse)
def login(payload: UserLogin):
    result = login_user(payload.mobile, payload.password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid mobile number or password")
    return result


@app.get("/api/auth/me", response_model=UserResponse)
def me(user: Annotated[dict, Depends(require_user)]):
    return {
        "id": user["id"],
        "full_name": user["full_name"],
        "mobile": user["mobile"],
        "email": user["email"],
    }


ALLOWED_KYC_DOCUMENT_TYPES = {"aadhaar", "pan", "e_shram", "bank_statement"}
ALLOWED_KYC_CONTENT_TYPES = {"application/pdf", "image/jpeg", "image/png"}
MAX_KYC_FILE_SIZE_BYTES = 5 * 1024 * 1024


def _has_expected_kyc_signature(content_type: str, content: bytes) -> bool:
    signatures = {
        "application/pdf": b"%PDF-",
        "image/jpeg": b"\xff\xd8\xff",
        "image/png": b"\x89PNG\r\n\x1a\n",
    }
    return content.startswith(signatures[content_type])


@app.post("/api/kyc/documents", response_model=KycDocumentResponse, status_code=201)
async def upload_kyc_document(
    document_type: Annotated[str, Form()],
    file: Annotated[UploadFile, File()],
    user: Annotated[dict, Depends(require_user)],
):
    normalized_type = document_type.strip().lower()
    if normalized_type not in ALLOWED_KYC_DOCUMENT_TYPES:
        raise HTTPException(status_code=422, detail="Unsupported KYC document type")
    if file.content_type not in ALLOWED_KYC_CONTENT_TYPES:
        raise HTTPException(status_code=415, detail="Only PDF, JPEG, and PNG files are accepted")

    file_name = os.path.basename(file.filename or "document")
    if not file_name or file_name == "document":
        raise HTTPException(status_code=422, detail="A document filename is required")
    content = await file.read(MAX_KYC_FILE_SIZE_BYTES + 1)
    await file.close()
    if not content:
        raise HTTPException(status_code=422, detail="The uploaded document is empty")
    if len(content) > MAX_KYC_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="KYC document must be 5 MB or smaller")
    if not _has_expected_kyc_signature(file.content_type, content):
        raise HTTPException(status_code=415, detail="The file content does not match its declared type")

    return save_kyc_document(
        user_id=user["id"], document_type=normalized_type, file_name=file_name,
        content_type=file.content_type, content=content,
    )


@app.get("/api/kyc/documents", response_model=list[KycDocumentResponse])
def kyc_documents(user: Annotated[dict, Depends(require_user)]):
    return list_kyc_documents(user["id"])


@app.get("/api/dashboard", response_model=DashboardResponse)
def dashboard():
    return get_demo_dashboard()


@app.get("/api/schemes", response_model=list[SchemeItem])
def schemes():
    return get_schemes()


@app.get("/api/content/home", response_model=HomeContent)
def home_content():
    return get_home_content()


@app.get("/api/content/about", response_model=AboutContent)
def about_content():
    return get_about_content()


@app.get("/api/content/help", response_model=HelpContent)
def help_content():
    return get_help_content()


@app.get("/api/content/footer", response_model=FooterContent)
def footer_content():
    return get_footer_content()


@app.post("/api/eligibility", response_model=EligibilityResponse)
def eligibility(payload: EligibilityRequest):
    return calculate_eligibility(payload.daily_earning, payload.daily_expense)


@app.get("/api/repayment-plans", response_model=FlexibleRepaymentResponse)
def repayment_plans(loan_amount: int = 90000):
    if loan_amount < 1000:
        raise HTTPException(status_code=400, detail="loan_amount must be at least 1000")
    return get_flexible_repayment_plans(loan_amount)


@app.get("/api/repayment-plans/legacy", response_model=dict[str, RepaymentPlan])
def repayment_plans_legacy(loan_amount: int = 90000):
    if loan_amount < 1000:
        raise HTTPException(status_code=400, detail="loan_amount must be at least 1000")
    return get_repayment_plans(loan_amount)


@app.post("/api/credit/analyze", response_model=UpiCreditAnalysisResponse)
def credit_analyze(payload: CreditAnalyzeRequest):
    return analyze_upi_credit(payload.profile_id, payload.loan_amount)


@app.post("/api/credit/upload-statement", response_model=UpiCreditAnalysisResponse)
async def upload_statement(
    profile_id: Annotated[str, Form()],
    file: Annotated[UploadFile, File()],
):
    """Upload a bank or UPI statement CSV, parse it, and return the ML analysis report."""
    normalized_profile = profile_id.strip()
    if not normalized_profile:
        raise HTTPException(status_code=422, detail="A valid UPI ID or Profile ID is required")

    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=415, detail="Only CSV statement files are accepted")

    try:
        content = await file.read()
        await file.close()

        # Parse transactions from CSV content
        transactions = parse_upi_csv(content, normalized_profile)
        if not transactions:
            raise HTTPException(status_code=422, detail="No valid transactions could be parsed from the CSV file")

        # Delete old transactions for this profile in database and write new ones
        from database import get_connection
        with get_connection() as conn:
            conn.execute("DELETE FROM upi_transactions WHERE profile_id = ?", (normalized_profile,))
            conn.executemany(
                """
                INSERT INTO upi_transactions (profile_id, txn_date, amount, customer_id, txn_type)
                VALUES (?, ?, ?, ?, ?)
                """,
                [
                    (
                        tx["profile_id"],
                        tx["txn_date"],
                        tx["amount"],
                        tx["customer_id"],
                        tx["txn_type"]
                    )
                    for tx in transactions
                ]
            )
            conn.commit()

        # Return the ML analysis report
        return analyze_upi_credit(normalized_profile)

    except HTTPException as exc:
        raise exc
    except Exception as exc:
        logger.exception("Failed to parse and upload statement")
        raise HTTPException(status_code=500, detail=f"Failed to process statement: {str(exc)}")



@app.get("/api/credit/demo", response_model=UpiCreditAnalysisResponse)
def credit_demo(loan_amount: int | None = None):
    return analyze_upi_credit("DEMO-VENDOR", loan_amount)


@app.get("/api/credit/warnings", response_model=list[AnomalyWarning])
def credit_warnings(profile_id: str = "DEMO-VENDOR"):
    return get_credit_warnings(profile_id)


@app.post("/api/applications", response_model=ApplicationResponse, status_code=201)
def applications(
    payload: ApplicationCreate,
    user: Annotated[dict | None, Depends(get_current_user)] = None,
):
    user_id = user["id"] if user else None
    return create_application(payload, user_id=user_id)


@app.get("/api/applications", response_model=list[ApplicationSummary])
def applications_list(user: Annotated[dict | None, Depends(get_current_user)] = None):
    user_id = user["id"] if user else None
    return list_applications(user_id=user_id)


@app.get("/api/applications/demo", response_model=ApplicationStatus)
def application_demo():
    data = get_demo_application_status()
    if not data:
        raise HTTPException(status_code=404, detail="Demo application not found")
    return data


@app.get("/api/applications/{application_id}", response_model=ApplicationStatus)
def application_status(application_id: str):
    data = get_application_status(application_id)
    if not data:
        raise HTTPException(status_code=404, detail="Application not found")
    return data


@app.get("/api/social-security/demo", response_model=SocialSecuritySummary)
def social_security_demo():
    return get_social_security_summary()


@app.get("/api/transactions/weekly", response_model=list[WeeklyTransaction])
def weekly_transactions():
    return get_weekly_transactions()


@app.get("/api/tracker/stats", response_model=TrackerStats)
def tracker_stats():
    return get_tracker_stats()


@app.post("/api/social-security/withdraw", response_model=MessageResponse)
def withdraw_overdraft(user: Annotated[dict, Depends(require_user)]):
    raise HTTPException(
        status_code=409,
        detail=(
            "Overdraft withdrawal is unavailable until an official Jan Dhan or "
            "bank partner account is linked and verified."
        ),
    )


@app.post("/api/v1/fetch-history")
def fetch_history_api(payload: UpiHistoryRequest):
    identifier = (payload.identifier or payload.pan_number or payload.upi_id or "").strip()
    mode = (payload.mode or "auto").strip().lower()

    if not identifier:
        raise HTTPException(
            status_code=400,
            detail="A valid UPI Virtual Payment Address (e.g. name@bank) or PAN Card Number (e.g. ABCDE1234F) is required."
        )

    try:
        return fetch_upi_history(identifier, mode=mode)
    except Exception as exc:
        logger.exception("Failed to fetch financial history")
        raise HTTPException(status_code=500, detail=str(exc))



@app.post("/api/ai/assistant/evaluate-schemes", response_model=WorkerSchemeEvaluationResponse)
def evaluate_schemes_api(payload: WorkerSchemeEvaluationRequest):
    """
    Step-by-step AI Assistant Scheme & Micro-Loan Evaluation Endpoint.
    Strictly filters government schemes according to user's real income, age, occupation, and daily cash buffer.
    """
    try:
        report = evaluate_worker_eligibility_report(
            full_name=payload.full_name,
            aadhaar_number=payload.aadhaar_number,
            daily_earning=payload.daily_earning,
            daily_expense=payload.daily_expense,
            monthly_income=payload.monthly_income,
            age=payload.age,
            occupation=payload.occupation,
            location=payload.location,
            language=payload.language,
        )
        return {
            "status": "success",
            "message": "Worker eligibility report generated successfully",
            "report": report,
        }
    except Exception as exc:
        logger.exception("Failed to evaluate worker schemes")
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/ai/conversations/session")
def record_ai_conversation_session_api(payload: dict):
    """
    Records a real AI conversation session.
    Increments the conversation count by +1 per UNIQUE session only (NOT per message).
    """
    session_id = str(payload.get("session_id", "")).strip()
    user_name = str(payload.get("user_name", "Anonymous Worker")).strip()
    language = str(payload.get("language", "en")).strip()
    status = str(payload.get("status", "active")).strip()

    if not session_id:
        session_id = f"CONV-{hashlib.md5(f'{user_name}-{language}'.encode()).hexdigest()[:10].upper()}"

    res = record_ai_conversation_session(
        session_id=session_id,
        user_name=user_name,
        language=language,
        status=status,
    )
    return {
        "status": "success",
        "data": res
    }


@app.get("/api/ai/conversations/stats")
def get_ai_conversations_stats_api():
    """
    Get live AI conversations statistics (real conversation sessions count, not messages count).
    """
    return get_ai_conversations_stats()


@app.get("/api/admin/workers")
def admin_workers_api():
    """
    Return real-time list of all workers, applications, and registered beneficiaries for Bank Dashboard.
    """
    return get_admin_workers_list()


@app.get("/api/admin/stats")
def admin_stats_api():
    """
    Return live aggregated metrics and counts for the Bank Partner Dashboard.
    """
    return get_admin_dashboard_stats()


