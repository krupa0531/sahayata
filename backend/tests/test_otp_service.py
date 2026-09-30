import unittest
from unittest.mock import patch

import otp_service


class _FakeResponse:
    def __init__(self, payload: bytes):
        self.payload = payload

    def read(self):
        return self.payload

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return False


class OtpServiceTests(unittest.TestCase):
    def test_normalizes_indian_mobile_numbers(self):
        self.assertEqual(otp_service.normalize_indian_mobile("98765 43210"), "+919876543210")
        self.assertEqual(otp_service.normalize_indian_mobile("+91-98765-43210"), "+919876543210")

    def test_rejects_invalid_indian_mobile_numbers(self):
        with self.assertRaises(ValueError):
            otp_service.normalize_indian_mobile("1234567890")

    def test_blocks_excessive_otp_requests(self):
        mobile = "+919876543210"
        original_attempts = otp_service._send_attempts
        try:
            otp_service._send_attempts = {mobile: __import__("collections").deque([1.0, 2.0, 3.0])}
            with patch("otp_service.time.monotonic", return_value=4.0):
                with self.assertRaises(otp_service.OtpRateLimitError):
                    otp_service._record_send_attempt(mobile)
        finally:
            otp_service._send_attempts = original_attempts

    @patch("otp_service.urlopen")
    @patch("otp_service.TWILIO_VERIFY_SERVICE_SID", "VA-test")
    @patch("otp_service.TWILIO_AUTH_TOKEN", "token-test")
    @patch("otp_service.TWILIO_ACCOUNT_SID", "AC-test")
    def test_verify_uses_provider_approval_status(self, mocked_urlopen):
        mocked_urlopen.return_value = _FakeResponse(b'{"status":"approved"}')

        self.assertTrue(otp_service.verify_sms_otp("9876543210", "123456"))
        request = mocked_urlopen.call_args.args[0]
        self.assertIn(b"To=%2B919876543210", request.data)
        self.assertIn(b"Code=123456", request.data)


if __name__ == "__main__":
    unittest.main()
