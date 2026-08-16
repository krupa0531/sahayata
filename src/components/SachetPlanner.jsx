import { useEffect, useState, useCallback } from "react";
import { Sparkles, ShieldAlert, Lightbulb, Calendar } from "lucide-react";
import { getRepaymentPlans } from "../api";

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export default function SachetPlanner({ loanAmount = 90000, lang = "en" }) {
  const [mode, setMode] = useState("daily_flexible");
  const [plans, setPlans] = useState(null);

  const t = useCallback((key) => {
    const dict = {
      en: {
        title: "Sachet Repayment Planner",
        loan: "Loan",
        mlRecommend: " — ML recommends Flexible EDI",
        dailyFixed: "Daily Fixed",
        flexibleEdi: "Flexible EDI",
        monthlyEmi: "Monthly EMI",
        smartTip: "Higher deductions on peak sales days, lower on slow days.",
      },
      hi: {
        title: "सचेत पुनर्भुगतान योजनाकार",
        loan: "ऋण राशि",
        mlRecommend: " — एमएल लचीले दैनिक भुगतान (EDI) की सिफारिश करता है",
        dailyFixed: "निश्चित दैनिक भुगतान",
        flexibleEdi: "लचीला दैनिक भुगतान (EDI)",
        monthlyEmi: "मासिक ईएमआई",
        smartTip: "सप्ताहांत (Weekends) पर भुगतान थोड़ा अधिक, मंदी के दिनों में कम रहता है।",
      },
      gu: {
        title: "સચેત ચુકવણી પ્લાનર",
        loan: "લોન રકમ",
        mlRecommend: " — ML ફ્લેક્સિબલ દૈનિક ચુકવણી (EDI) ની ભલામણ કરે છે",
        dailyFixed: "ફિક્સ દૈનિક ચુકવણી",
        flexibleEdi: "ફ્લેક્સિબલ દૈનિક ચુકવણી (EDI)",
        monthlyEmi: "માસિક EMI",
        smartTip: "શનિ-રવિ પર ચુકવણી થોડી વધારે, અને મંદીના દિવસોમાં ઓછી રહે છે.",
      }
    };
    return dict[lang]?.[key] || dict.en[key];
  }, [lang]);

  const translateDesc = (desc) => {
    if (!desc) return "";
    if (desc.includes("Fixed EDI") || desc.includes("Fixed daily") || desc.includes("નિયમિત") || desc.includes("निश्चित")) {
      return lang === "hi" ? "निश्चित दैनिक भुगतान — ई-मैंडेट / यूपीआई ऑटोपे (रोज सुबह)" : lang === "gu" ? "ફિક્સ દૈનિક ચુકવણી — e-મૅન્ડેટ / UPI ઓટોપે (રોજ સવારે)" : desc;
    }
    if (desc.includes("Flexible EDI") || desc.includes("Flexible daily") || desc.includes("લચીલું") || desc.includes("लचीला")) {
      return lang === "hi" ? "लचीला दैनिक भुगतान — दैनिक संग्रह का भिन्न % (सप्ताहांत पर अधिक, मंदी के दिनों में कम)" : lang === "gu" ? "ફ્લેક્સિબલ દૈનિક ચુકવણી — દૈનિક કલેક્શનના અલગ % (શનિ-રવિ પર વધુ, મંદીના દિવસોમાં ઓછી)" : desc;
    }
    if (desc.includes("Monthly EMI") || desc.includes("Monthly") || desc.includes("માસિક") || desc.includes("मासिक")) {
      return lang === "hi" ? "मासिक ईएमआई — निश्चित तिथि पर ऑटो-डेबिट (महीने की 1 तारीख)" : lang === "gu" ? "માસિક EMI — દરેક મહિનાની ૧ તારીખે ઓટો-દેબિટ" : desc;
    }
    return desc;
  };

  const translateDeductionRule = (rule) => {
    if (!rule) return "";
    if (rule.includes("fixed") || rule.includes("fixed") || rule.includes("નક્કી") || rule.includes("निश्चित")) {
      const match = rule.match(/(\d+)/);
      const val = match ? match[0] : "100";
      return lang === "hi" ? `₹${val}/दिन निश्चित` : lang === "gu" ? `₹${val}/દિવસ નક્કી` : rule;
    }
    if (rule.includes("collection") || rule.includes("sales") || rule.includes("કલેક્શન") || rule.includes("संग्रह")) {
      return lang === "hi" ? "दैनिक यूपीआई संग्रह का 10% (सप्ताह के दिन के अनुसार एमएल-समायोजित)" : lang === "gu" ? "દૈનિક UPI કલેક્શનના ૧૦% (વાર મુજબ ML દ્વારા એડજસ્ટ થયેલ)" : rule;
    }
    if (rule.includes("profit") || rule.includes("નફો") || rule.includes("लाभ")) {
      return lang === "hi" ? "मासिक लाभ का अधिकतम 28%" : lang === "gu" ? "માસિક નફાના મહત્તમ ૨૮%" : rule;
    }
    return rule;
  };

  const translateRetryPolicy = (policy) => {
    if (!policy) return "";
    if (policy.includes("Balance na hone par") || policy.includes("retries") || policy.includes("प्रयास") || policy.includes("પ્રયત્ન")) {
      return lang === "hi" ? "खाते में राशि न होने पर 3 प्रयास (सुबह 6, दोपहर 12, शाम 6 बजे)" : lang === "gu" ? "ખાતામાં બેલેન્સ ન હોવા પર ૩ પ્રયત્ન (સવારે ૬, બપોરે ૧૨, સાંજે ૬)" : policy;
    }
    if (policy.includes("Low-balance") || policy.includes("catch-up") || policy.includes("कमी") || policy.includes("કપાત")) {
      return lang === "hi" ? "कम बैलेंस वाले दिनों की कमी अगले उच्च बिक्री वाले दिन पूरी की जाएगी" : lang === "gu" ? "ઓછા બેલેન્સવાળા દિવસોની કપાત પછીના વધુ વેચાણવાળા દિવસે સરભર કરાશે" : policy;
    }
    if (policy.includes("3 retry attempts") || policy.includes("escalation") || policy.includes("रिपोर्ट") || policy.includes("રિપોર્ટિંગ")) {
      return lang === "hi" ? "5 दिनों में 3 पुनः प्रयास, फिर एनबीएफसी को रिपोर्ट" : lang === "gu" ? "૫ દિવસમાં ૩ પ્રયત્ન, ત્યારબાદ NBFC રિપોર્ટિંગ" : policy;
    }
    return policy;
  };

  const translateBouncePenalty = (penalty) => {
    if (!penalty) return "";
    if (penalty.includes("Bounce hone par") || penalty.includes("penalty") || penalty.includes("जुर्माना") || penalty.includes("દંડ")) {
      return lang === "hi" ? "बाउंस होने पर ₹350 जुर्माना + क्रेडिट स्कोर पर प्रभाव" : lang === "gu" ? "બાઉન્સ થવા પર ₹૩૫૦ દંડ + ક્રેડિટ સ્કોર પર અસર" : penalty;
    }
    return penalty;
  };

  const translateSmartTip = (tip) => {
    if (!tip) return "";
    if (tip.includes("ML model ne detect") || tip.includes("weekends") || tip.includes("સપ્તાહાંત") || tip.includes("શનિ-રવિ")) {
      return lang === "hi" ? "एमएल मॉडल ने पाया कि सप्ताहांत (Weekends) पर अधिक बिक्री होती है — उस दिन भुगतान थोड़ा बढ़ाया जाएगा, और मंगलवार जैसे मंदी के दिनों में कम किया जाएगा।" : lang === "gu" ? "ML મોડેલે જોયું કે શનિ-રવિ પર વધુ વેચાણ થાય છે — તે દિવસે કપાત થોડી વધારવામાં આવશે, અને મંગળવાર જેવા મંદીના દિવસોમાં ઓછી કરાશે।" : tip;
    }
    return tip;
  };

  useEffect(() => {
    getRepaymentPlans(loanAmount)
      .then((res) => {
        setPlans(res);
      })
      .catch(() => {
        setPlans({
          daily_fixed: { 
            amount: "₹100", 
            desc: lang === "hi" 
              ? "निश्चित भुगतान — प्रतिदिन स्वचालित" 
              : lang === "gu"
              ? "ફિક્સ ચુકવણી — રોજ ઓટો-ડેબિટ"
              : "Fixed EDI — daily auto-debit", 
            deduction_rule: lang === "hi" ? "100 रुपये / दिन" : lang === "gu" ? "રૂ. ૧૦૦ / દિવસ" : "INR 100/day" 
          },
          daily_flexible: { 
            amount: "₹620", 
            desc: lang === "hi" 
              ? "लचीला भुगतान — बिक्री के आधार पर" 
              : lang === "gu"
              ? "ફ્લેક્સિબલ ચુકવણી — વેચાણના આધારે"
              : "Flexible EDI — based on sales velocity", 
            deduction_rule: lang === "hi" ? "दैनिक बिक्री का 10%" : lang === "gu" ? "દૈનિક વેચાણના ૧૦%" : "10% of daily collection" 
          },
          monthly: { 
            amount: "₹3,000", 
            desc: lang === "hi" 
              ? "मासिक ईएमआई — हर महीने की 1 तारीख को" 
              : lang === "gu"
              ? "માસિક EMI — દરેક મહિનાની ૧ તારીખે"
              : "Monthly EMI — on the 1st", 
            deduction_rule: lang === "hi" ? "अधिकतम 28% मासिक लाभ" : lang === "gu" ? "મહત્તમ ૨૮% માસિક નફો" : "28% monthly profit max" 
          },
          recommended_mode: "daily_flexible",
          smart_tip: t("smartTip"),
        });
      });
  }, [loanAmount, lang, t]);

  const plan = plans?.[mode];
  const numLoan = typeof loanAmount === "object" ? (loanAmount?.amount || loanAmount?.eligible_limit || 15000) : (Number(loanAmount) || 15000);

  return (
    <div className="sachet-planner-inner" style={{ color: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Micro-Repayment Model
        </span>
        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
          {t("loan")}: <strong style={{ color: "#38bdf8" }}>₹{numLoan.toLocaleString("en-IN")}</strong>
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
        <IconCalendar />
        <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>
          {t("title")}
        </h4>
      </div>
      <p style={{ margin: "0 0 16px 0", fontSize: "12.5px", color: "#94a3b8" }}>
        {plans?.recommended_mode === "daily_flexible" ? `AI Recommended: Flexible EDI dynamically matches peak sales velocity.` : `Select your preferred automatic repayment frequency.`}
      </p>

      {/* Plan Switcher Pills */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          marginBottom: "16px",
          background: "rgba(15, 23, 42, 0.6)",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <button
          type="button"
          onClick={() => setMode("daily_fixed")}
          style={{
            padding: "8px 4px",
            fontSize: "12px",
            fontWeight: "700",
            borderRadius: "8px",
            border: "none",
            background: mode === "daily_fixed" ? "linear-gradient(135deg, #0284c7, #38bdf8)" : "transparent",
            color: mode === "daily_fixed" ? "#ffffff" : "#94a3b8",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {t("dailyFixed")}
        </button>

        <button
          type="button"
          onClick={() => setMode("daily_flexible")}
          style={{
            padding: "8px 4px",
            fontSize: "12px",
            fontWeight: "700",
            borderRadius: "8px",
            border: "none",
            background: mode === "daily_flexible" ? "linear-gradient(135deg, #059669, #34d399)" : "transparent",
            color: mode === "daily_flexible" ? "#0f172a" : "#94a3b8",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <span>{t("flexibleEdi")}</span>
          <Sparkles size={13} color={mode === "daily_flexible" ? "#0f172a" : "#34d399"} />
        </button>

        <button
          type="button"
          onClick={() => setMode("monthly")}
          style={{
            padding: "8px 4px",
            fontSize: "12px",
            fontWeight: "700",
            borderRadius: "8px",
            border: "none",
            background: mode === "monthly" ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "transparent",
            color: mode === "monthly" ? "#ffffff" : "#94a3b8",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {t("monthlyEmi")}
        </button>
      </div>

      {/* Plan Preview Result */}
      {plan && (
        <div
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
            <span style={{ fontSize: "22px", fontWeight: "900", color: "#34d399" }}>
              {plan.amount.replace("INR", "₹")}
            </span>
            <span style={{ fontSize: "11.5px", color: "#38bdf8", fontWeight: "700" }}>
              {plan.deduction_rule ? translateDeductionRule(plan.deduction_rule) : ""}
            </span>
          </div>

          <p style={{ fontSize: "12.5px", color: "#cbd5e1", margin: "0 0 10px 0", lineHeight: "1.4" }}>
            {translateDesc(plan.desc)}
          </p>

          {plan.bounce_penalty && (
            <div style={{ fontSize: "11px", color: "#94a3b8", background: "rgba(255, 255, 255, 0.03)", padding: "6px 10px", borderRadius: "6px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldAlert size={14} color="#f59e0b" />
              <span>{translateBouncePenalty(plan.bounce_penalty)}</span>
            </div>
          )}

          {plans?.smart_tip && mode === "daily_flexible" && (
            <div style={{ fontSize: "11.5px", color: "#a7f3d0", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "8px 12px", borderRadius: "8px", display: "flex", alignItems: "flex-start", gap: "7px" }}>
              <Lightbulb size={15} color="#34d399" style={{ flexShrink: 0, marginTop: "1px" }} />
              <span>{translateSmartTip(plans.smart_tip)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
