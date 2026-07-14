import { useEffect, useState } from "react";
import { getApplicationStatus, getDemoApplicationStatus } from "../api";
import SpeechButton from "./SpeechButton";

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
    <div className="card card-accent-indigo" id="application-status">
      <div className="eyebrow">Application Journey</div>
      <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <IconTimeline /> {t("title")}
        <SpeechButton text={`${t("title")}. Status for ${status.applicant_name}. Requested amount: ${status.requested_amount} rupees. Current stage is ${translateStageName(status.current_stage)}.`} lang={lang} />
      </div>
      <div className="card-sub">
        {status.applicant_name} · ₹{status.requested_amount.toLocaleString("en-IN")} · ID: {status.id}
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
        <div className="tl-active-detail">
          <IconSpinner />
          <div>
            <div className="tl-detail-title">{t("inReview")}{translateStageName(status.current_stage)}</div>
            <div className="tl-detail-sub">{translateReviewNote(status.review_note) || t("pending")}</div>
          </div>
        </div>
      )}
    </div>
  );
}
