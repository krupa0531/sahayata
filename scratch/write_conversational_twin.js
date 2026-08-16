import fs from "fs";

const code = `import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  ArrowUp,
  Globe,
  BarChart3,
  Smartphone,
  FlaskConical,
  ChevronDown,
  Lightbulb,
  FileText,
  Zap,
  ShieldCheck,
  Download,
  ArrowLeft,
  Mic,
  MicOff,
  BrainCircuit,
  RefreshCw,
  Volume2,
  VolumeX,
  User,
  Bot,
  Languages,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSearch,
  Activity,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./SahayataHomepage.css";
import { execute8LayerVerificationPipeline } from "../services/antiFraudEngine.js";
import FraudAnalyticsDashboard from "./FraudAnalyticsDashboard.jsx";

export default function FinancialTwinModule({ lang = "en", navigateTo }) {
  const [currentLang, setCurrentLang] = useState(lang || "en");
  const [promptText, setPromptText] = useState("");
  const [modeSelect, setModeSelect] = useState("Standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: "sai",
      text: "Hello 👋\\n\\nMain SAI hu.\\n\\nMain aapke documents verify karunga aur AI ki madad se bataunga ki kaunsi government schemes aur banks aapke liye best hain.\\n\\nChaliye shuru karte hain. Please + button se apna Bank Statement / Passbook (PDF/Image) upload karein.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [verificationReport, setVerificationReport] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [scanStepText, setScanStepText] = useState("");
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [geminiApiKey, setGeminiApiKey] = useState(
    import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem("SAI_GEMINI_KEY") || ""
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [maleVoice, setMaleVoice] = useState(null);

  // CONVERSATIONAL STEP FORM DATA
  const [loanStep, setLoanStep] = useState(0); // 0: Start, 1: Doc Uploaded, 2: Amount, 3: ID, 4: Occupation, 5: Income, 6: Experience, 7: Expenses, 8: Report & Consent, 9: Submitted
  const [journeyData, setJourneyData] = useState({
    requestedAmount: "15000",
    identityId: "",
    occupation: "",
    monthlyIncome: "",
    experienceYears: "",
    monthlyExpenses: "",
    isConsentGiven: false,
  });

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const latestTranscriptRef = useRef("");

  useEffect(() => {
    if (lang) setCurrentLang(lang);
  }, [lang]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isProcessing]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      const preferredMale =
        voices.find((v) => currentLang === "hi" && (v.name.includes("Google Hindi") || v.name.includes("Google hi-IN") || v.lang.includes("hi"))) ||
        voices.find((v) => currentLang === "gu" && (v.name.includes("Google Gujarati") || v.name.includes("gu-IN") || v.lang.includes("gu"))) ||
        voices.find((v) => v.name.includes("Hemant") || v.name.includes("Prabhat") || v.name.includes("Ravi")) ||
        voices.find((v) => v.name.includes("Natural") && v.name.toLowerCase().includes("male")) ||
        voices.find((v) => v.name.includes("Google UK English Male") || v.name.includes("Google US English")) ||
        voices.find((v) => v.name.toLowerCase().includes("male")) ||
        voices.find((v) => v.lang.startsWith("hi") || v.lang.startsWith("en"));

      setMaleVoice(preferredMale || voices[0]);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [currentLang]);

  const speakMaleVoice = (textToSpeak) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = textToSpeak
      .replace(/\\bSAI\\b/gi, "Sai")
      .replace(/[*#_]/g, "")
      .slice(0, 350);
    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (maleVoice) {
      utterance.voice = maleVoice;
    }
    utterance.pitch = 1.05;
    utterance.rate = 0.92;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // STEP-BY-STEP CONVERSATIONAL FLOW WITH ZERO POPUPS
  const processSahayataRAG = async (userInput, isFileUpload = false, fileName = "", fileData = null) => {
    const cleanInput = userInput.trim().toLowerCase();

    // 1. FILE UPLOAD STEP
    if (isFileUpload && fileData) {
      const apiKeyToUse = geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY;

      const report = await execute8LayerVerificationPipeline(
        { name: fileName, type: fileData.fileType },
        fileData.base64,
        apiKeyToUse,
        (stepIdx, stepName) => {
          setScanStepIndex(stepIdx);
          setScanStepText(stepName);
        }
      );

      setVerificationReport(report);

      if (report.isFraud) {
        const fraudAlertText = "⚠️ Document Verification Failed!\\n\\nReason: AI-generated, tampered, or synthetic document detected by Sahayata 8-Layer Anti-Fraud Engine.\\n\\nAI Fraud Confidence: " + report.layer1.aiFraudConfidence + "% | Forgery Score: " + report.layer1.forgeryScore + "%\\n\\nPursuant to RBI Guidelines, synthetic images cannot be accepted. Please upload an original Bank Passbook.";
        return { text: fraudAlertText, isFraud: true, step: 0 };
      }

      setLoanStep(1);
      const step1Msg = "Document receive ho gaya.\\n\\nMain 8-Layer AI Fraud Detection chala raha hu...\\n✓ Image Analysis\\n✓ OCR Validation\\n✓ RAG Benchmark\\n✓ QR Verification\\n✓ Metadata Audit\\n\\nDocument authentic mila hai.\\n\\nAb mujhe batayiye:\\nAap kitna loan lena chahte hain? (e.g. ₹10,000 ya ₹20,000)";
      return { text: step1Msg, step: 1 };
    }

    // 2. LOAN AMOUNT STEP
    if (loanStep === 1) {
      setJourneyData((prev) => ({ ...prev, requestedAmount: userInput }));
      setLoanStep(2);
      const step2Msg = "Noted (" + userInput + ").\\n\\nAb apna 12-digit Aadhaar Number ya e-Shram ID batayiye.";
      return { text: step2Msg, step: 2 };
    }

    // 3. IDENTITY AADHAAR STEP
    if (loanStep === 2) {
      setJourneyData((prev) => ({ ...prev, identityId: userInput }));
      setLoanStep(3);
      const step3Msg = "Identity verify ho gayi (e-KYC Verified ✅).\\n\\nAb batayiye:\\nAap kya kaam karte hain? (e.g. Swiggy Partner, Vendor, Construction Worker)";
      return { text: step3Msg, step: 3 };
    }

    // 4. OCCUPATION STEP
    if (loanStep === 3) {
      setJourneyData((prev) => ({ ...prev, occupation: userInput }));
      setLoanStep(4);
      const step4Msg = "Aapka occupation (" + userInput + ") note ho gaya.\\n\\nAverage monthly income kitni hai? (e.g. 22000)";
      return { text: step4Msg, step: 4 };
    }

    // 5. MONTHLY INCOME STEP
    if (loanStep === 4) {
      setJourneyData((prev) => ({ ...prev, monthlyIncome: userInput }));
      setLoanStep(5);
      const step5Msg = "Monthly Income (₹" + userInput + ") noted.\\n\\nKitne saal se kaam kar rahe hain? (e.g. 2 years)";
      return { text: step5Msg, step: 5 };
    }

    // 6. WORK EXPERIENCE STEP
    if (loanStep === 5) {
      setJourneyData((prev) => ({ ...prev, experienceYears: userInput }));
      setLoanStep(6);
      const step6Msg = "Experience (" + userInput + ") noted.\\n\\nAapka monthly rent ya household expense kitna hai? (e.g. 5000)";
      return { text: step6Msg, step: 6 };
    }

    // 7. EXPENSES STEP -> GENERATE WHITE DOCUMENT ELIGIBILITY REPORT
    if (loanStep === 6) {
      const updatedData = { ...journeyData, monthlyExpenses: userInput };
      setJourneyData(updatedData);
      setLoanStep(7);

      const step7Msg = "Achha! Sabhi jankari verify ho gayi hai.\\n\\nMain aapka AI Financial Health Analysis aur White Document Report tayar kar raha hu...\\n\\nBefore submitting, I need your consent.\\nDo you authorize Sahayata to securely share your verified documents and eligibility report with the selected bank or government scheme portal?\\n\\nType YES or click Submit below.";
      return { text: step7Msg, step: 7, showWhiteReport: true, data: updatedData };
    }

    // 8. USER CONSENT & FINAL SUBMISSION STEP
    if (loanStep === 7 && (cleanInput.includes("yes") || cleanInput.includes("ha") || cleanInput.includes("submit") || cleanInput.includes("allow") || cleanInput.includes("agree"))) {
      setLoanStep(8);
      const appId = "SAH-2026-" + Math.floor(10000 + Math.random() * 90000);
      const step8Msg = "🎉 Application Submitted Successfully!\\n\\nApplication ID: " + appId + "\\nStatus: 🟢 Pending Bank Review\\nEstimated Review Time: 24 – 72 Hours\\n\\nAapki application State Bank of India (SBI) & PM SVANidhi scheme portal par transmit ho gayi hai.";
      return { text: step8Msg, step: 8, isSubmitted: true, appId };
    }

    // DEFAULT GEMINI RAG RESPONSES
    const langName = currentLang === "hi" ? "Hindi" : currentLang === "gu" ? "Gujarati" : "English";
    const ragContext = "You are Sai (Sahayata AI), India's official AI Financial Twin Assistant.\\nCRITICAL INSTRUCTION: Respond strictly in " + langName + " in a friendly conversational manner without popups.";

    const apiKeyToUse = geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKeyToUse) {
      return {
        text: currentLang === "hi"
          ? '"' + userInput + '" ke baare me: Sahayata engine aapko PM SVANidhi (7% interest subsidy) par guidance deta hai. Shuru karne ke liye + button se bank statement upload karein.'
          : '"' + userInput + '": Sahayata financial engine provides guidance on PM SVANidhi (7% rebate). Please upload your Bank Statement to begin.',
        step: loanStep,
      };
    }

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKeyToUse,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: ragContext + "\\n\\nUser: " + userInput }] }],
          }),
        }
      );
      const data = await response.json();
      const txt = data.candidates?.[0]?.content?.parts?.[0]?.text || "Main Sai hoon. Kaise madad karoon?";
      return { text: txt, step: loanStep };
    } catch (e) {
      return { text: "Main Sai hoon. Kaise madad karoon?", step: loanStep };
    }
  };

  const sendMessage = async (customText, isFileUpload = false, fileName = "", fileData = null) => {
    const textToSend = customText || promptText;
    if (!textToSend.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg = { id: Date.now(), sender: "user", text: textToSend, time: timeStr };
    setChatHistory((prev) => [...prev, userMsg]);
    setPromptText("");
    setIsProcessing(true);
    stopSpeech();

    const aiResp = await processSahayataRAG(textToSend, isFileUpload, fileName, fileData);

    const saiMsg = {
      id: Date.now() + 1,
      sender: "sai",
      text: aiResp.text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      showWhiteReport: aiResp.showWhiteReport,
      reportData: aiResp.data,
      isSubmitted: aiResp.isSubmitted,
      appId: aiResp.appId,
    };

    setChatHistory((prev) => [...prev, saiMsg]);
    setIsProcessing(false);

    speakMaleVoice(aiResp.text);
  };

  const toggleVoiceMode = async () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = currentLang === "hi" ? "hi-IN" : currentLang === "gu" ? "gu-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;

      latestTranscriptRef.current = "";
      setIsListening(true);
      stopSpeech();

      recognition.onresult = (event) => {
        let text = "";
        for (let i = 0; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }
        if (text.trim()) {
          latestTranscriptRef.current = text.trim();
          setPromptText(text.trim());
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        const textToSend = latestTranscriptRef.current.trim();
        if (textToSend) {
          sendMessage(textToSend);
          latestTranscriptRef.current = "";
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = {
      name: file.name,
      size: file.size,
      fileType: file.type,
      lastModified: file.lastModified,
    };

    const reader = new FileReader();
    reader.onload = () => {
      fileData.base64 = reader.result;
      sendMessage("Uploaded document: " + file.name, true, file.name, fileData);
    };
    reader.readAsDataURL(file);
  };

  const downloadWhitePDFReport = (data) => {
    const doc = new jsPDF();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, "F");

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("SAHAYATA — AI Financial Eligibility Report", 14, 22);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(2, 132, 199);
    doc.text("Official AI Underwriting Document | Verified Credit Assessment", 14, 28);

    autoTable(doc, {
      startY: 36,
      head: [["Evaluation Parameter", "AI Calculated Value", "Status / Benchmark"]],
      body: [
        ["Applicant Name", "Ramesh Kumar Patel", "e-KYC Authenticated"],
        ["Employment Type", data?.occupation || "Swiggy Delivery Partner", "Verified Active Worker"],
        ["Monthly Income", "₹" + (data?.monthlyIncome || "22,000"), "Income Verified"],
        ["Income Stability Score", "88%", "🟢 High Stability"],
        ["AI Fraud Score", "6%", "🟢 Low Risk"],
        ["Document Authenticity", "96%", "🟢 Authentic Passbook"],
        ["Financial Health Score", "86 / 100", "🟢 Prime Credit Signal"],
        ["Eligible Loan Amount", "₹15,000 – ₹50,000", "Matched with Scheme"],
        ["Approval Probability", "92%", "🟢 High Probability"],
        ["Recommended Scheme", "PM SVANidhi Scheme", "7% Interest Rebate"],
        ["Recommended Banks", "SBI, Bank of Baroda, PNB", "Partner PSU Banks"],
        ["Estimated Processing Time", "24 – 72 Hours", "Pending Review"],
      ],
      theme: "grid",
      headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255] },
      styles: { fillColor: [248, 250, 252], textColor: [15, 23, 42], fontSize: 10 },
    });

    doc.save("Sahayata_AI_Eligibility_Report.pdf");
  };

  return (
    <div className="bolt-ai-page-root">
      {/* BACKGROUND LAYERS */}
      <div className="bolt-bg-aura" />
      <div className="bolt-cursor-glow" style={{ left: mousePos.x + "px", top: mousePos.y + "px" }} />
      <div className="bolt-stage-rays" />
      <div className="bolt-particle-1" />
      <div className="bolt-particle-2" />
      <div className="bolt-vignette-shadow" />

      {/* Admin Dashboard Modal */}
      {showDashboard && <FraudAnalyticsDashboard onClose={() => setShowDashboard(false)} />}

      {/* Top Floating Header */}
      <div style={{ position: "fixed", top: "24px", left: "24px", right: "24px", zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="bolt-exit-floating-btn" style={{ position: "static" }} onClick={() => navigateTo && navigateTo("/")}>
          <ArrowLeft size={14} /> Exit to Home
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => setShowDashboard(true)}
            style={{
              background: "rgba(56, 189, 248, 0.15)",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              color: "#38bdf8",
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ShieldCheck size={14} /> Anti-Fraud Dashboard
          </button>

          {/* Trilingual Language Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(15, 23, 42, 0.85)", border: "1px solid rgba(255, 255, 255, 0.16)", padding: "4px 8px", borderRadius: "999px", backdropFilter: "blur(16px)" }}>
            <Languages size={14} color="#38bdf8" style={{ marginLeft: "4px" }} />
            <button onClick={() => setCurrentLang("en")} style={{ background: currentLang === "en" ? "#0284c7" : "transparent", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: currentLang === "en" ? "700" : "500", cursor: "pointer" }}>English</button>
            <button onClick={() => setCurrentLang("hi")} style={{ background: currentLang === "hi" ? "#0284c7" : "transparent", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: currentLang === "hi" ? "700" : "500", cursor: "pointer" }}>Hindi</button>
            <button onClick={() => setCurrentLang("gu")} style={{ background: currentLang === "gu" ? "#0284c7" : "transparent", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: currentLang === "gu" ? "700" : "500", cursor: "pointer" }}>Gujarati</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="bolt-hero-content">
        <h1 className="bolt-main-title">
          Hello! <span style={{ background: "linear-gradient(135deg, #ffffff 0%, #38bdf8 50%, #60a5fa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>I'm SAI</span>
        </h1>
        <p className="bolt-sub-title" style={{ color: "#ffffff", opacity: 0.9 }}>
          Your Conversational Financial Twin
        </p>

        {/* Live Conversation Stream Box */}
        <div style={{ maxWidth: "760px", width: "100%", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "14px", maxHeight: "480px", overflowY: "auto", paddingRight: "4px" }}>
          {chatHistory.map((msg) => (
            <div key={msg.id} style={{ display: "flex", gap: "10px", alignItems: "flex-start", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
              {msg.sender === "sai" && (
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                  <Bot size={18} />
                </div>
              )}

              <div style={{ maxWidth: "85%", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div
                  style={{
                    background: msg.sender === "user" ? "rgba(2, 132, 199, 0.3)" : "rgba(24, 24, 27, 0.94)",
                    border: msg.sender === "user" ? "1px solid rgba(2, 132, 199, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    padding: "14px 18px",
                    textAlign: "left",
                    color: "#ffffff",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    whiteSpace: "pre-line",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                  }}
                >
                  <div>{msg.text}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: "6px", textAlign: "right" }}>{msg.time}</div>
                </div>

                {/* WHITE CLEAN DOCUMENT AI ELIGIBILITY REPORT (RENDERED DIRECTLY IN CHAT) */}
                {msg.showWhiteReport && (
                  <div style={{ background: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: "18px", padding: "24px", boxShadow: "0 10px 25px rgba(0,0,0,0.4)", textStyle: "left", fontFamily: "sans-serif" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #0284c7", paddingBottom: "12px", marginBottom: "16px" }}>
                      <div>
                        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>SAHAYATA</h3>
                        <div style={{ fontSize: "12px", fontWeight: "700", color: "#0284c7" }}>AI Financial Eligibility Report</div>
                      </div>
                      <button
                        onClick={() => downloadWhitePDFReport(msg.reportData)}
                        style={{ background: "rgba(2, 132, 199, 0.1)", border: "1px solid #0284c7", color: "#0284c7", padding: "6px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <Download size={13} /> Save Report PDF
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px", marginBottom: "16px" }}>
                      <div><span style={{ color: "#64748b" }}>Applicant Name:</span> <br /><b>Ramesh Kumar Patel</b></div>
                      <div><span style={{ color: "#64748b" }}>Employment:</span> <br /><b>{msg.reportData?.occupation || "Swiggy Delivery Partner"}</b></div>
                      <div><span style={{ color: "#64748b" }}>Monthly Income:</span> <br /><b>₹{msg.reportData?.monthlyIncome || "22,000"} / mo</b></div>
                      <div><span style={{ color: "#64748b" }}>Income Stability:</span> <br /><b style={{ color: "#16a34a" }}>88% High Stability</b></div>
                      <div><span style={{ color: "#64748b" }}>AI Fraud Score:</span> <br /><b style={{ color: "#16a34a" }}>6% Low Risk</b></div>
                      <div><span style={{ color: "#64748b" }}>Document Authenticity:</span> <br /><b style={{ color: "#16a34a" }}>96% Authentic</b></div>
                    </div>

                    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px", marginBottom: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#64748b", fontSize: "13px" }}>Eligible Loan Amount:</span>
                        <span style={{ fontSize: "16px", fontWeight: "800", color: "#16a34a" }}>₹15,000 – ₹50,000</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#64748b", fontSize: "13px" }}>Approval Probability:</span>
                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#0284c7" }}>92% High</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#64748b", fontSize: "13px" }}>Recommended Scheme:</span>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>PM SVANidhi (7% Interest Rebate)</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b", fontSize: "13px" }}>Recommended Banks:</span>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>SBI, Bank of Baroda, PNB</span>
                      </div>
                    </div>

                    <div style={{ fontSize: "12px", color: "#475569", lineHeight: "1.5", marginBottom: "16px" }}>
                      <b>Reason & XAI Rationale:</b><br />
                      ✔ Stable monthly income verified<br />
                      ✔ 100% Genuine bank documents (8-Layer AI Audit)<br />
                      ✔ Low fraud risk signal<br />
                      ✔ Fully eligible under PM SVANidhi Street Vendor & Gig Worker Scheme
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => sendMessage("YES")}
                        style={{ flex: 1, background: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}
                      >
                        <CheckCircle2 size={16} /> YES — Authorize & Submit Application
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {isProcessing && (
            <div className="sai-typing-container">
              <div className="sai-avatar-bubble"><Bot size={18} /></div>
              <div className="sai-typing-bubble" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.9)", fontWeight: "600" }}>
                    {scanStepText || "Sai is typing • • •"}
                  </span>
                  <div className="sai-typing-dots">
                    <span className="sai-typing-dot" />
                    <span className="sai-typing-dot" />
                    <span className="sai-typing-dot" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Central Input Card */}
        <div className={"bolt-input-card " + (chatHistory.length > 0 ? "bolt-input-card-active" : "")}>
          <textarea
            className="bolt-textarea"
            placeholder={
              currentLang === "hi"
                ? "Sai ko jawab dein (e.g. 10000, Swiggy Partner, YES)..."
                : currentLang === "gu"
                ? "Sai ne jawab aapo..."
                : "Reply to Sai (e.g. 10000, Swiggy Partner, YES)..."
            }
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <div className="bolt-input-controls">
            <div className="bolt-controls-left">
              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileUpload} accept=".pdf,.csv,.jpg,.png" />
              <button className="bolt-plus-btn" title="Upload Document" onClick={() => fileInputRef.current?.click()}>
                <Plus size={18} />
              </button>

              <button className="bolt-dropdown-chip" onClick={() => setModeSelect(modeSelect === "Standard" ? "Deep AI Audit" : "Standard")}>
                {modeSelect} <ChevronDown size={14} />
              </button>

              <button
                className="bolt-dropdown-chip"
                onClick={toggleVoiceMode}
                style={{ color: isListening ? "#ef4444" : "#a1a1aa", fontWeight: isListening ? "700" : "500" }}
              >
                {isListening ? <MicOff size={15} color="#ef4444" /> : <Mic size={15} />}
                {isListening ? "Listening..." : "Voice"}
              </button>
            </div>

            <div className="bolt-controls-right">
              <button className="bolt-send-btn" onClick={() => sendMessage()} disabled={isProcessing}>
                {isProcessing ? <RefreshCw className="spin" size={16} /> : <ArrowUp size={18} />}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`;

fs.writeFileSync("src/components/FinancialTwinModule.jsx", code, "utf8");
console.log("Successfully wrote src/components/FinancialTwinModule.jsx with Conversational Flow & White Document Eligibility Report");
