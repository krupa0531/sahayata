import React, { useState } from "react";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Layers,
  BrainCircuit,
  BarChart3,
  Calendar,
} from "lucide-react";
import DigitalTracker from "./DigitalTracker";
import SachetPlanner from "./SachetPlanner";
import SocialSecurity from "./SocialSecurity";
import UPIHistoryReport from "./UPIHistoryReport";

export default function AdvancedAnalyticsSection({
  eligibleAmount = 15000,
  lang = "en",
  t,
}) {
  const [isOpen, setIsOpen] = useState(true);

  const copy = {
    en: {
      badge: "Deep-Dive Financial Intelligence",
      title: "Advanced Analytics & Credit History Insights",
      subtitle: "Explore interactive UPI cash-flow velocity, flexible sachet repayment models, social security linkage, and Account Aggregator transaction ledgers.",
      optionalBadge: "Interactive Suite",
      collapseBtn: "Hide Analytics Suite",
      expandBtn: "View Advanced Analytics & Credit Insights",
      tabTracker: "Cashflow & Velocity",
      tabPlanner: "Repayment Modes",
      tabSecurity: "Welfare & Social Security",
      tabLedger: "RBI Account Aggregator Ledger",
    },
    hi: {
      badge: "गहन वित्तीय विश्लेषण इंजन",
      title: "उन्नत विश्लेषिकी एवं क्रेडिट इतिहास विश्लेषण",
      subtitle: "UPI लेनदेन वेग, सचेत पुनर्भुगतान योजना, सामाजिक सुरक्षा और RBI अकाउंट एग्रीगेटर लेजर का विस्तृत विश्लेषण देखें।",
      optionalBadge: "इंटरैक्टिव सुइट",
      collapseBtn: "एनालिटिक्स सुइट छिपाएं",
      expandBtn: "उन्नत विश्लेषिकी एवं क्रेडिट अंतर्दृष्टि देखें",
      tabTracker: "कैश-फ्लो एवं गति",
      tabPlanner: "पुनर्भुगतान मोड",
      tabSecurity: "कल्याण एवं पेंशन",
      tabLedger: "अकाउंट एग्रीगेटर लेजर",
    },
    gu: {
      badge: "ઊંડાણપૂર્વક નાણાકીય વિશ્લેષણ",
      title: "અદ્યતન એનાલિટિક્સ અને ક્રેડિટ ઇતિહાસ વિશ્લેષણ",
      subtitle: "UPI વ્યવહાર ઝડપ, સચેત ચુકવણી મોડેલ, સામાજિક સુરક્ષા અને RBI એકાઉન્ટ એગ્રીગેટર લેજરનું વિશ્લેષણ જુઓ.",
      optionalBadge: "ઇન્ટરેક્ટિવ સ્યુટ",
      collapseBtn: "એનાલિટિક્સ છુપાવો",
      expandBtn: "અદ્યતન એનાલિટિક્સ અને ક્રેડિટ વિગતો જુઓ",
      tabTracker: "કેશ-ફ્લો અને ઝડપ",
      tabPlanner: "ચુકવણી મોડ્સ",
      tabSecurity: "કલ્યાણ અને પેન્શન",
      tabLedger: "એકાઉન્ટ એગ્રીગેટર લેજર",
    },
  };

  const text = copy[lang] || copy.en;

  return (
    <div
      className="advanced-analytics-section-root"
      style={{
        width: "100%",
        maxWidth: "1240px",
        margin: "40px auto 0 auto",
      }}
    >
      <div
        style={{
          background: "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 16, 31, 0.98) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Ambient Background Gradient */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        {/* Section Header with Toggle */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            userSelect: "none",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(56, 189, 248, 0.25) 100%)",
                border: "1px solid rgba(99, 102, 241, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#818cf8",
                boxShadow: "0 0 15px rgba(99, 102, 241, 0.3)",
              }}
            >
              <BrainCircuit size={24} />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span
                  style={{
                    background: "rgba(99, 102, 241, 0.15)",
                    color: "#a5b4fc",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    fontSize: "11px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {text.badge}
                </span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>•</span>
                <span style={{ fontSize: "11.5px", color: "#38bdf8", fontWeight: "700" }}>
                  {text.optionalBadge}
                </span>
              </div>

              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#f8fafc", margin: 0, letterSpacing: "-0.3px" }}>
                {text.title}
              </h3>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              type="button"
              style={{
                background: isOpen ? "rgba(99, 102, 241, 0.2)" : "rgba(255, 255, 255, 0.05)",
                border: isOpen ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid rgba(255, 255, 255, 0.12)",
                color: isOpen ? "#c7d2fe" : "#cbd5e1",
                padding: "8px 18px",
                borderRadius: "12px",
                fontSize: "12.5px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {isOpen ? (
                <>
                  <span>{text.collapseBtn}</span>
                  <ChevronUp size={16} />
                </>
              ) : (
                <>
                  <span>{text.expandBtn}</span>
                  <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section Subtitle */}
        {isOpen && (
          <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: "16px 0 24px 0", lineHeight: "1.5" }}>
            {text.subtitle}
          </p>
        )}

        {/* Expandable Suite Body */}
        {isOpen && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* ROW 1: 2-Column Grid for Digital Tracker & Sachet Planner */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "20px",
              }}
            >
              <div style={{ background: "rgba(11, 19, 36, 0.75)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "18px", padding: "20px" }}>
                <DigitalTracker lang={lang} />
              </div>

              <div style={{ background: "rgba(11, 19, 36, 0.75)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "18px", padding: "20px" }}>
                <SachetPlanner loanAmount={eligibleAmount || 15000} lang={lang} />
              </div>
            </div>

            {/* ROW 2: Full-Width Social Security Card */}
            <div style={{ background: "rgba(11, 19, 36, 0.75)", border: "1px solid rgba(14, 165, 233, 0.2)", borderRadius: "18px", padding: "20px" }}>
              <SocialSecurity lang={lang} />
            </div>

            {/* ROW 3: Full-Width Multi-Rail UPI & Account Aggregator Credit Ledger */}
            <div style={{ background: "rgba(11, 19, 36, 0.85)", border: "1px solid rgba(168, 85, 247, 0.25)", borderRadius: "18px", padding: "20px" }}>
              <UPIHistoryReport lang={lang} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
