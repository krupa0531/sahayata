import fs from "fs";

const fullAppCode = `import { useCallback, useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import "./App.css";
import "./polish.css";
import { checkHealth, getDashboard, getSchemes } from "./api";
import AuthModal from "./components/AuthModal";
import Calculator from "./components/Calculator";
import DigitalTracker from "./components/DigitalTracker";
import SachetPlanner from "./components/SachetPlanner";
import ProgressiveReg from "./components/ProgressiveReg";
import SocialSecurity from "./components/SocialSecurity";
import ApplicationStatus from "./components/ApplicationStatus";
import KycDocuments from "./components/KycDocuments";
import UpiCreditEngine from "./components/UpiCreditEngine";
import UPIHistoryReport from "./components/UPIHistoryReport";
import IndiaGlobeHero from "./components/IndiaGlobeHero";
import SpeechButton from "./components/SpeechButton";
import VoiceAssistant from "./components/VoiceAssistant";
import GovernmentSchemesGuide from "./components/GovernmentSchemesGuide";
import HelpCenter from "./components/HelpCenter";
import FinancialTwinModule from "./components/FinancialTwinModule";
import AdminAnalyticsModule from "./components/AdminAnalyticsModule";

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

const PROBLEMS = [
  { Icon: TrendingUp, title: "Roz ki kamai, roz ka kharcha", desc: "Gig aur daily wage workers ki income regular nahi hoti. Bimari, mausam ya slow sales ke din repayment capacity ko turant affect karte hain.", delay: 0 },
  { Icon: FileX2, title: "Formal documents ki kami", desc: "Salary slip, ITR aur employer contract na hone ki wajah se workers traditional underwriting mein pass nahi hote.", delay: 80 },
  { Icon: Scale, title: "Small loans ka processing cost high", desc: "Rs 10,000 loan process karna bhi bank ke liye operationally expensive hota hai, isliye chhote borrowers ignore ho jate hain.", delay: 160 },
  { Icon: WalletCards, title: "Collateral aur CIBIL history nahi", desc: "Secured asset na hone aur 'new to credit' status ki wajah se automatic rejection common ho jata hai.", delay: 240 },
];

const SOLUTIONS = [
  { num: "1", title: "UPI history se alternate credit score", desc: "Daily QR receipts aur cash-flow pattern se repayment capacity estimate hoti hai." },
  { num: "2", title: "Daily micro repayment", desc: "Monthly EMI ke bajay Rs 100 per day jaise sachet payments income cycle ke saath sync hote hain." },
  { num: "3", title: "Bank + FinTech co-lending", desc: "FinTech onboarding aur collection handle karta hai; bank lower-risk funding provide karta hai." },
];

const ROADMAP = [
  { phase: "Phase 1 - Foundation", title: "Identity and onboarding", items: ["e-Shram registration", "Jan Dhan account linkage", "e-KYC with geo-tagging"], delay: 0 },
  { phase: "Phase 2 - Credit", title: "Alternate underwriting", items: ["UPI-based dynamic score", "NBFC co-lending partnerships", "Sachet repayment rails"], delay: 100 },
  { phase: "Phase 3 - Security", title: "Long-term safety nets", items: ["PM-SYM pension adoption", "SVANidhi to commercial credit", "Digital literacy programmes"], delay: 200 },
];

const TRANSLATIONS = {
  en: {
    brandTitle: "Sahayata",
    brandSub: "Worker Financial Support Portal",
    navHome: "Home",
    navAbout: "About Us",
    navHelp: "Help Center",
    apiConnected: "API Connected",
    missionBadge: "Mission Mode - Active 2026",
    heroHeading: "Financial support for gig workers, delivery partners and daily wage earners.",
    heroSubtitle: "A single-window platform for workers with daily income cycles: identity setup, quick eligibility checks, sachet loan planning and live application tracking.",
    btnApply: "Apply for support",
    btnCheck: "Check eligibility",
    trustEkyc: "e-KYC ready",
    trustSachet: "Sachet loans",
    trustWorker: "Worker-first",
    cardKicker: "Gig + Daily Wage Support",
    cardTitle: "Fast access for delivery, street work and daily labour.",
    cardLimit: "working capital",
    cardTime: "eligibility check",
    probEyebrow: "Identify the Obstacles",
    probTitle: "Why is formal credit out of reach?",
    probSub: "Understand the main barriers for unorganised workers in simple language.",
    solEyebrow: "Our Solution",
    solTitle: "Three-Pillar Alternate Credit Architecture",
    solSub: "Government, banks, and FinTechs collaborating to make small-ticket credit viable.",
    solFlow: "Credit Flow Pipeline",
    solArrow: "to",
    solNote: "Digital e-KYC, UPI transactions and local profiling eliminate the need for physical branch visits.",
    schemeEyebrow: "Government Schemes",
    schemeTitle: "Which scheme fits your needs?",
    schemeSub: "Compare credit, banking, pension, and identity welfare programs in one place.",
    toolEyebrow: "Interactive Tools",
    toolTitle: "Application Journey Suite",
    toolSub: "From real-time eligibility calculator to status tracker — fully integrated with the backend.",
    roadEyebrow: "Implementation Roadmap",
    roadTitle: "The Road Ahead",
    roadSub: "Phased rollout from digital identity to formal credit.",
    adminLink: "Admin ML Console",
    userLink: "Worker Portal",
  },
  hi: {
    brandTitle: "सहायता",
    brandSub: "श्रमिक वित्तीय सहायता पोर्टल",
    navHome: "होम",
    navAbout: "हमारे बारे में",
    navHelp: "सहायता केंद्र",
    apiConnected: "API कनेक्टेड",
    missionBadge: "मिशन मोड - सक्रिय 2026",
    heroHeading: "गिग वर्कर्स, डिलीवरी पार्टनर्स और दैनिक वेतन भोगियों के लिए वित्तीय सहायता।",
    heroSubtitle: "दैनिक आय चक्र वाले श्रमिकों के लिए एक एकल मंच: पहचान सेटअप, त्वरित पात्रता जांच, ऋण योजना और लाइव आवेदन ट्रैकिंग।",
    btnApply: "सहायता के लिए आवेदन करें",
    btnCheck: "पात्रता जांचें",
    trustEkyc: "e-KYC तैयार",
    trustSachet: "सचेत ऋण",
    trustWorker: "श्रमिक-प्रथम",
    cardKicker: "गिग + दैनिक वेतन सहायता",
    cardTitle: "डिलीवरी, स्ट्रीट वर्क और दैनिक श्रम के लिए त्वरित पहुंच।",
    cardLimit: "कार्यशील पूंजी",
    cardTime: "पात्रता जांच",
    probEyebrow: "बाधाओं की पहचान करें",
    probTitle: "औपचारिक ऋण पहुंच से बाहर क्यों है?",
    probSub: "असंगठित श्रमिकों के लिए मुख्य बाधाओं को सरल भाषा में समझें।",
    solEyebrow: "हमारा समाधान",
    solTitle: "तीन स्तंभों की क्रेडिट वास्तुकला",
    solSub: "सरकार, बैंक और फिनटेक मिलकर छोटे ऋणों को व्यावहारिक बनाते हैं।",
    solFlow: "क्रेडिट प्रवाह",
    solArrow: "से",
    solNote: "डिजिटल e-KYC, यूपीआई लेनदेन और स्थानीय प्रोफाइलिंग से बैंक जाने की आवश्यकता समाप्त होती है।",
    schemeEyebrow: "सरकारी योजनाएं",
    schemeTitle: "आपके लिए कौन सी योजना उपयुक्त है?",
    schemeSub: "ऋण, बैंकिंग, पेंशन और पहचान कार्यक्रमों की एक जगह तुलना करें।",
    toolEyebrow: "इंटरएक्टिव टूल",
    toolTitle: "आवेदन यात्रा टूल",
    toolSub: "पात्रता कैलकुलेटर से लेकर स्टेटस ट्रैकर तक — सब कुछ लाइव जुड़ा हुआ है।",
    roadEyebrow: "कार्यान्वयन रोडमैप",
    roadTitle: "आगे का रास्ता",
    roadSub: "डिजिटल पहचान से औपचारिक ऋण तक चरणबद्ध रोलआउट।",
    adminLink: "एडमिन एमएल कंसोल",
    userLink: "श्रमिक पोर्टल",
  },
  gu: {
    brandTitle: "સહાયતા",
    brandSub: "શ્રમિક નાણાકીય સહાય પોર્ટલ",
    navHome: "હોમ",
    navAbout: "અમારા વિશે",
    navHelp: "સહાયતા કેન્દ્ર",
    apiConnected: "API કનેક્ટેડ",
    missionBadge: "મિશન મોડ - સક્રિય 2026",
    heroHeading: "ગીગ વર્કર્સ, ડિલિવરી પાર્ટનર્સ અને દૈનિક વેતન મેળવનારાઓ માટે નાણાકીય સહાય.",
    heroSubtitle: "દૈનિક આવક ધરાવતા કામદારો માટે સિંગલ-વિન્ડો પ્લેટફોર્મ: ઓળખ સેટઅપ, ઝડપી પાત્રતા ચકાસણી અને લાઈવ અરજી ટ્રેકિંગ.",
    btnApply: "સહાય માટે અરજી કરો",
    btnCheck: "પાત્રતા ચકાસો",
    trustEkyc: "e-KYC તૈયાર",
    trustSachet: "સચેત લોન",
    trustWorker: "શ્રમિક-પ્રથમ",
    cardKicker: "ગીગ + દૈનિક વેતન સહાય",
    cardTitle: "ડિલિવરી, લારી-ગલ્લા અને દૈનિક શ્રમ માટે ઝડપી સુવિધા.",
    cardLimit: "વર્કિંગ કેપિટલ",
    cardTime: "પાત્રતા ચકાસણી",
    probEyebrow: "અડચણો ઓળખો",
    probTitle: "ઔપચારિક લોન કેમ દૂર છે?",
    probSub: "અસંગઠિત કામદારો માટેની મુખ્ય અડચણો સરળ ભાષામાં સમજો.",
    solEyebrow: "અમારું સોલ્યુશન",
    solTitle: "ત્રણ સ્તંભનું ધિરાણ માળખું",
    solSub: "સરકાર, બેંક અને ફિનટેક મળીને નાની લોનને વ્યવહારુ બનાવે છે.",
    solFlow: "ક્રેડિટ ફ્લો",
    solArrow: "થી",
    solNote: "ડિજિટલ e-KYC, UPI વ્યવહારો અને લોકલ વેરિફિકેશનથી બેંક જવાની જરૂર રહેતી નથી.",
    schemeEyebrow: "સરકારી યોજનાઓ",
    schemeTitle: "આપના માટે કઈ યોજના યોગ્ય છે?",
    schemeSub: "લોન, બેંકિંગ, પેન્શન અને ઓળખપત્રના પ્રોગ્રામ એક જ જગ્યાએ સરખાવો.",
    toolEyebrow: "ઇન્ટરેક્ટિવ ટૂલ્સ",
    toolTitle: "અરજી કરવા માટેના ટૂલ્સ",
    toolSub: "યોગ્યતા કેલ્ક્યુલેટરથી સ્ટેટસ ટ્રેકર સુધી — બધું બેકએન્ડ સાથે લાઈવ જોડાયેલું છે.",
    roadEyebrow: "યોજનાનો રોડમેપ",
    roadTitle: "આગળનો રસ્તો",
    roadSub: "ડિજિટલ ઓળખથી બેંકિંગ લોન સુધી તબક્કાવાર રોલઆઉટ.",
    adminLink: "એડમિન ML કન્સોલ",
    userLink: "કામદાર પોર્ટલ",
  }
};

const JOURNEY_COPY = {
  en: { steps: ["Check eligibility", "Complete KYC", "Submit application", "Track status"], step: "Step", eligibility: "Check your eligibility", eligibilityInfo: "Enter your daily income and expenses to see an estimated working-capital limit.", upload: "Upload KYC document", uploadInfo: "Upload one valid document to continue with your application.", application: "Submit your application", applicationInfo: "Share your work and banking details. You can track the decision after submission.", track: "Track your application", trackInfo: "See the current verification and lender-review stage in real time.", advanced: "Advanced analytics & credit history insights", optional: "Optional" },
  hi: { steps: ["पात्रता जांचें", "KYC पूरा करें", "आवेदन जमा करें", "स्थिति देखें"], step: "चरण", eligibility: "अपनी पात्रता जांचें", eligibilityInfo: "संभावित लोन सीमा देखने के लिए अपनी रोजाना आय और खर्च भरें।", upload: "KYC दस्तावेज़ अपलोड करें", uploadInfo: "आवेदन आगे बढ़ाने के लिए एक वैध दस्तावेज़ अपलोड करें।", application: "अपना आवेदन जमा करें", applicationInfo: "अपने काम और बैंक की जानकारी भरें। जमा करने के बाद स्थिति देख सकते हैं।", track: "अपना आवेदन ट्रैक करें", trackInfo: "मौजूदा सत्यापन और लेंडर रिव्यू स्थिति देखें।", advanced: "उन्नत विश्लेषण और क्रेडिट इतिहास जानकारी", optional: "वैकल्पिक" },
  gu: { steps: ["પાત્રતા ચકાસો", "KYC પૂરું કરો", "અરજી સબમિટ કરો", "સ્થિતિ ટ્રેક કરો"], step: "તબક્કો", eligibility: "તમારી પાત્રતા ચકાસો", eligibilityInfo: "લોનની સીમા જાણવા માટે તમારી રોજિંદી આવક અને ખર્ચ ભરો.", upload: "KYC દસ્તાવેજ અપલોડ કરો", uploadInfo: "અરજી આગળ વધારવા માટે એક માન્ય દસ્તાવેજ અપલોડ કરો.", application: "તમારી અરજી સબમિટ કરો", applicationInfo: "તમારા કામ અને બેંકની માહિતી ભરો.", track: "તમારી અરજી ટ્રેક કરો", trackInfo: "હાલમાં ચાલી રહેલી ચકાસણી જોઈ શકો.", advanced: "અદ્યતન યુપીઆઈ ક્રેડિટ વિશ્લેષણ", optional: "વૈકલ્પિક" }
};

export default function App() {
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [ticker, setTicker] = useState(FALLBACK_TICKER);
  const [schemes, setSchemes] = useState([]);
  const [apiOnline, setApiOnline] = useState(false);
  const [eligibleAmount, setEligibleAmount] = useState(15000);
  const [applicationId, setApplicationId] = useState(null);
  const [journeyStage, setJourneyStage] = useState(1);
  const [activeJourneyStep, setActiveJourneyStep] = useState(1);
  const [advancedToolsOpen, setAdvancedToolsOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState(() => localStorage.getItem("sahayata_lang") || "en");
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

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
  };

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("sahayata_lang", newLang);
  };

  const t = (key, fallback) => {
    return TRANSLATIONS[lang]?.[key] || fallback;
  };
  const journey = JOURNEY_COPY[lang] || JOURNEY_COPY.en;

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

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const translatedSchemes = [
    { name: "PM SVANidhi", sub: "Street vendors ke liye", desc: "Rs 10,000 se Rs 50,000 tak collateral-free working capital loan.", tag: "Street vendors" },
    { name: "Jan Dhan Yojana", sub: "Basic banking access", desc: "Zero-balance bank account, overdraft support, insurance cover.", tag: "All workers" },
    { name: "PM-SYM Pension", sub: "Old-age security", desc: "Small daily contribution ke saath government matching support.", tag: "18-40 years" },
    { name: "e-Shram Portal", sub: "Digital worker identity", desc: "Unorganised workers ke liye national ID aur scheme discovery.", tag: "Free" },
  ];

  return (
    <div className="app-root-shell">
      {/* GLOBAL NAVBAR */}
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
          
          <nav className="simple-nav" aria-label="Main navigation">
            <a href="#" className={\`nav-item \${currentPath === "/" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/"); }}>
              {t("navHome", "Home")}
            </a>
            <a href="#" className={\`nav-item \${currentPath === "/financial-twin" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/financial-twin"); }}>
              🤖 Sai AI Twin
            </a>
            <a href="#" className={\`nav-item \${currentPath === "/admin" || currentPath === "/admin-dashboard" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/admin"); }}>
              📊 Admin ML Console
            </a>
            <a href="#" className={\`nav-item \${currentPath === "/about" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/about"); }}>
              {t("navAbout", "About Us")}
            </a>
            <a href="#" className={\`nav-item \${currentPath === "/help" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/help"); }}>
              {t("navHelp", "Help Center")}
            </a>
          </nav>
          
          <div className="header-actions">
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

            <button
              className="btn-primary-sm"
              style={{ background: "linear-gradient(135deg, #00e5ff, #3b82f6)", color: "#050816", fontWeight: "800" }}
              onClick={() => navigateTo("/financial-twin")}
            >
              Start AI Chat
            </button>
          </div>
        </div>
      </header>

      {/* DYNAMIC ROUTER VIEW */}
      {currentPath === "/financial-twin" ? (
        <FinancialTwinModule lang={lang} navigateTo={navigateTo} />
      ) : currentPath === "/admin" || currentPath === "/admin-dashboard" ? (
        <AdminAnalyticsModule lang={lang} navigateTo={navigateTo} />
      ) : currentPath === "/about" ? (
        <GovernmentSchemesGuide lang={lang} />
      ) : currentPath === "/help" ? (
        <HelpCenter lang={lang} navigateTo={navigateTo} />
      ) : (
        /* MAIN HOMEPAGE WITH PULSING INDIA EARTH GLOBE & WHITE-BLUE ATMOSPHERIC THEME */
        <>
          {/* CINEMATIC HERO SECTION WITH INDIA EARTH PULSE GLOBE */}
          <section className="hero">
            <IndiaGlobeHero lang={lang} />
            <div className="hero-inner">
              <div className="hero-text">
                <div className="hero-badge">
                  <span className="pulse-dot" />
                  {t("missionBadge", "Mission Mode - Active 2026")}
                </div>
                <h2>
                  {t("heroHeading", "Financial support for gig workers, delivery partners and daily wage earners.")}
                  <SpeechButton text={\`\${t("heroHeading")}. \${t("heroSubtitle")}\`} lang={lang} />
                </h2>
                <p>{t("heroSubtitle", "A single-window platform for workers with daily income cycles: identity setup, quick eligibility checks, sachet loan planning and live application tracking.")}</p>
                <div className="hero-btns">
                  <button className="btn-primary" onClick={() => scrollTo("application-journey")}>{t("btnApply", "Apply for support")}</button>
                  <button className="btn-ghost" onClick={() => scrollTo("application-journey")}>{t("btnCheck", "Check eligibility")}</button>
                </div>
                <div className="hero-trust">
                  <span><ShieldCheck size={17} /> {t("trustEkyc", "e-KYC ready")}</span>
                  <span><Banknote size={17} /> {t("trustSachet", "Sachet loans")}</span>
                  <span><BriefcaseBusiness size={17} /> {t("trustWorker", "Worker-first")}</span>
                </div>
                <div className="hero-proof-grid" aria-label="Sahayata service highlights">
                  <div><strong>5 min</strong><span>eligibility check</span></div>
                  <div><strong>₹10k–₹50k</strong><span>working capital</span></div>
                  <div><strong>UPI-led</strong><span>fairer credit signal</span></div>
                </div>
              </div>
            </div>
          </section>

          {/* PROBLEM OBSTACLES SECTION */}
          <div className="section-dark-theme">
            <section className="section" id="problem-section">
              <div className="section-inner">
                <div className="eyebrow">{t("probEyebrow", "Identify the obstacles")}</div>
                <h2 className="section-title">{t("probTitle", "Formal credit door kyu hai?")}</h2>
                <p className="section-sub">{t("probSub", "Unorganised workers ke liye main barriers ko aasan bhasha mein samjhein.")}</p>
                <div className="prob-grid">
                  {PROBLEMS.map(({ Icon, title, desc }) => (
                    <div key={title} className="prob-card">
                      <div className="prob-icon"><Icon size={24} /></div>
                      <h3>{title}</h3>
                      <p>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* THREE PILLAR SOLUTION SECTION */}
          <div className="section-dark-theme">
            <section className="section section-solution">
              <div className="section-inner">
                <div className="eyebrow">{t("solEyebrow", "Hamaara samadhan")}</div>
                <h2 className="section-title">{t("solTitle", "Teen stambh ki credit architecture")}</h2>
                <p className="section-sub">{t("solSub", "Sarkar, bank aur FinTech milkar small-ticket credit ko practical banate hain.")}</p>
                <div className="sol-layout">
                  <div className="sol-steps">
                    {SOLUTIONS.map(({ num, title, desc }) => (
                      <div key={num} className="sol-step">
                        <div className="sol-num">{num}</div>
                        <div><h4>{title}</h4><p>{desc}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* GOVERNMENT SCHEMES SECTION (BLUE & WHITE THEME) */}
          <div className="section-light-theme" style={{ background: "#F5F5F7", color: "#090e1a", padding: "60px 0" }}>
            <section className="section" id="schemes-section">
              <div className="section-inner" style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 20px" }}>
                <div className="eyebrow" style={{ color: "#0284c7", fontWeight: "700" }}>{t("schemeEyebrow", "Sarkari yojanayen")}</div>
                <h2 className="section-title" style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800" }}>{t("schemeTitle", "Which scheme fits you best?")}</h2>
                <p className="section-sub" style={{ color: "#64748b", fontSize: "16px", marginBottom: "30px" }}>{t("schemeSub", "Credit, banking, pension aur identity programs ko ek jagah compare karein.")}</p>
                
                <div className="scheme-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
                  {translatedSchemes.map((scheme, i) => {
                    const Icon = SCHEME_ICONS[scheme.name] || BadgeCheck;
                    return (
                      <div key={scheme.name} style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "18px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                          <span style={{ background: "rgba(2, 132, 199, 0.1)", color: "#0284c7", padding: "10px", borderRadius: "12px" }}><Icon size={22} /></span>
                          <div>
                            <h4 style={{ margin: 0, color: "#0f172a", fontSize: "16px", fontWeight: "700" }}>{scheme.name}</h4>
                            <span style={{ fontSize: "12px", color: "#64748b" }}>{scheme.sub}</span>
                          </div>
                        </div>
                        <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>{scheme.desc}</p>
                        <span style={{ display: "inline-block", marginTop: "10px", background: "rgba(2, 132, 199, 0.08)", color: "#0284c7", padding: "4px 12px", borderRadius: "99px", fontSize: "11px", fontWeight: "600" }}>{scheme.tag}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* INTERACTIVE APPLICATION JOURNEY SECTION */}
          <div className="section-dark-theme">
            <section className="components-section" id="application-journey">
              <div className="components-inner">
                <div className="section-heading">
                  <div className="eyebrow">{t("toolEyebrow", "Interactive tools")}</div>
                  <h2 className="section-title">Application journey tools</h2>
                  <p className="section-sub">{t("toolSub", "Eligibility calculator se status tracker tak — sab backend se live connected.")}</p>
                </div>
                <div className="journey-layout-grid">
                  {/* Left Column Stepper */}
                  <div className="journey-timeline-sidebar">
                    {[
                      { stepNum: 1, name: "Check eligibility" },
                      { stepNum: 2, name: "Upload KYC & AI Fraud Check" },
                      { stepNum: 3, name: "Submit application" },
                      { stepNum: 4, name: "Track status" }
                    ].map((st) => (
                      <button
                        key={st.stepNum}
                        type="button"
                        onClick={() => setActiveJourneyStep(st.stepNum)}
                        className={\`journey-timeline-step-card \${activeJourneyStep === st.stepNum ? "active" : ""}\`}
                      >
                        <div className="step-circle-indicator">
                          <span className="circle-number">{st.stepNum}</span>
                        </div>
                        <div className="step-card-text">
                          <span className="step-label-num">Step {st.stepNum}</span>
                          <span className="step-label-name">{st.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Right Column Step Form Panel */}
                  <div className="journey-active-content-panel">
                    {activeJourneyStep === 1 && <Calculator onEligibilityChange={handleEligibilityChange} lang={lang} />}
                    {activeJourneyStep === 2 && <KycDocuments onUploaded={() => { setJourneyStage(3); setActiveJourneyStep(3); }} user={user} onLoginTrigger={() => setAuthMode("login")} lang={lang} />}
                    {activeJourneyStep === 3 && <ProgressiveReg requestedAmount={eligibleAmount || 15000} onApplicationSubmit={handleApplicationSubmit} lang={lang} />}
                    {activeJourneyStep === 4 && <ApplicationStatus applicationId={applicationId} user={user} lang={lang} />}
                  </div>
                </div>

                {/* ADVANCED ANALYTICS (OPTIONAL) ACCORDION DROPDOWN */}
                <details className="advanced-tools" open={advancedToolsOpen} onToggle={(event) => setAdvancedToolsOpen(event.currentTarget.open)} style={{ marginTop: "40px", background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "20px" }}>
                  <summary style={{ fontSize: "16px", fontWeight: "700", color: "#38bdf8", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {journey.advanced} <span style={{ fontSize: "12px", background: "rgba(56, 189, 248, 0.15)", padding: "4px 12px", borderRadius: "99px", color: "#38bdf8" }}>{journey.optional}</span>
                  </summary>
                  {advancedToolsOpen && (
                    <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
                      <div className="advanced-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                        <DigitalTracker lang={lang} />
                        <SachetPlanner loanAmount={eligibleAmount || 15000} lang={lang} />
                      </div>
                      <div className="advanced-full">
                        <SocialSecurity lang={lang} />
                      </div>
                      <div className="advanced-full">
                        <UpiCreditEngine loanAmount={eligibleAmount || 15000} adminView={false} lang={lang} />
                      </div>
                      {/* UPI ID STATEMENT CREDIT REPORT GENERATOR */}
                      <div className="advanced-full">
                        <UPIHistoryReport lang={lang} />
                      </div>
                    </div>
                  )}
                </details>
              </div>
            </section>
          </div>
        </>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <p>{t("footerCopyright", "© 2026 Bharat Sarkar. Ministry of Finance, Government of India.")}</p>
          <div className="footer-links">
            {["Website policy", "Privacy", "Accessibility", "Sitemap", "Contact"].map((link) => (
              <a key={link} href="#" onClick={(e) => e.preventDefault()}>{link}</a>
            ))}
          </div>
          <div className="footer-tricolor">
            <div style={{ background: "#ff9933" }} />
            <div style={{ background: "#ffffff" }} />
            <div style={{ background: "#138808" }} />
          </div>
        </div>
      </footer>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSuccess={setUser}
        />
      )}

      {currentPath !== "/financial-twin" && (
        <VoiceAssistant lang={lang} changeLang={changeLang} navigateTo={navigateTo} />
      )}
    </div>
  );
}
`;

fs.writeFileSync("src/App.jsx", fullAppCode, "utf8");
console.log("Successfully restored Advanced Analytics accordion, UPI ID credit report generator, and Blue-White theme sections in App.jsx");
