import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";

// Convert words representing numbers (English, Hindi, Gujarati) into clean digits (e.g. for Aadhaar or Account numbers)
const convertWordsToDigits = (text) => {
  const enDigits = {
    zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5",
    six: "6", seven: "7", eight: "8", nine: "9"
  };
  const hiDigits = {
    "शून्य": "0", "एक": "1", "दो": "2", "तीन": "3", "चार": "4", "पांच": "5",
    "छह": "6", "छः": "6", "सात": "7", "आठ": "8", "नौ": "9"
  };
  const guDigits = {
    "શૂન્ય": "0", "એક": "1", "બે": "2", "ત્રણ": "3", "ચાર": "4", "પાંચ": "5",
    "છ": "6", "સાત": "7", "આઠ": "8", "નવ": "9"
  };

  let processed = text.toLowerCase().trim();

  // Replace word boundaries for English
  Object.keys(enDigits).forEach((word) => {
    processed = processed.replace(new RegExp(`\\b${word}\\b`, "g"), enDigits[word]);
  });
  // Replace Hindi & Gujarati exact words
  Object.keys(hiDigits).forEach((word) => {
    processed = processed.replace(new RegExp(word, "g"), hiDigits[word]);
  });
  Object.keys(guDigits).forEach((word) => {
    processed = processed.replace(new RegExp(word, "g"), guDigits[word]);
  });

  // Remove spaces and keep only numbers
  processed = processed.replace(/\s+/g, "");
  const digitsOnly = processed.replace(/[^0-9]/g, "");

  return digitsOnly || processed;
};

// Parse verbal amounts (e.g., "one thousand five hundred" or "पंद्रह सौ" -> 1500)
const parseSpokenAmount = (rawText) => {
  let text = rawText.toLowerCase().replace(/,/g, "").trim();

  // Try extracting direct digits first
  const digitMatch = text.match(/\d+/g);
  if (digitMatch && digitMatch.length > 0) {
    return parseInt(digitMatch.join(""), 10);
  }

  const multipliers = {
    thousand: 1000,
    hundred: 100,
    lakh: 100000,
    "हजार": 1000,
    "सौ": 100,
    "લાખ": 100000,
    "હજાર": 1000,
    "સો": 100
  };

  const numberMap = {
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
    thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
    "शून्य": 0, "एक": 1, "दो": 2, "तीन": 3, "चार": 4, "पांच": 5, "छह": 6, "छः": 6, "सात": 7, "आठ": 8, "नौ": 9, "दस": 10,
    "ग्यारह": 11, "बारह": 12, "तेरह": 13, "चौदह": 14, "पंद्रह": 15, "सोलह": 16, "सत्रह": 17, "अठारह": 18, "उन्नीस": 19, "बीस": 20,
    "तीस": 30, "चालीस": 40, "पचास": 50, "साठ": 60, "सत्तर": 70, "अस्सी": 80, "नब्बे": 90,
    "શૂન્ય": 0, "એક": 1, "બે": 2, "ત્રણ": 3, "ચાર": 4, "પાંચ": 5, "છ": 6, "સાત": 7, "આઠ": 8, "નવ": 9, "દસ": 10,
    "અગિયાર": 11, "બાર": 12, "તેર": 13, "ચૌદ": 14, "પંદર": 15, "સોળ": 16, "સત્તર": 17, "અઢાર": 18, "ઓગણીસ": 19, "વીસ": 20,
    "ત્રીસ": 30, "ચાલીસ": 40, "પચાસ": 50, "સાઈઠ": 60, "સિત્તેર": 70, "એસી": 80, "નેવું": 90
  };

  const parts = text.split(/[\s-]+/);
  let total = 0;
  let currentVal = 0;

  for (let part of parts) {
    if (numberMap[part] !== undefined) {
      currentVal += numberMap[part];
    } else if (multipliers[part] !== undefined) {
      if (currentVal === 0) currentVal = 1;
      total += currentVal * multipliers[part];
      currentVal = 0;
    }
  }
  total += currentVal;

  return total > 0 ? total : null;
};

export default function VoiceInputButton({ onTranscript, lang = "en", type = "text" }) {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    // Access browser speech recognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recogInstance = new SpeechRecognition();
    recogInstance.continuous = false;
    recogInstance.interimResults = false;

    // Set correct locale based on app selection
    if (lang === "hi") {
      recogInstance.lang = "hi-IN";
    } else if (lang === "gu") {
      recogInstance.lang = "gu-IN";
    } else {
      recogInstance.lang = "en-IN";
    }

    recogInstance.onstart = () => {
      setListening(true);
    };

    recogInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (!transcript) return;

      // Handle transcript translation/formatting based on input type
      if (type === "number") {
        const parsedVal = parseSpokenAmount(transcript);
        if (parsedVal !== null) {
          onTranscript(parsedVal);
        }
      } else if (type === "digits") {
        const digits = convertWordsToDigits(transcript);
        onTranscript(digits);
      } else {
        // Normal text cleanup (remove final punctuation period if speech puts it)
        const cleanText = transcript.replace(/\.$/, "").trim();
        onTranscript(cleanText);
      }
      setListening(false);
    };

    recogInstance.onerror = (e) => {
      console.error("Speech Recognition Error:", e);
      setListening(false);
    };

    recogInstance.onend = () => {
      setListening(false);
    };

    setRecognition(recogInstance);
  }, [lang, type, onTranscript]);

  const toggleListening = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!recognition) return;

    if (listening) {
      recognition.stop();
    } else {
      // Cancel speech synthesis if speaking, so it doesn't feed back into mic!
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      try {
        recognition.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  if (!supported) return null;

  return (
    <button
      onClick={toggleListening}
      className={`voice-input-btn ${listening ? "listening" : ""}`}
      title={listening ? "Listening... click to stop" : `Voice input (${lang === "hi" ? "बोलें" : lang === "gu" ? "બોલો" : "Speak"})`}
      aria-label={listening ? "Stop recording voice input" : "Start recording voice input"}
      type="button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        border: "none",
        background: listening ? "rgba(239, 68, 68, 0.25)" : "rgba(2, 132, 199, 0.12)",
        color: listening ? "#f87171" : "#38bdf8",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: listening ? "0 0 15px rgba(239, 68, 68, 0.4)" : "0 2px 8px rgba(2, 132, 199, 0.15)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: listening ? "#ef4444" : "rgba(56, 189, 248, 0.35)",
        flexShrink: 0,
        marginLeft: "8px",
      }}
      onMouseEnter={(e) => {
        if (!listening) {
          e.currentTarget.style.background = "rgba(2, 132, 199, 0.25)";
          e.currentTarget.style.borderColor = "#38bdf8";
          e.currentTarget.style.color = "#ffffff";
          e.currentTarget.style.transform = "scale(1.08)";
        }
      }}
      onMouseLeave={(e) => {
        if (!listening) {
          e.currentTarget.style.background = "rgba(2, 132, 199, 0.12)";
          e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.35)";
          e.currentTarget.style.color = "#38bdf8";
          e.currentTarget.style.transform = "scale(1)";
        }
      }}
    >
      {listening ? (
        <span
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="pulse-mic"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.4)",
              animation: "ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite",
            }}
          />
          <MicOff size={16} style={{ position: "relative", zIndex: 1 }} />
        </span>
      ) : (
        <Mic size={16} />
      )}
    </button>
  );
}
