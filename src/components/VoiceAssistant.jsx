import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Send,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { getLoanGuidance, getLoanGuidanceAudioUrl } from "../api.js";
import {
  speakSaiUtterance,
  stopSaiUtterance,
  getRecognitionLocale,
} from "../services/saiAiService.js";
import {
  detectHomeVoiceIntent,
  QUICK_SUGGESTIONS,
} from "../services/homeVoiceIntents.js";

// ============================================================================
// HOME PAGE VOICE ASSISTANT COMPONENT
// ============================================================================
export default function VoiceAssistant({
  lang = "en",
  changeLang,
  navigateTo,
  onTriggerStep,
  onOpenAdvanced,
  onOpenOnboarding,
}) {
  // ISOLATED HOME PAGE VOICE GUIDANCE STATES (Completely independent from SAI Assistant)
  const [homeVoiceOpen, setHomeVoiceOpen] = useState(false);
  const [homeVoiceListening, setHomeVoiceListening] = useState(false);
  const [homeVoiceSpeaking, setHomeVoiceSpeaking] = useState(false);
  const [homeVoiceProcessing, setHomeVoiceProcessing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const [voiceResponseText, setVoiceResponseText] = useState("");
  const [textInput, setTextInput] = useState("");

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const autoCloseTimerRef = useRef(null);

  // Helper to smoothly scroll to any Home Page section
  const scrollToSection = useCallback((id) => {
    if (window.location.pathname !== "/") {
      navigateTo && navigateTo("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [navigateTo]);

  // Handlers bundle passed to intent actions
  const actionHandlers = {
    scrollToSection,
    navigateTo: (path) => navigateTo && navigateTo(path),
    changeLang: (newLang) => changeLang && changeLang(newLang),
    onTriggerStep,
    onOpenAdvanced,
    onOpenOnboarding,
  };

  // ============================================================================
  // CLOSE GUIDANCE: Stops Recognition, Stops TTS, Releases Mic, Closes Panel
  // ============================================================================
  const handleCloseGuidance = useCallback(() => {
    // 1. Stop Speech Recognition immediately & release mic
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      } catch (e) {}
    }

    // 2. Stop Voice Guidance TTS immediately
    stopSaiUtterance();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // 3. Clear timers
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }

    // 4. Reset isolated states
    setHomeVoiceListening(false);
    setHomeVoiceSpeaking(false);
    setHomeVoiceProcessing(false);
    setHomeVoiceOpen(false);
    setVoiceResponseText("");
    setLastTranscript("");
  }, []);

  // Process user speech or typed text through the Intent Engine
  const handleProcessIntent = useCallback((rawPhrase) => {
    const phrase = rawPhrase.trim();
    if (!phrase) return;

    setLastTranscript(phrase);
    setHomeVoiceProcessing(true);
    stopSaiUtterance();

    // 1. Detect Intent
    const detected = detectHomeVoiceIntent(phrase, lang);
    if (!detected) {
      setHomeVoiceProcessing(false);
      return;
    }

    const currentAudioLang = detected.targetLang || lang;
    const isNavigatingToAi = detected.intentKey === "GOVERNMENT_SCHEMES" || detected.intentKey === "AI_ASSISTANT";
    if (isNavigatingToAi) {
      sessionStorage.setItem("sai_pending_speak_intent", detected.intentKey);
      sessionStorage.setItem("sai_pending_speak_text", detected.responseText);
      sessionStorage.setItem("sai_pending_speak_lang", currentAudioLang);
    }

    // 2. Execute Action (Opens / Renders relevant Home Page section or navigates)
    try {
      detected.action(actionHandlers);
    } catch (e) {
      console.warn("Intent action navigation warning:", e);
    }

    // 3. Update Voice Guidance text feedback
    setVoiceResponseText(detected.responseText);
    setHomeVoiceProcessing(false);
    setHomeVoiceSpeaking(true);

    // 4. Speak response in the active language
    speakSaiUtterance(detected.responseText, currentAudioLang, {
      onEnd: () => {
        setHomeVoiceSpeaking(false);
      },
      onError: () => {
        setHomeVoiceSpeaking(false);
      },
    });

    // Auto close panel after 14 seconds if idle
    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    autoCloseTimerRef.current = setTimeout(() => {
      handleCloseGuidance();
    }, 14000);
  }, [lang, actionHandlers, handleCloseGuidance]);

  // Start Speech Recognition
  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceResponseText(
        lang === "hi"
          ? "आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया नीचे दिए गए सुझाव बटन या टेक्स्ट इनपुट का उपयोग करें।"
          : lang === "gu"
          ? "તમારા બ્રાઉઝરમાં વૉઇસ ઇનપુટ સપોર્ટેડ નથી. કૃપા કરીને નીચેના સૂચન બટન અથવા ટેક્સ્ટ ઇનપુટનો ઉપયોગ કરો."
          : "Voice recognition is not supported in this browser. Please use the suggestion buttons or text input below."
      );
      return;
    }

    stopSaiUtterance();

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = getRecognitionLocale(lang);
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setHomeVoiceListening(true);
        setHomeVoiceSpeaking(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setHomeVoiceListening(false);
        if (transcript && transcript.trim()) {
          handleProcessIntent(transcript.trim());
        }
      };

      recognition.onerror = (e) => {
        console.warn("Home Voice Assistant Error:", e);
        setHomeVoiceListening(false);
      };

      recognition.onend = () => {
        setHomeVoiceListening(false);
      };

      recognition.start();
    } catch (e) {
      setHomeVoiceListening(false);
    }
  }, [lang, handleProcessIntent]);

  // Toggle Home Voice Panel & Start Listening
  const handleToggleVoicePanel = () => {
    if (homeVoiceOpen) {
      handleCloseGuidance();
    } else {
      setHomeVoiceOpen(true);
      setVoiceResponseText(
        lang === "hi"
          ? "नमस्ते! मैं आपकी क्या सहायता करूँ? बोलें: 'मुझे लोन चाहिए' या 'सरकारी योजनाएं'। "
          : lang === "gu"
          ? "નમસ્તે! હું તમારી શું મદદ કરી શકું? બોલો: 'મારે લોન જોઈએ છે' અથવા 'સરકારી યોજનાઓ'."
          : "Hello! How can I help you? Speak: 'I need a loan' or 'Government schemes'."
      );
      setTimeout(() => {
        startListening();
      }, 300);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      // Note: do not cancel global TTS here so page transition speech is preserved
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "12px",
        fontFamily: "Inter, Roboto, sans-serif",
      }}
    >
      {/* ========================================================================= */}
      {/* HOME PAGE VOICE GUIDANCE FLOATING PANEL OVERLAY */}
      {/* ========================================================================= */}
      {homeVoiceOpen && (
        <div
          style={{
            background: "linear-gradient(160deg, rgba(15, 23, 42, 0.96) 0%, rgba(11, 17, 33, 0.98) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            color: "#f8fafc",
            padding: "18px 20px",
            borderRadius: "24px",
            fontSize: "13px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.65), 0 0 35px rgba(2, 132, 199, 0.25)",
            width: "320px",
            maxWidth: "calc(100vw - 48px)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            animation: "fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            position: "relative",
          }}
        >
          {/* Header with Title & Mic Indicator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  background: homeVoiceListening ? "rgba(16, 185, 129, 0.2)" : "rgba(2, 132, 199, 0.25)",
                  color: homeVoiceListening ? "#34d399" : "#38bdf8",
                  padding: "6px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Mic size={16} />
              </span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "800", color: "#f8fafc", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {lang === "hi" ? "वॉइस मार्गदर्शन" : lang === "gu" ? "વૉઇસ માર્ગદર્શન" : "Voice Guidance"}
                </div>
                <div style={{ fontSize: "10px", color: homeVoiceListening ? "#34d399" : "#94a3b8", fontWeight: "600" }}>
                  {homeVoiceListening
                    ? (lang === "hi" ? "सुन रहा हूँ... बोलें" : lang === "gu" ? "સાંભળી રહ્યો છું... બોલો" : "Listening... Speak now")
                    : homeVoiceSpeaking
                    ? (lang === "hi" ? "बोल रहा हूँ..." : lang === "gu" ? "બોલી રહ્યો છું..." : "Speaking...")
                    : (lang === "hi" ? "तैयार" : lang === "gu" ? "તૈયાર" : "Ready")}
                </div>
              </div>
            </div>

            {/* Language Quick Switchers */}
            <div style={{ display: "flex", gap: "4px" }}>
              {["en", "hi", "gu"].map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    changeLang && changeLang(code);
                    handleProcessIntent(code === "hi" ? "hindi me bolo" : code === "gu" ? "gujarati ma bolo" : "speak english");
                  }}
                  style={{
                    background: lang === code ? "#0284c7" : "rgba(255,255,255,0.06)",
                    color: lang === code ? "#ffffff" : "#94a3b8",
                    border: "none",
                    borderRadius: "6px",
                    padding: "3px 7px",
                    fontSize: "10px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Transcript & Response Display */}
          <div style={{ minHeight: "60px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {lastTranscript && (
              <div style={{ fontSize: "11px", color: "#94a3b8", background: "rgba(255,255,255,0.05)", padding: "6px 10px", borderRadius: "8px" }}>
                <strong style={{ color: "#38bdf8" }}>{lang === "hi" ? "आपने कहा" : lang === "gu" ? "તમે કહ્યું" : "You said"}:</strong> "{lastTranscript}"
              </div>
            )}

            <div
              style={{
                fontSize: "13px",
                color: "#f8fafc",
                lineHeight: "1.5",
                background: "rgba(2, 132, 199, 0.12)",
                border: "1px solid rgba(56, 189, 248, 0.2)",
                padding: "10px 12px",
                borderRadius: "12px",
              }}
            >
              {voiceResponseText || (lang === "hi" ? "मैं आपकी क्या मदद करूँ?" : lang === "gu" ? "હું તમારી શું મદદ કરી શકું?" : "How can I help you today?")}
            </div>
          </div>

          {/* Text Input Fallback */}
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && textInput.trim()) {
                  handleProcessIntent(textInput);
                  setTextInput("");
                }
              }}
              placeholder={lang === "hi" ? "लिखें: मुझे लोन चाहिए..." : lang === "gu" ? "લખો: મારે લોન જોઈએ છે..." : "Type: I need a loan..."}
              style={{
                flex: 1,
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                padding: "8px 12px",
                borderRadius: "10px",
                fontSize: "12px",
                outline: "none",
              }}
            />
            <button
              onClick={() => {
                if (textInput.trim()) {
                  handleProcessIntent(textInput);
                  setTextInput("");
                }
              }}
              style={{
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                padding: "0 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Send"
            >
              <Send size={14} />
            </button>
          </div>

          {/* Quick Suggestions Chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {(QUICK_SUGGESTIONS[lang] || QUICK_SUGGESTIONS.en).map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleProcessIntent(sug.query)}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(56, 189, 248, 0.2)",
                  color: "#93c5fd",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(56, 189, 248, 0.2)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.color = "#93c5fd";
                }}
              >
                {sug.label}
              </button>
            ))}
          </div>

          {/* ===================================================================== */}
          {/* CLEARLY VISIBLE "✕ CLOSE GUIDANCE" BUTTON */}
          {/* ===================================================================== */}
          <button
            onClick={handleCloseGuidance}
            style={{
              width: "100%",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#fca5a5",
              padding: "9px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
              e.currentTarget.style.color = "#fca5a5";
            }}
          >
            <X size={14} /> {lang === "hi" ? "मार्गदर्शन बंद करें" : lang === "gu" ? "માર્ગદર્શન બંધ કરો" : "Close Guidance"}
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HOME PAGE EXISTING VOICE BUTTON (FLOATING TRIGGER) */}
      {/* ========================================================================= */}
      <button
        onClick={handleToggleVoicePanel}
        className={`floating-mic-button ${homeVoiceListening ? "listening" : ""}`}
        title="Sahayata Home Page Voice Guide"
        aria-label="Sahayata Home Page Voice Guide"
        style={{
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          background: homeVoiceListening
            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
            : homeVoiceSpeaking
            ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
            : "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
          border: homeVoiceListening
            ? "2px solid #34d399"
            : homeVoiceSpeaking
            ? "2px solid #a5b4fc"
            : "2px solid #38bdf8",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: homeVoiceListening
            ? "0 0 30px rgba(16, 185, 129, 0.7), 0 6px 20px rgba(0, 0, 0, 0.4)"
            : "0 8px 25px rgba(2, 132, 199, 0.5), 0 0 18px rgba(56, 189, 248, 0.4)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {homeVoiceListening ? (
          <MicOff size={24} color="#ffffff" />
        ) : homeVoiceSpeaking ? (
          <Volume2 size={24} color="#ffffff" />
        ) : (
          <Mic size={24} color="#ffffff" />
        )}
      </button>
    </div>
  );
}
