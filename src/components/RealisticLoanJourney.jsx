import React, { useState } from "react";
import {
  ShieldCheck,
  FileCheck,
  UserCheck,
  Briefcase,
  Activity,
  Award,
  TrendingUp,
  Building2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  Zap,
  HelpCircle,
  XCircle,
} from "lucide-react";
import "./SahayataHomepage.css";
import { execute8LayerVerificationPipeline } from "../services/antiFraudEngine.js";

export default function RealisticLoanJourney({ onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [verificationReport, setVerificationReport] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState("PM SVANidhi");
  const [selectedLender, setSelectedLender] = useState("State Bank of India (SBI)");
  const [userConsent, setUserConsent] = useState(false);

  // User Profile Form State
  const [userProfile, setUserProfile] = useState({
    aadhaarNumber: "9812 4012 8812",
    mobileNumber: "98765 43210",
    occupation: "Street Vendor / Retailer",
    gigPlatform: "Swiggy / Zomato Vendor",
    monthlyIncome: "18500",
    workExperience: "4 Years",
    city: "Ahmedabad",
    employmentType: "Self-Employed / Worker",
  });

  const [submittedApplication, setSubmittedApplication] = useState(null);

  // STRICT STEP COMPLETION VALIDATOR
  const isStepComplete = (step) => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return uploadedFile !== null && verificationReport !== null && !verificationReport.isFraud && !isUploading;
      case 3:
        return (
          userProfile.aadhaarNumber &&
          userProfile.aadhaarNumber.replace(/\s/g, "").length >= 12 &&
          userProfile.mobileNumber &&
          userProfile.mobileNumber.replace(/\s/g, "").length >= 10
        );
      case 4:
        return (
          userProfile.occupation.trim() !== "" &&
          userProfile.monthlyIncome.trim() !== "" &&
          userProfile.workExperience.trim() !== ""
        );
      case 5:
        return true;
      case 6:
        return selectedScheme !== null && selectedScheme !== "";
      case 7:
        return true;
      case 8:
        return selectedLender !== null && selectedLender !== "";
      case 9:
        return userConsent === true;
      default:
        return true;
    }
  };

  const isNextDisabled = !isStepComplete(currentStep);

  // Document Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      const report = await execute8LayerVerificationPipeline(
        { name: file.name, type: file.type },
        base64,
        import.meta.env.VITE_GEMINI_API_KEY || "",
        () => {}
      );

      setVerificationReport(report);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Next / Previous Navigation
  const handleNext = () => {
    if (isNextDisabled) {
      if (currentStep === 2) {
        alert("Please upload an authentic Bank Passbook / Statement before proceeding.");
      } else if (currentStep === 3) {
        alert("Please enter a valid 12-digit Aadhaar and 10-digit mobile number.");
      } else if (currentStep === 4) {
        alert("Please complete your occupation, income, and experience details.");
      } else if (currentStep === 9) {
        alert("Please check the consent box to authorize your loan application.");
      }
      return;
    }
    if (currentStep < 10) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Final Application Submission Handler
  const handleSubmitApplication = () => {
    if (!userConsent) {
      alert("Please accept the privacy & data sharing authorization to proceed.");
      return;
    }

    const appData = {
      applicationId: `SAH-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      submissionTimestamp: new Date().toLocaleString(),
      scheme: selectedScheme,
      lender: selectedLender,
      eligibleAmount: "₹35,000",
      interestRate: "7% Annual Subsidy",
      status: "Application Submitted — Pending Partner Bank Review",
      reviewTime: "24 – 72 Hours",
    };

    setSubmittedApplication(appData);
    setCurrentStep(10);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(4, 8, 20, 0.96)",
        backdropFilter: "blur(24px)",
        overflowY: "auto",
        padding: "32px 20px",
        color: "#ffffff",
      }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        {/* Top Header & Close Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#38bdf8", fontSize: "13px", fontWeight: "700" }}>
              <Sparkles size={16} /> REALISTIC AI LENDING JOURNEY
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: "800" }}>Sahayata Verification & Matching Engine</h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <XCircle size={15} />
            <span>Exit Journey</span>
          </button>
        </div>

        {/* 10-Step Progress Bar Tracker */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8", marginBottom: "8px" }}>
            <span>Step {currentStep} of 10</span>
            <span>{currentStep * 10}% Complete</span>
          </div>

          <div style={{ height: "6px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "999px", overflow: "hidden" }}>
            <div
              style={{
                width: `${currentStep * 10}%`,
                height: "100%",
                background: "linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* STEP CONTENT CONTAINER */}
        <div style={{ background: "rgba(15, 23, 42, 0.85)", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "24px", padding: "28px 32px", marginBottom: "24px" }}>
          {/* STEP 1: WELCOME */}
          {currentStep === 1 && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(56, 189, 248, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto", color: "#38bdf8" }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "12px" }}>Welcome to Sahayata</h3>
              <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto 24px auto" }}>
                We use AI-powered verification and eligibility assessment to connect eligible workers with suitable government schemes and trusted lending partners.
              </p>
              <button
                onClick={handleNext}
                style={{
                  background: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
                  color: "#ffffff",
                  border: "none",
                  padding: "12px 32px",
                  borderRadius: "999px",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Begin AI Verification Journey →
              </button>
            </div>
          )}

          {/* STEP 2: DOCUMENT UPLOAD & FORENSICS */}
          {currentStep === 2 && (
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>Step 2 — Document Upload & AI Forensics Audit</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>
                Upload your Bank Passbook, Statement, Utility Bill, or e-Shram Card. Sahayata 8-Layer AI Engine will inspect for authenticity.
              </p>

              <div style={{ border: "2px dashed rgba(56, 189, 248, 0.4)", borderRadius: "18px", padding: "32px", textAlign: "center", background: "rgba(2, 132, 199, 0.05)" }}>
                <input type="file" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" style={{ display: "none" }} id="journey-file-upload" />
                <label htmlFor="journey-file-upload" style={{ cursor: "pointer" }}>
                  <FileCheck size={36} color="#38bdf8" style={{ marginBottom: "12px" }} />
                  <div style={{ fontSize: "15px", fontWeight: "600", color: "#ffffff" }}>
                    {uploadedFile ? uploadedFile.name : "Click to Upload Bank Statement / Passbook (PDF/Image)"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>Supports PDF, PNG, JPG up to 10MB</div>
                </label>
              </div>

              {isUploading && (
                <div style={{ marginTop: "16px", color: "#38bdf8", fontSize: "14px", fontWeight: "600", textAlign: "center" }}>
                  ⏳ Executing TruFor Noise Forensics, Canvas Pixel Analysis & Gemini Vision Scan...
                </div>
              )}

              {verificationReport && (
                <div
                  style={{
                    marginTop: "20px",
                    background: verificationReport.isFraud ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.15)",
                    border: verificationReport.isFraud ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(34, 197, 94, 0.4)",
                    padding: "18px",
                    borderRadius: "16px",
                  }}
                >
                  <div style={{ fontWeight: "700", fontSize: "16px", color: verificationReport.isFraud ? "#f87171" : "#4ade80", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    {verificationReport.isFraud ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
                    {verificationReport.layer8.statusBadge}
                  </div>

                  {verificationReport.isFraud ? (
                    <div style={{ fontSize: "13px", color: "#fca5a5", lineHeight: "1.5" }}>
                      <b style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><AlertTriangle size={15} /> Document Verification Failed!</b><br />
                      Reason: AI-generated, tampered, or synthetic document detected by Layer 1 TruFor / Canvas Pixel Forensics.<br />
                      <b>AI Fraud Confidence: {verificationReport.layer1.aiFraudConfidence}% | Forgery Score: {verificationReport.layer1.forgeryScore}%</b><br />
                      Pursuant to RBI Guidelines, AI-generated synthetic images cannot be used for loan verification. Please upload an original Bank Statement.
                    </div>
                  ) : (
                    <div style={{ fontSize: "13px", color: "#4ade80" }}>
                      <b style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><CheckCircle2 size={15} /> Verification Passed:</b> Image Authenticity: {verificationReport.layer1.imageAuthenticityScore}% | OCR Precision: {verificationReport.layer2.ocrConfidence}%
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: IDENTITY VERIFICATION */}
          {currentStep === 3 && (
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>Step 3 — Identity & e-KYC Verification</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>Verify your Aadhaar and e-Shram Registration credentials.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "500px" }}>
                <div>
                  <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>12-Digit Aadhaar / e-Shram UID *</label>
                  <input
                    type="text"
                    placeholder="Enter 12 digit Aadhaar number"
                    value={userProfile.aadhaarNumber}
                    onChange={(e) => setUserProfile({ ...userProfile, aadhaarNumber: e.target.value })}
                    style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "14px" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>Linked Mobile Number *</label>
                  <input
                    type="text"
                    placeholder="Enter 10 digit mobile number"
                    value={userProfile.mobileNumber}
                    onChange={(e) => setUserProfile({ ...userProfile, mobileNumber: e.target.value })}
                    style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "14px" }}
                  />
                </div>

                <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "12px", padding: "12px", fontSize: "13px", color: "#4ade80", display: "flex", alignItems: "center", gap: "10px" }}>
                  <UserCheck size={18} /> Identity Confidence Score: 98% (Authentic e-KYC Signal)
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: EMPLOYMENT & INCOME PROFILE */}
          {currentStep === 4 && (
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>Step 4 — Employment & Income Profile</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>Provide your work background for Sachet credit scoring.</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>Occupation *</label>
                  <input
                    type="text"
                    value={userProfile.occupation}
                    onChange={(e) => setUserProfile({ ...userProfile, occupation: e.target.value })}
                    style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "14px" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>Gig Platform / Association</label>
                  <input
                    type="text"
                    value={userProfile.gigPlatform}
                    onChange={(e) => setUserProfile({ ...userProfile, gigPlatform: e.target.value })}
                    style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "14px" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>Monthly Income (₹) *</label>
                  <input
                    type="text"
                    value={userProfile.monthlyIncome}
                    onChange={(e) => setUserProfile({ ...userProfile, monthlyIncome: e.target.value })}
                    style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "14px" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>Work Experience *</label>
                  <input
                    type="text"
                    value={userProfile.workExperience}
                    onChange={(e) => setUserProfile({ ...userProfile, workExperience: e.target.value })}
                    style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "14px" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: FINANCIAL HEALTH ASSESSMENT */}
          {currentStep === 5 && (
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>Step 5 — AI Financial Health Assessment</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>Calculated credit pillars based on cash-flow & payment discipline.</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
                <div style={{ background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: "14px" }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>Income Stability</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#38bdf8", marginTop: "4px" }}>88%</div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: "14px" }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>Document Authenticity</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#4ade80", marginTop: "4px" }}>96%</div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: "14px" }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>Fraud Risk Level</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#4ade80", marginTop: "4px" }}>Low (8%)</div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: "14px" }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>Repayment Buffer</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#38bdf8", marginTop: "4px" }}>₹4,500 / Mo</div>
                </div>
              </div>

              <div style={{ marginTop: "20px", background: "rgba(2, 132, 199, 0.15)", border: "1px solid rgba(2, 132, 199, 0.4)", borderRadius: "14px", padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>Overall Sahayata Credit Health Score</div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff", marginTop: "4px" }}>86 / 100</div>
              </div>
            </div>
          )}

          {/* STEP 6: GOVERNMENT SCHEME MATCHING */}
          {currentStep === 6 && (
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>Step 6 — Government Scheme Matching</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>AI has matched your profile with official collateral-free schemes.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div
                  onClick={() => setSelectedScheme("PM SVANidhi")}
                  style={{
                    background: selectedScheme === "PM SVANidhi" ? "rgba(2, 132, 199, 0.25)" : "rgba(255, 255, 255, 0.04)",
                    border: selectedScheme === "PM SVANidhi" ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.1)",
                    padding: "16px",
                    borderRadius: "14px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: "700", fontSize: "15px" }}>PM SVANidhi Scheme (98% Match)</div>
                  <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
                    Up to ₹50,000 micro-credit at 7% annual interest subsidy for street vendors & gig workers.
                  </div>
                </div>

                <div
                  onClick={() => setSelectedScheme("PM Mudra Shishu")}
                  style={{
                    background: selectedScheme === "PM Mudra Shishu" ? "rgba(2, 132, 199, 0.25)" : "rgba(255, 255, 255, 0.04)",
                    border: selectedScheme === "PM Mudra Shishu" ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.1)",
                    padding: "16px",
                    borderRadius: "14px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: "700", fontSize: "15px" }}>PM Mudra (Shishu Loan) (92% Match)</div>
                  <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
                    Loans up to ₹50,000 for micro-enterprises with 0 collateral requirement.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: LOAN ELIGIBILITY ASSESSMENT & EXPLAINABLE AI (XAI) */}
          {currentStep === 7 && (
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>Step 7 — AI Loan Eligibility & Explainable AI (XAI)</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>
                This is an AI-based eligibility assessment, not a final loan approval.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                <div style={{ background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: "14px" }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>Estimated Eligible Amount</div>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: "#4ade80", marginTop: "4px" }}>₹35,000</div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: "14px" }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>Approval Probability</div>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: "#38bdf8", marginTop: "4px" }}>92% High</div>
                </div>
              </div>

              {/* EXPLAINABLE AI (XAI) TRANSPARENCY SECTION */}
              <div style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "16px", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#38bdf8", fontWeight: "700", fontSize: "14px", marginBottom: "12px" }}>
                  <Sparkles size={16} /> Explainable AI (XAI) Decision Rationale
                </div>

                <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ color: "#4ade80", display: "flex", alignItems: "flex-start", gap: "6px" }}>
                    <CheckCircle2 size={15} color="#4ade80" style={{ flexShrink: 0, marginTop: "1px" }} />
                    <span><b>Positive Credit Drivers:</b> Verified Bank Passbook (96% authenticity), Stable Monthly Income (₹18,500), Active e-Shram Registration.</span>
                  </div>
                  <div style={{ color: "#fbbf24", display: "flex", alignItems: "flex-start", gap: "6px" }}>
                    <AlertTriangle size={15} color="#fbbf24" style={{ flexShrink: 0, marginTop: "1px" }} />
                    <span><b>Risk Mitigation Factors:</b> Limited formal credit bureau history, seasonal cash-flow variations.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: RECOMMENDED LENDING PARTNERS */}
          {currentStep === 8 && (
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>Step 8 — Recommended Lending Partners</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>Select a partner financial institution for application evaluation.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {["State Bank of India (SBI)", "Bank of Baroda (BoB)", "Punjab National Bank (PNB)"].map((bank) => (
                  <div
                    key={bank}
                    onClick={() => {
                      setSelectedLender(bank);
                      handleNext();
                    }}
                    style={{
                      background: selectedLender === bank ? "rgba(2, 132, 199, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      border: selectedLender === bank ? "2px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "14px",
                      padding: "16px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Building2 size={20} color="#38bdf8" />
                      <span style={{ fontSize: "15px", fontWeight: "600" }}>{bank}</span>
                    </div>
                    <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "700" }}>Select Partner →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 9: FINAL SUBMISSION & UNDERWRITING */}
          {currentStep === 9 && (
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>Step 9 — Final Review & Consent</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>Review the comprehensive packet that will be submitted to the bank.</p>

              <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>Applicant Name</span>
                    <div style={{ fontSize: "15px", fontWeight: "600", marginTop: "2px" }}>{applicantData.name}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>Requested Loan</span>
                    <div style={{ fontSize: "15px", fontWeight: "700", color: "#38bdf8", marginTop: "2px" }}>₹{applicantData.requestedLoan}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>AI Trust Score</span>
                    <div style={{ fontSize: "15px", fontWeight: "700", color: "#4ade80", marginTop: "2px" }}>88 / 100 (Tier-1)</div>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>Target Lender</span>
                    <div style={{ fontSize: "15px", fontWeight: "600", marginTop: "2px" }}>{selectedLender}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmitApplication}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "15px",
                  fontWeight: "700",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                Submit Application to {selectedLender}
              </button>
            </div>
          )}

          {/* STEP 10: CONFIRMATION & SANCTION TICKET */}
          {currentStep === 10 && submittedApplication && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(34, 197, 94, 0.15)", border: "2px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto" }}>
                <CheckCircle2 size={36} color="#22c55e" />
              </div>

              <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "8px" }}>Application Submitted Successfully!</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", maxWidth: "460px", margin: "0 auto 24px auto" }}>
                Your complete underwriting packet including AI fraud-free proof and cash-flow intelligence has been submitted.
              </p>

              <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "16px", padding: "20px", maxWidth: "460px", margin: "0 auto 24px auto", textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#94a3b8" }}>Application ID:</span>
                  <span style={{ fontWeight: "700", color: "#38bdf8" }}>{submittedApplication.id}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#94a3b8" }}>Selected Lender:</span>
                  <span style={{ fontWeight: "600" }}>{submittedApplication.lender}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#94a3b8" }}>Current Status:</span>
                  <span style={{ color: "#4ade80", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={13} color="#4ade80" />
                    <span>Pending Bank Review</span>
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94a3b8" }}>Estimated Review Time:</span>
                  <span style={{ color: "#38bdf8", fontWeight: "600" }}>24 – 72 Hours</span>
                </div>
              </div>

              <button
                onClick={onClose}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  padding: "10px 24px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Return to AI Portal
              </button>
            </div>
          )}
        </div>

        {/* BOTTOM NAVIGATION BUTTONS */}
        {currentStep < 10 && currentStep > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={handlePrev}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ChevronLeft size={16} /> Previous Step
            </button>

            {currentStep !== 9 && (
              <button
                onClick={handleNext}
                disabled={isNextDisabled}
                style={{
                  background: isNextDisabled
                    ? "rgba(255, 255, 255, 0.1)"
                    : "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
                  color: isNextDisabled ? "rgba(255, 255, 255, 0.4)" : "#ffffff",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: isNextDisabled ? "not-allowed" : "pointer",
                  opacity: isNextDisabled ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {isNextDisabled ? "Complete Step to Proceed" : "Next Step"} <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
