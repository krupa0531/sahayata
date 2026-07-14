import { useEffect, useState, useCallback } from "react";
import { calculateEligibility } from "../api";
import SpeechButton from "./SpeechButton";
import VoiceInputButton from "./VoiceInputButton";

const fmt = (v) => "₹" + Math.round(v).toLocaleString("en-IN");

const IconCalc = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/>
    <line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/>
    <line x1="8" y1="18" x2="10" y2="18"/><line x1="14" y1="18" x2="16" y2="18"/>
  </svg>
);

export default function Calculator({ onEligibilityChange, lang = "en" }) {
  const [earn, setEarn] = useState(1000);
  const [exp, setExp] = useState(800);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const t = useCallback((key) => {
    const dict = {
      en: {
        title: "Interactive Eligibility Calculator",
        sub: "Set daily earning and expenses — credit tier will update live from backend",
        earning: "Daily earning",
        expense: "Daily expense",
        buffer: "Net daily buffer",
        syncing: "Syncing…",
        offline: "Offline estimate",
      },
      hi: {
        title: "इंटरैक्टिव पात्रता कैलकुलेटर",
        sub: "दैनिक कमाई और खर्च सेट करें — क्रेडिट श्रेणी बैकएंड से लाइव आएगी",
        earning: "दैनिक कमाई",
        expense: "दैनिक खर्च",
        buffer: "शुद्ध दैनिक बफर",
        syncing: "सिंक हो रहा है…",
        offline: "ऑफ़लाइन अनुमान",
      },
      gu: {
        title: "ઇન્ટરેક્ટિવ યોગ્યતા કેલ્ક્યુલેટર",
        sub: "દૈનિક આવક અને ખર્ચ સેટ કરો — ક્રેડિટ લિમિટ બેકએન્ડ પરથી લાઈવ આવશે",
        earning: "દૈનિક આવક",
        expense: "દૈનિક ખર્ચ",
        buffer: "ચોખ્ખો દૈનિક બફર",
        syncing: "સિંક થઈ રહ્યું છે…",
        offline: "ઓફલાઇન અંદાજ",
      }
    };
    return dict[lang]?.[key] || dict.en[key];
  }, [lang]);

  const translateLabel = (lbl) => {
    if (!lbl) return "";
    if (lbl.includes("Tier 1")) {
      return lang === "hi" ? "श्रेणी 1 - ₹50,000 योग्य" : lang === "gu" ? "ટાયર ૧ - ₹૫૦,૦૦૦ પાત્ર" : lbl;
    }
    if (lbl.includes("Tier 2")) {
      return lang === "hi" ? "श्रेणी 2 - ₹15,000 योग्य" : lang === "gu" ? "ટાયર ૨ - ₹૧૫,૦૦૦ પાત્ર" : lbl;
    }
    if (lbl.includes("Tier 3")) {
      return lang === "hi" ? "श्रेणी 3 - ₹5,000 योग्य" : lang === "gu" ? "ટાયર ૩ - ₹૫,૦૦૦ પાત્ર" : lbl;
    }
    if (lbl.toLowerCase().includes("not eligible")) {
      return lang === "hi" ? "अभी पात्र नहीं हैं" : lang === "gu" ? "હજી પાત્ર નથી" : lbl;
    }
    return lbl;
  };

  const translateRecommendation = (rec) => {
    if (!rec) return "";
    if (rec.includes("Strong cash buffer")) {
      return lang === "hi" 
        ? "मजबूत नकद बफर। दैनिक पुनर्भुगतान के साथ पीएम स्वनिधि टॉप-अप की पेशकश करें।" 
        : lang === "gu" 
        ? "મજબૂત રોકડ બફર. દૈનિક ચુકવણી સાથે PM સ્વનિધિ ટોપ-અપ ઓફર કરો." 
        : rec;
    }
    if (rec.includes("Good profile")) {
      return lang === "hi" 
        ? "अच्छा प्रोफाइल। एक छोटे कार्यशील पूंजी ऋण से शुरुआत करें।" 
        : lang === "gu" 
        ? "સારી પ્રોફાઇલ. નાની વર્કિંગ કેપિટલ લોનથી શરૂઆત કરો." 
        : rec;
    }
    if (rec.includes("Basic eligibility")) {
      return lang === "hi" 
        ? "बुनियादी पात्रता। उच्च श्रेणी के लिए बचत निरंतरता में सुधार करें।" 
        : lang === "gu" 
        ? "મૂળભૂત યોગ્યતા. ઉચ્ચ સ્તર મેળવવા માટે બચત સુસંગતતામાં સુધારો કરો." 
        : rec;
    }
    if (rec.includes("Build at least")) {
      return lang === "hi" 
        ? "आवेदन करने से पहले कम से कम ₹80 का दैनिक बफर बनाएं।" 
        : lang === "gu" 
        ? "અરજી કરતા પહેલા ઓછામાં ઓછું ₹૮૦ નું દૈનિક બફર બનાવો." 
        : rec;
    }
    return rec;
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await calculateEligibility(earn, exp);
        setResult(data);
        onEligibilityChange?.(data);
      } catch {
        const safeExp = Math.min(exp, earn - 50);
        const buffer = earn - safeExp;
        setResult({
          daily_expense: safeExp,
          net_daily_buffer: buffer,
          eligible_amount: buffer >= 400 ? 50000 : buffer >= 200 ? 15000 : buffer >= 80 ? 5000 : 0,
          label: t("offline"),
          css_class: "tier-blue",
          recommendation: lang === "hi"
            ? "बैकएंड से कनेक्ट नहीं — स्थानीय अनुमान दिखा रहे हैं।"
            : lang === "gu"
            ? "બેકએન્ડ સાથે કનેક્શન નથી — સ્થાનિક અંદાજ બતાવે છે."
            : "Backend unavailable — displaying offline estimate.",
        });
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [earn, exp, onEligibilityChange, lang, t]);

  const safeExp = result?.daily_expense ?? Math.min(exp, earn - 50);
  const buffer = result?.net_daily_buffer ?? earn - safeExp;

  return (
    <div className="card card-accent-orange" id="eligibility-calculator">
      <div className="eyebrow">Interactive Suite</div>
      <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <IconCalc /> {t("title")}
        <SpeechButton text={`${t("title")}. ${t("sub")}`} lang={lang} />
        {loading && <span className="api-pill">{t("syncing")}</span>}
      </div>
      <div className="card-sub">{t("sub")}</div>

      <div className="calc-slider-row">
        <label>{t("earning")} (₹)</label>
        <input type="range" min={200} max={3000} step={50} value={earn}
          onChange={(e) => setEarn(Number(e.target.value))} />
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <input
            type="number"
            value={earn}
            onChange={(e) => setEarn(Math.max(0, Number(e.target.value)))}
            aria-label={t("earning")}
            style={{
              width: "75px",
              padding: "6px 8px",
              background: "var(--bg-input)",
              border: "1px solid var(--border-medium)",
              borderRadius: "8px",
              color: "var(--text-primary)",
              textAlign: "right",
              fontSize: "13px",
              fontWeight: "600"
            }}
          />
          <VoiceInputButton onTranscript={(val) => setEarn(val)} lang={lang} type="number" />
        </div>
      </div>
      <div className="calc-slider-row">
        <label>{t("expense")} (₹)</label>
        <input type="range" min={100} max={earn - 50} step={50} value={safeExp}
          onChange={(e) => setExp(Number(e.target.value))} />
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <input
            type="number"
            value={safeExp}
            onChange={(e) => setExp(Math.max(0, Number(e.target.value)))}
            aria-label={t("expense")}
            style={{
              width: "75px",
              padding: "6px 8px",
              background: "var(--bg-input)",
              border: "1px solid var(--border-medium)",
              borderRadius: "8px",
              color: "var(--text-primary)",
              textAlign: "right",
              fontSize: "13px",
              fontWeight: "600"
            }}
          />
          <VoiceInputButton onTranscript={(val) => setExp(val)} lang={lang} type="number" />
        </div>
      </div>
      <div className="calc-result">
        <div className="calc-result-left">
          <div className="lbl">{t("buffer")}</div>
          <div className="val">{fmt(buffer)}</div>
        </div>
        {result && (
          <span className={`tier-badge ${result.css_class}`}>{translateLabel(result.label)}</span>
        )}
      </div>
      {result?.recommendation && (
        <p className="calc-recommendation">{translateRecommendation(result.recommendation)}</p>
      )}
    </div>
  );
}
