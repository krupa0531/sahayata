import unittest

from services import get_male_voice, get_voice_guidance


class VoiceAssistantTests(unittest.TestCase):
    def test_guidance_is_available_in_all_requested_languages(self):
        for language, locale in (("en", "en-IN"), ("hi", "hi-IN"), ("gu", "gu-IN")):
            with self.subTest(language=language):
                guidance = get_voice_guidance(language)
                self.assertEqual(guidance["language"], language)
                self.assertEqual(guidance["locale"], locale)
                self.assertTrue(guidance["text"])

    def test_unknown_language_falls_back_to_hindi(self):
        self.assertEqual(get_voice_guidance("unknown")["language"], "hi")

    def test_language_names_and_locales_are_normalized(self):
        self.assertEqual(get_voice_guidance("Hindi")["language"], "hi")
        self.assertEqual(get_voice_guidance("Gujarati")["language"], "gu")
        self.assertEqual(get_voice_guidance("gu-IN")["language"], "gu")

    def test_indic_guidance_uses_native_scripts_for_tts(self):
        self.assertIn("लोन", get_voice_guidance("hi")["text"])
        self.assertIn("લોન", get_voice_guidance("gu")["text"])

    def test_otp_warning_is_included(self):
        self.assertIn("OTP", get_voice_guidance("en")["security_notice"])

    def test_each_language_uses_an_indian_male_neural_voice(self):
        self.assertEqual(get_male_voice("en"), "en-IN-PrabhatNeural")
        self.assertEqual(get_male_voice("hi"), "hi-IN-MadhurNeural")
        self.assertEqual(get_male_voice("gu"), "gu-IN-NiranjanNeural")


if __name__ == "__main__":
    unittest.main()
