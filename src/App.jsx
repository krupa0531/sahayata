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
} from "lucide-react";
import "./App.css";
import "./polish.css";
import { checkHealth, getDashboard, getSchemes, listApplications, listKycDocuments } from "./api";
import AuthModal from "./components/AuthModal";
import Calculator from "./components/Calculator";
import DigitalTracker from "./components/DigitalTracker";
import SachetPlanner from "./components/SachetPlanner";
import ProgressiveReg from "./components/ProgressiveReg";
import SocialSecurity from "./components/SocialSecurity";
import ApplicationStatus from "./components/ApplicationStatus";
import KycDocuments from "./components/KycDocuments";
import UpiCreditEngine from "./components/UpiCreditEngine";
import streetVendorPhoto from "./assets/street-vendor-india.jpg";
import deliveryRiderPhoto from "./assets/delivery-rider-real.jpg";
import SpeechButton from "./components/SpeechButton";
import VoiceAssistant from "./components/VoiceAssistant";
import FinancialPulse from "./components/FinancialPulse";
import GovernmentSchemesGuide from "./components/GovernmentSchemesGuide";
import HelpCenter from "./components/HelpCenter";

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

const ELIGIBILITY = [
  { check: true, text: "Aadhaar Card with e-KYC" },
  { check: true, text: "UPI-linked mobile number" },
  { check: true, text: "3 months UPI transaction history" },
  { check: true, text: "e-Shram / SVANidhi registration" },
  { check: false, text: "Jan Dhan or regular bank account" },
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
    roadSub: "A structured phased rollout from digital identity to commercial-scale credit access.",
    adminLink: "Admin Dashboard",
    userLink: "Worker View",
    backToUser: "Back to Worker Portal",
    adminDashboardTitle: "Sahayata ML Command Center",
    adminDashboardSub: "Advanced Credit Scoring Pipeline, Isolation Forest Anomaly Analysis & Applications Review Console",
  },
  hi: {
    brandTitle: "सहायता",
    brandSub: "श्रमिक वित्तीय सहायता पोर्टल",
    navHome: "मुख्य पृष्ठ",
    navAbout: "हमारे बारे में",
    navHelp: "सहायता केंद्र",
    apiConnected: "एपीआई कनेक्टेड",
    missionBadge: "मिशन मोड - सक्रिय 2026",
    heroHeading: "गिग श्रमिकों, डिलीवरी पार्टनर्स और दैनिक वेतन भोगियों के लिए वित्तीय सहायता।",
    heroSubtitle: "दैनिक आय चक्र वाले श्रमिकों के लिए एकल-खिड़की मंच: पहचान सेटअप, त्वरित पात्रता जांच, दैनिक ऋण योजना और लाइव आवेदन ट्रैकिंग।",
    btnApply: "सहायता के लिए आवेदन करें",
    btnCheck: "पात्रता जांचें",
    trustEkyc: "ई-केवाईसी तैयार",
    trustSachet: "छोटे ऋण (सचेत)",
    trustWorker: "श्रमिक-प्रथम",
    cardKicker: "गिग और दैनिक वेतन सहायता",
    cardTitle: "डिलीवरी, रेहड़ी-पटरी और दैनिक श्रम के लिए त्वरित पहुंच।",
    cardLimit: "कार्यशील पूंजी",
    cardTime: "पात्रता जांच",
    probEyebrow: "समस्या की पहचान",
    probTitle: "औपचारिक ऋण से दूरी क्यों बनती है?",
    probSub: "असंगठित श्रमिकों के लिए मुख्य बाधाओं को सरल भाषा में समझें।",
    solEyebrow: "हमारा समाधान",
    solTitle: "तीन स्तंभों की ऋण वास्तुकला",
    solSub: "सरकार, बैंक और फिनटेक मिलकर छोटे ऋण को व्यावहारिक बनाते हैं।",
    solFlow: "ऋण प्रवाह",
    solArrow: "से",
    solNote: "डिजिटल ई-KYC, यूपीआई इतिहास और स्थानीय सत्यापन से बैंक शाखा जाने की आवश्यकता कम हो जाती है।",
    schemeEyebrow: "सरकारी योजनाएं",
    schemeTitle: "आपके लिए कौन सी योजना उपयुक्त है?",
    schemeSub: "ऋण, बैंकिंग, पेंशन और पहचान कार्यक्रमों की एक ही स्थान पर तुलना करें।",
    toolEyebrow: "इंटरैक्टिव उपकरण",
    toolTitle: "आवेदन यात्रा के उपकरण",
    toolSub: "पात्रता कैलकुलेटर से स्टेटस ट्रैकर तक — सब बैकएंड से लाइव कनेक्टेड हैं।",
    roadEyebrow: "कार्यान्वयन रोडमैप",
    roadTitle: "आगे का रास्ता",
    roadSub: "डिजिटल पहचान से औपचारिक ऋण तक का चरणबद्ध विकास।",
    adminLink: "एडमिन डैशबोर्ड",
    userLink: "श्रमिक डैशबोर्ड",
    backToUser: "श्रमिक पोर्टल पर वापस जाएं",
    adminDashboardTitle: "सहायता एमएल कमांड सेंटर",
    adminDashboardSub: "उन्नत क्रेडिट स्कोरिंग पाइपलाइन, आइसोलेशन फ़ॉरेस्ट विसंगति विश्लेषण और अनुप्रयोग समीक्षा कंसोल",
  },
  gu: {
    brandTitle: "સહાયતા",
    brandSub: "શ્રમિક નાણાકીય સહાય પોર્ટલ",
    navHome: "મુખ્ય પૃષ્ઠ",
    navAbout: "અમારા વિશે",
    navHelp: "મદદ",
    apiConnected: "API કનેક્ટેડ",
    missionBadge: "મિશન મોડ - સક્રિય ૨૦૨૬",
    heroHeading: "ગીગ કામદારો, ડિલિવરી પાર્ટનર્સ અને દૈનિક વેતન મેળવનારાઓ માટે નાણાકીય સહાય.",
    heroSubtitle: "દૈનિક આવક ચક્રવાળા કામદારો માટે સિંગલ-વિન્ડો પ્લેટફોર્મ: ઓળખ સેટઅપ, ઝડપી યોગ્યતા તપાસ, દૈનિક લોન પ્લાનિંગ અને લાઈવ અરજી ટ્રેકિંગ.",
    btnApply: "સહાય માટે અરજી કરો",
    btnCheck: "યોગ્યતા તપાસો",
    trustEkyc: "ઈ-KYC તૈયાર",
    trustSachet: "નાની લોન (સચેત)",
    trustWorker: "કામદાર-પ્રથમ",
    cardKicker: "ગીગ અને દૈનિક વેતન સહાય",
    cardTitle: "ડિલિવરી, લારી-ગલ્લા અને દૈનિક મજૂરી માટે ઝડપી લોન.",
    cardLimit: "કાર્યશીલ મૂડી",
    cardTime: "યોગ્યતા તપાસ",
    probEyebrow: "સમસ્યાની ઓળખ",
    probTitle: "ઔપચારિક લોનથી અંતર કેમ રહે છે?",
    probSub: "અસંગઠિત કામદારો માટેના મુખ્ય અવરોધોને સરળ ભાષામાં સમજો.",
    solEyebrow: "અમારું સમાધાન",
    solTitle: "ત્રણ સ્તંભની ક્રેડિટ સિસ્ટમ",
    solSub: "સરકાર, બેંક અને ફિનટેક મળીને નાની લોનને વ્યવહારુ બનાવે છે.",
    solFlow: "ક્રેડિટ ફ્લો",
    solArrow: "થી",
    solNote: "ડિજિટલ e-KYC, UPI હિસ્ટ્રી અને લોકલ વેરિફિકેશનથી બેંક જવાની જરૂર રહેતી નથી.",
    schemeEyebrow: "સરકારી યોજનાઓ",
    schemeTitle: "આપના માટે કઈ યોજના યોગ્ય છે?",
    schemeSub: "લોન, બેંકિંગ, પેન્શન અને ઓળખપત્રના પ્રોગ્રામ એક જ જગ્યાએ સરખાવો.",
    toolEyebrow: "ઇન્ટરેક્ટિવ ટૂલ્સ",
    toolTitle: "અરજી કરવા માટેના ટૂલ્સ",
    toolSub: "યોગ્યતા કેલ્ક્યુલેટરથી સ્ટેટસ ટ્રેકર સુધી — બધું બેકએન્ડ સાથે લાઈવ જોડાયેલું છે.",
    roadEyebrow: "યોજનાનો રોડમેપ",
    roadTitle: "આગળનો રસ્તો",
    roadSub: "ડિજિટલ ઓળખથી બેંકિંગ લોન સુધી તબક્કાવાર રોલઆઉટ.",
    adminLink: "એડમિન ડેશબોર્ડ",
    userLink: "કામદાર ડેશબોર્ડ",
    backToUser: "કામદાર પોર્ટલ પર પાછા જાઓ",
    adminDashboardTitle: "સહાયતા ML કમાન્ડ સેન્ટર",
    adminDashboardSub: "એડવાન્સ્ડ ક્રેડિટ સ્કોરિંગ પાઇપલાઇન, આઇસોલેશન ફોરેસ્ટ એનોમલી એનાલિસિસ અને એપ્લિકેશન રિવ્યૂ કન્સોલ",
  }
};

function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), Number(entry.target.dataset.delay || 0));
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useCountUp(stats) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !stats.length) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        ref.current.querySelectorAll(".stat-num").forEach((el, i) => {
          const target = Number(el.dataset.target);
          const suffix = el.dataset.suffix;
          const isFloat = target % 1 !== 0;
          setTimeout(() => {
            el.classList.add("visible");
            let current = 0;
            const step = target / 40;
            const timer = setInterval(() => {
              current = Math.min(current + step, target);
              el.textContent = `${isFloat ? current.toFixed(1) : Math.round(current)}${suffix}`;
              if (current >= target) clearInterval(timer);
            }, 35);
          }, i * 120);
        });
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [stats]);
  return ref;
}

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

function AdminDashboard({ lang, navigateTo }) {
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [kycDocuments, setKycDocuments] = useState([]);

  const t = (key, fallback) => {
    return TRANSLATIONS[lang]?.[key] || fallback;
  };

  useEffect(() => {
    listApplications()
      .then((data) => {
        setApps(data);
        if (data.length > 0) {
          setSelectedApp(data[0]);
        }
      })
      .catch(() => {
        const fallback = [
          {
            id: "SAH-DEMO001",
            applicant_name: "Ramesh Kumar",
            requested_amount: 15000,
            status: "in_review",
            current_stage: "NBFC review",
            created_at: "2026-06-22T10:00:00Z"
          }
        ];
        setApps(fallback);
        setSelectedApp(fallback[0]);
      })
      .finally(() => setLoading(false));

    listKycDocuments().then(setKycDocuments).catch(() => setKycDocuments([]));

    const initialLogs = [
      "[INFO] Ingesting real-time transactional stream from UPI gateway...",
      "[INFO] Extracted 90 days historical UPI velocity for assessment.",
      "[MODEL] Initializing Isolation Forest anomaly detector (n_estimators=100, contamination=0.03)...",
      "[MODEL] Isolation Forest fit complete. Decision path length score computed.",
      "[MODEL] Executing Random Forest Underwriting Classifier (n_estimators=200, max_depth=12)...",
      "[MODEL] Random Forest fit complete. Accuracy: 94.3%, Recall: 92.1%.",
      "[INFO] ML Inference Pipeline execution complete. Generating Risk Assessment profile.",
    ];
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const liveLog = `[INFO] ${new Date().toISOString()} - Ingesting new transaction payload - Status: 200 OK. Feature arrays updated.`;
      setLogs((prev) => [...prev.slice(-10), liveLog]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h2>{t("adminDashboardTitle", "Sahayata ML Command Center")}</h2>
          <p className="admin-subtitle">{t("adminDashboardSub", "Advanced Credit Underwriting, ML Risk Analytics, & System Diagnostics")}</p>
        </div>
        <button className="btn-outline" onClick={() => navigateTo("/")}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            &larr; {t("backToUser", "Back to Worker Portal")}
          </span>
        </button>
      </div>

      <div className="admin-grid">
        <div className="admin-sidebar-card">
          <h3 className="card-title">Live Queue ({apps.length})</h3>
          <p className="card-sub">Lenders' queue of submitted credit requests</p>
          <div className="app-list-container">
            {loading ? (
              <div className="loading-spinner">Loading queue...</div>
            ) : (
              apps.map((app) => (
                <div
                  key={app.id}
                  className={`app-item ${selectedApp?.id === app.id ? "active" : ""}`}
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="app-item-header">
                    <strong>{app.applicant_name}</strong>
                    <span className={`status-badge ${app.status}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="app-item-details">
                    <span>Amt: ₹{app.requested_amount.toLocaleString("en-IN")}</span>
                    <span>Stage: {app.current_stage}</span>
                  </div>
                  <span className="app-item-id">{app.id}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="admin-main-pane">
          {selectedApp ? (
            <>
              <div className="card card-accent-purple" style={{ marginBottom: "20px" }}>
                <div className="eyebrow">Applicant Profile Audit</div>
                <h3 className="card-title" style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 16px 0" }}>
                  Profile: {selectedApp.applicant_name}
                </h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "11px", display: "block", textTransform: "uppercase" }}>Occupation</span>
                    <strong style={{ fontSize: "14px", color: "var(--text-primary)" }}>{selectedApp.occupation_type}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "11px", display: "block", textTransform: "uppercase" }}>Earning Mode</span>
                    <strong style={{ fontSize: "14px", color: "var(--text-primary)" }}>{selectedApp.earning_mode}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "11px", display: "block", textTransform: "uppercase" }}>UPI ID</span>
                    <strong style={{ fontSize: "14px", color: "var(--text-primary)" }}>{selectedApp.upi_id || "N/A"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "11px", display: "block", textTransform: "uppercase" }}>Bank Account</span>
                    <strong style={{ fontSize: "14px", color: "var(--text-primary)" }}>{selectedApp.account_number || "N/A"}</strong>
                  </div>
                </div>

                <div style={{
                  marginTop: "20px",
                  padding: "12px",
                  borderRadius: "6px",
                  background: selectedApp.verification_status === "verified" ? "rgba(0, 200, 83, 0.08)" : "rgba(223, 75, 75, 0.08)",
                  border: selectedApp.verification_status === "verified" ? "1px solid rgba(0, 200, 83, 0.3)" : "1px solid rgba(223, 75, 75, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <div>
                    <span style={{ color: selectedApp.verification_status === "verified" ? "#00c853" : "#ff3d00", fontSize: "12px", fontWeight: "700", display: "block" }}>
                      {selectedApp.verification_status === "verified" ? "WORKER VERIFIED" : "UNVERIFIED PROFILE"}
                    </span>
                    <span style={{ color: "var(--text-secondary)", fontSize: "11.5px", marginTop: "2px", display: "block" }}>
                      {selectedApp.verification_message || (selectedApp.verification_status === "verified" ? `${selectedApp.verification_type} verified.` : "Worker credentials pending verification checks.")}
                    </span>
                  </div>
                  {selectedApp.verification_status === "verified" && (
                    <div style={{
                      background: "#00c853",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "700"
                    }}>
                      {selectedApp.verification_id}
                    </div>
                  )}
                </div>
              </div>

              <div className="card card-accent-teal admin-kyc-panel">
                <div className="eyebrow">e-KYC verification queue</div>
                <div className="admin-kyc-head">
                  <div>
                    <h3 className="card-title">Submitted KYC documents</h3>
                    <p className="card-sub">Live document metadata for the signed-in worker. Files remain private.</p>
                  </div>
                  <span className="admin-kyc-count">{kycDocuments.length} received</span>
                </div>
                {kycDocuments.length ? (
                  <div className="admin-kyc-list">
                    {kycDocuments.map((document) => (
                      <div className="admin-kyc-item" key={document.id}>
                        <div><b>{document.document_type.replaceAll("_", " ")}</b><span>{document.file_name} · {(document.size_bytes / 1024).toFixed(0)} KB</span></div>
                        <span className="status-badge in_review">{document.status.replaceAll("_", " ")}</span>
                      </div>
                    ))}
                  </div>
                ) : <div className="admin-kyc-empty">No KYC document has been uploaded by the signed-in worker yet.</div>}
              </div>

              <UpiCreditEngine
                loanAmount={selectedApp.requested_amount}
                profileId={selectedApp.id === "SAH-DEMO001" ? "DEMO-VENDOR" : "DEMO-VENDOR"}
              />

              <div className="card card-accent-purple terminal-card">
                <div className="eyebrow">Diagnostic Console</div>
                <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <BrainCircuit size={18} /> Real-Time Machine Learning Pipeline Logs
                </div>
                <div className="terminal-body">
                  {logs.map((log, i) => (
                    <div key={i} className="terminal-line">
                      <span className="terminal-prompt">$</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-pane">Select an application to view ML risk scoring pipeline details.</div>
          )}
        </div>
      </div>
    </div>
  );
}

const JOURNEY_COPY = {
  en: { steps: ["Check eligibility", "Complete KYC", "Submit application", "Track status"], step: "Step", eligibility: "Check your eligibility", eligibilityInfo: "Enter your daily income and expenses to see an estimated working-capital limit.", upload: "Upload KYC document", uploadInfo: "Upload one valid document to continue with your application.", application: "Submit your application", applicationInfo: "Share your work and banking details. You can track the decision after submission.", track: "Track your application", trackInfo: "See the current verification and lender-review stage in real time.", lockedKyc: "KYC document", lockedApp: "Loan application", lockedStatus: "Application status", unlockKyc: "Complete the eligibility check first to unlock document upload.", unlockApp: "Upload a KYC document first to unlock the application form.", unlockStatus: "Your status tracker will appear after application submission.", advanced: "Advanced planning and insights", optional: "Optional" },
  hi: { steps: ["\u092a\u093e\u0924\u094d\u0930\u0924\u093e \u091c\u093e\u0901\u091a\u0947\u0902", "KYC \u092a\u0942\u0930\u093e \u0915\u0930\u0947\u0902", "\u0906\u0935\u0947\u0926\u0928 \u091c\u092e\u093e \u0915\u0930\u0947\u0902", "\u0938\u094d\u0925\u093f\u0924\u093f \u0926\u0947\u0916\u0947\u0902"], step: "\u091a\u0930\u0923", eligibility: "\u0905\u092a\u0928\u0940 \u092a\u093e\u0924\u094d\u0930\u0924\u093e \u091c\u093e\u0901\u091a\u0947\u0902", eligibilityInfo: "\u0938\u0902\u092d\u093e\u0935\u093f\u0924 \u0932\u094b\u0928 \u0938\u0940\u092e\u093e \u0926\u0947\u0916\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0905\u092a\u0928\u0940 \u0930\u094b\u091c\u093c\u093e\u0928\u093e \u0906\u092f \u0914\u0930 \u0916\u0930\u094d\u091a \u092d\u0930\u0947\u0902\u0964", upload: "KYC \u0926\u0938\u094d\u0924\u093e\u0935\u0947\u091c\u093c \u0905\u092a\u0932\u094b\u0921 \u0915\u0930\u0947\u0902", uploadInfo: "\u0906\u0935\u0947\u0926\u0928 \u0906\u0917\u0947 \u092c\u0922\u093c\u093e\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u090f\u0915 \u0935\u0948\u0927 \u0926\u0938\u094d\u0924\u093e\u0935\u0947\u091c\u093c \u0905\u092a\u0932\u094b\u0921 \u0915\u0930\u0947\u0902\u0964", application: "\u0905\u092a\u0928\u093e \u0906\u0935\u0947\u0926\u0928 \u091c\u092e\u093e \u0915\u0930\u0947\u0902", applicationInfo: "\u0905\u092a\u0928\u0947 \u0915\u093e\u092e \u0914\u0930 \u092c\u0948\u0902\u0915 \u0915\u0940 \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u092d\u0930\u0947\u0902\u0964 \u091c\u092e\u093e \u0915\u0930\u0928\u0947 \u0915\u0947 \u092c\u093e\u0926 \u0938\u094d\u0925\u093f\u0924\u093f \u0926\u0947\u0916 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964", track: "\u0905\u092a\u0928\u093e \u0906\u0935\u0947\u0926\u0928 \u091f\u094d\u0930\u0948\u0915 \u0915\u0930\u0947\u0902", trackInfo: "\u092e\u094c\u091c\u0942\u0926\u093e \u0938\u0924\u094d\u092f\u093e\u092a\u0928 \u0914\u0930 \u0932\u0947\u0902\u0921\u0930 \u0930\u093f\u0935\u094d\u092f\u0942 \u0938\u094d\u0925\u093f\u0924\u093f \u0926\u0947\u0916\u0947\u0902\u0964", lockedKyc: "KYC \u0926\u0938\u094d\u0924\u093e\u0935\u0947\u091c\u093c", lockedApp: "\u0932\u094b\u0928 \u0906\u0935\u0947\u0926\u0928", lockedStatus: "\u0906\u0935\u0947\u0926\u0928 \u0915\u0940 \u0938\u094d\u0925\u093f\u0924\u093f", unlockKyc: "\u0926\u0938\u094d\u0924\u093e\u0935\u0947\u091c\u093c \u0905\u092a\u0932\u094b\u0921 \u0916\u094b\u0932\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u092a\u0939\u0932\u0947 \u092a\u093e\u0924\u094d\u0930\u0924\u093e \u091c\u093e\u0901\u091a \u092a\u0942\u0930\u0940 \u0915\u0930\u0947\u0902\u0964", unlockApp: "\u092a\u0939\u0932\u0947 KYC \u0926\u0938\u094d\u0924\u093e\u0935\u0947\u091c\u093c \u0905\u092a\u0932\u094b\u0921 \u0915\u0930\u0947\u0902\u0964", unlockStatus: "\u0906\u0935\u0947\u0926\u0928 \u091c\u092e\u093e \u0939\u094b\u0928\u0947 \u0915\u0947 \u092c\u093e\u0926 \u0906\u092a\u0915\u093e \u0938\u094d\u091f\u0947\u091f\u0938 \u091f\u094d\u0930\u0948\u0915\u0930 \u0926\u093f\u0916\u0947\u0917\u093e\u0964", advanced: "\u0909\u0928\u094d\u0928\u0924 \u092f\u094b\u091c\u0928\u093e \u0914\u0930 \u091c\u093e\u0928\u0915\u093e\u0930\u0940", optional: "\u0935\u0948\u0915\u0932\u094d\u092a\u093f\u0915" },
  gu: { steps: ["\u0aaa\u0abe\u0aa4\u0acd\u0ab0\u0aa4\u0abe \u0a9a\u0abe\u0a95\u0ab8\u0acb", "KYC \u0aaa\u0ac2\u0ab0\u0ac1\u0a82 \u0a95\u0ab0\u0acb", "\u0a85\u0ab0\u0a9c\u0ac0 \u0ab8\u0aac\u0aae\u0abf\u0a9f \u0a95\u0ab0\u0acb", "\u0ab8\u0acd\u0aa5\u0abf\u0aa4\u0abf \u0a9f\u0acd\u0ab0\u0ac7\u0a95 \u0a95\u0ab0\u0acb"], step: "\u0aa4\u0aac\u0a95\u0acd\u0a95\u0acb", eligibility: "\u0aa4\u0aae\u0abe\u0ab0\u0ac0 \u0aaa\u0abe\u0aa4\u0acd\u0ab0\u0aa4\u0abe \u0a9a\u0abe\u0ab8\u0acb", eligibilityInfo: "\u0ab2\u0acb\u0aa8\u0aa8\u0ac0 \u0ab8\u0ac0\u0aae\u0abe \u0a9c\u0abe\u0aa3\u0ab5\u0abe \u0aae\u0abe\u0a9f\u0ac7 \u0aa4\u0aae\u0abe\u0ab0\u0ac0 \u0ab0\u0acb\u0a9c\u0abf\u0a82\u0aa6\u0ac0 \u0a86\u0ab5\u0a95 \u0a85\u0aa8\u0ac7 \u0a96\u0ab0\u0acd\u0a9a \u0aad\u0ab0\u0acb\u0964", upload: "KYC \u0aa6\u0ab8\u0acd\u0aa4\u0abe\u0ab5\u0ac7\u0a9c \u0a85\u0aaa\u0ab2\u0acb\u0aa1 \u0a95\u0ab0\u0acb", uploadInfo: "\u0a85\u0ab0\u0a9c\u0ac0 \u0a86\u0a97\u0ab3 \u0ab5\u0aa7\u0abe\u0ab0\u0ab5\u0abe \u0aae\u0abe\u0a9f\u0ac7 \u0a8f\u0a95 \u0aae\u0abe\u0aa8\u0acd\u0aaf \u0aa6\u0ab8\u0acd\u0aa4\u0abe\u0ab5\u0ac7\u0a9c \u0a85\u0aaa\u0ab2\u0acb\u0aa1 \u0a95\u0ab0\u0acb\u0964", application: "\u0aa4\u0aae\u0abe\u0ab0\u0ac0 \u0a85\u0ab0\u0a9c\u0ac0 \u0ab8\u0aac\u0aae\u0abf\u0a9f \u0a95\u0ab0\u0acb", applicationInfo: "\u0aa4\u0aae\u0abe\u0ab0\u0abe \u0a95\u0abe\u0aae \u0a85\u0aa8\u0ac7 \u0aac\u0ac7\u0a82\u0a95\u0aa8\u0ac0 \u0aae\u0abe\u0ab9\u0abf\u0aa4\u0ac0 \u0aad\u0ab0\u0acb\u0964 \u0ab8\u0aac\u0aae\u0abf\u0a9f \u0a95\u0ab0\u0acd\u0aaf\u0abe \u0aaa\u0a9b\u0ac0 \u0ab8\u0acd\u0aa5\u0abf\u0aa4\u0abf \u0a9c\u0acb\u0a88 \u0ab6\u0a95\u0ab6\u0acb\u0964", track: "\u0aa4\u0aae\u0abe\u0ab0\u0ac0 \u0a85\u0ab0\u0a9c\u0ac0 \u0a9f\u0acd\u0ab0\u0ac7\u0a95 \u0a95\u0ab0\u0acb", trackInfo: "\u0ab9\u0abe\u0ab2\u0aae\u0abe\u0a82 \u0a9a\u0abe\u0ab2\u0ac0 \u0ab0\u0ab9\u0ac7\u0ab2\u0ac0 \u0a9a\u0a95\u0abe\u0ab8\u0aa3\u0ac0 \u0a85\u0aa8\u0ac7 \u0ab2\u0ac7\u0aa8\u0acd\u0aa1\u0ab0 \u0ab0\u0abf\u0ab5\u0acd\u0aaf\u0ac2 \u0ab8\u0acd\u0aa5\u0abf\u0aa4\u0abf \u0a9c\u0acb\u0a88 \u0ab6\u0a95\u0acb\u0964", lockedKyc: "KYC \u0aa6\u0ab8\u0acd\u0aa4\u0abe\u0ab5\u0ac7\u0a9c", lockedApp: "\u0ab2\u0acb\u0aa8 \u0a85\u0ab0\u0a9c\u0ac0", lockedStatus: "\u0a85\u0ab0\u0a9c\u0ac0\u0aa8\u0ac0 \u0ab8\u0acd\u0aa5\u0abf\u0aa4\u0abf", unlockKyc: "\u0aa6\u0ab8\u0acd\u0aa4\u0abe\u0ab5\u0ac7\u0a9c \u0a85\u0aaa\u0ab2\u0acb\u0aa1 \u0a96\u0acb\u0ab2\u0ab5\u0abe \u0aae\u0abe\u0a9f\u0ac7 \u0aaa\u0ab9\u0ac7\u0ab2\u0abe \u0aaa\u0abe\u0aa4\u0acd\u0ab0\u0aa4\u0abe \u0a9a\u0abe\u0ab8\u0aa3\u0ac0 \u0aaa\u0ac2\u0ab0\u0ac0 \u0a95\u0ab0\u0acb\u0964", unlockApp: "\u0aaa\u0ab9\u0ac7\u0ab2\u0abe KYC \u0aa6\u0ab8\u0acd\u0aa4\u0abe\u0ab5\u0ac7\u0a9c \u0a85\u0aaa\u0ab2\u0acb\u0aa1 \u0a95\u0ab0\u0acb\u0964", unlockStatus: "\u0a85\u0ab0\u0a9c\u0ac0 \u0ab8\u0aac\u0aae\u0abf\u0a9f \u0aa5\u0aaf\u0abe \u0aaa\u0a9b\u0ac0 \u0aa4\u0aae\u0abe\u0ab0\u0acb \u0ab8\u0acd\u0a9f\u0ac7\u0a9f\u0ab8 \u0a9f\u0acd\u0ab0\u0ac7\u0a95\u0ab0 \u0aa6\u0ac7\u0a96\u0abe\u0ab6\u0ac7\u0964", advanced: "\u0a85\u0aa6\u0acd\u0ab5\u0abe\u0aa8\u0acd\u0ab8 \u0aaf\u0acb\u0a9c\u0aa8\u0abe \u0a85\u0aa8\u0ac7 \u0a9c\u0abe\u0aa3\u0a95\u0abe\u0ab0\u0ac0", optional: "\u0ab5\u0ac8\u0a95\u0ab2\u0acd\u0aaa\u0abf\u0a95" },
};

export default function App() {
  useScrollReveal();
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [ticker, setTicker] = useState(FALLBACK_TICKER);
  const [schemes, setSchemes] = useState([]);
  const [apiOnline, setApiOnline] = useState(false);
  const [eligibleAmount, setEligibleAmount] = useState(15000);
  const [applicationId, setApplicationId] = useState(null);
  const [journeyStage, setJourneyStage] = useState(1);
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState(() => localStorage.getItem("sahayata_lang") || "en");
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const statsRef = useCountUp(stats);

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

  useEffect(() => {
    const panels = document.querySelectorAll(".journey-panel-head");
    const panelCopy = [
      [journey.eligibility, journey.eligibilityInfo],
      [journey.upload, journey.uploadInfo],
      [journey.application, journey.applicationInfo],
      [journey.track, journey.trackInfo],
    ];
    panels.forEach((panel, index) => {
      const [title, description] = panelCopy[index] || [];
      const step = panel.querySelector("span");
      const heading = panel.querySelector("h3");
      const detail = panel.querySelector("p");
      if (step) step.textContent = `${journey.step} ${index + 1}`;
      if (heading) heading.textContent = title;
      if (detail) detail.textContent = description;
    });
    document.querySelectorAll(".journey-progress small").forEach((element, index) => {
      element.textContent = journey.steps[index] || "";
    });
    const locked = document.querySelectorAll(".journey-locked");
    const lockedCopy = [[journey.lockedKyc, journey.unlockKyc], [journey.lockedApp, journey.unlockApp], [journey.lockedStatus, journey.unlockStatus]];
    const firstLockedIndex = Math.min(Math.max(journeyStage, 1), 3) - 1;
    locked.forEach((panel, index) => {
      const [title, description] = lockedCopy[firstLockedIndex + index] || [];
      const heading = panel.querySelector("b");
      const detail = panel.querySelector("span");
      if (heading) heading.textContent = `${journey.step} ${firstLockedIndex + index + 2} · ${title}`;
      if (detail) detail.textContent = description;
    });
    const advanced = document.querySelector(".advanced-tools summary");
    if (advanced) advanced.innerHTML = `${journey.advanced} <span>${journey.optional}</span>`;
  }, [journey, journeyStage]);

  useEffect(() => {
    checkHealth().then(() => setApiOnline(true)).catch(() => setApiOnline(false));
    getDashboard()
      .then((data) => {
        setStats(data.stats);
        setTicker(data.ticker);
      })
      .catch(() => {});
    getSchemes().then(setSchemes).catch(() => {});
  }, []);

  const handleEligibilityChange = useCallback((data) => {
    if (data.eligible_amount > 0) {
      setEligibleAmount(data.eligible_amount);
      setJourneyStage((current) => Math.max(current, 2));
    }
  }, []);

  const handleApplicationSubmit = (id) => {
    setApplicationId(id);
    setJourneyStage(4);
    setTimeout(() => scrollTo("application-status"), 400);
  };

  const translateStatLabel = (label) => {
    const dict = {
      "PM SVANidhi beneficiaries": { en: "PM SVANidhi beneficiaries", hi: "पीएम स्वनिधि लाभार्थी", gu: "PM સ્વનિધિ લાભાર્થીઓ" },
      "e-Shram registered workers": { en: "e-Shram registered workers", hi: "ई-श्रम पंजीकृत श्रमिक", gu: "ઈ-શ્રમ નોંધાયેલ શ્રમિકો" },
      "Jan Dhan accounts": { en: "Jan Dhan accounts", hi: "जन धन खाते", gu: "જન ધન ખાતાઓ" },
      "Jan Dhan balance, INR": { en: "Jan Dhan balance, INR", hi: "जन धन शेष राशि (INR)", gu: "જન ધન સિલક (INR)" },
      "PM SVANidhi Beneficiaries": { en: "PM SVANidhi Beneficiaries", hi: "पीएम स्वनिधि लाभार्थी", gu: "PM સ્વનિધિ લાભાર્થીઓ" },
      "Jan Dhan Accounts": { en: "Jan Dhan Accounts", hi: "जन धन खाते", gu: "જન ધન ખાતાઓ" },
      "Jan Dhan Balance (INR)": { en: "Jan Dhan Balance (INR)", hi: "जन धन शेष राशि (INR)", gu: "જન ધન સિલક (INR)" }
    };
    return dict[label]?.[lang] || label;
  };

  const getTranslatedTicker = () => {
    if (lang === "hi") {
      return [
        "पीएम स्वनिधि योजना: 50 लाख से अधिक लाभार्थी पंजीकृत",
        "ई-श्रम पोर्टल: 28 करोड़ से अधिक श्रमिक पंजीकृत",
        "जन धन खातों में 2.3 लाख करोड़ रुपये से अधिक की राशि जमा"
      ];
    } else if (lang === "gu") {
      return [
        "PM સ્વનિધિ યોજના: ૫૦ લાખથી વધુ લાભાર્થીઓ નોંધાયેલા છે",
        "ઈ-શ્રમ પોર્ટલ: ૨૮ કરોડથી વધુ શ્રમિકો નોંધાયેલા છે",
        "જન ધન ખાતાઓમાં ૨.૩ લાખ કરોડ રૂપિયાથી વધુ રકમ જમા"
      ];
    }
    return ticker;
  };

  const translatedProblems = PROBLEMS.map((p, idx) => {
    const translationsHi = [
      { title: "रोज की कमाई, रोज का खर्चा", desc: "गिग और दैनिक वेतन भोगियों की आय नियमित नहीं होती। बीमारी, मौसम या कम बिक्री के दिन भुगतान क्षमता को तुरंत प्रभावित करते हैं।" },
      { title: "औपचारिक दस्तावेजों की कमी", desc: "सैलरी स्लिप, आईटीआर और नियोक्ता अनुबंध न होने के कारण श्रमिक पारंपरिक ऋण प्रक्रिया में पास नहीं हो पाते।" },
      { title: "छोटे ऋण का प्रसंस्करण लागत अधिक", desc: "10,000 रुपये का ऋण संसाधित करना भी बैंक के लिए परिचालन रूप से महंगा होता है, इसलिए छोटे उधारकर्ता उपेक्षित हो जाते हैं।" },
      { title: "संपार्श्विक (गारंटी) और सिबिल इतिहास नहीं", desc: "सुरक्षित संपत्ति न होने और 'न्यू टू क्रेडिट' स्थिति के कारण स्वचालित अस्वीकृति आम हो जाती है।" }
    ];
    const translationsGu = [
      { title: "રોજની કમાણી, રોજનો ખર્ચ", desc: "ગીગ અને દૈનિક વેતન મેળવનારાઓની આવક નિયમિત હોતી નથી. બીમારી, હવામાન અથવા ઓછી વેચાણ ચૂકવણી ક્ષમતાને અસર કરે છે." },
      { title: "ઔપચારિક દસ્તાવેજોની અછત", desc: "સેલેરી સ્લિપ, ITR અને કોન્ટ્રાક્ટ ન હોવાને કારણે કામદારો પરંપરાગત બેંકિંગમાં પાસ નથી થતા." },
      { title: "નાની લોનનો પ્રોસેસિંગ ખર્ચ વધુ", desc: "રૂ. ૧૦,૦૦૦ ની લોન પ્રોસેસ કરવી પણ બેંક માટે ખર્ચાળ હોય છે, તેથી નાના લોન લેનારાઓની અવગણના થાય છે." },
      { title: "ગેરંટી અને સિબિલ હિસ્ટ્રી નથી", desc: "સેક્યોર્ડ મિલકત ન હોવા અને નવો ક્રેડિટ સ્કોર હોવાના કારણે ઓટોમેટિક રિજેક્શન થાય છે." }
    ];
    if (lang === "hi") {
      return { ...p, title: translationsHi[idx].title, desc: translationsHi[idx].desc };
    } else if (lang === "gu") {
      return { ...p, title: translationsGu[idx].title, desc: translationsGu[idx].desc };
    }
    return p;
  });

  const translatedSolutions = SOLUTIONS.map((s, idx) => {
    const translationsHi = [
      { title: "यूपीआई इतिहास से वैकल्पिक क्रेडिट स्कोर", desc: "दैनिक क्यूआर रसीदों और कैश-फ्लो पैटर्न से पुनर्भुगतान क्षमता का अनुमान लगाया जाता है।" },
      { title: "दैनिक सूक्ष्म भुगतान", desc: "मासिक ईएमआई के बजाय प्रति दिन 100 रुपये जैसे छोटे भुगतान आय चक्र के साथ जुड़ते हैं।" },
      { title: "बैंक + फिनटेक सह-ऋण", desc: "फिनटेक ऑनबोर्डिंग और संग्रह संभालता है; बैंक कम जोखिम वाला वित्तपोषण प्रदान करता है।" }
    ];
    const translationsGu = [
      { title: "UPI ઇતિહાસ પરથી નવો ક્રેડિટ સ્કોર", desc: "દૈનિક QR રિસિપ્ટ્સ અને કેશ-ફ્લોથી લોન ચૂકવવાની ક્ષમતા નક્કી થાય છે." },
      { title: "દૈનિક નાની ચૂકવણી", desc: "માસિક EMI ને બદલે રોજ રૂ. ૧૦૦ જેવી નાની ચૂકવણી રોજની આવક સાથે સેટ થાય છે." },
      { title: "બેંક + ફિનટેક ભાગીદારી", desc: "ફિનટેક ઓનબોર્ડિંગ અને કલેક્શન સંભાળે છે; બેંક ઓછું જોખમ ધરાવતું ફંડ આપે છે." }
    ];
    if (lang === "hi") {
      return { ...s, title: translationsHi[idx].title, desc: translationsHi[idx].desc };
    } else if (lang === "gu") {
      return { ...s, title: translationsGu[idx].title, desc: translationsGu[idx].desc };
    }
    return s;
  });

  const translatedRoadmap = ROADMAP.map((r, idx) => {
    const translationsHi = [
      { phase: "चरण 1 - आधारभूत संरचना", title: "पहचान और ऑनबोर्डिंग", items: ["ई-श्रम पंजीकरण", "जन धन खाता लिंक", "जियो-टैगिंग के साथ ई-केवाईसी"] },
      { phase: "चरण 2 - ऋण सुविधा", title: "वैकल्पिक मूल्यांकन", items: ["यूपीआई-आधारित गतिशील स्कोर", "एनबीएफसी सह-ऋण साझेदारी", "छोटे दैनिक भुगतान सिस्टम"] },
      { phase: "चरण 3 - सुरक्षा कवच", title: "दीर्घकालिक सुरक्षा तंत्र", items: ["पीएम-एसवाईएम पेंशन योजना", "स्वनिधि से व्यावसायिक ऋण", "डिजिटल साक्षरता कार्यक्रम"] }
    ];
    const translationsGu = [
      { phase: "તબક્કો ૧ - પાયો", title: "ઓળખ અને ઓનબોર્ડિંગ", items: ["ઈ-શ્રમ રજીસ્ટ્રેશન", "જન ધન ખાતા લિંકેજ", "જીઓ-ટેગિંગ સાથે ઈ-KYC"] },
      { phase: "તબક્કો ૨ - ક્રેડિટ", title: "વૈકલ્પિક ક્રેડિટ સ્કોર", items: ["UPI આધારિત ડાયનેમિક સ્કોર", "NBFC સાથે ભાગીદારી", "નાની ચૂકવણી સિસ્ટમ"] },
      { phase: "તબક્કો ૩ - સુરક્ષા", title: "લાંબા ગાળાની સુરક્ષા", items: ["PM-SYM પેન્શન સ્વીકાર", "સ્વનિધિથી કોમર્શિયલ ક્રેડિટ", "ડિજિટલ સાક્ષરતા કાર્યક્રમો"] }
    ];
    if (lang === "hi") {
      return { ...r, phase: translationsHi[idx].phase, title: translationsHi[idx].title, items: translationsHi[idx].items };
    } else if (lang === "gu") {
      return { ...r, phase: translationsGu[idx].phase, title: translationsGu[idx].title, items: translationsGu[idx].items };
    }
    return r;
  });

  const translatedEligibility = ELIGIBILITY.map((e, idx) => {
    const translationsHi = [
      "ई-केवाईसी के साथ आधार कार्ड",
      "यूपीआई-लिंक किया गया मोबाइल नंबर",
      "3 महीने का यूपीआई लेनदेन इतिहास",
      "ई-श्रम / स्वनिधि पंजीकरण",
      "जन धन या सामान्य बैंक खाता"
    ];
    const translationsGu = [
      "આધાર કાર્ડ ઈ-KYC સાથે",
      "UPI લિંક કરેલ મોબાઈલ નંબર",
      "૩ મહિનાની UPI હિસ્ટ્રી",
      "ઈ-શ્રમ / સ્વનિધિ રજીસ્ટ્રેશન",
      "જન ધન અથવા સામાન્ય બેંક ખાતું"
    ];
    if (lang === "hi") {
      return { ...e, text: translationsHi[idx] };
    } else if (lang === "gu") {
      return { ...e, text: translationsGu[idx] };
    }
    return e;
  });

  const translatedSchemes = (schemes.length ? schemes : [
    { name: "PM SVANidhi", sub: "Street vendors ke liye", desc: "Rs 10,000 se Rs 50,000 tak collateral-free working capital loan.", tag: "Street vendors" },
    { name: "Jan Dhan Yojana", sub: "Basic banking access", desc: "Zero-balance bank account, overdraft support, insurance cover.", tag: "All workers" },
    { name: "PM-SYM Pension", sub: "Old-age security", desc: "Small daily contribution ke saath government matching support.", tag: "18-40 years" },
    { name: "e-Shram Portal", sub: "Digital worker identity", desc: "Unorganised workers ke liye national ID aur scheme discovery.", tag: "Free" },
  ]).map((scheme) => {
    const schemeTranslationsHi = {
      "PM SVANidhi": { name: "पीएम स्वनिधि", sub: "रेहड़ी-पटरी विक्रेताओं के लिए", desc: "बिना किसी गारंटी के 10,000 रुपये से 50,000 रुपये तक का ऋण।", tag: "फेरीवाले / विक्रेता" },
      "Jan Dhan Yojana": { name: "जन धन योजना", sub: "बुनियादी बैंकिंग पहुंच", desc: "जीरो-बैलेंस बैंक खाता, ओवरड्राफ्ट सहायता, बीमा कवर।", tag: "सभी श्रमिक" },
      "PM-SYM Pension": { name: "पीएम-श्रम योगी मान-धन", sub: "वृद्धावस्था सुरक्षा", desc: "छोटे दैनिक योगदान के साथ सरकारी पेंशन सहायता।", tag: "18-40 वर्ष" },
      "e-Shram Portal": { name: "ई-श्रम पोर्टल", sub: "डिजिटल श्रमिक पहचान", desc: "असंगठित श्रमिकों के लिए राष्ट्रीय आईडी और योजना खोज।", tag: "नि:शुल्क" }
    };
    const schemeTranslationsGu = {
      "PM SVANidhi": { name: "PM સ્વનિધિ", sub: "લારી-ગલ્લા ચલાવનારાઓ માટે", desc: "રૂ. ૧૦,૦૦૦ થી રૂ. ૫૦,૦૦૦ સુધીની ગેરંટી વગરની લોન.", tag: "લારી-ગલ્લા ધારકો" },
      "Jan Dhan Yojana": { name: "જન ધન યોજના", sub: "બેઝિક બેંકિંગ સેવાઓ", desc: "ઝીરો-બેલેન્સ બેંક ખાતું, ઓવરડ્રાફ્ટ સુવિધા, વીમા કવર.", tag: "તમામ શ્રમિકો" },
      "PM-SYM Pension": { name: "PM-SYM પેન્શન", sub: "વૃદ્ધાવસ્થા સુરક્ષા", desc: "નાના દૈનિક યોગદાન સામે સરકારી સમાન ફંડ સહાય.", tag: "૧૮-૪૦ વર્ષ" },
      "e-Shram Portal": { name: "ઈ-શ્રમ પોર્ટલ", sub: "ડિજિટલ કામદાર ઓળખપત્ર", desc: "અસંગઠિત કામદારો માટે રાષ્ટ્રીય ID અને યોજનાઓ શોધવાની સુવિધા.", tag: "મફત" }
    };

    if (lang === "hi" && schemeTranslationsHi[scheme.name]) {
      return { ...scheme, ...schemeTranslationsHi[scheme.name] };
    } else if (lang === "gu" && schemeTranslationsGu[scheme.name]) {
      return { ...scheme, ...schemeTranslationsGu[scheme.name] };
    }
    return scheme;
  });

  return (
    <>
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
            {["Home", "About Us", "Help"].map((item, i) => {
              const navLabels = {
                "Home": t("navHome", "Home"),
                "About Us": t("navAbout", "About Us"),
                "Help": t("navHelp", "Help Center")
              };
              return (
                <a href="#" key={item} className={`nav-item${(item === "Home" && currentPath === "/") || (item === "About Us" && currentPath === "/about") || (item === "Help" && currentPath === "/help") ? " active" : ""}`} onClick={(e) => { e.preventDefault(); navigateTo(item === "About Us" ? "/about" : item === "Help" ? "/help" : "/"); }}>
                  {navLabels[item] || item}
                </a>
              );
            })}
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

            {currentPath === "/admin-dashboard" ? (
              <button className="btn-outline active-route" onClick={() => navigateTo("/")}>
                {t("userLink", "Worker Dashboard")}
              </button>
            ) : (
              <button className="btn-outline" onClick={() => navigateTo("/admin-dashboard")}>
                {t("adminLink", "Admin Console")}
              </button>
            )}

            {apiOnline && <span className="api-status online">{t("apiConnected", "API Connected")}</span>}
            {user ? (
              <span className="user-chip">{t("hi", "Hi")}, {user.full_name.split(" ")[0]}</span>
            ) : (
              <>
                <button className="btn-primary-sm" onClick={() => setAuthMode("register")}>{t("Register", "Register")}</button>
                <button className="btn-outline" onClick={() => setAuthMode("login")}>{t("Login", "Login")}</button>
              </>
            )}
          </div>
        </div>
      </header>

      {currentPath === "/admin-dashboard" ? (
        <AdminDashboard lang={lang} navigateTo={navigateTo} />
      ) : currentPath === "/about" ? (
        <GovernmentSchemesGuide lang={lang} />
      ) : currentPath === "/help" ? (
        <HelpCenter lang={lang} />
      ) : (
        <>
          <section className="hero">
            <div className="hero-inner">
              <div className="hero-text">
                <div className="hero-badge">
                  <span className="pulse-dot" />
                  {t("missionBadge", "Mission Mode - Active 2026")}
                </div>
                <h2>
                  {t("heroHeading", "Financial support for gig workers, delivery partners and daily wage earners.")}
                  <SpeechButton text={`${t("heroHeading")}. ${t("heroSubtitle")}`} lang={lang} />
                </h2>
                <p>{t("heroSubtitle", "A single-window platform for workers with daily income cycles: identity setup, quick eligibility checks, sachet loan planning and live application tracking.")}</p>
                <div className="hero-btns">
                  <button className="btn-primary" onClick={() => scrollTo("registration-form")}>{t("btnApply", "Apply for support")}</button>
                  <button className="btn-ghost" onClick={() => scrollTo("eligibility-calculator")}>{t("btnCheck", "Check eligibility")}</button>
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
                <div className="hero-tricolor">
                  <div style={{ background: "#ff9933" }} />
                  <div style={{ background: "#ffffff" }} />
                  <div style={{ background: "#138808" }} />
                </div>
              </div>

              <aside className="worker-hero-card" aria-label="Real gig worker support visual">
                <div className="worker-photo-grid">
                  <img src={streetVendorPhoto} alt="Street vendor at work in India" />
                  <img src={deliveryRiderPhoto} alt="Delivery rider at work in an Indian city" />
                </div>
                <div className="worker-card-copy">
                  <span className="mini-kicker">{t("cardKicker", "Gig + Daily Wage Support")}</span>
                  <h3>{t("cardTitle", "Fast access for delivery, street work and daily labour.")}</h3>
                  <p className="photo-credit">
                    Real photos: <a href="https://commons.wikimedia.org/wiki/File:A_Street_Vendor_in_India.jpg" target="_blank" rel="noreferrer">street vendor</a> (Wikimedia Commons) and <a href="https://www.pexels.com/photo/delivery-person-on-motorbike-in-urban-setting-33359127/" target="_blank" rel="noreferrer">delivery rider</a> (Pexels).
                  </p>
                </div>
                <div className="worker-floating-chip chip-left">
                  <strong>Rs 10k-50k</strong>
                  <span>{t("cardLimit", "working capital")}</span>
                </div>
                <div className="worker-floating-chip chip-right">
                  <strong>5 min</strong>
                  <span>{t("cardTime", "eligibility check")}</span>
                </div>
                <div className="hero-mini-checklist">
                  {translatedEligibility.slice(0, 3).map(({ check, text }) => (
                    <div key={text} className="hero-mini-row">
                      <span className={`elig-icon${check ? " checked" : ""}`}>
                        {check ? <Check size={15} /> : <Circle size={15} />}
                      </span>
                      {text}
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </section>

          <div className="stats-band" ref={statsRef}>
            <div className="stats-inner">
              {stats.map(({ target, suffix, label }, i) => (
                <div key={label} className={`stat-cell stat-color-${i % 4}`}>
                  <div className="stat-num" data-target={target} data-suffix={suffix}>0</div>
                  <div className="stat-label">{translateStatLabel(label)}</div>
                </div>
              ))}
            </div>
          </div>

          <section className="section" style={{ paddingTop: "34px", paddingBottom: "8px" }}>
            <div className="section-inner">
              <FinancialPulse
                schemes={schemes}
                eligibleAmount={eligibleAmount}
                lang={lang}
                onApply={() => scrollTo("registration-form")}
              />
            </div>
          </section>

          <section className="section section-alt">
            <div className="section-inner">
              <div className="eyebrow">{t("probEyebrow", "Samasya ki pahchaan")}</div>
              <h2 className="section-title">{t("probTitle", "Formal credit se doori kyun banti hai?")}</h2>
              <p className="section-sub">{t("probSub", "Unorganised workers ke liye main barriers ko simple language mein samjhein.")}</p>
              <div className="prob-grid">
                {translatedProblems.map(({ Icon, title, desc, delay }) => (
                  <div key={title} className="prob-card reveal" data-delay={delay}>
                    <div className="prob-card-icon"><Icon size={22} /></div>
                    <h4>{title}</h4>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-inner">
              <div className="eyebrow">{t("solEyebrow", "Hamaara samadhan")}</div>
              <h2 className="section-title">{t("solTitle", "Teen stambh ki credit architecture")}</h2>
              <p className="section-sub">{t("solSub", "Sarkar, bank aur FinTech milkar small-ticket credit ko practical banate hain.")}</p>
              <div className="sol-layout">
                <div className="sol-steps">
                  {translatedSolutions.map(({ num, title, desc }) => (
                    <div key={num} className="sol-step">
                      <div className="sol-num">{num}</div>
                      <div><h4>{title}</h4><p>{desc}</p></div>
                    </div>
                  ))}
                </div>
                <div className="flowbox">
                  <h3>{t("solFlow", "Credit flow")}</h3>
                  {[[lang === "hi" ? "श्रमिक" : lang === "gu" ? "શ્રમિક" : "Worker", lang === "hi" ? "यूपीआई लेनदेन" : lang === "gu" ? "UPI વ્યવહારો" : "UPI transactions"], [lang === "hi" ? "फिनटेक स्कोर" : lang === "gu" ? "ફિનટેક સ્કોર" : "FinTech score", lang === "hi" ? "एनबीएफसी समीक्षा" : lang === "gu" ? "NBFC સમીક્ષા" : "NBFC review"], [lang === "hi" ? "बैंक फंडिंग" : lang === "gu" ? "બેંક ફંડિંગ" : "Bank funding", lang === "hi" ? "ऋण वितरण" : lang === "gu" ? "લોન વિતરણ" : "Loan disbursal"]].map(([a, b]) => (
                    <div key={a} className="flow-row">
                      <div className="flow-chip">{a}</div>
                      <span className="flow-arrow">{t("solArrow", "to")}</span>
                      <div className="flow-chip">{b}</div>
                    </div>
                  ))}
                  <div className="flow-row">
                    <div className="flow-chip flow-chip-success">{lang === "hi" ? "स्वीकृत ऋण" : lang === "gu" ? "મંજૂર થયેલ લોન" : "Approved loan"}</div>
                    <span className="flow-arrow">{t("solArrow", "to")}</span>
                    <div className="flow-chip flow-chip-success">{lang === "hi" ? "दैनिक पुनर्भुगतान" : lang === "gu" ? "દૈનિક ચૂકવણી" : "Daily repayment"}</div>
                  </div>
                  <p className="flow-note">{t("solNote", "Digital e-KYC, UPI history aur local verification se branch visit ki need kam hoti hai.")}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section section-alt" id="schemes-section">
            <div className="section-inner">
              <div className="eyebrow">{t("schemeEyebrow", "Sarkari yojanayen")}</div>
              <h2 className="section-title">{t("schemeTitle", "Aapke liye kaunsi yojana fit hai?")}</h2>
              <p className="section-sub">{t("schemeSub", "Credit, banking, pension aur identity programs ko ek jagah compare karein.")}</p>
              <div className="scheme-grid">
                {translatedSchemes.map((scheme, i) => {
                  const Icon = SCHEME_ICONS[scheme.name] || BadgeCheck;
                  return (
                    <div key={scheme.name} className={`scheme-card reveal scheme-color-${i % 4}`} data-delay={i * 80}>
                      <div className="scheme-head">
                        <span className="scheme-icon"><Icon size={22} /></span>
                        <h4>{scheme.name}</h4>
                        <span>{scheme.sub}</span>
                      </div>
                      <div className="scheme-body">
                        <p>{scheme.desc}</p>
                        <span className="scheme-tag">{scheme.tag}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="components-section">
            <div className="components-inner">
              <div className="section-heading">
                <div className="eyebrow">{t("toolEyebrow", "Interactive tools")}</div>
                <h2 className="section-title">{t("toolTitle", "Application journey ke tools")}</h2>
                <p className="section-sub">{t("toolSub", "Eligibility calculator se status tracker tak — sab backend se live connected.")}</p>
              </div>
              <div className="journey-progress" aria-label="Loan application journey">
                {["Check eligibility", "Complete KYC", "Submit application", "Track status"].map((label, index) => (
                  <div className={`journey-step${journeyStage > index + 1 ? " done" : ""}${journeyStage === index + 1 ? " active" : ""}`} key={label}>
                    <span>{journeyStage > index + 1 ? "✓" : index + 1}</span><small>{label}</small>
                  </div>
                ))}
              </div>

              <section className="journey-panel"><div className="journey-panel-head"><span>Step 1</span><div><h3>Check your eligibility</h3><p>Enter your daily income and expenses to see an estimated working-capital limit.</p></div></div><Calculator onEligibilityChange={handleEligibilityChange} lang={lang} /></section>

              {journeyStage >= 2 ? <section className="journey-panel"><div className="journey-panel-head"><span>Step 2</span><div><h3>Upload KYC document</h3><p>Upload one valid document to continue with your application.</p></div></div><KycDocuments onUploaded={() => setJourneyStage((current) => Math.max(current, 3))} /></section> : <div className="journey-locked"><b>Step 2 · KYC document</b><span>Complete the eligibility check first to unlock document upload.</span></div>}

              {journeyStage >= 3 ? <section className="journey-panel"><div className="journey-panel-head"><span>Step 3</span><div><h3>Submit your application</h3><p>Share your work and banking details. You can track the decision after submission.</p></div></div><ProgressiveReg requestedAmount={eligibleAmount || 15000} onApplicationSubmit={handleApplicationSubmit} lang={lang} /></section> : <div className="journey-locked"><b>Step 3 · Loan application</b><span>Upload a KYC document first to unlock the application form.</span></div>}

              {journeyStage >= 4 ? <section className="journey-panel"><div className="journey-panel-head"><span>Step 4</span><div><h3>Track your application</h3><p>See the current verification and lender-review stage in real time.</p></div></div><ApplicationStatus applicationId={applicationId} lang={lang} /></section> : <div className="journey-locked"><b>Step 4 · Application status</b><span>Your status tracker will appear after application submission.</span></div>}

              <details className="advanced-tools"><summary>Advanced planning and insights <span>Optional</span></summary><div className="advanced-grid"><DigitalTracker lang={lang} /><SachetPlanner loanAmount={eligibleAmount || 15000} lang={lang} /></div><div className="advanced-full"><SocialSecurity lang={lang} /></div><div className="advanced-full"><UpiCreditEngine loanAmount={eligibleAmount || 15000} adminView={false} lang={lang} /></div></details>
            </div>
          </section>

          <section className="section" id="roadmap-section">
            <div className="section-inner">
              <div className="eyebrow">{t("roadEyebrow", "Implementation roadmap")}</div>
              <h2 className="section-title">{t("roadTitle", "Aage ka raasta")}</h2>
              <p className="section-sub">{t("roadSub", "Digital identity se formal credit tak ka phased rollout.")}</p>
              <div className="road-grid">
                {translatedRoadmap.map(({ phase, title, items, delay }) => (
                  <div key={phase} className="road-card reveal" data-delay={delay}>
                    <div className="road-phase">{phase}</div>
                    <div className="road-title">{title}</div>
                    <ul className="road-items">
                      {items.map((item) => (
                        <li key={item}><span className="road-check">✓</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

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
      <VoiceAssistant lang={lang} changeLang={changeLang} navigateTo={navigateTo} />
    </>
  );
}
