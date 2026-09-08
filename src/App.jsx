import { useCallback, useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  Check,
  Circle,
  FileX2,
  HandCoins,
  Landmark,
  Scale,
  ShieldCheck,
  Store,
  TrendingUp,
  WalletCards,
  Languages,
  BrainCircuit,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";
import "./App.css";
import "./polish.css";
import { checkHealth, getDashboard, getSchemes } from "./api";
import { t as translate, saveLanguage, getSavedLanguage, TRANSLATIONS } from "./services/i18n";
import AuthModal from "./components/AuthModal";
import Calculator from "./components/Calculator";
import DigitalTracker from "./components/DigitalTracker";
import SachetPlanner from "./components/SachetPlanner";
import ProgressiveReg from "./components/ProgressiveReg";
import SocialSecurity from "./components/SocialSecurity";
import ApplicationStatus from "./components/ApplicationStatus";
import KycDocuments from "./components/KycDocuments";
import UPIHistoryReport from "./components/UPIHistoryReport";
import IndiaGlobeHero from "./components/IndiaGlobeHero";
import VoiceAssistant from "./components/VoiceAssistant";
import GovernmentSchemesGuide from "./components/GovernmentSchemesGuide";
import HelpCenter from "./components/HelpCenter";
import FinancialTwinModule from "./components/FinancialTwinModule";
import AdminAnalyticsModule from "./components/AdminAnalyticsModule";
import OnboardingFlow from "./components/OnboardingFlow";
import LoggedInJourneyDashboard from "./components/LoggedInJourneyDashboard";
import ApplicationJourneySuite from "./components/ApplicationJourneySuite";
import AdvancedAnalyticsSection from "./components/AdvancedAnalyticsSection";

const SCHEME_ICONS = {
  "PM SVANidhi": Store,
  "Jan Dhan Yojana": Landmark,
  "PM-SYM Pension": HandCoins,
  "e-Shram Portal": BadgeCheck,
};

const FALLBACK_STATS = [
  { target: "50", suffix: "L+", label: "PM SVANidhi beneficiaries" },
  { target: "28", suffix: "Cr+", label: "e-Shram registered workers" },
  { target: "52", suffix: "Cr+", label: "Jan Dhan accounts" },
  { target: "2.3", suffix: "L Cr", label: "Jan Dhan balance, INR" },
];

const FALLBACK_TICKER = [
  "PM SVANidhi Yojana: 50 lakh se adhik labharthi registered",
  "e-Shram Portal: 28 crore shramik panjikrit",
  "Jan Dhan Khaton mein INR 2.3 lakh crore ki rashi jama",
];

export default function App() {
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [ticker, setTicker] = useState(FALLBACK_TICKER);
  const [schemes, setSchemes] = useState([]);
  const [apiOnline, setApiOnline] = useState(false);
  const [eligibleAmount, setEligibleAmount] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [journeyStage, setJourneyStage] = useState(1);
  const [activeJourneyStep, setActiveJourneyStep] = useState(1);
  const [advancedToolsOpen, setAdvancedToolsOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [lang, setLang] = useState(() => getSavedLanguage());
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Listen to global sahayata_lang_change events for instant language switching across the entire app
  useEffect(() => {
    const handleLangChange = (e) => {
      const newLang = typeof e.detail === "string" ? e.detail : (e.detail?.lang || e.detail);
      if (newLang && ["en", "hi", "gu"].includes(newLang)) {
        setLang(newLang);
      }
    };
    window.addEventListener("sahayata_lang_change", handleLangChange);
    return () => window.removeEventListener("sahayata_lang_change", handleLangChange);
  }, []);

  // Load saved user and progress from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("sahayata_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const saved = localStorage.getItem("sahayata_user_progress");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.journeyStage) setJourneyStage(parsed.journeyStage);
        if (parsed.activeJourneyStep) setActiveJourneyStep(parsed.activeJourneyStep);
        if (parsed.eligibleAmount) setEligibleAmount(parsed.eligibleAmount);
        if (parsed.applicationId) setApplicationId(parsed.applicationId);
      }
    } catch (e) {}
  }, []);

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setAuthMode(null);
    setJourneyStage(1);
    setActiveJourneyStep(1);
    setEligibleAmount(null);
    setApplicationId(null);
    try {
      localStorage.removeItem("sahayata_user_progress");
    } catch (_) {}
  };

  const handleLogout = () => {
    setUser(null);
    setJourneyStage(1);
    setActiveJourneyStep(1);
    setEligibleAmount(null);
    setApplicationId(null);
    localStorage.removeItem("sahayata_user");
    localStorage.removeItem("sahayata_token");
    localStorage.removeItem("sahayata_user_progress");
  };

  // Save user progress to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(
        "sahayata_user_progress",
        JSON.stringify({
          journeyStage,
          activeJourneyStep,
          eligibleAmount,
          applicationId,
        })
      );
    } catch (e) {}
  }, [journeyStage, activeJourneyStep, eligibleAmount, applicationId]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState(null, "", path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  const changeLang = (newLang) => {
    setLang(newLang);
    saveLanguage(newLang);
  };

  const t = (key, fallback) => {
    return translate(key, lang, fallback);
  };

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const problemsList = [
    {
      Icon: TrendingUp,
      title: t("prob1Title", "1. Alternative Financial Data"),
      desc: t("prob1Desc", "Digital lending systems increasingly analyse transaction behaviour to understand users without traditional financial documents."),
    },
    {
      Icon: AlertTriangle,
      title: t("prob2Title", "2. Suspicious Transaction Patterns"),
      desc: t("prob2Desc", "Abnormal or unusual transaction behaviour can affect the reliability of financial assessments."),
    },
    {
      Icon: ShieldCheck,
      title: t("prob3Title", "3. Unreliable Decisions"),
      desc: t("prob3Desc", "If suspicious signals are not identified, financial assessment may require additional verification before a reliable decision can be made."),
    },
  ];

  const translatedSchemes = [
    {
      name: t("scheme1Name", "PM SVANidhi"),
      sub: t("scheme1Sub", "For street vendors & hawkers"),
      desc: t("scheme1Desc", "Collateral-free working capital loan from ₹10,000 to ₹50,000 with 7% interest subsidy."),
      tag: t("scheme1Tag", "Street Vendors"),
    },
    {
      name: t("scheme2Name", "PM Jan Dhan Yojana"),
      sub: t("scheme2Sub", "Basic banking access"),
      desc: t("scheme2Desc", "Zero-balance savings account, ₹10,000 overdraft facility, and free RuPay accident insurance."),
      tag: t("scheme2Tag", "All Workers"),
    },
    {
      name: t("scheme3Name", "PM-SYM Pension"),
      sub: t("scheme3Sub", "Old-age social security"),
      desc: t("scheme3Desc", "Assured ₹3,000 monthly lifelong pension after age 60 with 50% matching contribution from Central Government."),
      tag: t("scheme3Tag", "Age 18-40"),
    },
    {
      name: t("scheme4Name", "e-Shram Portal"),
      sub: t("scheme4Sub", "Digital worker identity"),
      desc: t("scheme4Desc", "12-digit national Universal Account Number (UAN) for unorganised workers with direct DBT relief access."),
      tag: t("scheme4Tag", "Free Registration"),
    },
  ];

  return (
    <div className="app-root-shell">
      {/* GLOBAL NAVBAR (HIDDEN ON AI PAGE & BANK DASHBOARD) */}
      {currentPath !== "/financial-twin" && currentPath !== "/admin" && currentPath !== "/admin-dashboard" && (
        <header className="header">
          <div className="header-inner">
            <div className="brand-block" onClick={() => navigateTo("/")} style={{ cursor: "pointer" }}>
              <div className="brand-flag">
                <span className="flag-saffron" />
                <span className="flag-white" />
                <span className="flag-green" />
              </div>
              <div>
                <div className="brand-title">{t("brandTitle", "Sahayata")}</div>
                <div className="brand-sub">{t("brandSub", "AI Digital Lending Fraud Intelligence")}</div>
              </div>
            </div>

            <button className="mobile-menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <nav className={`simple-nav ${mobileMenuOpen ? "mobile-open" : ""}`} aria-label="Main navigation">
              <a href="#" className={`nav-item ${currentPath === "/" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); navigateTo("/"); }}>
                {t("navHome", "Home")}
              </a>
              <a href="#" className={`nav-item ${currentPath === "/financial-twin" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); navigateTo("/financial-twin"); }}>
                {t("navAi", "AI Financial Twin")}
              </a>
              <a href="#how-it-works" className="nav-item" onClick={(e) => { e.preventDefault(); scrollTo("how-it-works"); }}>
                {t("howItWorks", "How It Works")}
              </a>
              <a href="#" className={`nav-item ${currentPath === "/help" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); navigateTo("/help"); }}>
                {t("navHelp", "Help")}
              </a>
            </nav>

            <div className={`header-actions ${mobileMenuOpen ? "mobile-open" : ""}`}>
              <div className="lang-selector-container">
                <Languages size={16} className="lang-icon" />
                <select
                  className="lang-select"
                  value={lang}
                  onChange={(e) => changeLang(e.target.value)}
                  aria-label="Select Language"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                </select>
              </div>

              {/* WHITE LENDER COMMAND CENTER BUTTON */}
              <button
                className="btn-lender-white"
                onClick={() => navigateTo("/admin")}
              >
                <Landmark size={16} /> {t("navLender", "Lender Command Center")}
              </button>

              {/* REGISTER AND LOGIN BUTTONS */}
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="user-chip" style={{ background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38bdf8", padding: "6px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: "700" }}>
                    Hi, {user.full_name || user.name || "User"}
                  </span>
                  <button
                    className="btn-header-login"
                    style={{ padding: "6px 12px", fontSize: "12px", background: "rgba(239, 68, 68, 0.15)", color: "#fca5a5", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "999px", cursor: "pointer" }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button className="btn-header-login" onClick={() => setAuthMode("login")}>{t("navLogin", "Login")}</button>
                  <button className="btn-header-register" onClick={() => setAuthMode("register")}>{t("navRegister", "Register")}</button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* DYNAMIC ROUTER VIEW */}
      {currentPath === "/financial-twin" ? (
        <FinancialTwinModule lang={lang} navigateTo={navigateTo} />
      ) : currentPath === "/admin" || currentPath === "/admin-dashboard" ? (
        <AdminAnalyticsModule lang={lang} navigateTo={navigateTo} />
      ) : currentPath === "/about" ? (
        <GovernmentSchemesGuide lang={lang} navigateTo={navigateTo} />
      ) : currentPath === "/help" ? (
        <HelpCenter lang={lang} navigateTo={navigateTo} />
      ) : (
        /* MAIN HOMEPAGE WITH PULSING INDIA EARTH GLOBE & ATMOSPHERIC THEME */
        <main className="home-experience">
          {/* CINEMATIC HERO SECTION WITH INDIA EARTH PULSE GLOBE */}
          <section className="hero">
            <IndiaGlobeHero lang={lang} />
            <div className="hero-inner">
              <div className="hero-text">
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38bdf8", padding: "6px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: "700", marginBottom: "16px" }}>
                  <BrainCircuit size={16} /> {t("heroBadge", "AI-Powered Digital Transaction Security")}
                </div>
                <h2 style={{ fontSize: "38px", fontWeight: "800", lineHeight: "1.2", marginBottom: "16px" }}>
                  {t("heroHeadingTitle1", "Trust Every Transaction.")}<br />{t("heroHeadingTitle2", "Detect Every Anomaly.")}
                </h2>
                <p style={{ fontSize: "16px", color: "#a9b6ce", lineHeight: "1.6", marginBottom: "28px", maxWidth: "680px" }}>
                  {t("heroSubtitle", "Sahayata uses AI to understand digital transaction behaviour, identify suspicious patterns and help make digital lending safer for both lenders and genuine users.")}
                </p>
                <div className="hero-btns" style={{ display: "flex", gap: "14px" }}>
                  <button className="btn-primary" onClick={() => navigateTo("/financial-twin")}>{t("btnExploreAi", "Explore AI Behaviour Twin →")}</button>
                  <button className="btn-ghost" onClick={() => scrollTo("how-it-works")}>{t("btnHowItWorks", "How Sahayata Works")}</button>
                </div>
                <div className="hero-trust" style={{ marginTop: "24px" }}>
                  <span><ShieldCheck size={17} /> {t("trustForensics", "8-Layer AI Forensics")}</span>
                  <span><BrainCircuit size={17} /> {t("trustTwin", "Behavioural Twin")}</span>
                  <span><BriefcaseBusiness size={17} /> {t("trustFriction", "Zero-Friction Pass")}</span>
                </div>
              </div>
            </div>
          </section>

          {/* PROBLEM OBSTACLES SECTION */}
          <div className="section-dark-theme home-surface home-surface-problems" style={{ background: "linear-gradient(180deg, #090f1e, #0b1121)", color: "#f8fafc", padding: "70px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <section className="section" id="problem-section">
              <div className="section-inner" style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 20px" }}>
                <div className="eyebrow" style={{ color: "#38bdf8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("probEyebrow", "Challenge Identification")}</div>
                <h2 className="section-title" style={{ color: "#f8fafc", fontSize: "34px", fontWeight: "800", marginTop: "8px", marginBottom: "12px" }}>{t("probTitle", "Digital Lending Needs Trustworthy Financial Signals")}</h2>
                <p className="section-sub" style={{ color: "#a9b6ce", fontSize: "16px", marginBottom: "36px" }}>{t("probSub", "Digital lending systems increasingly analyse transaction behaviour, but anomalous patterns require explainable verification.")}</p>

                <div className="prob-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                  {problemsList.map((prob, idx) => (
                    <div key={idx} className="prob-card" style={{ background: "linear-gradient(145deg, rgba(22,36,64,0.88), rgba(11,19,36,0.88))", border: "1px solid rgba(132,179,255,0.15)", borderRadius: "20px", padding: "28px" }}>
                      <div className="prob-icon" style={{ background: idx === 0 ? "rgba(56, 189, 248, 0.12)" : idx === 1 ? "rgba(245, 158, 11, 0.12)" : "rgba(239, 68, 68, 0.12)", color: idx === 0 ? "#38bdf8" : idx === 1 ? "#fbbf24" : "#fca5a5", width: "50px", height: "50px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                        <prob.Icon size={24} />
                      </div>
                      <h3 style={{ color: "#f8fafc", fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>{prob.title}</h3>
                      <p style={{ color: "#a9b6ce", fontSize: "14px", lineHeight: "1.6" }}>{prob.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* 4-STEP WORKFLOW SECTION: HOW SAHAYATA WORKS */}
          <div className="section-dark-theme home-surface home-surface-solution" id="how-it-works" style={{ padding: "80px 0" }}>
            <section className="section section-solution">
              <div className="section-inner" style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 20px" }}>
                <div className="eyebrow" style={{ color: "#38bdf8", fontWeight: "700" }}>{t("solEyebrow", "EXPLAINABLE AI WORKFLOW")}</div>
                <h2 className="section-title" style={{ fontSize: "32px", color: "#f8fafc", marginBottom: "16px" }}>{t("solTitle", "How Sahayata Protects Digital Lending")}</h2>
                <p className="section-sub" style={{ color: "#a9b6ce", marginBottom: "40px" }}>{t("solSub", "Four-step explainable AI workflow to learn behaviour baselines and detect anomalous transaction signals.")}</p>
                <div className="sol-layout" style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "60px" }}>
                  <div className="sol-steps" style={{ display: "grid", gap: "24px" }}>
                    <div className="sol-step" style={{ display: "flex", gap: "20px" }}>
                      <div className="sol-num" style={{ background: "#1e293b", color: "#38bdf8", padding: "10px 16px", borderRadius: "12px", fontWeight: "800" }}>01</div>
                      <div>
                        <h4 style={{ color: "#f8fafc", marginBottom: "4px" }}>{t("step1Title", "STEP 1 — LEARN BASELINES")}</h4>
                        <p style={{ color: "#a9b6ce", fontSize: "14px" }}>{t("step1Desc", "AI analyses historical transaction patterns including transfer frequency, typical amount windows, daytime transaction habits, and device geofence baselines.")}</p>
                      </div>
                    </div>

                    <div className="sol-step" style={{ display: "flex", gap: "20px" }}>
                      <div className="sol-num" style={{ background: "#1e293b", color: "#38bdf8", padding: "10px 16px", borderRadius: "12px", fontWeight: "800" }}>02</div>
                      <div>
                        <h4 style={{ color: "#f8fafc", marginBottom: "4px" }}>{t("step2Title", "STEP 2 — BUILD FINANCIAL TWIN")}</h4>
                        <p style={{ color: "#a9b6ce", fontSize: "14px" }}>{t("step2Desc", "Sahayata creates an AI Financial Behaviour Twin establishing a personalised baseline: 'What is authentic behaviour for this user?'")}</p>
                      </div>
                    </div>

                    <div className="sol-step" style={{ display: "flex", gap: "20px" }}>
                      <div className="sol-num" style={{ background: "#1e293b", color: "#38bdf8", padding: "10px 16px", borderRadius: "12px", fontWeight: "800" }}>03</div>
                      <div>
                        <h4 style={{ color: "#f8fafc", marginBottom: "4px" }}>{t("step3Title", "STEP 3 — DETECT ANOMALIES & FRAUD")}</h4>
                        <p style={{ color: "#a9b6ce", fontSize: "14px" }}>{t("step3Desc", "Live AI Fraud Engine inspects incoming transfers, statement balance arithmetic continuity, EXIF metadata edits, and unverified receiver VPA handles.")}</p>
                      </div>
                    </div>

                    <div className="sol-step" style={{ display: "flex", gap: "20px" }}>
                      <div className="sol-num" style={{ background: "#1e293b", color: "#38bdf8", padding: "10px 16px", borderRadius: "12px", fontWeight: "800" }}>04</div>
                      <div>
                        <h4 style={{ color: "#f8fafc", marginBottom: "4px" }}>{t("step4Title", "STEP 4 — PROTECT & UNDERWRITE")}</h4>
                        <p style={{ color: "#a9b6ce", fontSize: "14px" }}>{t("step4Desc", "Generates real-time risk scores, explainable AI breakdown cards, flagged transaction lines, and proportionate lender recommendations for safe credit decisions.")}</p>
                      </div>
                    </div>
                  </div>

                  <aside className="flowbox" style={{ background: "rgba(15, 23, 42, 0.5)", padding: "30px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)" }} aria-label="Transaction Security pipeline">
                    <div className="flowbox-kicker" style={{ fontSize: "12px", color: "#38bdf8" }}>{t("solFlow", "Digital Lending Security Pipeline")}</div>
                    <h3 style={{ fontSize: "18px", color: "#fff", margin: "10px 0" }}>{t("flowTitle", "AI Transaction & Fraud Intelligence")}</h3>
                    <div className="flow-visual" style={{ margin: "20px 0" }}>
                      <div className="flow-node"><b>{t("flowWorker", "Digital Signals")}</b></div>
                      <div className="flow-connector">01</div>
                      <div className="flow-node"><b>{t("flowScore", "Fraud Inspection")}</b></div>
                      <div className="flow-connector">02</div>
                      <div className="flow-node"><b>{t("flowBank", "Verified Signal")}</b></div>
                    </div>
                    <p className="flow-note" style={{ fontSize: "12px", color: "#a9b6ce" }}><ShieldCheck size={15} /> {t("solNote", "Flagging suspicious signals for verification rather than automatically declining clean applicants.")}</p>
                  </aside>
                </div>
              </div>
            </section>
          </div>

          {/* USER & LENDER BENEFITS SECTION */}
          <div className="section-dark-theme home-surface" style={{ background: "linear-gradient(180deg, #0b1121, #080d1a)", color: "#f8fafc", padding: "60px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <section className="section">
              <div className="section-inner" style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px" }}>
                  
                  {/* USER BENEFITS */}
                  <div style={{ background: "linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "24px", padding: "30px" }}>
                    <div style={{ color: "#38bdf8", fontWeight: "700", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>{t("userBenefitsTitle", "Protection for Users")}</div>
                    <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#f8fafc", marginBottom: "18px" }}>{t("userBenefitsHeading", "Better Signals for Genuine Users")}</h3>
                    
                    <div style={{ display: "grid", gap: "14px" }}>
                      <div>
                        <strong style={{ color: "#38bdf8", fontSize: "14px" }}>{t("userBen1Title", "1. Personalised Analysis")}</strong>
                        <p style={{ color: "#a9b6ce", fontSize: "13px", margin: "4px 0 0 0" }}>{t("userBen1Desc", "Evaluates behaviour relative to the individual user's historical pattern instead of relying only on generic thresholds.")}</p>
                      </div>
                      <div>
                        <strong style={{ color: "#38bdf8", fontSize: "14px" }}>{t("userBen2Title", "2. Suspicious Activity Awareness")}</strong>
                        <p style={{ color: "#a9b6ce", fontSize: "13px", margin: "4px 0 0 0" }}>{t("userBen2Desc", "Unusual financial behaviour can be flagged for additional review.")}</p>
                      </div>
                      <div>
                        <strong style={{ color: "#38bdf8", fontSize: "14px" }}>{t("userBen3Title", "3. Reduced Unnecessary Friction")}</strong>
                        <p style={{ color: "#a9b6ce", fontSize: "13px", margin: "4px 0 0 0" }}>{t("userBen3Desc", "A suspicious signal triggers proportionate verification rather than automatic rejection.")}</p>
                      </div>
                      <div>
                        <strong style={{ color: "#38bdf8", fontSize: "14px" }}>{t("userBen4Title", "4. Fairer Financial Assessment")}</strong>
                        <p style={{ color: "#a9b6ce", fontSize: "13px", margin: "4px 0 0 0" }}>{t("userBen4Desc", "Context-aware analysis helps distinguish stable historical behaviour from significant deviations.")}</p>
                      </div>
                    </div>
                  </div>

                  {/* LENDER BENEFITS */}
                  <div style={{ background: "linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "24px", padding: "30px" }}>
                    <div style={{ color: "#c084fc", fontWeight: "700", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>{t("lenderBenefitsTitle", "Lender Benefits")}</div>
                    <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#f8fafc", marginBottom: "18px" }}>{t("lenderBenefitsHeading", "Safer Digital Lending Decisions")}</h3>
                    
                    <div style={{ display: "grid", gap: "14px" }}>
                      <div>
                        <strong style={{ color: "#c084fc", fontSize: "14px" }}>{t("lenderBen1Title", "• AI-assisted anomaly detection")}</strong>
                        <p style={{ color: "#a9b6ce", fontSize: "13px", margin: "4px 0 0 0" }}>{t("lenderBen1Desc", "Automated 8-layer identification of unusual transaction timing and amount spikes.")}</p>
                      </div>
                      <div>
                        <strong style={{ color: "#c084fc", fontSize: "14px" }}>{t("lenderBen2Title", "• Suspicious financial signals highlighted")}</strong>
                        <p style={{ color: "#a9b6ce", fontSize: "13px", margin: "4px 0 0 0" }}>{t("lenderBen2Desc", "Flags potential image tampering, EXIF edits, and velocity anomalies.")}</p>
                      </div>
                      <div>
                        <strong style={{ color: "#c084fc", fontSize: "14px" }}>{t("lenderBen3Title", "• Explainable risk indicators")}</strong>
                        <p style={{ color: "#a9b6ce", fontSize: "13px", margin: "4px 0 0 0" }}>{t("lenderBen3Desc", "Detailed reasoning behind every flagged transaction for risk analyst confidence.")}</p>
                      </div>
                      <div>
                        <strong style={{ color: "#c084fc", fontSize: "14px" }}>{t("lenderBen4Title", "• Prioritised verification workflow")}</strong>
                        <p style={{ color: "#a9b6ce", fontSize: "13px", margin: "4px 0 0 0" }}>{t("lenderBen4Desc", "High-priority review queue for applicants with significant anomalous signals.")}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          </div>

          {/* GOVERNMENT SCHEMES SECTION (DARK ATMOSPHERIC AI SPACE THEME) */}
          <div className="section-dark-theme home-surface home-surface-schemes" style={{ background: "linear-gradient(180deg, #0a1020, #080c18)", color: "#f8fafc", padding: "60px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <section className="section" id="schemes-section">
              <div className="section-inner" style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 20px" }}>
                <div className="eyebrow" style={{ color: "#38bdf8", fontWeight: "700" }}>{t("schemeEyebrow")}</div>
                <h2 className="section-title" style={{ color: "#f8fafc", fontSize: "32px", fontWeight: "800" }}>{t("schemeTitle")}</h2>
                <p className="section-sub" style={{ color: "#a9b6ce", fontSize: "16px", marginBottom: "30px" }}>{t("schemeSub")}</p>

                <div className="scheme-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
                  {translatedSchemes.map((scheme) => {
                    const Icon = SCHEME_ICONS[scheme.name] || BadgeCheck;
                    return (
                      <div key={scheme.name} style={{ background: "linear-gradient(145deg, rgba(22,36,64,0.88), rgba(11,19,36,0.88))", border: "1px solid rgba(132,179,255,0.15)", borderRadius: "18px", padding: "24px", boxShadow: "0 18px 45px rgba(0,0,0,0.25)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                          <span style={{ background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8", padding: "10px", borderRadius: "12px" }}><Icon size={22} /></span>
                          <div>
                            <h4 style={{ margin: 0, color: "#f8fafc", fontSize: "16px", fontWeight: "700" }}>{scheme.name}</h4>
                            <span style={{ fontSize: "12px", color: "#8ea3c5" }}>{scheme.sub}</span>
                          </div>
                        </div>
                        <p style={{ fontSize: "13px", color: "#a9b6ce", lineHeight: "1.5" }}>{scheme.desc}</p>
                        <span style={{ display: "inline-block", marginTop: "10px", background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8", padding: "4px 12px", borderRadius: "99px", fontSize: "11px", fontWeight: "600" }}>{scheme.tag}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* INTERACTIVE APPLICATION JOURNEY SECTION */}
          <div className="section-dark-theme home-surface home-surface-journey" style={{ paddingTop: "20px" }}>
            <section className="components-section" id="application-journey" style={{ padding: "0 20px" }}>
              <div className="components-inner" style={{ maxWidth: "1240px", margin: "0 auto" }}>
                {user && (
                  <div style={{ marginBottom: "28px" }}>
                    <LoggedInJourneyDashboard
                      user={user}
                      journeyStage={journeyStage}
                      activeJourneyStep={activeJourneyStep}
                      setActiveJourneyStep={setActiveJourneyStep}
                      eligibleAmount={eligibleAmount}
                      applicationId={applicationId}
                      onOpenAuth={() => setAuthMode("login")}
                      onTriggerVoice={() => {
                        const micBtn = document.querySelector(".floating-mic-button");
                        if (micBtn) micBtn.click();
                      }}
                      lang={lang}
                      t={t}
                    />
                  </div>
                )}

                <ApplicationJourneySuite
                  user={user}
                  journeyStage={journeyStage}
                  setJourneyStage={setJourneyStage}
                  activeJourneyStep={activeJourneyStep}
                  setActiveJourneyStep={setActiveJourneyStep}
                  eligibleAmount={eligibleAmount}
                  setEligibleAmount={setEligibleAmount}
                  applicationId={applicationId}
                  setApplicationId={setApplicationId}
                  setAuthMode={setAuthMode}
                  lang={lang}
                  t={t}
                />

                {/* ADVANCED ANALYTICS & CREDIT HISTORY INSIGHTS SUITE */}
                <AdvancedAnalyticsSection eligibleAmount={eligibleAmount} lang={lang} t={t} />
              </div>
            </section>
          </div>
        </main>
      )}

      {/* FOOTER (HIDDEN ON BANK DASHBOARD & AI PAGE) */}
      {currentPath !== "/financial-twin" && currentPath !== "/admin" && currentPath !== "/admin-dashboard" && (
        <footer className="footer">
          <div className="footer-inner">
            <p>{t("footerCopyright")}</p>
            <div className="footer-links">
              {[
                { label: t("footerPolicy"), key: "policy" },
                { label: t("footerPrivacy"), key: "privacy" },
                { label: t("footerAccessibility"), key: "access" },
                { label: t("footerSitemap"), key: "sitemap" },
                { label: t("footerContact"), key: "contact" }
              ].map(({ label, key }) => (
                <a key={key} href="#" onClick={(e) => e.preventDefault()}>{label}</a>
              ))}
            </div>
            <div className="footer-tricolor">
              <div style={{ background: "#ff9933" }} />
              <div style={{ background: "#ffffff" }} />
              <div style={{ background: "#138808" }} />
            </div>
          </div>
        </footer>
      )}

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSuccess={handleAuthSuccess}
          lang={lang}
        />
      )}

      {onboardingOpen && <OnboardingFlow lang={lang} onClose={() => setOnboardingOpen(false)} onComplete={() => { setOnboardingOpen(false); scrollTo("application-journey"); }} />}

      {currentPath !== "/financial-twin" && currentPath !== "/admin" && currentPath !== "/admin-dashboard" && (
        <VoiceAssistant
          lang={lang}
          changeLang={changeLang}
          navigateTo={navigateTo}
          onTriggerStep={(stepNum) => {
            setActiveJourneyStep(stepNum);
            setJourneyStage((curr) => Math.max(curr, stepNum));
          }}
          onOpenAdvanced={(open) => setAdvancedToolsOpen(open)}
          onOpenOnboarding={() => setOnboardingOpen(true)}
        />
      )}
    </div>
  );
}
