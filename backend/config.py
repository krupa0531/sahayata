import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "sahayata.db"
KYC_UPLOAD_DIR = BASE_DIR / "uploads" / "kyc"


def _load_local_env() -> None:
    """Load a local .env file for development without overriding host secrets."""
    env_file = BASE_DIR / ".env"
    if not env_file.exists():
        return

    for raw_line in env_file.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        if key and key not in os.environ:
            os.environ[key] = value.strip().strip('"').strip("'")


_load_local_env()

SECRET_KEY = os.getenv("SAHAYATA_SECRET_KEY", "sahayata-dev-secret-change-in-production")
RAG_ADMIN_TOKEN = os.getenv("SAHAYATA_RAG_ADMIN_TOKEN")
RAG_OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
RAG_OPENAI_MODEL = os.getenv("SAHAYATA_RAG_OPENAI_MODEL", "gpt-4o-mini")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("SAHAYATA_TOKEN_EXPIRE_MINUTES", "1440"))
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_VERIFY_SERVICE_SID = os.getenv("TWILIO_VERIFY_SERVICE_SID")
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "SAHAYATA_CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
