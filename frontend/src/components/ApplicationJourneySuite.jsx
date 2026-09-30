import React from "react";
import {
  Calculator as CalcIcon,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Building,
} from "lucide-react";
import Calculator from "./Calculator";
import KycDocuments from "./KycDocuments";
import ProgressiveReg from "./ProgressiveReg";
import ApplicationStatus from "./ApplicationStatus";

const STEP_METADATA = {
  en: [
    {
      stepNum: 1,
      title: "Check Eligibility",
      subtitle: "Calculate your credit limit from daily earnings & expenses",
      shortDesc: "Income & Limit",
      icon: CalcIcon,
    },
    {
      stepNum: 2,
      title: "Complete e-KYC",
      subtitle: "Upload Aadhaar, Voter ID or Passbook for verification",
      shortDesc: "Identity & Proofs",
      icon: ShieldCheck,
    },
    {
      stepNum: 3,
      title: "Submit Application",
      subtitle: "Fill personal details, occupation, and bank disbursement account",
      shortDesc: "Review & Apply",
      icon: FileText,
    },
    {
      stepNum: 4,
      title: "Track Sanction",
      subtitle: "Live timeline of underwriting, bank sanction, and payout",
      shortDesc: "Sanction Status",
      icon: Clock,
    },
  ],
  hi: [
    {
      stepNum: 1,
      title: "पात्रता जांचें",
      subtitle: "दैनिक आय और खर्च के आधार पर ऋण सीमा की गणना करें",
      shortDesc: "आय व सीमा",
      icon: CalcIcon,
    },
    {
      stepNum: 2,
      title: "e-KYC पूरा करें",
      subtitle: "सत्यापन के लिए आधार कार्ड, वोटर आईडी या पासबुक अपलोड करें",
      shortDesc: "पहचान प्रमाण",
      icon: ShieldCheck,
    },
    {
      stepNum: 3,
      title: "आवेदन जमा करें",
      subtitle: "व्यक्तिगत विवरण, व्यवसाय और बैंक खाता भरें",
      shortDesc: "विवरण व आवेदन",
      icon: FileText,
    },
    {
      stepNum: 4,
      title: "स्थिति ट्रैक करें",
      subtitle: "बैंक स्वीकृति और ऋण वितरण की लाइव स्थिति देखें",
      shortDesc: "स्वीकृति स्थिति",
      icon: Clock,
    },
  ],
  gu: [
    {
      stepNum: 1,
      title: "પાત્રતા ચકાસો",
      subtitle: "દૈનિક આવક અને ખર્ચ પરથી લોન મર્યાદા ગણો",
      shortDesc: "આવક અને લિમિટ",
      icon: CalcIcon,
    },
    {
      stepNum: 2,
      title: "e-KYC પૂરું કરો",
      subtitle: "ઓળખ ચકાસણી માટે આધાર કાર્ડ કે પાસબુક અપલોડ કરો",
      shortDesc: "ઓળખ પુરાવા",
      icon: ShieldCheck,
    },
    {
      stepNum: 3,
      title: "અરજી સબમિટ કરો",
      subtitle: "વ્યક્તિગત વિગતો, વ્યવસાય અને બેંક ખાતું ભરી સબમિટ કરો",
      shortDesc: "વિગતો અને અરજી",
      icon: FileText,
    },
    {
      stepNum: 4,
      title: "સ્થિતિ ટ્રેક કરો",
      subtitle: "બેંક મંજૂરી અને લોન જમા થવાની લાઈવ સ્થિતિ જુઓ",
      shortDesc: "મંજૂરી સ્થિતિ",
      icon: Clock,
    },
  ],
};

export default function ApplicationJourneySuite({
  user,
  journeyStage = 1,
  setJourneyStage,
  activeJourneyStep = 1,
  setActiveJourneyStep,
  eligibleAmount = 15000,
  setEligibleAmount,
  applicationId,
  setApplicationId,
  setAuthMode,
  lang = "en",
  t,
}) {
  const stepsList = STEP_METADATA[lang] || STEP_METADATA.en;
  const currentMeta = stepsList[activeJourneyStep - 1] || stepsList[0];

  const isStep1Done = journeyStage >= 2;
  const isStep2Done = journeyStage >= 3;
  const isStep3Done = journeyStage >= 4 && Boolean(applicationId);

  const completedStepsCount = (isStep1Done ? 1 : 0) + (isStep2Done ? 1 : 0) + (isStep3Done ? 1 : 0);
  const progressPercent = Math.min(100, Math.round((activeJourneyStep / 4) * 100));

  const handleStepClick = (stepNum) => {
    setActiveJourneyStep(stepNum);
  };

  const handleEligibilityChange = (amount) => {
    const cleanNum = typeof amount === "object" ? (amount?.eligible_amount || 15000) : (Number(amount) || 15000);
    setEligibleAmount(cleanNum);
    setJourneyStage((current) => Math.max(current, 2));
    setActiveJourneyStep(2);
  };

  const handleKycUploaded = () => {
    setJourneyStage((current) => Math.max(current, 3));
    setActiveJourneyStep(3);
  };

  const handleApplicationSubmit = (appId) => {
    setApplicationId(appId);
    setJourneyStage(4);
    setActiveJourneyStep(4);
  };

  return (
    <div
      className="application-journey-suite-root"
      style={{
        width: "100%",
        maxWidth: "1240px",
        margin: "0 auto",
      }}
    >
      {/* ========================================================================= */}
      {/* FORM SUITE HEADER & INTERACTIVE WIZARD STEPPER */}
      {/* ========================================================================= */}
      <div
        className="form-suite-container"
        style={{
          background: "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 16, 31, 0.98) 100%)",
          border: "1px solid rgba(56, 189, 248, 0.25)",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(2, 132, 199, 0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Ambient Glow */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "260px",
            height: "260px",
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(2, 132, 199, 0) 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        {/* Top Suite Title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span
                style={{
                  background: "rgba(56, 189, 248, 0.15)",
                  color: "#38bdf8",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "11.5px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {lang === "hi" ? "आधिकारिक ऋण आवेदन प्रक्रिया" : lang === "gu" ? "સત્તાવાર લોન અરજી પ્રક્રિયા" : "Official Credit Application"}
              </span>
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc", margin: "6px 0 4px 0", letterSpacing: "-0.5px" }}>
              {t("journeyTitle", "Interactive Application Suite")}
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14.5px", margin: 0 }}>
              {t("journeySub", "Step-by-step digital underwriting from instant calculator to bank disbursement.")}
            </p>
          </div>

          {/* Form Completion Progress Pill */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "12px 20px",
              minWidth: "220px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "8px" }}>
              <span style={{ color: "#94a3b8", fontWeight: "600" }}>
                {lang === "hi" ? "चरण प्रगति" : lang === "gu" ? "તબક્કા પ્રગતિ" : "Form Progress"}:
              </span>
              <span style={{ color: "#38bdf8", fontWeight: "800" }}>
                {lang === "hi" ? `चरण ${activeJourneyStep} / 4 (${progressPercent}%)` : lang === "gu" ? `તબક્કો ${activeJourneyStep} / ૪ (${progressPercent}%)` : `Step ${activeJourneyStep} of 4 (${progressPercent}%)`}
              </span>
            </div>
            <div style={{ width: "100%", height: "7px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "999px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: activeJourneyStep === 4 ? "linear-gradient(90deg, #10b981, #059669)" : "linear-gradient(90deg, #0284c7, #38bdf8)",
                  borderRadius: "999px",
                  transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </div>
          </div>
        </div>

        {/* 4-Step Horizontal Interactive Stepper Pills */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            marginBottom: "32px",
          }}
        >
          {stepsList.map((st) => {
            const isCurrent = activeJourneyStep === st.stepNum;
            const isCompleted = (st.stepNum === 1 && isStep1Done) || (st.stepNum === 2 && isStep2Done) || (st.stepNum === 3 && isStep3Done);
            const StepIcon = st.icon;

            return (
              <div
                key={st.stepNum}
                onClick={() => handleStepClick(st.stepNum)}
                style={{
                  background: isCurrent
                    ? "linear-gradient(145deg, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)"
                    : isCompleted
                    ? "rgba(16, 185, 129, 0.08)"
                    : "rgba(255, 255, 255, 0.03)",
                  border: isCurrent
                    ? "2px solid #38bdf8"
                    : isCompleted
                    ? "1px solid rgba(16, 185, 129, 0.4)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  padding: "16px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  position: "relative",
                  boxShadow: isCurrent ? "0 0 20px rgba(56, 189, 248, 0.2)" : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span
                    style={{
                      background: isCurrent ? "rgba(56, 189, 248, 0.2)" : isCompleted ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.06)",
                      color: isCurrent ? "#38bdf8" : isCompleted ? "#34d399" : "#94a3b8",
                      padding: "6px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <StepIcon size={18} />
                  </span>

                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "800",
                      color: isCurrent ? "#38bdf8" : isCompleted ? "#34d399" : "#64748b",
                      textTransform: "uppercase",
                    }}
                  >
                    {isCompleted ? (
                      <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                        <CheckCircle2 size={13} /> {lang === "hi" ? "पूर्ण" : lang === "gu" ? "પૂર્ણ" : "Done"}
                      </span>
                    ) : isCurrent ? (
                      lang === "hi" ? "सक्रिय चरण" : lang === "gu" ? "ચાલુ તબક્કો" : "Active"
                    ) : (
                      `0${st.stepNum}`
                    )}
                  </span>
                </div>

                <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px 0" }}>
                  {st.stepNum}. {st.title}
                </h4>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                  {st.shortDesc}
                </p>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* ACTIVE FORM BODY CONTAINER */}
        {/* ========================================================================= */}
        <div
          className="active-form-card"
          style={{
            background: "rgba(11, 19, 36, 0.85)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Step Context Sub-header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              paddingBottom: "16px",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div style={{ fontSize: "12px", fontWeight: "800", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {lang === "hi" ? `चरण 0${activeJourneyStep} • ${currentMeta.title}` : lang === "gu" ? `તબક્કો 0${activeJourneyStep} • ${currentMeta.title}` : `Step 0${activeJourneyStep} • ${currentMeta.title}`}
              </div>
              <div style={{ fontSize: "14px", color: "#cbd5e1", marginTop: "2px" }}>
                {currentMeta.subtitle}
              </div>
            </div>

            {/* Quick Step Switcher */}
            <div style={{ display: "flex", gap: "8px" }}>
              {activeJourneyStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveJourneyStep((prev) => Math.max(1, prev - 1))}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#cbd5e1",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <ArrowLeft size={13} /> {lang === "hi" ? "पिछला" : lang === "gu" ? "પાછળ" : "Previous"}
                </button>
              )}

              {activeJourneyStep < 4 && (
                <button
                  type="button"
                  onClick={() => setActiveJourneyStep((prev) => Math.min(4, prev + 1))}
                  style={{
                    background: "rgba(2, 132, 199, 0.2)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    color: "#38bdf8",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {lang === "hi" ? "अगला" : lang === "gu" ? "આગળ" : "Next"} <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Form Step Component Rendering */}
          <div className="active-form-content">
            {activeJourneyStep === 1 && (
              <Calculator onEligibilityChange={handleEligibilityChange} lang={lang} />
            )}
            {activeJourneyStep === 2 && (
              <KycDocuments
                onUploaded={handleKycUploaded}
                user={user}
                onLoginTrigger={() => setAuthMode && setAuthMode("login")}
                lang={lang}
              />
            )}
            {activeJourneyStep === 3 && (
              <ProgressiveReg
                requestedAmount={eligibleAmount || 15000}
                onApplicationSubmit={handleApplicationSubmit}
                user={user}
                lang={lang}
              />
            )}
            {activeJourneyStep === 4 && (
              <ApplicationStatus
                applicationId={applicationId}
                user={user}
                lang={lang}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
