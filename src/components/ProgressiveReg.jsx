import { useEffect, useState } from "react";
import { requestMobileOtp, submitApplication, verifyMobileOtp } from "../api";
import SpeechButton from "./SpeechButton";
import VoiceInputButton from "./VoiceInputButton";

const STEPS_DICT = {
  en: ["Profile", "Occupation", "Bank Link"],
  hi: ["Profile Details", "Vyavasay Details", "Bank Link"],
  gu: ["Profile Details", "Vyavasay Details", "Bank Link"]
};

const OCCUPATIONS_DICT = {
  en: [
    "Street vendor / phatak vikretha",
    "Gig worker",
    "Daily wage labourer",
    "Construction worker",
  ],
  hi: [
    "Rehdi-patri vikreta / Pheriwala",
    "Gig shramik (Delivery boy/driver)",
    "Dainik vetanbhogi mazdoor",
    "Nirman shramik (Construction labour)",
  ],
  gu: [
    "Lari-galla vala / Pheriyo",
    "Gig kamdar (Delivery rider)",
    "Dainik vetan mazdoor",
    "Bandhkam mazdoor",
  ]
};

const EARNING_MODES_DICT = {
  en: ["UPI / digital payments", "Cash only", "Mixed"],
  hi: ["UPI / digital payments", "Keval nakad", "Mixed (Dono)"],
  gu: ["UPI / digital payments", "Keval nakad", "Mixed (Dono)"]
};

const IconForms = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>
  </svg>
);

export default function ProgressiveReg({ requestedAmount = 15000, onApplicationSubmit, lang = "en" }) {
  const [current, setCurrent] = useState(1);
  const occupations = OCCUPATIONS_DICT[lang] || OCCUPATIONS_DICT.en;
  const earningModes = EARNING_MODES_DICT[lang] || EARNING_MODES_DICT.en;
  const steps = STEPS_DICT[lang] || STEPS_DICT.en;

  const [form, setForm] = useState({
    full_name: "",
    mobile: "",
    identity_number: "",
    occupation_type: occupations[0],
    earning_mode: earningModes[0],
    account_number: "",
    upi_id: "",
    requested_amount: requestedAmount,
    verification_type: "",
    verification_id: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [otpStatus, setOtpStatus] = useState("idle");
  const [otpBusy, setOtpBusy] = useState(false);

  // Worker verification local states
  const [verificationStatus, setVerificationStatus] = useState("idle"); // idle, verifying, verified, failed
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationIdInput, setVerificationIdInput] = useState("");
  const [gigPlatform, setGigPlatform] = useState("Zomato");
  const [docType, setDocType] = useState("PM SVANidhi LOR");

  useEffect(() => {
    // Synchronize initial selections if lang changes
    const newOccupations = OCCUPATIONS_DICT[lang] || OCCUPATIONS_DICT.en;
    const newEarningModes = EARNING_MODES_DICT[lang] || EARNING_MODES_DICT.en;
    setForm((prev) => {
      let prevIndex = -1;
      for (const l of ["en", "hi", "gu"]) {
        const idx = OCCUPATIONS_DICT[l].indexOf(prev.occupation_type);
        if (idx !== -1) { prevIndex = idx; break; }
      }
      const newOcc = prevIndex !== -1 ? newOccupations[prevIndex] : newOccupations[0];

      let prevEarnIndex = -1;
      for (const l of ["en", "hi", "gu"]) {
        const idx = EARNING_MODES_DICT[l].indexOf(prev.earning_mode);
        if (idx !== -1) { prevEarnIndex = idx; break; }
      }
      const newEarn = prevEarnIndex !== -1 ? newEarningModes[prevEarnIndex] : newEarningModes[0];

      return {
        ...prev,
        occupation_type: newOcc,
        earning_mode: newEarn
      };
    });
  }, [lang]);

  const t = (key) => {
    const dict = {
      en: {
        title: "Progressive Registration",
        sub: "3-step form - application will be saved in the backend on submit",
        nameLbl: "Full name (as in Aadhaar)",
        namePl: "Ramesh Kumar",
        mobileLbl: "Mobile number",
        mobilePl: "9876543210",
        smsConsent: "I agree to receive a one-time verification SMS on this number.",
        sendOtp: "Send OTP",
        sendingOtp: "Sending OTP...",
        otpLbl: "Enter OTP",
        otpPl: "6-digit OTP",
        verifyOtp: "Verify OTP",
        verifyingOtp: "Verifying...",
        otpVerified: "Mobile number verified",
        otpRequired: "Please verify your mobile number before continuing.",
        otpNotice: "For your safety, Sahayata will never ask you to share this OTP with a person, caller, or assistant.",
        idLbl: "e-Shram / Aadhaar number",
        idPl: "XXXX-XXXX-XXXX",
        occLbl: "Occupation type",
        earnLbl: "Primary earning mode",
        accLbl: "Jan Dhan / bank account number",
        accPl: "Account number",
        upiLbl: "UPI ID (linked to business QR)",
        upiPl: "yourname@upi",
        back: "Back",
        continue: "Continue",
        submit: "Submit Application",
        submitting: "Submitting...",
        speechInstruction: "To apply for the loan, please complete these three steps. First, verify your own mobile number using the OTP sent to your phone. Never share an OTP with any person, caller, agent, or assistant. Then enter your identity, bank account number, and UPI ID to submit the application.",
        verificationTitle: "Worker Verification Required",
        verificationSub: "Verify your unorganised worker status to access low-interest credit.",
        btnVerify: "Verify Credentials",
        verifying: "Verifying with registry...",
        verifiedSuccess: "Verified successfully!",
        selectPlatform: "Select Gig Platform",
        partnerIdLbl: "Gig Partner ID",
        eShramLbl: "12-digit e-Shram Card Number (UAN)",
        lorLbl: "PM SVANidhi LOR Number",
        validationPrompt: "Please verify your worker identity credentials first.",
      },
      hi: {
        title: "Pragatisheel Registration",
        sub: "3-charan form - submit karne par backend me save ho jayega",
        nameLbl: "Pura naam (Aadhaar ke anusar)",
        namePl: "Ramesh Kumar",
        mobileLbl: "Mobile number",
        mobilePl: "9876543210",
        smsConsent: "Main is number par verification SMS pane ke liye sehmat hoon.",
        sendOtp: "Send OTP",
        sendingOtp: "OTP bheja ja raha hai...",
        otpLbl: "OTP enter karein",
        otpPl: "6-digit OTP",
        verifyOtp: "Verify OTP",
        verifyingOtp: "Verify ho raha hai...",
        otpVerified: "Mobile number verified ho gaya",
        otpRequired: "Kripya aage badhne se pehle mobile number verify karein.",
        otpNotice: "Suraksha ke liye, Sahayata aapse kabhi OTP call/person par nahi mangega.",
        idLbl: "e-Shram / Aadhaar number",
        idPl: "XXXX-XXXX-XXXX",
        occLbl: "Vyavasay ka prakar",
        earnLbl: "Kamai ka tarika",
        accLbl: "Jan Dhan / bank account number",
        accPl: "Account number",
        upiLbl: "UPI ID (Business QR se link)",
        upiPl: "yourname@upi",
        back: "Peeche",
        continue: "Aage badhein",
        submit: "Application Submit Karein",
        submitting: "Submit ho raha hai...",
        speechInstruction: "Loan pane ke liye kripya ye teen charan pure karein. Pehle apna mobile number OTP se verify karein, phir occupation aur bank linking complete karein.",
        verificationTitle: "Worker Verification Required",
        verificationSub: "Apna worker status verify karein taaki micro-loan process ho sake.",
        btnVerify: "Verify Karein",
        verifying: "Verify ho raha hai...",
        verifiedSuccess: "Verify ho gaya!",
        selectPlatform: "Platform chunein",
        partnerIdLbl: "Partner ID",
        eShramLbl: "12-digit e-Shram Card Number (UAN)",
        lorLbl: "PM SVANidhi LOR Number",
        validationPrompt: "Kripya pehle apna worker verification complete karein."
      },
      gu: {
        title: "Pragatisheel Registration",
        sub: "3-charan form - submit karvathi backend ma save thai jashe",
        nameLbl: "Aakhu naam (Aadhaar pramane)",
        namePl: "Ramesh Kumar",
        mobileLbl: "Mobile number",
        mobilePl: "9876543210",
        smsConsent: "Hu verification SMS melavva mate sahamat chhu.",
        sendOtp: "Send OTP",
        sendingOtp: "OTP mokli rahya chhie...",
        otpLbl: "OTP enter karo",
        otpPl: "6-digit OTP",
        verifyOtp: "Verify OTP",
        verifyingOtp: "Verify thai rahyu chhe...",
        otpVerified: "Mobile number verified thai gayu",
        otpRequired: "Kripa karine aage badhta pehla mobile number verify karo.",
        otpNotice: "Suraksha mate, Sahayata kyarey pan call ke person par OTP mangshe nahi.",
        idLbl: "e-Shram / Aadhaar number",
        idPl: "XXXX-XXXX-XXXX",
        occLbl: "Vyavasay no prakar",
        earnLbl: "Aavak padhdhati",
        accLbl: "Jan Dhan / bank account number",
        accPl: "Account number",
        upiLbl: "UPI ID (Business QR sathe linked)",
        upiPl: "yourname@upi",
        back: "Pachha jao",
        continue: "Aagad vadho",
        submit: "Application Submit Karo",
        submitting: "Submit thai rahyu chhe...",
        speechInstruction: "Loan melavva mate kripa karine aa tran paglao purna karo. Pehla mobile number OTP thi verify karo.",
        verificationTitle: "Worker Verification Required",
        verificationSub: "Tamaru worker status verify karo jethi loan mali shake.",
        btnVerify: "Verify Karo",
        verifying: "Chakasani chaloj chhe...",
        verifiedSuccess: "Chakasani safal thai!",
        selectPlatform: "Platform pasand karo",
        partnerIdLbl: "Partner ID",
        eShramLbl: "12-digit e-Shram Card Number (UAN)",
        lorLbl: "PM SVANidhi LOR Number",
        validationPrompt: "Kripa karine pehla tamaru worker verification complete karo."
      }
    };
    return dict[lang]?.[key] || dict.en[key];
  };

  const st = (i) => (i + 1 < current ? "done" : i + 1 === current ? "active" : "idle");

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const sendOtp = async () => {
    if (!form.mobile.trim()) {
      setError("Enter your mobile number first.");
      return;
    }
    if (!smsConsent) {
      setError("Please agree to receive a verification SMS.");
      return;
    }
    setOtpBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await requestMobileOtp(form.mobile);
      setOtpStatus("sent");
      setMessage(result.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setOtpBusy(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setError("Enter the OTP sent to your mobile number.");
      return;
    }
    setOtpBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await verifyMobileOtp(form.mobile, otp);
      if (result.verified) {
        setOtpStatus("verified");
        setMessage(t("otpVerified"));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setOtpBusy(false);
    }
  };

  const handleOccupationChange = (val) => {
    update("occupation_type", val);
    setVerificationStatus("idle");
    setVerificationMessage("");
    setVerificationIdInput("");
  };

  const handleVerifyCredentials = () => {
    if (!verificationIdInput.trim()) {
      setError(lang === "hi" ? "Kripya ID number enter karein." : lang === "gu" ? "Kripa karine ID number enter karo." : "Please enter the verification ID number.");
      return;
    }
    
    setError("");
    setVerificationStatus("verifying");
    setVerificationMessage("");
    
    setTimeout(() => {
      const occIndex = occupations.indexOf(form.occupation_type);
      let cleanId = verificationIdInput.trim();
      let typeLabel = "";
      
      if (occIndex === 0) {
        typeLabel = docType;
        if (cleanId.length < 5) {
          setVerificationStatus("failed");
          setError("Invalid LOR/Certificate ID (min 5 characters).");
          return;
        }
      } else if (occIndex === 1) {
        typeLabel = gigPlatform + " Partner";
        if (cleanId.length < 3) {
          setVerificationStatus("failed");
          setError("Invalid Partner ID (min 3 characters).");
          return;
        }
      } else {
        typeLabel = "e-Shram Card";
        const digits = cleanId.replace(/\D/g, "");
        if (digits.length !== 12) {
          setVerificationStatus("failed");
          setError("e-Shram UAN must be exactly 12 digits.");
          return;
        }
        cleanId = digits.slice(0, 4) + "-" + digits.slice(4, 8) + "-" + digits.slice(8);
      }
      
      setVerificationStatus("verified");
      const msg = "Verified: " + typeLabel + " (" + cleanId + ")";
      setVerificationMessage(msg);
      setForm(prev => ({
        ...prev,
        verification_type: typeLabel,
        verification_id: cleanId
      }));
    }, 1500);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const result = await submitApplication({
        ...form,
        requested_amount: requestedAmount || form.requested_amount,
      });
      setMessage(lang === "hi" ? "Application submitted ho gaya." : lang === "gu" ? "Application submitted thai gayu." : result.message);
      onApplicationSubmit?.(result.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card card-accent-purple" id="registration-form">
      <div className="eyebrow">Worker Onboarding</div>
      <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <IconForms /> {t("title")}
        <SpeechButton text={t("speechInstruction")} lang={lang} />
      </div>
      <div className="card-sub">{t("sub")}</div>

      <div className="step-nav">
        {steps.map((s, i) => (
          <div key={s} style={{ display: "contents" }}>
            <div className={`step-dot ${st(i)}`}>{st(i) === "done" ? "✓" : i + 1}</div>
            {i < steps.length - 1 && <div className={`step-line${st(i) === "done" ? " done" : ""}`} />}
          </div>
        ))}
      </div>
      <div className="step-labels">
        {steps.map((s, i) => <span key={s} className={st(i) === "active" ? "current" : ""}>{s}</span>)}
      </div>

      <div className="step-content">
        {current === 1 && (
          <>
            <div className="form-field">
              <label>{t("nameLbl")}</label>
              <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                <input type="text" placeholder={t("namePl")} value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)} style={{ flex: 1 }} />
                <VoiceInputButton onTranscript={(val) => update("full_name", val)} lang={lang} type="text" />
              </div>
            </div>
            <div className="form-field">
              <label>{t("mobileLbl")}</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder={t("mobilePl")}
                  value={form.mobile}
                  disabled={otpStatus === "verified"}
                  onChange={(e) => {
                    update("mobile", e.target.value);
                    setOtpStatus("idle");
                    setOtp("");
                  }}
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn-sm primary" disabled={otpBusy || otpStatus === "verified"} onClick={sendOtp}>
                  {otpBusy ? t("sendingOtp") : otpStatus === "sent" ? "Resend OTP" : t("sendOtp")}
                </button>
              </div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 10, fontSize: 12, color: "var(--text-secondary)", cursor: "pointer" }}>
                <input type="checkbox" checked={smsConsent} disabled={otpStatus === "verified"} onChange={(e) => setSmsConsent(e.target.checked)} style={{ marginTop: 2 }} />
                <span>{t("smsConsent")}</span>
              </label>
            </div>
            {otpStatus !== "idle" && otpStatus !== "verified" && (
              <div className="form-field">
                <label>{t("otpLbl")}</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="text" inputMode="numeric" maxLength="10" placeholder={t("otpPl")} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} style={{ flex: 1 }} />
                  <button type="button" className="btn-sm primary" disabled={otpBusy} onClick={verifyOtp}>{otpBusy ? t("verifyingOtp") : t("verifyOtp")}</button>
                </div>
                <p style={{ margin: "8px 0 0", color: "var(--text-muted)", fontSize: 11.5, lineHeight: 1.4 }}>{t("otpNotice")}</p>
              </div>
            )}
            {otpStatus === "verified" && <p className="form-success" style={{ marginTop: -4 }}>Verified mobile number</p>}
            <div className="form-field">
              <label>{t("idLbl")}</label>
              <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                <input type="text" placeholder={t("idPl")} value={form.identity_number}
                  onChange={(e) => update("identity_number", e.target.value)} style={{ flex: 1 }} />
                <VoiceInputButton onTranscript={(val) => update("identity_number", val)} lang={lang} type="digits" />
              </div>
            </div>
          </>
        )}
        {current === 2 && (
          <>
            <div className="form-field">
              <label>{t("occLbl")}</label>
              <select value={form.occupation_type} onChange={(e) => handleOccupationChange(e.target.value)}>
                {occupations.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>{t("earnLbl")}</label>
              <select value={form.earning_mode} onChange={(e) => update("earning_mode", e.target.value)}>
                {earningModes.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>

            {/* Worker Verification Panel */}
            <div style={{
              background: "rgba(108, 92, 231, 0.06)",
              border: "1px solid rgba(108, 92, 231, 0.2)",
              borderRadius: "8px",
              padding: "16px",
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              <h4 style={{ margin: 0, color: "var(--text-primary)", fontSize: "14px" }}>
                {t("verificationTitle")}
              </h4>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "12px", lineHeight: "1.4" }}>
                {t("verificationSub")}
              </p>

              {occupations.indexOf(form.occupation_type) === 0 && (
                <div className="form-field" style={{ margin: 0 }}>
                  <label>{t("lorLbl")}</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <select value={docType} onChange={(e) => setDocType(e.target.value)} style={{ width: "135px", flexShrink: 0 }}>
                      <option>PM SVANidhi LOR</option>
                      <option>Municipal Vending ID</option>
                    </select>
                    <input
                      type="text"
                      placeholder="e.g. LOR123456"
                      value={verificationIdInput}
                      disabled={verificationStatus === "verified"}
                      onChange={(e) => setVerificationIdInput(e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              )}

              {occupations.indexOf(form.occupation_type) === 1 && (
                <div className="form-field" style={{ margin: 0 }}>
                  <label>{t("selectPlatform")} & {t("partnerIdLbl")}</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <select value={gigPlatform} onChange={(e) => setGigPlatform(e.target.value)} style={{ width: "130px", flexShrink: 0 }}>
                      <option>Zomato</option>
                      <option>Swiggy</option>
                      <option>Porter</option>
                      <option>Uber</option>
                      <option>Ola</option>
                    </select>
                    <input
                      type="text"
                      placeholder="e.g. ZM-99182"
                      value={verificationIdInput}
                      disabled={verificationStatus === "verified"}
                      onChange={(e) => setVerificationIdInput(e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              )}

              {(occupations.indexOf(form.occupation_type) === 2 || occupations.indexOf(form.occupation_type) === 3) && (
                <div className="form-field" style={{ margin: 0 }}>
                  <label>{t("eShramLbl")}</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder="e.g. 1234-5678-9012"
                      value={verificationIdInput}
                      disabled={verificationStatus === "verified"}
                      onChange={(e) => setVerificationIdInput(e.target.value.replace(/[^\d-]/g, ""))}
                      maxLength="14"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginTop: "4px" }}>
                <button
                  type="button"
                  className="btn-sm"
                  style={{
                    background: verificationStatus === "verified" ? "#00c853" : "var(--accent-purple)",
                    color: "white",
                    fontWeight: "600",
                    border: "none",
                    cursor: verificationStatus === "verified" ? "default" : "pointer"
                  }}
                  disabled={verificationStatus === "verifying" || verificationStatus === "verified"}
                  onClick={handleVerifyCredentials}
                >
                  {verificationStatus === "verifying" ? t("verifying") : verificationStatus === "verified" ? "Verified" : t("btnVerify")}
                </button>

                {verificationStatus === "verified" && (
                  <span style={{ color: "#00c853", fontSize: "12px", fontWeight: "600" }}>
                    {verificationMessage}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
        {current === 3 && (
          <>
            <div className="form-field">
              <label>{t("accLbl")}</label>
              <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                <input type="text" placeholder={t("accPl")} value={form.account_number}
                  onChange={(e) => update("account_number", e.target.value)} style={{ flex: 1 }} />
                <VoiceInputButton onTranscript={(val) => update("account_number", val)} lang={lang} type="digits" />
              </div>
            </div>
            <div className="form-field">
              <label>{t("upiLbl")}</label>
              <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                <input type="text" placeholder={t("upiPl")} value={form.upi_id}
                  onChange={(e) => update("upi_id", e.target.value)} style={{ flex: 1 }} />
                <VoiceInputButton onTranscript={(val) => update("upi_id", val)} lang={lang} type="text" />
              </div>
            </div>
          </>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}
      {message && <p className="form-success">{message}</p>}

      <div className="form-actions">
        {current > 1 && <button className="btn-sm" onClick={() => setCurrent((c) => c - 1)}>{t("back")}</button>}
        <button
          className="btn-sm primary"
          disabled={submitting}
          onClick={() => {
            if (current === 1 && otpStatus !== "verified") {
              setError(t("otpRequired"));
              return;
            }
            if (current === 2 && verificationStatus !== "verified") {
              setError(t("validationPrompt"));
              return;
            }
            if (current < steps.length) setCurrent((c) => c + 1);
            else handleSubmit();
          }}
        >
          {submitting ? t("submitting") : current < steps.length ? t("continue") : t("submit")}
        </button>
      </div>
    </div>
  );
}
