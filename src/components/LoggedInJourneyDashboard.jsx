import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  FileText,
  Landmark,
  Calculator as CalcIcon,
  Mic,
  Sparkles,
  TrendingUp,
  UserCheck,
  Layers,
  AlertCircle,
  FileCheck2,
  Building,
} from "lucide-react";

export default function LoggedInJourneyDashboard({
  user,
  journeyStage = 1,
  activeJourneyStep = 1,
  setActiveJourneyStep,
  eligibleAmount = null,
  applicationId = null,
  onOpenAuth,
  onTriggerVoice,
  lang = "en",
  t,
}) {
  const cleanAmt = typeof eligibleAmount === "object" ? (eligibleAmount?.eligible_amount || 0) : (Number(eligibleAmount) || 0);

  // Real sequential progress states
  const isStep1Done = journeyStage >= 2;
  const isStep2Done = journeyStage >= 3;
  const isStep3Done = journeyStage >= 4 && Boolean(applicationId);

  const completedCount = (isStep1Done ? 1 : 0) + (isStep2Done ? 1 : 0) + (isStep3Done ? 1 : 0);
  const progressPercent = Math.round((completedCount / 3) * 100);

  const getStepState = (stepNum) => {
    if (stepNum === 1) {
      if (isStep1Done) return "completed";
      if (activeJourneyStep === 1) return "active";
      return "not_started";
    }
    if (stepNum === 2) {
      if (isStep2Done) return "completed";
      if (activeJourneyStep === 2 && isStep1Done) return "active";
      return "not_started";
    }
    if (stepNum === 3) {
      if (isStep3Done) return "completed";
      if (activeJourneyStep === 3 && isStep2Done) return "active";
      return "not_started";
    }
    return "not_started";
  };

  const stepsData = [
    {
      stepNum: 1,
      title: t("step1Name", "Check Eligibility"),
      desc: t("step1Desc", "Determine your financial eligibility"),
      state: getStepState(1),
    },
    {
      stepNum: 2,
      title: t("step2Name", "Complete e-KYC"),
      desc: t("step2Desc", "Verify your identity securely"),
      state: getStepState(2),
    },
    {
      stepNum: 3,
      title: t("step3Name", "Submit Application"),
      desc: t("step3Desc", "Submit application for bank underwriting"),
      state: getStepState(3),
    },
  ];

  const handleStepClick = (stepNum) => {
    setActiveJourneyStep(stepNum);
    const el = document.getElementById("application-journey") || document.getElementById("application-journey-container") || document.getElementById("registration-form") || document.getElementById("eligibility-calculator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleContinueJourney = () => {
    let nextStep = 1;
    if (!isStep1Done) nextStep = 1;
    else if (!isStep2Done) nextStep = 2;
    else if (!isStep3Done) nextStep = 3;
    else nextStep = 4;

    setActiveJourneyStep(nextStep);
    const el = document.getElementById("application-journey") || document.getElementById("application-journey-container") || document.getElementById("registration-form") || document.getElementById("eligibility-calculator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const userName = user?.full_name || user?.name || user?.username || "Applicant";

  return (
    <div className="logged-in-dashboard-root" style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "20px 20px 0 20px" }}>
      {/* ========================================================================= */}
      {/* 1. WELCOME & 3-STEP APPLICATION PROGRESS TRACKER */}
      {/* ========================================================================= */}
      <div
        className="journey-hero-card"
        style={{
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 16, 31, 0.98) 100%)",
          border: "1px solid rgba(56, 189, 248, 0.25)",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(2, 132, 199, 0.12)",
          marginBottom: "28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow ambient background element */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "220px",
            height: "220px",
            background: "radial-gradient(circle, rgba(2, 132, 199, 0.25) 0%, rgba(2, 132, 199, 0) 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        {/* Top Header Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <span style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {user ? "Verified Profile" : "Application Workflow"}
              </span>
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc", margin: "6px 0 4px 0", letterSpacing: "-0.5px" }}>
              {t("welcomeBack")} {userName}
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "14.5px", margin: 0 }}>
              {t("profileSubtitle")}
            </p>
          </div>

          {/* Overall Progress Widget */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "12px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              minWidth: "220px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px" }}>
              <span style={{ color: "#94a3b8", fontWeight: "600" }}>{t("progressLabel", "Progress:")}</span>
              <span style={{ color: "#38bdf8", fontWeight: "800" }}>
                {completedCount} / 3 {t("progressCompletedOf", "completed")} ({progressPercent}%)
              </span>
            </div>
            {/* Progress bar container */}
            <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "999px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: progressPercent === 100 ? "linear-gradient(90deg, #10b981, #059669)" : "linear-gradient(90deg, #0284c7, #38bdf8)",
                  borderRadius: "999px",
                  transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </div>
          </div>
        </div>

        {/* 3-Step Visual Progression Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {stepsData.map((st) => {
            const isCompleted = st.state === "completed";
            const isActive = st.state === "active";
            const isNotStarted = st.state === "not_started";

            return (
              <div
                key={st.stepNum}
                onClick={() => handleStepClick(st.stepNum)}
                style={{
                  background: isActive
                    ? "linear-gradient(145deg, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)"
                    : isCompleted
                    ? "rgba(16, 185, 129, 0.08)"
                    : "rgba(255, 255, 255, 0.03)",
                  border: isActive
                    ? "2px solid #38bdf8"
                    : isCompleted
                    ? "1px solid rgba(16, 185, 129, 0.4)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "18px",
                  padding: "18px 20px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  position: "relative",
                  boxShadow: isActive ? "0 0 20px rgba(56, 189, 248, 0.25)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "800",
                      color: isActive ? "#38bdf8" : isCompleted ? "#34d399" : "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    STEP 0{st.stepNum}
                  </span>
                  {/* Status Indicator Icon */}
                  {isCompleted ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#34d399", fontSize: "11.5px", fontWeight: "700" }}>
                      <CheckCircle2 size={16} color="#34d399" /> {t("statusCompleted", "Completed")}
                    </span>
                  ) : isActive ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#38bdf8", fontSize: "11.5px", fontWeight: "700" }}>
                      <Clock size={15} color="#38bdf8" /> {t("statusInProgress", "In progress")}
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#64748b", fontSize: "11.5px", fontWeight: "600" }}>
                      <Circle size={14} color="#64748b" /> {t("statusNotStarted", "Not started")}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px 0" }}>
                  {st.title}
                </h3>
                <p style={{ fontSize: "12.5px", color: "#94a3b8", margin: 0, lineHeight: 1.4 }}>
                  {st.desc}
                </p>

                {isActive && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontSize: "12px", fontWeight: "700", marginTop: "12px" }}>
                    <span>{t("btnContinue", "Continue")}</span>
                    <ArrowRight size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Primary CTA Row */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "18px" }}>
          <button
            onClick={handleContinueJourney}
            className="btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              fontSize: "14.5px",
              fontWeight: "700",
              borderRadius: "12px",
              boxShadow: "0 4px 18px rgba(2, 132, 199, 0.4)",
            }}
          >
            {isStep3Done
              ? t("btnReviewApp", "Review Sanction Status →")
              : isStep2Done
              ? t("btnStep3", "Submit Application Form →")
              : isStep1Done
              ? t("btnStep2", "Complete e-KYC →")
              : t("btnStartStep", "Start Application →")}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. COMPACT FINANCIAL PROFILE DASHBOARD */}
      {/* ========================================================================= */}
      <div
        style={{
          background: "linear-gradient(145deg, rgba(17, 24, 39, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "28px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={18} color="#38bdf8" />
            <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
              {t("dashboardTitle", "Your Financial Profile")}
            </h2>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => handleStepClick(activeJourneyStep)}
              style={{
                background: "rgba(2, 132, 199, 0.2)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                color: "#38bdf8",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              {t("btnContinue", "Continue Application")}
            </button>
          </div>
        </div>

        {/* 5 Financial Overview Metric Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
          }}
        >
          {/* Card 1: Eligibility */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "14px", padding: "14px 16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
              {t("dashEligibility", "Eligibility")}
            </div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: isStep1Done ? "#34d399" : "#f59e0b", display: "flex", alignItems: "center", gap: "6px" }}>
              {isStep1Done ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              {isStep1Done && cleanAmt > 0 ? `₹${cleanAmt.toLocaleString("en-IN")} Limit` : "Pending"}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
              {isStep1Done ? "Tier 1 Micro-ticket" : "Calculate in Step 1"}
            </div>
          </div>

          {/* Card 2: e-KYC */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "14px", padding: "14px 16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
              {t("dashEkyc", "e-KYC Status")}
            </div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: isStep2Done ? "#34d399" : "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
              {isStep2Done ? <CheckCircle2 size={16} /> : <UserCheck size={16} />}
              {isStep2Done ? t("dashVerified", "Verified") : t("dashPending", "Pending")}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
              {isStep2Done ? "Aadhaar / ID linked" : "Upload in Step 2"}
            </div>
          </div>

          {/* Card 3: Application */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "14px", padding: "14px 16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
              {t("dashApplication", "Application")}
            </div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: isStep3Done ? "#34d399" : "#cbd5e1", display: "flex", alignItems: "center", gap: "6px" }}>
              {isStep3Done ? <CheckCircle2 size={16} /> : <FileText size={16} />}
              {isStep3Done && applicationId ? `ID: ${String(applicationId).slice(0, 12)}` : t("dashNotSubmitted", "Not Submitted")}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
              {isStep3Done ? "Under bank review" : "Submit in Step 3"}
            </div>
          </div>

          {/* Card 4: Documents */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "14px", padding: "14px 16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
              {t("dashDocuments", "Documents")}
            </div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#f8fafc", display: "flex", alignItems: "center", gap: "6px" }}>
              <FileCheck2 size={16} color={isStep2Done ? "#34d399" : "#38bdf8"} />
              {isStep2Done ? "2 / 2" : "0 / 2"} {t("dashUploaded", "uploaded")}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
              {isStep2Done ? "Aadhaar & Passbook verified" : "Aadhaar & Passbook"}
            </div>
          </div>

          {/* Card 5: Recommended */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "14px", padding: "14px 16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
              {t("dashRecommended", "Recommended")}
            </div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#38bdf8", display: "flex", alignItems: "center", gap: "6px" }}>
              <Building size={16} color="#38bdf8" />
              2 {t("dashSchemesAvail", "schemes")}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
              PM SVANidhi & e-Shram
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. QUICK ACTIONS GRID */}
      {/* ========================================================================= */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "13px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>
          {t("quickActionsTitle", "Quick Actions")}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "14px",
          }}
        >
          {/* Action 1: Loan / Credit */}
          <div
            onClick={() => handleStepClick(3)}
            style={{
              background: "linear-gradient(145deg, rgba(22, 36, 64, 0.8), rgba(11, 19, 36, 0.8))",
              border: "1px solid rgba(56, 189, 248, 0.15)",
              borderRadius: "16px",
              padding: "16px",
              cursor: "pointer",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#38bdf8"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8", padding: "8px", borderRadius: "10px" }}>
                <CreditCard size={18} />
              </span>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>{t("qaLoan", "Apply for Credit")}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>{t("qaLoanSub", "Explore available sachet micro-loans")}</div>
          </div>

          {/* Action 2: Government Schemes */}
          <div
            onClick={() => scrollToSection("schemes-section")}
            style={{
              background: "linear-gradient(145deg, rgba(22, 36, 64, 0.8), rgba(11, 19, 36, 0.8))",
              border: "1px solid rgba(56, 189, 248, 0.15)",
              borderRadius: "16px",
              padding: "16px",
              cursor: "pointer",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#38bdf8"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8", padding: "8px", borderRadius: "10px" }}>
                <Landmark size={18} />
              </span>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>{t("qaSchemes", "Government Schemes")}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>{t("qaSchemesSub", "Find welfare schemes relevant to you")}</div>
          </div>

          {/* Action 3: Documents */}
          <div
            onClick={() => handleStepClick(2)}
            style={{
              background: "linear-gradient(145deg, rgba(22, 36, 64, 0.8), rgba(11, 19, 36, 0.8))",
              border: "1px solid rgba(56, 189, 248, 0.15)",
              borderRadius: "16px",
              padding: "16px",
              cursor: "pointer",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#38bdf8"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8", padding: "8px", borderRadius: "10px" }}>
                <FileText size={18} />
              </span>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>{t("qaDocs", "e-KYC Documents")}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>{t("qaDocsSub", "View and upload verification documents")}</div>
          </div>

          {/* Action 4: Eligibility Check */}
          <div
            onClick={() => handleStepClick(1)}
            style={{
              background: "linear-gradient(145deg, rgba(22, 36, 64, 0.8), rgba(11, 19, 36, 0.8))",
              border: "1px solid rgba(56, 189, 248, 0.15)",
              borderRadius: "16px",
              padding: "16px",
              cursor: "pointer",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#38bdf8"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8", padding: "8px", borderRadius: "10px" }}>
                <CalcIcon size={18} />
              </span>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>{t("qaCalc", "Check Eligibility")}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>{t("qaCalcSub", "Calculate real-time borrowing limit")}</div>
          </div>

          {/* Action 5: Voice Guidance */}
          <div
            onClick={() => onTriggerVoice && onTriggerVoice()}
            style={{
              background: "linear-gradient(145deg, rgba(2, 132, 199, 0.2), rgba(15, 23, 42, 0.8))",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              borderRadius: "16px",
              padding: "16px",
              cursor: "pointer",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#38bdf8"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", padding: "8px", borderRadius: "10px" }}>
                <Mic size={18} />
              </span>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>{t("qaVoice", "Voice Guidance")}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>{t("qaVoiceSub", "Speak in Hindi, Gujarati or English")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
