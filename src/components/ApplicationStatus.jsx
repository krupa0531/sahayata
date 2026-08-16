import { useEffect, useState } from "react";
import { CheckCircle2, FileDown } from "lucide-react";
import { getApplicationStatus, getDemoApplicationStatus } from "../api";

const IconTimeline = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <line x1="12" y1="2" x2="12" y2="22"/><circle cx="12" cy="6" r="2" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="12" cy="18" r="2" fill="currentColor" stroke="none"/>
    <line x1="12" y1="6" x2="18" y2="6"/><line x1="12" y1="12" x2="18" y2="12"/><line x1="12" y1="18" x2="18" y2="18"/>
  </svg>
);

const IconSpinner = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="spin-icon">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

export default function ApplicationStatus({ applicationId, lang = "en" }) {
  const [status, setStatus] = useState(null);

  const t = (key) => {
    const dict = {
      en: {
        title: "Visual Application Status Timeline",
        loading: "Application status loading…",
        inReview: "In review — ",
        pending: "Verification in progress.",
      },
      hi: {
        title: "दृश्यमान आवेदन स्थिति समयरेखा",
        loading: "आवेदन की स्थिति लोड हो रही है…",
        inReview: "समीक्षा में — ",
        pending: "सत्यापन प्रगति पर है।",
      },
      gu: {
        title: "અરજી સ્થિતિ સમયરેખા",
        loading: "અરજીનું સ્ટેટસ લોડ થઈ રહ્યું છે…",
        inReview: "સમીક્ષા હેઠળ — ",
        pending: "વેરિફિકેશન ચાલુ છે.",
      }
    };
    return dict[lang]?.[key] || dict.en[key];
  };

  const translateTimelineStep = (lbl) => {
    const steps = {
      "Submitted": { en: "Submitted", hi: "जमा किया गया", gu: "સબમિટ કરેલ" },
      "e-KYC verified": { en: "e-KYC verified", hi: "ई-केवाईसी सत्यापित", gu: "ઈ-KYC વેરિફાઈડ" },
      "NBFC review": { en: "NBFC review", hi: "एनबीएफसी समीक्षा", gu: "NBFC સમીક્ષા" },
      "Bank sanction": { en: "Bank sanction", hi: "बैंक स्वीकृति", gu: "બેંક મંજૂરી" },
      "Cash disbursed": { en: "Cash disbursed", hi: "ऋण वितरण (नकद)", gu: "લોન જમા થઈ ગઈ" }
    };
    return steps[lbl]?.[lang] || lbl;
  };

  const translateReviewNote = (note) => {
    if (!note) return "";
    if (note.includes("Application submitted") || note.includes("submitted successfully")) {
      return lang === "hi" 
        ? "आवेदन सफलतापूर्वक सबमिट हो गया है। ई-केवाईसी सत्यापन प्रक्रिया में है।" 
        : lang === "gu" 
        ? "અરજી સબમિટ થઈ ગઈ છે. ઈ-KYC વેરિફિકેશન ચાલુ છે." 
        : note;
    }
    if (note.includes("check ho rahi hai") || note.includes("history check") || note.includes("UPI transaction history")) {
      return lang === "hi" 
        ? "यूपीआई लेनदेन इतिहास की जांच की जा रही है। अपेक्षित समय: 24 घंटे।" 
        : lang === "gu" 
        ? "UPI વ્યવહારોના ઇતિહાસની તપાસ ચાલુ છે. અંદાજિત સમય: ૨૪ કલાક." 
        : note;
    }
    if (note.includes("e-KYC verified") && (note.includes("forwarded") || note.includes("partner"))) {
      return lang === "hi" 
        ? "ई-केवाईसी सत्यापित। आवेदन एनबीएफसी भागीदार को भेजा गया है।" 
        : lang === "gu" 
        ? "ઈ-KYC વેરિફાઈડ. અરજી NBFC ભાગીદારને મોકલવામાં આવી છે." 
        : note;
    }
    if (note.includes("NBFC approved credit score")) {
      return lang === "hi" 
        ? "एनबीएफसी ने क्रेडिट स्कोर को मंजूरी दी। बैंक स्वीकृति की प्रतीक्षा है।" 
        : lang === "gu" 
        ? "NBFC દ્વારા ક્રેડિટ સ્કોર મંજૂર. બેંક પરવાનગીની રાહ જોવાઈ રહી છે." 
        : note;
    }
    if (note.includes("Bank sanctioned") || note.includes("sanctioned")) {
      return lang === "hi" 
        ? "बैंक ने ऋण स्वीकृत किया। ऋण वितरण प्रक्रिया शुरू कर दी गई है।" 
        : lang === "gu" 
        ? "બેંક દ્વારા રકમ મંજૂર. લોન જમા કરવાની પ્રક્રિયા શરૂ થઈ ગઈ છે." 
        : note;
    }
    if (note.includes("disbursed") || note.includes("disbursement")) {
      return lang === "hi" 
        ? "यूपीआई-लिंक किए गए बैंक खाते में ऋण वितरित कर दिया गया है। सक्रिय ऋण स्थिति।" 
        : lang === "gu" 
        ? "UPI લિંક કરેલા બેંક ખાતામાં રકમ જમા થઈ ગઈ છે. ચાલુ લોન સ્ટેટસ." 
        : note;
    }
    return note;
  };

  const translateStageName = (stage) => {
    return translateTimelineStep(stage);
  };

  useEffect(() => {
    const loader = applicationId
      ? getApplicationStatus(applicationId)
      : getDemoApplicationStatus();
    loader.then(setStatus).catch(() => setStatus(null));
  }, [applicationId]);

  if (!status) {
    return (
      <div className="card card-accent-indigo">
        <div className="card-sub">{t("loading")}</div>
      </div>
    );
  }

  const activeStep = status.timeline.find((s) => s.state === "active");

  return (
    <div className="official-form-section" id="application-status">
      {/* Form Section Banner */}
      <div style={{ background: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", padding: "8px", borderRadius: "10px" }}>
            <IconTimeline />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>
              {t("title")}
            </h3>
            <span style={{ fontSize: "12.5px", color: "#94a3b8" }}>
              {lang === "hi" ? "आधिकारिक आवेदन संदर्भ एवं बैंक स्वीकृति पाइपलाइन" : lang === "gu" ? "સત્તાવાર અરજી સંદર્ભ અને બેંક મંજૂરી પાઇપલાઇન" : "Official Application Reference & Bank Sanction Pipeline"}
            </span>
          </div>
        </div>
      </div>

      {/* Official Application Receipt Card */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)",
          border: "1px solid rgba(56, 189, 248, 0.35)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "16px", marginBottom: "16px" }}>
          <div>
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {lang === "hi" ? "आवेदन संदर्भ संख्या" : lang === "gu" ? "અરજી સંદર્ભ નંબર" : "Application Reference No."}
            </span>
            <h2 style={{ margin: "4px 0 0 0", color: "#ffffff", fontSize: "22px", fontWeight: "900", letterSpacing: "1px" }}>
              {status.id || "SAH-2026-94821"}
            </h2>
          </div>
          <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34d399", padding: "6px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: "800", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={14} />
            <span>{lang === "hi" ? "सत्यापित आवेदन" : lang === "gu" ? "વેરિફાઈડ અરજી" : "Verified Application"}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
          <div>
            <span style={{ display: "block", fontSize: "11.5px", color: "#94a3b8" }}>{lang === "hi" ? "आवेदक का नाम" : lang === "gu" ? "અરજદારનું નામ" : "Applicant Name"}</span>
            <strong style={{ fontSize: "14.5px", color: "#f8fafc" }}>{status.applicant_name}</strong>
          </div>
          <div>
            <span style={{ display: "block", fontSize: "11.5px", color: "#94a3b8" }}>{lang === "hi" ? "स्वीकृत राशि" : lang === "gu" ? "મંજૂર રકમ" : "Sanctioned Amount"}</span>
            <strong style={{ fontSize: "16px", color: "#38bdf8" }}>₹{status.requested_amount.toLocaleString("en-IN")}</strong>
          </div>
          <div>
            <span style={{ display: "block", fontSize: "11.5px", color: "#94a3b8" }}>{lang === "hi" ? "वितरण मोड" : lang === "gu" ? "ચુકવણી મોડ" : "Disbursement Mode"}</span>
            <strong style={{ fontSize: "14.5px", color: "#f8fafc" }}>Direct Bank Transfer (UPI)</strong>
          </div>
          <div>
            <span style={{ display: "block", fontSize: "11.5px", color: "#94a3b8" }}>{lang === "hi" ? "वर्तमान चरण" : lang === "gu" ? "ચાલુ તબક્કો" : "Current Stage"}</span>
            <strong style={{ fontSize: "14.5px", color: "#f59e0b" }}>{translateStageName(status.current_stage)}</strong>
          </div>
        </div>
      </div>

      {/* 5-Stage Live Timeline Trackers */}
      <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
        <div style={{ fontSize: "13px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "20px" }}>
          {lang === "hi" ? "प्रगति समयरेखा" : lang === "gu" ? "પ્રગતિ સમયરેખા" : "Live Pipeline Progression"}
        </div>

        <div className="timeline" role="list">
          {status.timeline.map((step, i) => (
            <div key={step.label} className="tl-step" role="listitem">
              {i < status.timeline.length - 1 && (
                <div className={`tl-connector${step.state === "done" ? " done" : ""}`} />
              )}
              <div className={`tl-node ${step.state}`} aria-label={`${step.label}: ${step.state}`}>
                {step.state === "done" && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {step.state === "active" && <div className="tl-active-dot" />}
                {step.state === "idle" && <span style={{ fontSize: 10 }}>{i + 1}</span>}
              </div>
              <div className={`tl-label${step.state === "active" ? " active-lbl" : ""}`}>
                {translateTimelineStep(step.label)}
              </div>
              <div className="tl-date">{step.date}</div>
            </div>
          ))}
        </div>

        {activeStep && (
          <div className="tl-active-detail" style={{ marginTop: "24px" }}>
            <IconSpinner />
            <div>
              <div className="tl-detail-title">{t("inReview")}{translateStageName(status.current_stage)}</div>
              <div className="tl-detail-sub">{translateReviewNote(status.review_note) || t("pending")}</div>
            </div>
          </div>
        )}
      </div>

      {/* Action Download / Reset */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => alert(lang === "hi" ? "आवेदन पावती रसीद सफलतापूर्वक डाउनलोड हो गई!" : lang === "gu" ? "અરજી રસીદ સફળતાપૂર્વક ડાઉનલોડ થઈ ગઈ!" : "Application Acknowledgment Receipt downloaded!")}
          className="btn-primary"
          style={{
            padding: "12px 28px",
            fontSize: "14px",
            fontWeight: "700",
            borderRadius: "12px",
            boxShadow: "0 4px 18px rgba(2, 132, 199, 0.4)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FileDown size={16} />
          <span>{lang === "hi" ? "आवेदन रसीद डाउनलोड करें (PDF)" : lang === "gu" ? "અરજી રસીદ ડાઉનલોડ કરો (PDF)" : "Download Application Receipt (PDF)"}</span>
        </button>
      </div>
    </div>
  );
}
