import { useState, useEffect, useRef, useCallback } from "react";
import { BrainCircuit, Mic, MicOff, Volume2, X } from "lucide-react";
import { getLoanGuidance, getLoanGuidanceAudioUrl } from "../api";

// Speech Synthesis speak utility
const speakFeedback = (text, lang) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  // Start during the tap itself; a delayed call is treated as autoplay by some browsers.
  {
  const utterance = new SpeechSynthesisUtterance(text);
  window._currentUtterance = utterance;
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

    if (lang === "hi") {
      utterance.lang = "hi-IN";
    } else if (lang === "gu") {
      utterance.lang = "gu-IN";
    } else {
      utterance.lang = "en-IN";
    }

    const voices = window.speechSynthesis.getVoices();
    let targetLang = lang === "hi" ? "hi-IN" : lang === "gu" ? "gu-IN" : "en-IN";

    // Filter voices that match the language
    const langVoices = voices.filter(
      (v) => v.lang === targetLang || v.lang.replace("_", "-") === targetLang || v.lang.startsWith(lang)
    );

    if (langVoices.length > 0) {
      // Prefer specific male voices on Windows/Android/macOS
      let preferredVoiceName = "";
      if (lang === "hi") preferredVoiceName = "hemant";
      else if (lang === "gu") preferredVoiceName = "niranjan";
      else preferredVoiceName = "ravi"; // Microsoft Ravi for en-IN

      let voice = langVoices.find((v) => v.name.toLowerCase().includes(preferredVoiceName));

      // Fallback 1: Look for any voice containing "male" in the name
      if (!voice) {
        voice = langVoices.find((v) => v.name.toLowerCase().includes("male"));
      }

      // Fallback 2: Look for English male names like "david", "mark" (if en-IN not available)
      if (!voice && lang === "en") {
        voice = langVoices.find(
          (v) =>
            v.name.toLowerCase().includes("david") ||
            v.name.toLowerCase().includes("mark") ||
            v.name.toLowerCase().includes("george")
        );
      }

      // Fallback 3: Take first matching language voice
      if (!voice) {
        voice = langVoices[0];
      }

      if (voice) {
        utterance.voice = voice;
      }
    }

    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  }
};

export default function VoiceAssistant({ lang = "en", changeLang, navigateTo }) {
  const [listening, setListening] = useState(false);
  const [showHelper, setShowHelper] = useState(true);
  const [lastCommand, setLastCommand] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [isGuidancePlaying, setIsGuidancePlaying] = useState(false);
  const [question, setQuestion] = useState("");
  const helperTimeout = useRef(null);
  const responseTimeout = useRef(null);
  const guidanceAudio = useRef(null);

  // Helper to set visual text feedback with automatic auto-hide timeout
  const showTextFeedback = (text) => {
    setAssistantResponse(text);
    setShowHelper(true);
    if (responseTimeout.current) clearTimeout(responseTimeout.current);
    responseTimeout.current = setTimeout(() => {
      setAssistantResponse("");
    }, 6000);
  };

  const playLoanGuidance = useCallback(async (selectedLanguage = lang) => {
    if (guidanceAudio.current) {
      guidanceAudio.current.pause();
      guidanceAudio.current = null;
    }
    window.speechSynthesis?.cancel();

    setShowHelper(true);
    try {
      const guidance = await getLoanGuidance(selectedLanguage);
      // Always show the complete answer, even if the external voice service is unavailable.
      setAssistantResponse(guidance.text);
      const audio = new Audio(getLoanGuidanceAudioUrl(selectedLanguage));
      guidanceAudio.current = audio;
      setIsGuidancePlaying(true);
      audio.onended = () => setIsGuidancePlaying(false);
      audio.onerror = () => {
        setIsGuidancePlaying(false);
        setAssistantResponse(`${guidance.text}\n\nUsing the browser voice because the online voice service is unavailable.`);
        speakFeedback(guidance.text, selectedLanguage);
      };
      await audio.play();
    } catch (error) {
      setIsGuidancePlaying(false);
      setAssistantResponse(
        "I could not connect to the loan guide. Please start the backend with npm run backend, then try again."
      );
    }
  }, [lang]);

  const askLoanGuide = () => {
    const normalizedQuestion = question.toLowerCase();
    if (normalizedQuestion.includes("loan") || normalizedQuestion.includes("credit") || normalizedQuestion.includes("ऋण") || normalizedQuestion.includes("લોન")) {
      playLoanGuidance(lang);
    } else {
      setShowHelper(true);
      setAssistantResponse(
        lang === "hi"
          ? "Main loan application ki madad kar sakta hoon. Likhein ya bolen: mujhe loan chahiye."
          : lang === "gu"
            ? "Hu loan application ma madad kari saku chhu. Lakho athva bolo: mare loan joie chhe."
            : "I can help with a loan application. Type or say: I need a loan."
      );
    }
  };

  const processCommand = useCallback((phrase) => {
    if (
      phrase.includes("loan") ||
      phrase.includes("credit") ||
      phrase.includes("borrow") ||
      phrase.includes("mujhe loan") ||
      phrase.includes("ऋण") ||
      phrase.includes("લોન")
    ) {
      playLoanGuidance(lang);
      return;
    }

    // 1. Language Changes
    if (phrase.includes("english") || phrase.includes("अंग्रेजी")) {
      changeLang("en");
      const feedback = "Language changed to English";
      showTextFeedback(feedback);
      speakFeedback(feedback, "en");
      return;
    }
    if (phrase.includes("हिन्दी") || phrase.includes("हिंदी") || phrase.includes("hindi")) {
      changeLang("hi");
      const feedback = "भाषा बदलकर हिन्दी कर दी गई है";
      showTextFeedback(feedback);
      speakFeedback(feedback, "hi");
      return;
    }
    if (phrase.includes("ગુજરાતી") || phrase.includes("gujarati")) {
      changeLang("gu");
      const feedback = "ભાષા બદલીને ગુજરાતી કરવામાં આવી છે";
      showTextFeedback(feedback);
      speakFeedback(feedback, "gu");
      return;
    }

    // 2. Navigation
    if (phrase.includes("admin") || phrase.includes("एडमिन") || phrase.includes("એડમિન") || phrase.includes("command center")) {
      navigateTo("/admin-dashboard");
      const feedbackText =
        lang === "hi"
          ? "एडमिन कमांड सेंटर खोल रहे हैं"
          : lang === "gu"
          ? "એડમિન કમાન્ડ સેન્ટર ખોલી રહ્યા છીએ"
          : "Opening admin command center";
      showTextFeedback(feedbackText);
      speakFeedback(feedbackText, lang);
      return;
    }
    if (phrase.includes("home") || phrase.includes("होम") || phrase.includes("હોમ") || phrase.includes("worker portal") || phrase.includes("मुख्य पृष्ठ")) {
      navigateTo("/");
      const feedbackText =
        lang === "hi"
          ? "मुख्य पृष्ठ पर वापस जा रहे हैं"
          : lang === "gu"
          ? "મુખ્ય પૃષ્ઠ પર પાછા જઈ રહ્યા છીએ"
          : "Going back to the main portal";
      showTextFeedback(feedbackText);
      speakFeedback(feedbackText, lang);
      return;
    }

    // 3. Page Scrolls
    if (
      phrase.includes("apply") ||
      phrase.includes("form") ||
      phrase.includes("registration") ||
      phrase.includes("onboard") ||
      phrase.includes("आवेदन") ||
      phrase.includes("पंजीकरण") ||
      phrase.includes("અરજી") ||
      phrase.includes("નોંધણી")
    ) {
      document.getElementById("registration-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      const feedbackText =
        lang === "hi"
          ? "आवेदन फॉर्म खोल रहे हैं"
          : lang === "gu"
          ? "અરજી ફોર્મ ખોલી રહ્યા છીએ"
          : "Scrolling to the registration form";
      showTextFeedback(feedbackText);
      speakFeedback(feedbackText, lang);
      return;
    }

    if (
      phrase.includes("calculator") ||
      phrase.includes("eligibility") ||
      phrase.includes("calculate") ||
      phrase.includes("कैलकुलेटर") ||
      phrase.includes("पात्रता") ||
      phrase.includes("કેલ્ક્યુલેટર") ||
      phrase.includes("યોગ્યતા")
    ) {
      document.getElementById("eligibility-calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
      const feedbackText =
        lang === "hi"
          ? "पात्रता कैलकुलेटर पर जा रहे हैं"
          : lang === "gu"
          ? "યોગ્યતા કેલ્ક્યુલેટર પર જઈ રહ્યા છીએ"
          : "Scrolling to the eligibility calculator";
      showTextFeedback(feedbackText);
      speakFeedback(feedbackText, lang);
      return;
    }

    if (
      phrase.includes("status") ||
      phrase.includes("track") ||
      phrase.includes("स्थिति") ||
      phrase.includes("ट्रैक") ||
      phrase.includes("સ્ટેટસ") ||
      phrase.includes("ટ્રેક")
    ) {
      document.getElementById("application-status")?.scrollIntoView({ behavior: "smooth", block: "start" });
      const feedbackText =
        lang === "hi"
          ? "आपके आवेदन की स्थिति दिखा रहे हैं"
          : lang === "gu"
          ? "તમારા અરજીની સ્થિતિ બતાવી રહ્યા છીએ"
          : "Scrolling to application status";
      showTextFeedback(feedbackText);
      speakFeedback(feedbackText, lang);
      return;
    }

    if (
      phrase.includes("schemes") ||
      phrase.includes("yojana") ||
      phrase.includes("yojna") ||
      phrase.includes("योजना") ||
      phrase.includes("યોજના")
    ) {
      document.getElementById("schemes-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      const feedbackText =
        lang === "hi"
          ? "सरकारी कल्याणकारी योजनाएं दिखा रहे हैं"
          : lang === "gu"
          ? "સરકારી કલ્યાણકારી યોજનાઓ બતાવી રહ્યા છીએ"
          : "Scrolling to government schemes";
      showTextFeedback(feedbackText);
      speakFeedback(feedbackText, lang);
      return;
    }

    if (
      phrase.includes("roadmap") ||
      phrase.includes("road map") ||
      phrase.includes("रोडमैप") ||
      phrase.includes("રોડમેપ") ||
      phrase.includes("plan")
    ) {
      document.getElementById("roadmap-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      const feedbackText =
        lang === "hi"
          ? "कार्यान्वयन रोडमैप दिखा रहे हैं"
          : lang === "gu"
          ? "યોજનાનો રોડમેપ બતાવી રહ્યા છીએ"
          : "Scrolling to implementation roadmap";
      showTextFeedback(feedbackText);
      speakFeedback(feedbackText, lang);
      return;
    }

    // 4. Command not recognized feedback
    const unrecognizedText =
      lang === "hi"
        ? `मुझे "${phrase}" समझ नहीं आया। कृपया "कैलकुलेटर", "आवेदन", "योजना" या "एडमिन" बोलें।`
        : lang === "gu"
        ? `મને "${phrase}" સમજાયું નથી. કૃપા કરીને "કેલ્ક્યુલેટર", "અરજી", "યોજના" અથવા "એડમિન" બોલો.`
        : `Command "${phrase}" not recognized. Try speaking "apply", "calculator", "schemes", "admin", or "change language".`;

    showTextFeedback(unrecognizedText);
    speakFeedback(unrecognizedText, lang);
  }, [lang, changeLang, navigateTo, playLoanGuidance]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAssistantResponse("Voice input is not supported in this browser. Use Chrome or Edge, or tap the male voice guide below.");
      return;
    }

    const recogInstance = new SpeechRecognition();
    recogInstance.continuous = false;
    recogInstance.interimResults = false;

    recogInstance.onstart = () => {
      setListening(true);
      setShowHelper(true);
      setLastCommand("");
      setAssistantResponse("");
    };

    recogInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      if (!transcript) return;

      setLastCommand(transcript);
      processCommand(transcript);
      setListening(false);
    };

    recogInstance.onerror = (e) => {
      console.error("Assistant Voice Error:", e);
      setListening(false);
    };

    recogInstance.onend = () => {
      setListening(false);
    };

    setRecognition(recogInstance);

    // Show tooltip helper initially and hide after 8 seconds
    helperTimeout.current = setTimeout(() => {
      setShowHelper(false);
    }, 8000);

    return () => {
      if (helperTimeout.current) clearTimeout(helperTimeout.current);
      if (responseTimeout.current) clearTimeout(responseTimeout.current);
      guidanceAudio.current?.pause();
    };
  }, [lang, processCommand]);

  const toggleAssistant = (e) => {
    e.stopPropagation();
    if (!recognition) return;

    if (listening) {
      recognition.stop();
    } else {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      recognition.lang = lang === "hi" ? "hi-IN" : lang === "gu" ? "gu-IN" : "en-IN";
      try {
        recognition.start();
      } catch (err) {
        console.error("Failed to start voice assistant:", err);
      }
    }
  };

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
        gap: "10px",
        fontFamily: "Inter, Roboto, sans-serif",
      }}
    >
      {(showHelper || assistantResponse) && (
        <div
          style={{
            background: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            color: "#e2e8f0",
            padding: "12px 16px",
            borderRadius: "16px",
            fontSize: "12.5px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            maxWidth: "280px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            animation: "fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            position: "relative",
            transition: "all 0.3s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "6px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", color: "#60a5fa", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              <BrainCircuit size={14} />
              {listening ? "Listening" : assistantResponse ? "Sahayata AI" : "Voice Guide"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowHelper(false);
                setAssistantResponse("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255, 255, 255, 0.5)",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center"
              }}
              title="Close Guide"
            >
              <X size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {listening ? (
              <span style={{ color: "#a1a1aa", fontStyle: "italic" }}>
                {lang === "hi" ? "सुन रहा हूँ... बोलें" : lang === "gu" ? "સાંભળી રહ્યો છું... બોલો" : "Listening... Speak now"}
              </span>
            ) : assistantResponse ? (
              <>
                <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                  <strong>{lang === "hi" ? "आपने कहा" : lang === "gu" ? "તમે કહ્યું" : "You said"}:</strong> "{lastCommand}"
                </div>
                <div style={{ fontSize: "13px", color: "#60a5fa", marginTop: "2px", fontWeight: "500", lineHeight: 1.4 }}>
                  {assistantResponse}
                </div>
              </>
            ) : (
              <span style={{ color: "#cbd5e1" }}>
                {lang === "hi"
                  ? 'बोलें: "आवेदन", "कैलकुलेटर", "योजना", "एडमिन", "English"'
                  : lang === "gu"
                  ? 'બોલો: "અરજી", "કેલ્ક્યુલેટર", "યોજના", "એડમિન", "हिन्दी"'
                  : 'Try: "apply", "calculator", "schemes", "admin", "gujarati"'}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
            {["en", "hi", "gu"].map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => {
                  if (language !== lang) changeLang(language);
                  playLoanGuidance(language);
                }}
                style={{
                  border: "1px solid rgba(96, 165, 250, 0.55)",
                  background: language === lang ? "#2563eb" : "transparent",
                  color: "#e2e8f0",
                  borderRadius: "999px",
                  padding: "5px 8px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                <Volume2 size={12} style={{ verticalAlign: "-2px", marginRight: "3px" }} />
                {language === "en" ? "English" : language === "hi" ? "Hindi" : "Gujarati"}
              </button>
            ))}
          </div>
          {isGuidancePlaying && (
            <span style={{ color: "#86efac", fontSize: "11px" }}>Male voice is playing…</span>
          )}
          <div style={{ display: "flex", gap: "6px", marginTop: "5px" }}>
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && askLoanGuide()}
              placeholder="Ask: I need a loan"
              aria-label="Ask the loan guide"
              style={{ minWidth: 0, flex: 1, borderRadius: "7px", border: "1px solid #475569", padding: "6px 8px" }}
            />
            <button
              type="button"
              onClick={askLoanGuide}
              style={{ border: 0, borderRadius: "7px", padding: "6px 9px", background: "#2563eb", color: "white", cursor: "pointer" }}
            >
              Ask
            </button>
          </div>
        </div>
      )}

      <button
        onClick={toggleAssistant}
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: listening
            ? "linear-gradient(135deg, #ef4444, #dc2626)"
            : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          color: "#ffffff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: listening
            ? "0 0 25px rgba(239, 68, 68, 0.5), 0 8px 16px rgba(0, 0, 0, 0.2)"
            : "0 0 20px rgba(59, 130, 246, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08) translateY(-2px)";
          if (!listening) {
            e.currentTarget.style.boxShadow = "0 0 25px rgba(59, 130, 246, 0.4), 0 10px 20px rgba(0, 0, 0, 0.25)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1) translateY(0)";
          if (!listening) {
            e.currentTarget.style.boxShadow = "0 0 20px rgba(59, 130, 246, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2)";
          }
        }}
        title="Sahayata Voice Assistant"
      >
        {listening ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span
              style={{
                position: "absolute",
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.2)",
                animation: "ping 1.3s cubic-bezier(0, 0, 0.2, 1) infinite",
              }}
            />
            <MicOff size={24} />
          </span>
        ) : (
          <Mic size={24} />
        )}
      </button>
    </div>
  );
}
