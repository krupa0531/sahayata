"""Twilio Verify integration for mobile-number ownership verification."""

import base64
import json
import time
from collections import defaultdict, deque
from threading import Lock
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID


class OtpConfigurationError(RuntimeError):
    """Raised when the production OTP provider has not been configured."""


class OtpProviderError(RuntimeError):
    """Raised when Twilio cannot process an OTP verification request."""


class OtpRateLimitError(RuntimeError):
    """Raised when a number requests too many SMS codes in a short period."""


_REQUEST_WINDOW_SECONDS = 15 * 60
_MAX_REQUESTS_PER_WINDOW = 3
_send_attempts: dict[str, deque[float]] = defaultdict(deque)
_send_attempts_lock = Lock()


def normalize_indian_mobile(mobile: str) -> str:
    """Return an Indian mobile in E.164 format without accepting arbitrary numbers."""
    digits = "".join(character for character in mobile if character.isdigit())
    if len(digits) == 12 and digits.startswith("91"):
        digits = digits[2:]
    if len(digits) != 10 or digits[0] not in "6789":
        raise ValueError("Enter a valid 10-digit Indian mobile number")
    return f"+91{digits}"


def _verify_request(path: str, payload: dict[str, str]) -> dict:
    if not all((TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID)):
        raise OtpConfigurationError("OTP service is not configured")

    credentials = base64.b64encode(
        f"{TWILIO_ACCOUNT_SID}:{TWILIO_AUTH_TOKEN}".encode("utf-8")
    ).decode("ascii")
    request = Request(
        f"https://verify.twilio.com/v2/Services/{TWILIO_VERIFY_SERVICE_SID}/{path}",
        data=urlencode(payload).encode("utf-8"),
        headers={
            "Authorization": f"Basic {credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=15) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        # Never pass provider payloads through: they can reveal account details.
        if exc.code == 401:
            raise OtpProviderError("OTP provider credentials were rejected") from exc
        if exc.code == 404:
            raise OtpProviderError("Twilio Verify Service SID was not found") from exc
        if exc.code == 403:
            raise OtpProviderError("Twilio account is not permitted to send this OTP") from exc
        if exc.code == 400:
            raise OtpProviderError("Twilio rejected this OTP request") from exc
        raise OtpProviderError("OTP service is temporarily unavailable") from exc
    except (URLError, TimeoutError) as exc:
        raise OtpProviderError("OTP service is temporarily unavailable") from exc


def _record_send_attempt(mobile: str) -> None:
    """Limit OTP sends per number to reduce SMS pumping and user spam."""
    now = time.monotonic()
    with _send_attempts_lock:
        attempts = _send_attempts[mobile]
        while attempts and now - attempts[0] >= _REQUEST_WINDOW_SECONDS:
            attempts.popleft()
        if len(attempts) >= _MAX_REQUESTS_PER_WINDOW:
            raise OtpRateLimitError("Too many OTP requests. Please try again later.")
        attempts.append(now)


def request_sms_otp(mobile: str) -> str:
    """Ask Twilio Verify to send an OTP. The code is never returned or stored here."""
    normalized_mobile = normalize_indian_mobile(mobile)
    _record_send_attempt(normalized_mobile)
    _verify_request("Verifications", {"To": normalized_mobile, "Channel": "sms"})
    return normalized_mobile


def verify_sms_otp(mobile: str, code: str) -> bool:
    """Verify an OTP with Twilio; it returns only whether the number is approved."""
    normalized_mobile = normalize_indian_mobile(mobile)
    result = _verify_request(
        "VerificationCheck", {"To": normalized_mobile, "Code": code}
    )
    return result.get("status") == "approved"
