import { useEffect, useState, useCallback } from "react";
import { calculateEligibility } from "../api";
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
  }, [earn, exp, lang, t]);

  const safeExp = result?.daily_expense ?? Math.min(exp, earn - 50);
  const buffer = result?.net_daily_buffer ?? earn - safeExp;

  return (
    <div className="official-form-section" id="eligibility-calculator">
      {/* Form Section Banner */}
      <div style={{ background: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", padding: "8px", borderRadius: "10px" }}>
            <IconCalc />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>
              {t("title")}
            </h3>
            <span style={{ fontSize: "12.5px", color: "#94a3b8" }}>{t("sub")}</span>
          </div>
        </div>
        {loading && <span className="api-pill" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "4px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "700" }}>{t("syncing")}</span>}
      </div>

      {/* 2-Column Form Fields */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Field 1: Daily Earning */}
        <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <label style={{ fontSize: "13.5px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>
              {t("earning")} (₹ / Day)
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "16px", fontWeight: "800", color: "#38bdf8" }}>₹{earn.toLocaleString("en-IN")}</span>
              <VoiceInputButton onTranscript={(val) => setEarn(val)} lang={lang} type="number" />
            </div>
          </div>

          <input
            type="range"
            min={200}
            max={3000}
            step={50}
            value={earn}
            onChange={(e) => setEarn(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#38bdf8", cursor: "pointer", marginBottom: "12px" }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "#64748b" }}>Min: ₹200</span>
            <input
              type="number"
              value={earn}
              onChange={(e) => setEarn(Math.max(0, Number(e.target.value)))}
              aria-label={t("earning")}
              style={{
                width: "90px",
                padding: "6px 10px",
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                borderRadius: "8px",
                color: "#f8fafc",
                textAlign: "right",
                fontSize: "13.5px",
                fontWeight: "700",
              }}
            />
            <span style={{ fontSize: "11px", color: "#64748b" }}>Max: ₹3,000</span>
          </div>
        </div>

        {/* Field 2: Daily Expenses */}
        <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <label style={{ fontSize: "13.5px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>
              {t("expense")} (₹ / Day)
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "16px", fontWeight: "800", color: "#f59e0b" }}>₹{safeExp.toLocaleString("en-IN")}</span>
              <VoiceInputButton onTranscript={(val) => setExp(val)} lang={lang} type="number" />
            </div>
          </div>

          <input
            type="range"
            min={100}
            max={earn - 50}
            step={50}
            value={safeExp}
            onChange={(e) => setExp(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer", marginBottom: "12px" }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "#64748b" }}>Min: ₹100</span>
            <input
              type="number"
              value={safeExp}
              onChange={(e) => setExp(Math.max(0, Number(e.target.value)))}
              aria-label={t("expense")}
              style={{
                width: "90px",
                padding: "6px 10px",
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                borderRadius: "8px",
                color: "#f8fafc",
                textAlign: "right",
                fontSize: "13.5px",
                fontWeight: "700",
              }}
            />
            <span style={{ fontSize: "11px", color: "#64748b" }}>Max: ₹{(earn - 50).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Official Assessment Summary Result Card */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)",
          border: "1px solid rgba(56, 189, 248, 0.3)",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>
            {t("buffer")}
          </div>
          <div style={{ fontSize: "24px", fontWeight: "900", color: "#34d399", marginTop: "2px" }}>
            {fmt(buffer)} <span style={{ fontSize: "13px", fontWeight: "600", color: "#94a3b8" }}>/ Day</span>
          </div>
          <div style={{ fontSize: "12.5px", color: "#cbd5e1", marginTop: "4px" }}>
            Estimated Monthly Disposable Savings: <strong style={{ color: "#38bdf8" }}>₹{(buffer * 26).toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {result && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>
              {lang === "hi" ? "पात्रता स्थिति" : lang === "gu" ? "પાત્રતા સ્થિતિ" : "Eligibility Tier"}
            </div>
            <span
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #0284c7, #38bdf8)",
                color: "#ffffff",
                padding: "6px 16px",
                borderRadius: "999px",
                fontSize: "13.5px",
                fontWeight: "800",
                boxShadow: "0 2px 10px rgba(2, 132, 199, 0.4)",
              }}
            >
              {translateLabel(result.label)}
            </span>
          </div>
        )}
      </div>

      {result?.recommendation && (
        <div style={{ background: "rgba(56, 189, 248, 0.06)", borderLeft: "3px solid #38bdf8", borderRadius: "8px", padding: "12px 16px", marginBottom: "24px", color: "#cbd5e1", fontSize: "13px", lineHeight: "1.5" }}>
          <strong>{lang === "hi" ? "सिफारिश:" : lang === "gu" ? "ભલામણ:" : "Recommendation:"}</strong> {translateRecommendation(result.recommendation)}
        </div>
      )}

      {/* Primary Form Proceed Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <button
          type="button"
          onClick={() => onEligibilityChange && onEligibilityChange(result?.eligible_amount || 15000)}
          className="btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 28px",
            fontSize: "14px",
            fontWeight: "700",
            borderRadius: "12px",
            boxShadow: "0 4px 18px rgba(2, 132, 199, 0.4)",
            cursor: "pointer",
          }}
        >
          {lang === "hi" ? "आय विवरण सहेजें और e-KYC पर आगे बढ़ें →" : lang === "gu" ? "આવક વિગતો સાચવો અને e-KYC પર આગળ વધો →" : "Save Income Details & Continue to e-KYC →"}
        </button>
      </div>
    </div>
  );
}
