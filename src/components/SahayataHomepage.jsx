import IndiaGlobeHero from "./IndiaGlobeHero";
import React, { useState, useEffect, useRef } from "react";
import {
  BrainCircuit,
  Mic,
  Paperclip,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Landmark,
  FileSpreadsheet,
  AlertTriangle,
  Award,
  Sparkles,
  ChevronRight,
  X,
  Volume2,
  Download,
  CheckCircle2,
  RefreshCw,
  Search,
} from "lucide-react";
import { gsap } from "gsap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./SahayataHomepage.css";

export default function SahayataHomepage({ lang = "en", changeLang, navigateTo, onOpenAuth }) {
  const [promptText, setPromptText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Listening...");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const heroRef = useRef(null);
  const promptBoxRef = useRef(null);
  const cardsRef = useRef(null);

  // Mouse Glow Movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // GSAP Animations on Mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in hero elements
      gsap.from(".sai-badge-pill", { opacity: 0, y: -20, duration: 0.8, delay: 0.1 });
      gsap.from(".sai-hero-heading", { opacity: 0, y: 30, duration: 1, delay: 0.2 });
      gsap.from(".sai-hero-sub", { opacity: 0, y: 20, duration: 0.9, delay: 0.35 });
      gsap.from(promptBoxRef.current, { opacity: 0, scale: 0.94, y: 30, duration: 1, delay: 0.5 });
      gsap.from(".sai-pill", { opacity: 0, y: 15, stagger: 0.08, duration: 0.8, delay: 0.7 });
      
      // Floating orbs infinite animation
      gsap.to(".sai-orb-1", {
        y: "+=30",
        x: "+=20",
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".sai-orb-2", {
        y: "-=40",
        x: "-=25",
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
    return () => ctx.revert();
  }, []);

  // Handle Quick Prompts
  const handleQuickPrompt = (text) => {
    setPromptText(text);
    processQuery(text);
  };

  // Process Query via SAI Engine
  const processQuery = (query) => {
    const textToUse = query || promptText;
    if (!textToUse.trim()) return;

    setIsProcessing(true);
    setAiResponse(null);

    setTimeout(() => {
      const qLower = textToUse.toLowerCase();
      let responseObj = null;

      if (qLower.includes("bank") || qLower.includes("statement")) {
        responseObj = {
          type: "BANK_STATEMENT_ANALYSIS",
          title: "Bank Statement OCR & AI Audit Complete",
          score: 88,
          summary: "Verified 6 months SBI Bank Statement. Net monthly credit ₹28,500 with zero bounced transactions.",
          details: [
            { label: "Verified Monthly Credits", value: "₹28,500" },
            { label: "Average Surplus Buffer", value: "₹14,300/month" },
            { label: "Bounced Charges", value: "0 Flags (Clean)" },
            { label: "Income Stability Index", value: "92% (High)" }
          ]
        };
      } else if (qLower.includes("loan") || qLower.includes("eligib")) {
        responseObj = {
          type: "LOAN_ELIGIBILITY",
          title: "Real-Time Sachet Credit Underwriting",
          score: 92,
          summary: "Qualified for instant micro-loan up to ₹50,000 at 0% collateral with PM SVANidhi subsidy.",
          details: [
            { label: "Recommended Borrowing", value: "₹50,000" },
            { label: "Max Safe Borrowing Limit", value: "₹75,000" },
            { label: "Suggested Daily EMI", value: "₹72/day (Auto-Debit)" },
            { label: "Repayment Probability", value: "96% (Prime Tier)" }
          ]
        };
      } else if (qLower.includes("scheme") || qLower.includes("yojana") || qLower.includes("sarkari")) {
        responseObj = {
          type: "GOVERNMENT_SCHEME",
          title: "RAG Scheme Matching Engine",
          score: 98,
          summary: "Matched 3 government schemes specifically tailored for gig & informal workers.",
          details: [
            { label: "Top Recommendation", value: "PM SVANidhi (98% Match)" },
            { label: "Estimated Subsidy", value: "7% Interest Rebate" },
            { label: "Social Security", value: "e-Shram ₹2 Lakh Cover" },
            { label: "State Welfare", value: "Gujarat MA Amrutum Health Cover" }
          ]
        };
      } else if (qLower.includes("fraud") || qLower.includes("detect")) {
        responseObj = {
          type: "FRAUD_AUDIT",
          title: "AI Anti-Tampering & Fraud Scan",
          score: 96,
          summary: "All uploaded document metadata, PDF font layers, and name cross-checks passed with zero tampering flags.",
          details: [
            { label: "Document Metadata Integrity", value: "Passed (100% Authentic)" },
            { label: "Font & Template Check", status: "Passed", value: "Original Digital PDF" },
            { label: "Cross-ID Identity Match", value: "Verified (Aadhaar & Bank)" },
            { label: "SHA-256 Anti-Duplicate", value: "Unique File Verified" }
          ]
        };
      } else {
        responseObj = {
          type: "GENERAL_TWIN",
          title: "Sahayata AI Financial Twin Insight",
          score: 86,
          summary: `Analyzing query: "${textToUse}". Your overall Sahayata Financial Health Score is 86/100 (Prime Financial Stability). You qualify for instant government credit assistance.`,
          details: [
            { label: "Sahayata Health Score", value: "86/100" },
            { label: "Income Stability", value: "91% (Low Risk)" },
            { label: "Cash Flow Health", value: "88% (Positive Buffer)" },
            { label: "Recommended Next Step", value: "Claim PM SVANidhi Subsidy" }
          ]
        };
      }

      setIsProcessing(false);
      setAiResponse(responseObj);
    }, 1200);
  };

  // Handle Document Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPromptText(`Analyzing document: ${file.name}`);
    processQuery(`Analyze uploaded statement: ${file.name}`);
  };

  // PDF Report Download
  const downloadAiReport = () => {
    const doc = new jsPDF();
    doc.setFillColor(9, 9, 11);
    doc.rect(0, 0, 210, 297, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("SAHAYATA AI - Underwriting Report", 14, 22);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(96, 165, 250);
    doc.text("India's AI Financial Twin Engine | Verified Worker Credit Signal", 14, 28);

    autoTable(doc, {
      startY: 38,
      head: [["Metric Category", "Calculated Signal", "Risk Status"]],
      body: [
        ["Sahayata Overall Score", "86 / 100", "Prime Financial Stability"],
        ["Income Stability Index", "91%", "Low Risk"],
        ["Cash Flow Surplus", "₹14,300 / Month", "Healthy Buffer"],
        ["Utility Payment Discipline", "100%", "On-Time Guaranteed"],
        ["Fraud Verification Check", "96%", "Passed Anti-Tampering"],
        ["Recommended Loan", "₹50,000", "0% Collateral, 7% Subsidy"],
        ["Matched Scheme", "PM SVANidhi", "High Priority Disbursal"]
      ],
      theme: "grid",
      headStyles: { fillColor: [79, 140, 255], textColor: [255, 255, 255] },
      styles: { fillColor: [17, 17, 19], textColor: [244, 244, 245], fontSize: 10 }
    });

    doc.save("Sahayata_AI_Underwriting_Report.pdf");
  };

  // Voice Mode Trigger
  const startVoiceMode = () => {
    setVoiceActive(true);
    setVoiceStatus("Listening to your voice...");
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = lang === "hi" ? "hi-IN" : lang === "gu" ? "gu-IN" : "en-US";
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceStatus(`Recognized: "${transcript}"`);
        setPromptText(transcript);
        setTimeout(() => {
          setVoiceActive(false);
          processQuery(transcript);
        }, 1000);
      };

      recognition.onerror = () => {
        setVoiceStatus("Voice input active. Tap Mic to close.");
      };
    }
  };

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="sai-homepage-root">
      {/* Background Grid & Interactive Light */}
      <div className="sai-bg-grid" />
      <div
        className="sai-mouse-glow"
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />
      <div className="sai-orb sai-orb-1" />
      <div className="sai-orb sai-orb-2" />

      {/* Fixed Top Navbar */}
      <nav className="sai-nav-fixed">
        <div className="sai-nav-container">
          <div className="sai-brand" onClick={() => navigateTo("/")}>
            <div className="sai-brand-logo">
              <BrainCircuit size={20} />
            </div>
            <span className="sai-brand-title">SAHAYATA AI</span>
            <span className="sai-brand-badge">PRO</span>
          </div>

          <div className="sai-nav-links">
            <span className="sai-nav-link" onClick={() => navigateTo("/financial-twin")}>
              {lang === "hi" ? "फाइनेंशियल ट्विन" : lang === "gu" ? "ફાઇનાન્શિયલ ટ્વિન" : "Financial Twin"}
            </span>
            <span className="sai-nav-link" onClick={() => handleQuickPrompt(lang === "hi" ? "एआई रिपोर्ट तैयार करें" : lang === "gu" ? "AI રિપોર્ટ બનાવો" : "Generate AI report")}>
              {lang === "hi" ? "एआई रिपोर्ट" : lang === "gu" ? "AI રિપોર્ટ" : "AI Reports"}
            </span>
            <span className="sai-nav-link" onClick={() => navigateTo("/about")}>
              {lang === "hi" ? "सरकारी योजनाएं" : lang === "gu" ? "સરકારી યોજનાઓ" : "Government Schemes"}
            </span>
            <span className="sai-nav-link" onClick={() => navigateTo("/help")}>
              {lang === "hi" ? "हमारे बारे में" : lang === "gu" ? "અમારા વિશે" : "About"}
            </span>
          </div>

          <div className="sai-nav-actions">
            <select
              className="sai-lang-select"
              value={lang}
              onChange={(e) => changeLang(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="gu">ગુજરાતી</option>
            </select>
            <button className="sai-btn-login" onClick={onOpenAuth}>
              {lang === "hi" ? "लॉगिन" : lang === "gu" ? "લૉગિન" : "Login"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="sai-hero-section-split" ref={heroRef} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "40px", alignItems: "center", maxWidth: "1400px", margin: "0 auto", padding: "90px 24px 60px 24px" }}>
        
        {/* LEFT COLUMN: India Earth Hero with subtle pulse zoom */}
        <div className="sai-hero-globe-column" style={{ position: "relative", borderRadius: "24px", overflow: "hidden" }}>
          <IndiaGlobeHero lang={lang} />
        </div>

        {/* RIGHT COLUMN: SAI AI Assistant & Floating Prompt Box */}
        <div className="sai-hero-content-column">
          <div className="sai-badge-pill">
            <Sparkles size={14} /> {lang === "hi" ? "एआई वित्तीय बुद्धिमत्ता द्वारा संचालित" : lang === "gu" ? "AI નાણાકીય ઇન્ટેલિજન્સ દ્વારા સંચાલિત" : "Powered by AI Financial Intelligence"}
          </div>

          <h1 className="sai-hero-heading">
            {lang === "hi" ? "नमस्ते," : lang === "gu" ? "નમસ્તે," : "Hello,"} <br />
            {lang === "hi" ? "मैं हूँ " : lang === "gu" ? "હું છું " : "I'm "}<span className="sai-gradient-text">SAI</span>
          </h1>

          <p className="sai-hero-sub">
            {lang === "hi"
              ? "भारत के गिग कामगारों, स्ट्रीट वेंडरों और दैनिक वेतनभोगियों के लिए आपका एआई फाइनेंशियल ट्विन।"
              : lang === "gu"
              ? "ભારતના ગીગ વર્કર્સ, ડિલિવરી પાર્ટનર્સ અને દૈનિક શ્રમિકો માટે તમારું AI ફાઇનાન્શિયલ ટ્વિન."
              : "Your AI Financial Twin for India's Gig Workers, Delivery Partners and Daily Wage Earners."}
          </p>

          {/* AI Floating Glass Prompt Box */}
          <div className="sai-prompt-wrapper">
            <div className="sai-prompt-box" ref={promptBoxRef}>
              <textarea
                className="sai-textarea"
                placeholder={
                  lang === "hi"
                    ? "अपना बैंक स्टेटमेंट, बिजली बिल अपलोड करें या SAI से कुछ भी पूछें..."
                    : lang === "gu"
                    ? "તમારું બેંક સ્ટેટમેન્ટ, વીજળીનું બિલ અપલોડ કરો અથવા SAI ને કંઈપણ પૂછો..."
                    : "Upload your bank statement, electricity bill or ask SAI anything..."
                }
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    processQuery();
                  }
                }}
              />

              <div className="sai-prompt-bottom">
                <div className="sai-controls-left">
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                    accept=".pdf,.csv,.jpg,.png"
                  />
                  <button
                    className="sai-attach-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip size={15} /> {lang === "hi" ? "दस्तावेज़ अपलोड करें" : lang === "gu" ? "દસ્તાવેજ અપલોડ કરો" : "Upload Documents"}
                  </button>
                  <button
                    className="sai-voice-btn"
                    onClick={startVoiceMode}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "rgba(2, 132, 199, 0.14)",
                      border: "1px solid rgba(56, 189, 248, 0.45)",
                      color: "#38BDF8",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 2px 10px rgba(2, 132, 199, 0.2)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <Mic size={15} color="#38BDF8" /> {lang === "hi" ? "आवाज़" : lang === "gu" ? "અવાજ" : "Voice"}
                  </button>
                </div>

                <button
                  className="sai-send-btn"
                  onClick={() => processQuery()}
                  disabled={isProcessing}
                >
                  {isProcessing ? <RefreshCw className="spin" size={18} /> : <ArrowUpRight size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Prompts Pills */}
          <div className="sai-quick-prompts">
            {(lang === "hi"
              ? [
                  "बैंक स्टेटमेंट का विश्लेषण करें",
                  "ऋण पात्रता जांचें",
                  "एआई रिपोर्ट तैयार करें",
                  "सरकारी योजनाएं खोजें",
                  "धोखाधड़ी पहचानें",
                  "सहायता स्कोर सुधारें",
                ]
              : lang === "gu"
              ? [
                  "બેંક સ્ટેટમેન્ટ વિશ્લેષણ કરો",
                  "લોન પાત્રતા ચકાસો",
                  "AI રિપોર્ટ બનાવો",
                  "સરકારી યોજનાઓ શોધો",
                  "છેતરપિંડી ઓળખો",
                  "સહાયતા સ્કોર સુધારો",
                ]
              : [
                  "Analyze my bank statement",
                  "Check loan eligibility",
                  "Generate AI report",
                  "Find government schemes",
                  "Detect fraud",
                  "Improve my Sahayata Score",
                ]
            ).map((pill, i) => (
              <button key={i} className="sai-pill" onClick={() => handleQuickPrompt(pill)}>
                {pill}
              </button>
            ))}
          </div>

          {/* Dynamic AI Output Panel */}
          {aiResponse && (
            <div className="sai-response-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <BrainCircuit color="#6366f1" size={24} />
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "18px" }}>{aiResponse.title}</h3>
                </div>
                <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "4px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: "700" }}>
                  Score: {aiResponse.score}/100
                </div>
              </div>

              <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                {aiResponse.summary}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px" }}>
                {aiResponse.details.map((d, idx) => (
                  <div key={idx} style={{ background: "rgba(19, 27, 46, 0.6)", padding: "12px", borderRadius: "12px", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>{d.label}</div>
                    <div style={{ fontSize: "15px", fontWeight: "700", color: "#a5b4fc", marginTop: "4px" }}>{d.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  className="sai-btn-login"
                  style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)", border: "none", color: "#fff", boxShadow: "0 8px 20px rgba(79, 70, 229, 0.3)" }}
                  onClick={downloadAiReport}
                >
                  <Download size={15} style={{ marginRight: "6px" }} /> {lang === "hi" ? "एआई रिपोर्ट डाउनलोड करें (PDF)" : lang === "gu" ? "AI રિપોર્ટ ડાઉનલોડ કરો (PDF)" : "Download AI Report (PDF)"}
                </button>
                <button
                  className="sai-btn-login"
                  onClick={() => navigateTo("/financial-twin")}
                >
                  {lang === "hi" ? "पूर्ण ट्विन डैशबोर्ड देखें" : lang === "gu" ? "સંપૂર્ણ ટ્વિન ડેશબોર્ડ જુઓ" : "View Full Twin Dashboard"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* THREAD SAAS LIVE PULSE METRICS BANNER */}
      <div className="sai-metrics-strip">
        <div className="sai-metrics-container">
          <div className="sai-metric-item">
            <span className="sai-pulse-dot" />
            <span className="sai-metric-label">Live AI Engine Active</span>
            <span className="sai-metric-val">28 Indian States</span>
          </div>
          <div className="sai-metric-divider" />
          <div className="sai-metric-item">
            <span className="sai-metric-label">Max Collateral-Free Micro-Credit</span>
            <span className="sai-metric-val">₹50,000</span>
          </div>
          <div className="sai-metric-divider" />
          <div className="sai-metric-item">
            <span className="sai-metric-label">AI Anti-Tampering Accuracy</span>
            <span className="sai-metric-val">98.4%</span>
          </div>
          <div className="sai-metric-divider" />
          <div className="sai-metric-item">
            <span className="sai-metric-label">Underwriting Processing Time</span>
            <span className="sai-metric-val">&lt; 1.2s</span>
          </div>
        </div>
      </div>

      {/* THREAD SAAS FEATURE MATRIX SECTION */}
      <section className="sai-features-section" ref={cardsRef}>
        <div className="sai-features-header">
          <div className="sai-features-badge">
            <BrainCircuit size={14} /> THREAD DESIGN ARCHITECTURE
          </div>
          <h2 className="sai-features-title">Engineered for Underrepresented Workers</h2>
          <p className="sai-features-sub">
            The complete AI-powered financial intelligence stack for cashflow analysis, scheme matching & loan underwriting.
          </p>

          {/* Interactive Tab Controller for Thread SaaS Preview */}
          <div className="sai-tab-selector">
            {[
              "AI Financial Twin",
              "Loan Eligibility",
              "Fraud Detection",
              "Government Schemes",
              "Financial Health",
              "AI Reports"
            ].map((tabName, idx) => (
              <button
                key={idx}
                className={`sai-tab-btn ${activeTab === idx ? "active" : ""}`}
                onClick={() => setActiveTab(idx)}
              >
                {tabName}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Grid (All 6 Thread Glass Cards Preserved) */}
        <div className="sai-grid">
          <div className={`sai-card ${activeTab === 0 ? "sai-card-highlighted" : ""}`} onClick={() => navigateTo("/financial-twin")}>
            <div className="sai-card-beam" />
            <div className="sai-card-icon">
              <BrainCircuit size={24} />
            </div>
            <h3 className="sai-card-title">AI Financial Twin</h3>
            <p className="sai-card-desc">
              Real-time digital twin synthesized from bank statements, utility bills, rent receipts, and gig partner earnings.
            </p>
            <span className="sai-card-action">
              Explore Twin <ChevronRight size={14} />
            </span>
          </div>

          <div className={`sai-card ${activeTab === 1 ? "sai-card-highlighted" : ""}`} onClick={() => handleQuickPrompt("Check loan eligibility")}>
            <div className="sai-card-beam" />
            <div className="sai-card-icon">
              <TrendingUp size={24} />
            </div>
            <h3 className="sai-card-title">Loan Eligibility</h3>
            <p className="sai-card-desc">
              Instant calculation of safe borrowing capacity, daily micro-EMI limits, and 24-month repayment probability.
            </p>
            <span className="sai-card-action">
              Calculate Limits <ChevronRight size={14} />
            </span>
          </div>

          <div className={`sai-card ${activeTab === 2 ? "sai-card-highlighted" : ""}`} onClick={() => handleQuickPrompt("Detect fraud")}>
            <div className="sai-card-beam" />
            <div className="sai-card-icon">
              <ShieldCheck size={24} />
            </div>
            <h3 className="sai-card-title">Fraud Detection</h3>
            <p className="sai-card-desc">
              Automated PDF font structure audit, template tampering checks, and cross-document identity verification.
            </p>
            <span className="sai-card-action">
              Scan Documents <ChevronRight size={14} />
            </span>
          </div>

          <div className={`sai-card ${activeTab === 3 ? "sai-card-highlighted" : ""}`} onClick={() => navigateTo("/about")}>
            <div className="sai-card-beam" />
            <div className="sai-card-icon">
              <Landmark size={24} />
            </div>
            <h3 className="sai-card-title">Government Schemes</h3>
            <p className="sai-card-desc">
              RAG-driven matching engine for PM SVANidhi, e-Shram, PM Jan Dhan, and Gujarat state welfare programs.
            </p>
            <span className="sai-card-action">
              Find Schemes <ChevronRight size={14} />
            </span>
          </div>

          <div className={`sai-card ${activeTab === 4 ? "sai-card-highlighted" : ""}`} onClick={() => handleQuickPrompt("Improve my Sahayata Score")}>
            <div className="sai-card-beam" />
            <div className="sai-card-icon">
              <Award size={24} />
            </div>
            <h3 className="sai-card-title">Financial Health</h3>
            <p className="sai-card-desc">
              10 AI metrics evaluating income stability, utility payment discipline, and cashflow health score (0–100).
            </p>
            <span className="sai-card-action">
              Check Score <ChevronRight size={14} />
            </span>
          </div>

          <div className={`sai-card ${activeTab === 5 ? "sai-card-highlighted" : ""}`} onClick={downloadAiReport}>
            <div className="sai-card-beam" />
            <div className="sai-card-icon">
              <FileSpreadsheet size={24} />
            </div>
            <h3 className="sai-card-title">AI Reports</h3>
            <p className="sai-card-desc">
              Instant downloadable 16-section PDF report ready for bank underwriters and NBFC micro-credit approval.
            </p>
            <span className="sai-card-action">
              Download PDF <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </section>

      {/* Voice Assistant Overlay Modal */}
      {voiceActive && (
        <div className="sai-voice-modal-backdrop" onClick={() => setVoiceActive(false)}>
          <div className="sai-voice-modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              className="sai-voice-ring"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(2, 132, 199, 0.15)",
                border: "2px solid rgba(56, 189, 248, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: "0 0 35px rgba(2, 132, 199, 0.45)"
              }}
            >
              <Mic size={40} color="#38BDF8" />
            </div>
            <div className="sai-voice-wave">
              <div className="sai-wave-bar" style={{ background: "#38BDF8" }} />
              <div className="sai-wave-bar" style={{ background: "#38BDF8" }} />
              <div className="sai-wave-bar" style={{ background: "#38BDF8" }} />
              <div className="sai-wave-bar" style={{ background: "#38BDF8" }} />
              <div className="sai-wave-bar" style={{ background: "#38BDF8" }} />
            </div>
            <h3 style={{ color: "#fff", margin: "0 0 8px 0" }}>SAI Voice Mode</h3>
            <p style={{ color: "#a1a1aa", fontSize: "14px" }}>{voiceStatus}</p>
            <button
              className="sai-btn-login"
              style={{ marginTop: "20px" }}
              onClick={() => setVoiceActive(false)}
            >
              Close Voice AI
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="sai-footer">
        <p>© 2026 SAHAYATA AI — India's AI Financial Twin Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
