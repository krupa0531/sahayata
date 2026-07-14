import { useEffect, useState, useCallback } from "react";
import { getRepaymentPlans } from "../api";
import SpeechButton from "./SpeechButton";

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
        smartTip: "Weekends par deduction thodi zyada, slow days par kam.",
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

  return (
    <div className="card card-accent-green">
      <div className="eyebrow">Interactive Suite</div>
      <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <IconCalendar /> {t("title")}
        <SpeechButton text={`${t("title")}. ${t("loan")} ${loanAmount} rupees. ${plans?.recommended_mode === "daily_flexible" ? t("mlRecommend") : ""}`} lang={lang} />
      </div>
      <div className="card-sub">
        {t("loan")}: <strong>₹{loanAmount.toLocaleString("en-IN")}</strong>
        {plans?.recommended_mode === "daily_flexible" && t("mlRecommend")}
      </div>

      <div className="plan-toggle">
        <button className={`plan-btn${mode === "daily_fixed" ? " active" : ""}`} onClick={() => setMode("daily_fixed")}>{t("dailyFixed")}</button>
        <button className={`plan-btn${mode === "daily_flexible" ? " active" : ""}`} onClick={() => setMode("daily_flexible")}>{t("flexibleEdi")}</button>
        <button className={`plan-btn${mode === "monthly" ? " active" : ""}`} onClick={() => setMode("monthly")}>{t("monthlyEmi")}</button>
      </div>
      {plan && (
        <div className="plan-preview">
          <div className="amount">{plan.amount.replace("INR", "₹")}</div>
          <div className="desc">{translateDesc(plan.desc)}</div>
          <div className="plan-note">{translateDeductionRule(plan.deduction_rule)}</div>
          {plan.retry_policy && <div className="plan-note">{translateRetryPolicy(plan.retry_policy)}</div>}
          {plan.bounce_penalty && <div className="plan-note">{translateBouncePenalty(plan.bounce_penalty)}</div>}
          {plans?.smart_tip && mode === "daily_flexible" && (
            <div className="plan-note plan-tip">{translateSmartTip(plans.smart_tip)}</div>
          )}
        </div>
      )}
    </div>
  );
}
