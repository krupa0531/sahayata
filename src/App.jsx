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

const ROADMAP = [
  { phase: "Phase 1 - Foundation", title: "Identity and onboarding", items: ["e-Shram registration", "Jan Dhan account linkage", "e-KYC with geo-tagging"], delay: 0 },
  { phase: "Phase 2 - Credit", title: "Alternate underwriting", items: ["UPI-based dynamic score", "NBFC co-lending partnerships", "Sachet repayment rails"], delay: 100 },
  { phase: "Phase 3 - Security", title: "Long-term safety nets", items: ["PM-SYM pension adoption", "SVANidhi to commercial credit", "Digital literacy programmes"], delay: 200 },
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
    // New registration or user session starts fresh at Step 1
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

  const handleEligibilityChange = (amount) => {
    setEligibleAmount(amount);
    setJourneyStage((current) => {
      const next = Math.max(current, 2);
      setActiveJourneyStep(next);
      return next;
    });
  };

  const handleApplicationSubmit = (appId) => {
    setApplicationId(appId);
    setJourneyStage(4);
    setActiveJourneyStep(4);
  };

  const beginSupportJourney = () => setOnboardingOpen(true);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const problemsList = [
    {
      Icon: Banknote,
      title: t("prob1Title", "Daily Income, Daily Expenses"),
      desc: t("prob1Desc", "Gig and daily wage workers lack regular monthly salary cycles. Illness, weather disruptions, or slow sales days immediately impact traditional loan repayment."),
    },
    {
      Icon: FileX2,
      title: t("prob2Title", "Lack of Formal Documents"),
      desc: t("prob2Desc", "Without salary slips, ITR tax filings, and formal employment contracts, informal workers fail traditional bank credit checks."),
    },
    {
      Icon: Scale,
      title: t("prob3Title", "High Processing Cost for Small Loans"),
      desc: t("prob3Desc", "Processing a ₹10,000 micro-loan costs banks the same operational overhead as large loans, leading to routine neglect of micro-borrowers."),
    },
    {
      Icon: TrendingUp,
      title: t("prob4Title", "No Collateral or CIBIL History"),
      desc: t("prob4Desc", "Having no physical pledged assets and a 'New to Credit' 0 CIBIL score leads to automatic credit rejection by conventional banking algorithms."),
    },
  ];

  const solutionsList = [
    {
      num: "01",
      title: t("sol1Title", "Alternate Credit Scoring from UPI History"),
      desc: t("sol1Desc", "Daily QR transaction velocity and cashflow patterns estimate actual net repayment capacity without CIBIL score."),
    },
    {
      num: "02",
      title: t("sol2Title", "Daily Sachet Micro-Repayments (EDI)"),
      desc: t("sol2Desc", "Replaces burdensome monthly lump-sum EMIs with small daily ₹50–₹100 deductions aligned with daily cash cycles."),
    },
    {
      num: "03",
      title: t("sol3Title", "Bank + FinTech Co-Lending Rails"),
      desc: t("sol3Desc", "FinTech handles AI voice onboarding and forensic verification; public sector banks disburse low-risk subsidized capital."),
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

  const journeySteps = [
    { stepNum: 1, name: t("step1Name", "Check Eligibility") },
    { stepNum: 2, name: t("step2Name", "Complete KYC") },
    { stepNum: 3, name: t("step3Name", "Submit Application") },
    { stepNum: 4, name: t("step4Name", "Track Status") },
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
                <div className="brand-sub">{t("brandSub", "Worker Financial Support Portal")}</div>
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
                {t("navAi", "AI Assistant")}
              </a>
              <a href="#" className={`nav-item ${currentPath === "/about" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); navigateTo("/about"); }}>
                {t("navAbout", "About Us")}
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

              {/* BANK DASHBOARD BUTTON WITH BANK ICON */}
              <button
                className="btn-white-sm"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
                onClick={() => navigateTo("/admin")}
              >
                <Landmark size={17} /> {t("navBank", "Bank Dashboard")}
              </button>

              {/* REGISTER AND LOGIN BUTTONS */}
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="user-chip" style={{ background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38bdf8", padding: "6px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: "700" }}>
                    Hi, {user.full_name || user.name || "User"}
                  </span>
                  <button
                    className="btn-white-sm"
                    style={{ padding: "6px 12px", fontSize: "12px", background: "rgba(239, 68, 68, 0.15)", color: "#fca5a5", border: "1px solid rgba(239, 68, 68, 0.3)", cursor: "pointer" }}
                    onClick={handleLogout}
                  >
                    {t("navLogout", "Logout")}
                  </button>
                </div>
              ) : (
                <>
                  <button className="btn-white-sm" onClick={() => setAuthMode("register")}>{t("navRegister", "Register")}</button>
                  <button className="btn-white-sm" onClick={() => setAuthMode("login")}>{t("navLogin", "Login")}</button>
                </>
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
        /* MAIN HOMEPAGE WITH PULSING INDIA EARTH GLOBE & WHITE-BLUE ATMOSPHERIC THEME */
        <main className="home-experience">
          {/* CINEMATIC HERO SECTION WITH INDIA EARTH PULSE GLOBE */}
          <section className="hero">
            <IndiaGlobeHero lang={lang} />
            <div className="hero-inner">
              <div className="hero-text">
                <h2>
                  {t("heroHeading")}
                </h2>
                <p>{t("heroSubtitle")}</p>
                <div className="hero-btns">
                  <button className="btn-primary" onClick={beginSupportJourney}>{t("btnApply")}</button>
                  <button className="btn-ghost" onClick={() => scrollTo("application-journey")}>{t("btnCheck")}</button>
                </div>
                <div className="hero-trust">
                  <span><ShieldCheck size={17} /> {t("trustEkyc")}</span>
                  <span><Banknote size={17} /> {t("trustSachet")}</span>
                  <span><BriefcaseBusiness size={17} /> {t("trustWorker")}</span>
                </div>
                <div className="hero-safety-note"><ShieldCheck size={15} /> {t("safetyNote")}</div>
                <div className="hero-proof-grid" aria-label="Sahayata service highlights">
                  <div><strong>5 min</strong><span>{t("metricInitialCheck")}</span></div>
                  <div><strong>₹10k–₹50k</strong><span>{t("metricWorkingCapital")}</span></div>
                  <div><strong>UPI-led</strong><span>{t("metricCreditSignal")}</span></div>
                </div>
              </div>
            </div>
          </section>

          {/* PROBLEM OBSTACLES SECTION (DARK ATMOSPHERIC AI SPACE THEME) */}
          <div className="section-dark-theme home-surface home-surface-problems" style={{ background: "linear-gradient(180deg, #090f1e, #0b1121)", color: "#f8fafc", padding: "70px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <section className="section" id="problem-section">
              <div className="section-inner" style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 20px" }}>
                <div className="eyebrow" style={{ color: "#38bdf8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("probEyebrow")}</div>
                <h2 className="section-title" style={{ color: "#f8fafc", fontSize: "34px", fontWeight: "800", marginTop: "8px", marginBottom: "12px" }}>{t("probTitle")}</h2>
                <p className="section-sub" style={{ color: "#a9b6ce", fontSize: "16px", marginBottom: "36px" }}>{t("probSub")}</p>

                <div className="prob-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
                  {problemsList.map(({ Icon, title, desc }) => (
                    <div key={title} className="prob-card" style={{ background: "linear-gradient(145deg, rgba(22,36,64,0.88), rgba(11,19,36,0.88))", border: "1px solid rgba(132,179,255,0.15)", borderRadius: "20px", padding: "28px", boxShadow: "0 18px 45px rgba(0,0,0,0.25)", transition: "transform 0.2s ease, boxShadow 0.2s ease" }}>
                      <div className="prob-icon" style={{ background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8", width: "50px", height: "50px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                        <Icon size={24} />
                      </div>
                      <h3 style={{ color: "#f8fafc", fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>{title}</h3>
                      <p style={{ color: "#a9b6ce", fontSize: "14px", lineHeight: "1.6" }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* THREE PILLAR SOLUTION SECTION */}
          <div className="section-dark-theme home-surface home-surface-solution">
            <section className="section section-solution">
              <div className="section-inner">
                <div className="eyebrow">{t("solEyebrow")}</div>
                <h2 className="section-title">{t("solTitle")}</h2>
                <p className="section-sub">{t("solSub")}</p>
                <div className="sol-layout">
                  <div className="sol-steps">
                    {solutionsList.map(({ num, title, desc }) => (
                      <div key={num} className="sol-step">
                        <div className="sol-num">{num}</div>
                        <div><h4>{title}</h4><p>{desc}</p></div>
                      </div>
                    ))}
                  </div>
                  <aside className="flowbox" aria-label="Credit flow pipeline">
                    <div className="flowbox-kicker">{t("solFlow")}</div>
                    <h3>{t("flowTitle")}</h3>
                    <div className="flow-visual">
                      <div className="flow-node flow-node-worker"><span className="flow-node-icon">₹</span><div><b>{t("flowWorker")}</b><small>{t("flowWorkerSub")}</small></div></div>
                      <div className="flow-connector"><span>01</span></div>
                      <div className="flow-node flow-node-score"><span className="flow-node-icon">↗</span><div><b>{t("flowScore")}</b><small>{t("flowScoreSub")}</small></div></div>
                      <div className="flow-connector"><span>02</span></div>
                      <div className="flow-node flow-node-bank"><span className="flow-node-icon">✓</span><div><b>{t("flowBank")}</b><small>{t("flowBankSub")}</small></div></div>
                    </div>
                    <div className="flowbox-metrics"><div><strong>5 min</strong><span>{t("metricInitialCheck")}</span></div><div><strong>₹10k–₹50k</strong><span>{t("metricWorkingCapital")}</span></div></div>
                    <p className="flow-note"><ShieldCheck size={15} /> {t("solNote")}</p>
                  </aside>
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
