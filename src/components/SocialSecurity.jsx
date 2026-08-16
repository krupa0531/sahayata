import { useEffect, useState } from "react";
import { getSocialSecurity } from "../api";

const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const COPY = {
  en: {
    eyebrow: "Social Security",
    title: "Social Security & Pension Ledger",
    loading: "Loading social security status…",
    notLinkedMsg: "PM-SYM pension or Jan Dhan account is not linked yet. Verified balance and overdraft eligibility will appear once official bank integration is completed.",
    statusLbl: "Linkage Status",
    notLinkedVal: "Not Linked",
    notLinkedSub: "Connect Jan Dhan account or e-Shram UAN to view pension corpus.",
    verifiedData: "Verified Scheme Data",
  },
  hi: {
    eyebrow: "सामाजिक सुरक्षा",
    title: "सामाजिक सुरक्षा एवं पेंशन लेजर",
    loading: "सामाजिक सुरक्षा स्थिति लोड हो रही है…",
    notLinkedMsg: "PM-SYM पेंशन या जन-धन खाता अभी लिंक नहीं है। आधिकारिक बैंक एकीकरण पूरा होने के बाद सत्यापित शेष राशि और ओवरड्राफ्ट दिखाई देगा।",
    statusLbl: "लिंकिंग स्थिति",
    notLinkedVal: "लिंक नहीं है",
    notLinkedSub: "पेंशन संचित राशि देखने के लिए जन-धन खाता या ई-श्रम UAN जोड़ें।",
    verifiedData: "सत्यापित योजना डेटा",
  },
  gu: {
    eyebrow: "સામાજિક સુરક્ષા",
    title: "સામાજિક સુરક્ષા અને પેન્શન લેજર",
    loading: "સામાજિક સુરક્ષા સ્થિતિ લોડ થઈ રહી છે…",
    notLinkedMsg: "PM-SYM પેન્શન અથવા જન-ધન ખાતું હજી લિંક નથી. સત્તાવાર બેંક એકીકરણ પૂર્ણ થયા પછી વેરિફાઇડ બેલેન્સ અને ઓવરડ્રાફ્ટ દેખાશે.",
    statusLbl: "જોડાણ સ્થિતિ",
    notLinkedVal: "લિંક કરેલ નથી",
    notLinkedSub: "પેન્શન ભંડોળ જોવા માટે જન-ધન ખાતું અથવા ઈ-શ્રમ UAN જોડો.",
    verifiedData: "ચકાસાયેલ યોજના ડેટા",
  }
};

export default function SocialSecurity({ lang = "en" }) {
  const [data, setData] = useState(null);
  const t = COPY[lang] || COPY.en;

  useEffect(() => {
    getSocialSecurity().then(setData).catch(() => setData(null));
  }, []);

  if (!data) {
    return <div style={{ color: "#94a3b8", fontSize: "13px" }}>{t.loading}</div>;
  }

  if (data.status !== "linked") {
    const message = t.notLinkedMsg;
    return (
      <div className="social-security-inner" style={{ color: "#f8fafc" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ background: "rgba(14, 165, 233, 0.15)", color: "#38bdf8", padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {t.eyebrow}
          </span>
          <span style={{ background: "rgba(249, 115, 22, 0.15)", color: "#fb923c", padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "700" }}>
            Pending e-Shram Link
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <IconShield />
          <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>
            {t.title}
          </h4>
        </div>
        <p style={{ margin: "0 0 16px 0", fontSize: "12.5px", color: "#94a3b8" }}>
          {message}
        </p>

        <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "11.5px", color: "#94a3b8", textTransform: "uppercase" }}>{t.statusLbl}</div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#fb923c", marginTop: "2px" }}>{t.notLinkedVal}</div>
          </div>
          <span style={{ fontSize: "12px", color: "#cbd5e1" }}>{t.notLinkedSub}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="social-security-inner" style={{ color: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "8px" }}>
        <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          ✓ Verified Government Protection
        </span>
        <span style={{ fontSize: "12px", color: "#94a3b8" }}>{t.verifiedData}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <IconShield />
        <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>
          {t.title}
        </h4>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
        {data.pension_cards.map(({ lbl, val, cls, sub, unit }) => (
          <div key={lbl} style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "14px" }}>
            <div style={{ fontSize: "11.5px", color: "#94a3b8", textTransform: "uppercase" }}>{lbl}</div>
            <div style={{ fontSize: "18px", fontWeight: "900", color: "#38bdf8", margin: "4px 0 2px 0" }}>
              {val.replace("INR", "₹")}{unit}
            </div>
            <div style={{ fontSize: "11px", color: "#cbd5e1" }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
