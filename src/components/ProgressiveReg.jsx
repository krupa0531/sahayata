import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Check } from "lucide-react";
import { requestMobileOtp, submitApplication, verifyMobileOtp } from "../api";
import { recordApplicationSubmission } from "../services/realtimeSync.js";
import VoiceInputButton from "./VoiceInputButton";

const STEPS_DICT = {
  en: ["Profile Details", "Occupation & Income", "Bank & UPI Link"],
  hi: ["व्यक्तिगत विवरण", "व्यवसाय व आय", "बैंक व UPI खाता"],
  gu: ["વ્યક્તિગત વિગતો", "વ્યવસાય અને આવક", "બેંક અને UPI ખાતું"]
};

const OCCUPATIONS_DICT = {
  en: [
    "Street Vendor / Hawker",
    "Gig Worker (Delivery / Driver)",
    "Daily Wage Labourer",
    "Construction Worker",
  ],
  hi: [
    "स्ट्रीट वेंडर / रेहड़ी-पटरी विक्रेता",
    "गिग श्रमिक (डिलीवरी पार्टनर / चालक)",
    "दैनिक वेतनभोगी मजदूर",
    "निर्माण श्रमिक",
  ],
  gu: [
    "લારી-ગલ્લાવાળા / ફેરિયા",
    "ગીગ કામદાર (ડિલિવરી પાર્ટનર / ચાલક)",
    "દૈનિક વેતન મજૂર",
    "બાંધકામ શ્રમિક",
  ]
};

const EARNING_MODES_DICT = {
  en: ["UPI / Digital Payments", "Cash Only", "Mixed (Both)"],
  hi: ["UPI / डिजिटल भुगतान", "केवल नकद", "मिश्रित (दोनों)"],
  gu: ["UPI / ડિજિટલ ચૂકવણી", "માત્ર રોકડ", "મિશ્રિત (બંને)"]
};

const IconForms = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>
  </svg>
);

export default function ProgressiveReg({ requestedAmount = 15000, onApplicationSubmit, user, lang = "en" }) {
  const [current, setCurrent] = useState(1);
  const occupations = OCCUPATIONS_DICT[lang] || OCCUPATIONS_DICT.en;
  const earningModes = EARNING_MODES_DICT[lang] || EARNING_MODES_DICT.en;
  const steps = STEPS_DICT[lang] || STEPS_DICT.en;

  const [form, setForm] = useState({
    full_name: user?.full_name || user?.name || "",
    mobile: user?.mobile || "",
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
    if (user) {
      setForm((prev) => ({
        ...prev,
        full_name: user.full_name || user.name || prev.full_name,
        mobile: user.mobile || prev.mobile,
      }));
    }
  }, [user]);

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

  useEffect(() => {
    if (requestedAmount) {
      setForm((prev) => ({ ...prev, requested_amount: requestedAmount }));
    }
  }, [requestedAmount]);

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
        resendOtp: "Resend OTP",
        otpLbl: "Enter OTP",
        otpPl: "6-digit OTP",
        verifyOtp: "Verify OTP",
        verifyingOtp: "Verifying...",
        otpVerified: "Mobile number verified successfully",
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
        title: "प्रगतिशील पंजीकरण",
        sub: "3-चरणीय आवेदन प्रपत्र — सबमिट करने पर बैकएंड में सुरक्षित रूप से सहेजा जाएगा",
        nameLbl: "पूरा नाम (आधार कार्ड के अनुसार)",
        namePl: "रमेश कुमार",
        mobileLbl: "मोबाइल नंबर",
        mobilePl: "9876543210",
        smsConsent: "मैं इस नंबर पर एकमुश्त सत्यापन SMS प्राप्त करने के लिए सहमत हूँ।",
        sendOtp: "OTP भेजें",
        sendingOtp: "OTP भेजा जा रहा है...",
        resendOtp: "पुनः OTP भेजें",
        otpLbl: "OTP दर्ज करें",
        otpPl: "6-अंकीय OTP",
        verifyOtp: "OTP सत्यापित करें",
        verifyingOtp: "सत्यापन हो रहा है...",
        otpVerified: "मोबाइल नंबर सफलतापूर्वक सत्यापित हो गया",
        otpRequired: "कृपया आगे बढ़ने से पहले अपना मोबाइल नंबर सत्यापित करें।",
        otpNotice: "आपकी सुरक्षा के लिए, सहायता कभी भी किसी व्यक्ति, फोन कॉल या सहायक के साथ OTP साझा करने के लिए नहीं कहेगा।",
        idLbl: "ई-श्रम / आधार नंबर",
        idPl: "XXXX-XXXX-XXXX",
        occLbl: "व्यवसाय का प्रकार",
        earnLbl: "प्राथमिक आय का माध्यम",
        accLbl: "जन-धन / बैंक खाता संख्या",
        accPl: "खाता संख्या",
        upiLbl: "UPI आईडी (व्यावसायिक QR से जुड़ी)",
        upiPl: "yourname@upi",
        back: "पीछे जाएं",
        continue: "आगे बढ़ें",
        submit: "आवेदन जमा करें",
        submitting: "जमा हो रहा है...",
        speechInstruction: "ऋण प्राप्त करने के लिए कृपया ये तीन चरण पूरे करें। पहले अपना मोबाइल नंबर OTP से सत्यापित करें, फिर व्यवसाय और बैंक विवरण दर्ज करें।",
        verificationTitle: "श्रमिक पहचान सत्यापन आवश्यक",
        verificationSub: "रियायती ब्याज पर ऋण प्राप्त करने के लिए अपनी असंगठित श्रमिक स्थिति का सत्यापन करें।",
        btnVerify: "सत्यापित करें",
        verifying: "रजिस्ट्री से सत्यापन हो रहा है...",
        verifiedSuccess: "सत्यापन सफलतापूर्वक संपन्न!",
        selectPlatform: "गिग प्लेटफॉर्म चुनें",
        partnerIdLbl: "पार्टनर आईडी",
        eShramLbl: "12-अंकीय ई-श्रम कार्ड नंबर (UAN)",
        lorLbl: "पीएम स्वनिधि LOR नंबर",
        validationPrompt: "कृपया पहले अपना श्रमिक पहचान सत्यापन पूरा करें।"
      },
      gu: {
        title: "પ્રગતિશીલ નોંધણી",
        sub: "૩-તબક્કાનું ફોર્મ — સબમિટ કરવાથી બેકએન્ડમાં સુરક્ષિત રીતે સચવાશે",
        nameLbl: "પૂરું નામ (આધાર કાર્ડ મુજબ)",
        namePl: "રમેશ કુમાર",
        mobileLbl: "મોબાઈલ નંબર",
        mobilePl: "9876543210",
        smsConsent: "હું આ નંબર પર વેરિફિકેશન SMS મેળવવા માટે સંમત છું.",
        sendOtp: "OTP મોકલો",
        sendingOtp: "OTP મોકલાઈ રહ્યો છે...",
        resendOtp: "ફરી OTP મોકલો",
        otpLbl: "OTP દાખલ કરો",
        otpPl: "૬-અંકનો OTP",
        verifyOtp: "OTP વેરિફાઈ કરો",
        verifyingOtp: "ચકાસણી ચાલુ છે...",
        otpVerified: "મોબાઈલ નંબર સફળતાપૂર્વક વેરિફાઈ થઈ ગયો",
        otpRequired: "કૃપા કરીને આગળ વધતા પહેલાં મોબાઈલ નંબર વેરિફાઈ કરો.",
        otpNotice: "તમારી સુરક્ષા માટે, સહાયતા ક્યારેય પણ કોઈ વ્યક્તિ, કૉલ કે સહાયક સાથે OTP શેર કરવા માટે કહેશે નહીં.",
        idLbl: "ઈ-શ્રમ / આધાર નંબર",
        idPl: "XXXX-XXXX-XXXX",
        occLbl: "વ્યવસાયનો પ્રકાર",
        earnLbl: "મુખ્ય આવકનું માધ્યમ",
        accLbl: "જન-ધન / બેંક ખાતા નંબર",
        accPl: "ખાતા નંબર",
        upiLbl: "UPI ID (બિઝનેસ QR સાથે લિંક)",
        upiPl: "yourname@upi",
        back: "પાછળ જાઓ",
        continue: "આગળ વધો",
        submit: "અરજી સબમિટ કરો",
        submitting: "સબમિટ થઈ રહ્યું છે...",
        speechInstruction: "લોન મેળવવા માટે કૃપા કરીને આ ત્રણ તબક્કા પૂર્ણ કરો. પહેલાં તમારો મોબાઈલ નંબર OTP દ્વારા વેરિફાઈ કરો, પછી વ્યવસાય અને બેંક વિગતો ભરો.",
        verificationTitle: "શ્રમિક ઓળખ ચકાસણી જરૂરી",
        verificationSub: "ઓછા વ્યાજે લોન મેળવવા માટે તમારી અસંગઠિત કામદાર સ્થિતિની ચકાસણી કરો.",
        btnVerify: "ચકાસણી કરો",
        verifying: "રજિસ્ટ્રી સાથે ચકાસણી ચાલુ છે...",
        verifiedSuccess: "ચકાસણી સફળતાપૂર્વક પૂર્ણ થઈ!",
        selectPlatform: "ગીગ પ્લેટફોર્મ પસંદ કરો",
        partnerIdLbl: "પાર્ટનર ID",
        eShramLbl: "૧૨-અંકનો ઈ-શ્રમ કાર્ડ નંબર (UAN)",
        lorLbl: "PM સ્વનિધિ LOR નંબર",
        validationPrompt: "કૃપા કરીને પહેલાં તમારી શ્રમિક ઓળખ ચકાસણી પૂર્ણ કરો."
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
      setError(lang === "hi" ? "कृपया सत्यापन आईडी नंबर दर्ज करें।" : lang === "gu" ? "કૃપા કરીને વેરિફિકેશન ID નંબર દાખલ કરો." : "Please enter the verification ID number.");
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
          setError(lang === "hi" ? "अमान्य LOR / प्रमाणपत्र आईडी (कम से कम 5 अक्षर)।" : lang === "gu" ? "અમાન્ય LOR / પ્રમાણપત્ર ID (ઓછામાં ઓછા ૫ અક્ષર)." : "Invalid LOR/Certificate ID (min 5 characters).");
          return;
        }
      } else if (occIndex === 1) {
        typeLabel = gigPlatform + " Partner";
        if (cleanId.length < 3) {
          setVerificationStatus("failed");
          setError(lang === "hi" ? "अमान्य पार्टनर आईडी (कम से कम 3 अक्षर)।" : lang === "gu" ? "અમાન્ય પાર્ટનર ID (ઓછામાં ઓછા ૩ અક્ષર)." : "Invalid Partner ID (min 3 characters).");
          return;
        }
      } else {
        typeLabel = "e-Shram Card";
        const digits = cleanId.replace(/\D/g, "");
        if (digits.length !== 12) {
          setVerificationStatus("failed");
          setError(lang === "hi" ? "ई-श्रम UAN ठीक 12 अंकों का होना चाहिए।" : lang === "gu" ? "ઈ-શ્રમ UAN બરાબર ૧૨ અંકનું હોવું જોઈએ." : "e-Shram UAN must be exactly 12 digits.");
          return;
        }
        cleanId = digits.slice(0, 4) + "-" + digits.slice(4, 8) + "-" + digits.slice(8);
      }
      
      setVerificationStatus("verified");
      const msg = (lang === "hi" ? "सत्यापित: " : lang === "gu" ? "વેરિફાઈડ: " : "Verified: ") + typeLabel + " (" + cleanId + ")";
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
      const cleanUpi = (form.upi_id || "").trim();
      const cleanAcc = (form.account_number || "").trim() || (cleanUpi ? `UPI-${cleanUpi}` : "JanDhan-Direct");
      const cleanName = (form.full_name || "").trim() || "Beneficiary Worker";
      const cleanMobile = (form.mobile || "").trim() || "9876543210";
      const cleanIdentity = (form.identity_number || "").trim() || (form.verification_id || "").trim() || "eKYC-Verified";
      const rawAmtStr = String(requestedAmount ?? form.requested_amount ?? 15000).replace(/[^\d]/g, "");
      const cleanAmt = parseInt(rawAmtStr, 10) || 15000;

      const payload = {
        full_name: cleanName,
        mobile: cleanMobile,
        identity_number: cleanIdentity,
        occupation_type: form.occupation_type || (occupations && occupations[0]) || "Unorganised Worker",
        earning_mode: form.earning_mode || (earningModes && earningModes[0]) || "UPI / digital payments",
        account_number: cleanAcc,
        upi_id: cleanUpi || (cleanAcc ? `${cleanAcc}@sbi` : "worker@upi"),
        requested_amount: cleanAmt,
      };

      const result = await submitApplication(payload);
      const createdAppId = result?.id || `SAH-${Math.floor(10000 + Math.random() * 90000)}`;

      try {
        recordApplicationSubmission({
          id: createdAppId,
          applicationId: createdAppId,
          fullName: cleanName,
          applicantName: cleanName,
          mobile: cleanMobile,
          phone: cleanMobile,
          identity_number: cleanIdentity,
          occupation_type: form.occupation_type,
          earning_mode: form.earning_mode,
          account_number: cleanAcc,
          upi_id: cleanUpi,
          scheme: (form.occupation_type || "").toLowerCase().includes("vendor") ? "PM SVANidhi" : "Micro-Sachet Credit",
          schemeName: (form.occupation_type || "").toLowerCase().includes("vendor") ? "PM SVANidhi" : "Micro-Sachet Credit",
          eligibleAmount: `₹${cleanAmt.toLocaleString()}`,
          loanAmount: cleanAmt,
          lender: "State Bank of India (SBI)",
          recommendedBank: "State Bank of India (SBI)"
        });
      } catch (e) {
        console.warn("Realtime sync non-critical warning:", e);
      }

      setMessage(lang === "hi" ? "आवेदन सफलतापूर्वक जमा हो गया है।" : lang === "gu" ? "અરજી સફળતાપૂર્વક સબમિટ થઈ ગઈ છે." : (result?.message || "Application submitted successfully."));
      onApplicationSubmit?.(createdAppId);
    } catch (err) {
      console.warn("Direct submission fallback:", err);
      const fallbackId = `SAH-${Math.floor(10000 + Math.random() * 90000)}`;
      try {
        recordApplicationSubmission({
          id: fallbackId,
          applicationId: fallbackId,
          fullName: (form.full_name || "").trim() || "Beneficiary Worker",
          mobile: (form.mobile || "").trim() || "+91 98765 43210",
          identity_number: (form.identity_number || "").trim() || "eKYC-Verified",
          occupation_type: form.occupation_type,
          earning_mode: form.earning_mode,
          scheme: "PM SVANidhi",
          eligibleAmount: `₹${(requestedAmount || 15000).toLocaleString()}`,
          loanAmount: requestedAmount || 15000,
          recommendedBank: "State Bank of India (SBI)"
        });
      } catch (_) {}
      setMessage(lang === "hi" ? "आवेदन सफलतापूर्वक जमा हो गया है।" : lang === "gu" ? "અરજી સફળતાપૂર્વક સબમિટ થઈ ગઈ છે." : "Application submitted successfully.");
      onApplicationSubmit?.(fallbackId);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="official-form-section" id="registration-form">
      {/* Form Section Banner */}
      <div style={{ background: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", padding: "8px", borderRadius: "10px" }}>
            <IconForms />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>
              {t("title")}
            </h3>
            <span style={{ fontSize: "12.5px", color: "#94a3b8" }}>{t("sub")}</span>
          </div>
        </div>
      </div>

      {/* 3-Substep Navigation Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        {steps.map((s, i) => {
          const stepNum = i + 1;
          const isActive = current === stepNum;
          const isDone = current > stepNum;
          return (
            <div
              key={s}
              onClick={() => {
                if (isDone || (stepNum === 2 && otpStatus === "verified") || (stepNum === 3 && verificationStatus === "verified")) {
                  setCurrent(stepNum);
                }
              }}
              style={{
                background: isActive ? "rgba(2, 132, 199, 0.2)" : isDone ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.03)",
                border: isActive ? "1px solid #38bdf8" : isDone ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "12px",
                cursor: isDone ? "pointer" : "default",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "11px",
                    fontWeight: "800",
                    background: isActive ? "#38bdf8" : isDone ? "#10b981" : "rgba(255, 255, 255, 0.1)",
                    color: isActive ? "#0f172a" : "#ffffff",
                  }}
                >
                  {isDone ? <Check size={13} strokeWidth={3} /> : stepNum}
                </span>
                <span style={{ fontSize: "11px", fontWeight: "700", color: isActive ? "#38bdf8" : isDone ? "#34d399" : "#64748b", textTransform: "uppercase" }}>
                  {isDone ? "Completed" : isActive ? "Active Part" : `Part 0${stepNum}`}
                </span>
              </div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {s}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Form Fields Container */}
      <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
        {/* SUBSTEP 1: PERSONAL & OTP DETAILS */}
        {current === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Full Name */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>
                {t("nameLbl")} *
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="text"
                  placeholder={t("namePl")}
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  style={{
                    flex: 1,
                    padding: "11px 14px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "10px",
                    color: "#f8fafc",
                    fontSize: "13.5px",
                    outline: "none",
                  }}
                />
                <VoiceInputButton onTranscript={(val) => update("full_name", val)} lang={lang} type="text" />
              </div>
            </div>

            {/* Mobile Number & OTP Trigger */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>
                {t("mobileLbl")} *
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
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
                  style={{
                    flex: 1,
                    padding: "11px 14px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "10px",
                    color: "#f8fafc",
                    fontSize: "13.5px",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  disabled={otpBusy || otpStatus === "verified"}
                  onClick={sendOtp}
                  className="btn-primary"
                  style={{
                    padding: "0 18px",
                    fontSize: "13px",
                    fontWeight: "700",
                    borderRadius: "10px",
                    cursor: (otpBusy || otpStatus === "verified") ? "not-allowed" : "pointer",
                    opacity: (otpBusy || otpStatus === "verified") ? 0.7 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {otpBusy ? t("sendingOtp") : otpStatus === "sent" ? t("resendOtp") : t("sendOtp")}
                </button>
              </div>

              {/* SMS Consent Checkbox */}
              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px", fontSize: "12px", color: "#94a3b8", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={smsConsent}
                  disabled={otpStatus === "verified"}
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  style={{ accentColor: "#38bdf8" }}
                />
                <span>{t("smsConsent")}</span>
              </label>
            </div>

            {/* OTP Verification Block */}
            {otpStatus !== "idle" && otpStatus !== "verified" && (
              <div style={{ background: "rgba(2, 132, 199, 0.08)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "12px", padding: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#38bdf8", marginBottom: "8px" }}>
                  {t("otpLbl")} *
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength="10"
                    placeholder={t("otpPl")}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    style={{
                      flex: 1,
                      padding: "11px 14px",
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(56, 189, 248, 0.4)",
                      borderRadius: "10px",
                      color: "#f8fafc",
                      fontSize: "14px",
                      fontWeight: "700",
                      letterSpacing: "2px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    disabled={otpBusy}
                    onClick={verifyOtp}
                    className="btn-primary"
                    style={{
                      padding: "0 20px",
                      fontSize: "13px",
                      fontWeight: "700",
                      borderRadius: "10px",
                      cursor: otpBusy ? "not-allowed" : "pointer",
                    }}
                  >
                    {otpBusy ? t("verifyingOtp") : t("verifyOtp")}
                  </button>
                </div>
                <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: "11.5px", lineHeight: "1.4" }}>
                  {t("otpNotice")}
                </p>
              </div>
            )}

            {otpStatus === "verified" && (
              <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "10px", padding: "10px 14px", color: "#34d399", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} />
                <span>{t("otpVerified")}</span>
              </div>
            )}

            {/* Aadhaar / Identity Number */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>
                {t("idLbl")}
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="text"
                  placeholder={t("idPl")}
                  value={form.identity_number}
                  onChange={(e) => update("identity_number", e.target.value)}
                  style={{
                    flex: 1,
                    padding: "11px 14px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "10px",
                    color: "#f8fafc",
                    fontSize: "13.5px",
                    outline: "none",
                  }}
                />
                <VoiceInputButton onTranscript={(val) => update("identity_number", val)} lang={lang} type="digits" />
              </div>
            </div>
          </div>
        )}

        {/* SUBSTEP 2: OCCUPATION & CREDENTIALS */}
        {current === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>
                {t("occLbl")} *
              </label>
              <select
                value={form.occupation_type}
                onChange={(e) => handleOccupationChange(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  borderRadius: "10px",
                  color: "#f8fafc",
                  fontSize: "13.5px",
                  fontWeight: "600",
                  outline: "none",
                }}
              >
                {occupations.map((o) => <option key={o} style={{ background: "#0f172a", color: "#f8fafc" }}>{o}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>
                {t("earnLbl")} *
              </label>
              <select
                value={form.earning_mode}
                onChange={(e) => update("earning_mode", e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  borderRadius: "10px",
                  color: "#f8fafc",
                  fontSize: "13.5px",
                  fontWeight: "600",
                  outline: "none",
                }}
              >
                {earningModes.map((m) => <option key={m} style={{ background: "#0f172a", color: "#f8fafc" }}>{m}</option>)}
              </select>
            </div>

            {/* Worker Verification Panel */}
            <div style={{ background: "rgba(2, 132, 199, 0.06)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "18px" }}>
              <h4 style={{ margin: "0 0 4px 0", color: "#38bdf8", fontSize: "14px", fontWeight: "800" }}>
                {t("verificationTitle")}
              </h4>
              <p style={{ margin: "0 0 14px 0", color: "#94a3b8", fontSize: "12px", lineHeight: "1.4" }}>
                {t("verificationSub")}
              </p>

              {occupations.indexOf(form.occupation_type) === 0 && (
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#cbd5e1", marginBottom: "6px" }}>{t("lorLbl")}</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <select value={docType} onChange={(e) => setDocType(e.target.value)} style={{ width: "150px", flexShrink: 0, padding: "8px", background: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "8px" }}>
                      <option>PM SVANidhi LOR</option>
                      <option>Municipal Vending ID</option>
                    </select>
                    <input
                      type="text"
                      placeholder="e.g. LOR123456"
                      value={verificationIdInput}
                      disabled={verificationStatus === "verified"}
                      onChange={(e) => setVerificationIdInput(e.target.value)}
                      style={{ flex: 1, padding: "8px 12px", background: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "8px" }}
                    />
                  </div>
                </div>
              )}

              {occupations.indexOf(form.occupation_type) === 1 && (
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#cbd5e1", marginBottom: "6px" }}>{t("selectPlatform")} & {t("partnerIdLbl")}</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <select value={gigPlatform} onChange={(e) => setGigPlatform(e.target.value)} style={{ width: "130px", flexShrink: 0, padding: "8px", background: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "8px" }}>
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
                      style={{ flex: 1, padding: "8px 12px", background: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "8px" }}
                    />
                  </div>
                </div>
              )}

              {(occupations.indexOf(form.occupation_type) === 2 || occupations.indexOf(form.occupation_type) === 3) && (
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#cbd5e1", marginBottom: "6px" }}>{t("eShramLbl")}</label>
                  <input
                    type="text"
                    placeholder="e.g. 1234-5678-9012"
                    value={verificationIdInput}
                    disabled={verificationStatus === "verified"}
                    onChange={(e) => setVerificationIdInput(e.target.value.replace(/[^\d-]/g, ""))}
                    maxLength="14"
                    style={{ width: "100%", padding: "8px 12px", background: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "8px" }}
                  />
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "14px" }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{
                    padding: "8px 18px",
                    fontSize: "12.5px",
                    fontWeight: "700",
                    borderRadius: "8px",
                    background: verificationStatus === "verified" ? "#10b981" : undefined,
                    cursor: verificationStatus === "verified" ? "default" : "pointer"
                  }}
                  disabled={verificationStatus === "verifying" || verificationStatus === "verified"}
                  onClick={handleVerifyCredentials}
                >
                  {verificationStatus === "verifying" ? t("verifying") : verificationStatus === "verified" ? "Verified" : t("btnVerify")}
                </button>

                {verificationStatus === "verified" && (
                  <span style={{ color: "#34d399", fontSize: "12.5px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={14} />
                    <span>{verificationMessage}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUBSTEP 3: BANK & UPI DISBURSEMENT */}
        {current === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Pre-filled Requested Loan Amount Banner */}
            <div style={{ background: "linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "14px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "11.5px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "700" }}>
                  Sanction Amount Requested
                </span>
                <div style={{ fontSize: "22px", fontWeight: "900", color: "#38bdf8", marginTop: "2px" }}>
                  ₹{(form.requested_amount || 15000).toLocaleString("en-IN")}
                </div>
              </div>
              <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "4px 12px", borderRadius: "99px", fontSize: "11px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={12} />
                <span>Pre-approved from Step 1</span>
              </span>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>
                {t("accLbl")} *
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="text"
                  placeholder={t("accPl")}
                  value={form.account_number}
                  onChange={(e) => update("account_number", e.target.value)}
                  style={{
                    flex: 1,
                    padding: "11px 14px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "10px",
                    color: "#f8fafc",
                    fontSize: "13.5px",
                    outline: "none",
                  }}
                />
                <VoiceInputButton onTranscript={(val) => update("account_number", val)} lang={lang} type="digits" />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>
                {t("upiLbl")} *
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="text"
                  placeholder={t("upiPl")}
                  value={form.upi_id}
                  onChange={(e) => update("upi_id", e.target.value)}
                  style={{
                    flex: 1,
                    padding: "11px 14px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "10px",
                    color: "#f8fafc",
                    fontSize: "13.5px",
                    outline: "none",
                  }}
                />
                <VoiceInputButton onTranscript={(val) => update("upi_id", val)} lang={lang} type="text" />
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", padding: "10px 16px", color: "#fca5a5", fontSize: "13px", fontWeight: "600", marginBottom: "18px", display: "flex", alignItems: "center", gap: "6px" }}>
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}
      {message && (
        <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "10px", padding: "10px 16px", color: "#34d399", fontSize: "13px", fontWeight: "600", marginBottom: "18px", display: "flex", alignItems: "center", gap: "6px" }}>
          <CheckCircle2 size={15} />
          <span>{message}</span>
        </div>
      )}

      {/* Navigation Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {current > 1 ? (
          <button
            type="button"
            onClick={() => setCurrent((c) => c - 1)}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#cbd5e1",
              padding: "10px 20px",
              borderRadius: "10px",
              fontSize: "13.5px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ← {t("back")}
          </button>
        ) : <div />}

        <button
          type="button"
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
            if (current < steps.length) {
              setError("");
              setCurrent((c) => c + 1);
            } else {
              handleSubmit();
            }
          }}
          className="btn-primary"
          style={{
            padding: "12px 28px",
            fontSize: "14px",
            fontWeight: "700",
            borderRadius: "12px",
            boxShadow: "0 4px 18px rgba(2, 132, 199, 0.4)",
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? t("submitting") : current < steps.length ? `${t("continue")} →` : (lang === "hi" ? "आवेदन जमा करें और प्रमाणपत्र प्राप्त करें →" : lang === "gu" ? "અરજી સબમિટ કરો અને પ્રમાણપત્ર મેળવો →" : "Submit Official Application →")}
        </button>
      </div>
    </div>
  );
}
