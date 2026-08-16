import { useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, ShieldCheck, X } from "lucide-react";

const COPY = {
  en: {
    title: "Find support in a few simple steps", close: "Close", back: "Back", next: "Continue", finish: "See my options",
    steps: ["Work profile", "Daily income", "Documents", "Your options"],
    work: "What kind of work do you do?", income: "What is your typical daily income?", docs: "Which documents are ready?",
    workOptions: ["Street vendor", "Delivery partner", "Construction / daily wage", "Domestic worker", "Farmer", "Other"],
    incomeHint: "This is only an estimate. You can update it later.", docsHint: "Select all that you currently have.",
    ready: "You may be a fit for", note: "This is an initial guidance result, not a loan approval. Final eligibility is decided by the relevant scheme or lender.",
    privacy: "Your answers stay on this device until you choose to submit an application.",
  },
  hi: {
    title: "कुछ आसान चरणों में सहायता खोजें", close: "बंद करें", back: "वापस", next: "आगे बढ़ें", finish: "मेरे विकल्प देखें",
    steps: ["काम की जानकारी", "दैनिक आय", "दस्तावेज़", "आपके विकल्प"],
    work: "आप किस तरह का काम करते हैं?", income: "आपकी सामान्य दैनिक आय कितनी है?", docs: "कौन से दस्तावेज़ तैयार हैं?",
    workOptions: ["स्ट्रीट वेंडर", "डिलीवरी पार्टनर", "निर्माण / दिहाड़ी श्रमिक", "घरेलू कामगार", "किसान", "अन्य"],
    incomeHint: "यह केवल एक अनुमान है; इसे बाद में बदला जा सकता है।", docsHint: "जो दस्तावेज़ अभी उपलब्ध हैं, उन सभी को चुनें।",
    ready: "आपके लिए उपयुक्त विकल्प", note: "यह शुरुआती मार्गदर्शन है, ऋण की मंजूरी नहीं। अंतिम पात्रता संबंधित योजना या ऋणदाता तय करेगा।",
    privacy: "आवेदन जमा करने तक आपके उत्तर इसी डिवाइस पर रहते हैं।",
  },
  gu: {
    title: "થોડા સરળ પગલાંમાં સહાય શોધો", close: "બંધ કરો", back: "પાછળ", next: "આગળ વધો", finish: "મારા વિકલ્પો જુઓ",
    steps: ["કામની માહિતી", "દૈનિક આવક", "દસ્તાવેજો", "તમારા વિકલ્પો"],
    work: "તમે કેવા પ્રકારનું કામ કરો છો?", income: "તમારી સામાન્ય દૈનિક આવક કેટલી છે?", docs: "કયા દસ્તાવેજો તૈયાર છે?",
    workOptions: ["સ્ટ્રીટ વેન્ડર", "ડિલિવરી પાર્ટનર", "બાંધકામ / દૈનિક મજૂર", "ઘરકામ કરનાર", "ખેડૂત", "અન્ય"],
    incomeHint: "આ માત્ર અંદાજ છે; તમે તેને પછી બદલી શકો છો.", docsHint: "હાલમાં ઉપલબ્ધ બધા દસ્તાવેજો પસંદ કરો.",
    ready: "તમારા માટે યોગ્ય વિકલ્પો", note: "આ પ્રારંભિક માર્ગદર્શન છે, લોન મંજૂરી નથી. અંતિમ પાત્રતા યોજના અથવા ધિરાણકર્તા નક્કી કરશે.",
    privacy: "તમે અરજી સબમિટ કરો ત્યાં સુધી જવાબો આ ડિવાઇસ પર જ રહે છે.",
  },
};

const DOCS = ["Aadhaar", "PAN", "e-Shram", "Bank statement"];

export default function OnboardingFlow({ lang = "en", onClose, onComplete }) {
  const t = COPY[lang] || COPY.en;
  const [step, setStep] = useState(0);
  const [work, setWork] = useState("");
  const [income, setIncome] = useState("1000");
  const [documents, setDocuments] = useState([]);
  const recommendations = work === t.workOptions[0] ? ["PM SVANidhi", "Jan Dhan Yojana"] : ["e-Shram Portal", "Jan Dhan Yojana", "PM-SYM Pension"];
  const toggleDoc = (doc) => setDocuments((current) => current.includes(doc) ? current.filter((item) => item !== doc) : [...current, doc]);
  const complete = () => {
    const profile = { work, income: Number(income) || 0, documents };
    localStorage.setItem("sahayata_profile", JSON.stringify(profile));
    onComplete?.(profile);
    setStep(3);
  };

  return <div className="onboarding-backdrop" role="presentation">
    <section className="onboarding-modal" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <button className="onboarding-close" type="button" onClick={onClose} aria-label={t.close}><X size={20} /></button>
      <div className="onboarding-progress" aria-label={t.steps[step]}>{t.steps.map((label, index) => <span key={label} className={index <= step ? "active" : ""}>{index + 1}</span>)}</div>
      <h2 id="onboarding-title">{t.title}</h2>
      {step === 0 && <div className="onboarding-content"><h3>{t.work}</h3><div className="choice-grid">{t.workOptions.map((option) => <button type="button" className={work === option ? "selected" : ""} key={option} onClick={() => setWork(option)}>{option}</button>)}</div></div>}
      {step === 1 && <div className="onboarding-content"><h3>{t.income}</h3><label className="income-input"><span>₹</span><input type="number" min="0" inputMode="numeric" value={income} onChange={(event) => setIncome(event.target.value)} /></label><p>{t.incomeHint}</p></div>}
      {step === 2 && <div className="onboarding-content"><h3>{t.docs}</h3><div className="doc-choice-list">{DOCS.map((doc) => <label key={doc}><input type="checkbox" checked={documents.includes(doc)} onChange={() => toggleDoc(doc)} /><span>{doc}</span></label>)}</div><p>{t.docsHint}</p></div>}
      {step === 3 && <div className="onboarding-content option-result"><CheckCircle2 size={32} /><h3>{t.ready}</h3>{recommendations.map((item) => <div className="recommendation" key={item}>{item}</div>)}<p>{t.note}</p></div>}
      {step < 3 && <div className="onboarding-actions"><button type="button" className="btn-ghost-sm" disabled={step === 0} onClick={() => setStep(step - 1)}><ChevronLeft size={16} /> {t.back}</button><button type="button" className="btn-primary-sm" disabled={step === 0 && !work} onClick={() => step === 2 ? complete() : setStep(step + 1)}>{step === 2 ? t.finish : t.next} <ChevronRight size={16} /></button></div>}
      <p className="onboarding-privacy"><ShieldCheck size={15} /> {t.privacy}</p>
    </section>
  </div>;
}
