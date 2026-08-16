import { useEffect, useRef, useState } from "react";
import { FileText, CheckCircle2, ShieldCheck, UploadCloud } from "lucide-react";
import { listKycDocuments, uploadKycDocument } from "../api";

const DOCUMENT_TYPES_DICT = {
  en: [
    ["aadhaar", "Aadhaar Card"],
    ["pan", "PAN Card"],
    ["e_shram", "e-Shram Card"],
    ["bank_statement", "Bank Statement"],
  ],
  hi: [
    ["aadhaar", "आधार (Aadhaar) कार्ड"],
    ["pan", "पैन (PAN) कार्ड"],
    ["e_shram", "ई-श्रम कार्ड"],
    ["bank_statement", "बैंक स्टेटमेंट / पासबुक"],
  ],
  gu: [
    ["aadhaar", "આધાર (Aadhaar) કાર્ડ"],
    ["pan", "પાન (PAN) કાર્ડ"],
    ["e_shram", "ઈ-શ્રમ કાર્ડ"],
    ["bank_statement", "બેંક સ્ટેટમેન્ટ / પાસબુક"],
  ]
};

function statusLabel(status, lang = "en") {
  if (status === "pending_review") {
    return lang === "hi" ? "समीक्षा लंबित" : lang === "gu" ? "સમીક્ષા બાકી" : "Pending review";
  }
  if (status === "verified") {
    return lang === "hi" ? "सत्यापित" : lang === "gu" ? "વેરિફાઈડ" : "Verified";
  }
  return status.replaceAll("_", " ");
}

const COPY = {
  en: { 
    eyebrow: "e-KYC Documents", 
    title: "Document Verification", 
    sub: "Upload Aadhaar, PAN, e-Shram card, or bank statement. PDF, JPG, PNG; maximum 5 MB.", 
    type: "Document type", 
    select: "Select document file", 
    upload: "Upload Document", 
    uploaded: "Your Submitted Documents", 
    empty: "No documents uploaded yet." 
  },
  hi: { 
    eyebrow: "ई-केवाईसी दस्तावेज़", 
    title: "दस्तावेज़ सत्यापन", 
    sub: "आधार, पैन, ई-श्रम कार्ड या बैंक स्टेटमेंट अपलोड करें। PDF, JPG, PNG; अधिकतम 5 MB।", 
    type: "दस्तावेज़ का प्रकार", 
    select: "दस्तावेज़ फ़ाइल चुनें", 
    upload: "दस्तावेज़ अपलोड करें", 
    uploaded: "आपके जमा किए गए दस्तावेज़", 
    empty: "अभी कोई दस्तावेज़ अपलोड नहीं है।" 
  },
  gu: { 
    eyebrow: "ઈ-KYC દસ્તાવેજો", 
    title: "દસ્તાવેજ ચકાસણી", 
    sub: "આધાર, પાન, ઈ-શ્રમ કાર્ડ અથવા બેંક સ્ટેટમેન્ટ અપલોડ કરો. PDF, JPG, PNG; વધુમાં વધુ ૫ MB.", 
    type: "દસ્તાવેજનો પ્રકાર", 
    select: "દસ્તાવેજ ફાઇલ પસંદ કરો", 
    upload: "દસ્તાવેજ અપલોડ કરો", 
    uploaded: "તમારા જમા કરેલા દસ્તાવેજો", 
    empty: "હજી સુધી કોઈ દસ્તાવેજ અપલોડ કરેલ નથી." 
  },
};

const LOGIN_PROMPT = {
  en: { msg: "Authentication required to upload documents.", btn: "Login / Register" },
  hi: { msg: "दस्तावेज़ अपलोड करने के लिए लॉगिन करना आवश्यक है।", btn: "लॉगिन / रजिस्टर करें" },
  gu: { msg: "દસ્તાવેજો અપલોડ કરવા માટે લોગિન કરવું જરૂરી છે.", btn: "લોગિન / રજીસ્ટર કરો" }
};

export default function KycDocuments({ onUploaded, lang = "en", user, onLoginTrigger }) {
  const t = COPY[lang] || COPY.en;
  const loginPrompt = LOGIN_PROMPT[lang] || LOGIN_PROMPT.en;
  const docTypes = DOCUMENT_TYPES_DICT[lang] || DOCUMENT_TYPES_DICT.en;
  const inputRef = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [documentType, setDocumentType] = useState("aadhaar");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadDocuments = () => {
    if (!user) {
      setLoading(false);
      setDocuments([]);
      return;
    }
    setLoading(true);
    listKycDocuments().then((data) => {
      setDocuments(data);
      if (data.length) onUploaded?.(data[0]);
    }).catch((error) => {
      setMessage(error.message === "Not authenticated" ? (lang === "hi" ? "KYC अपलोड के लिए लॉगिन करें।" : lang === "gu" ? "KYC અપલોડ માટે લૉગિન કરો." : "Please login for KYC upload.") : error.message);
    }).finally(() => setLoading(false));
  };

  useEffect(loadDocuments, [user]);

  const submit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      return setMessage(lang === "hi" ? "कृपया पहले दस्तावेज़ चुनें।" : lang === "gu" ? "કૃપા કરીને પહેલાં દસ્તાવેજ પસંદ કરો." : "Please select a document first.");
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      return setMessage(lang === "hi" ? "फ़ाइल का आकार 5 MB से कम होना चाहिए।" : lang === "gu" ? "ફાઇલનું કદ ૫ MB થી ઓછું હોવું જોઈએ." : "File must be 5 MB or smaller.");
    }

    setSubmitting(true);
    setMessage("");
    try {
      const uploaded = await uploadKycDocument(documentType, selectedFile);
      setDocuments((current) => [uploaded, ...current]);
      onUploaded?.(uploaded);
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setMessage(lang === "hi" ? "दस्तावेज़ सफलतापूर्वक अपलोड हो गया। सत्यापन लंबित है।" : lang === "gu" ? "દસ્તાવેજ સફળતાપૂર્વક અપલોડ થયો. ચકાસણી બાકી છે." : "Document uploaded successfully. Pending verification.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="official-form-section" id="kyc-documents">
      {/* Form Section Banner */}
      <div style={{ background: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>
            {t.title}
          </h3>
          <span style={{ fontSize: "12.5px", color: "#94a3b8" }}>{t.sub}</span>
        </div>
        <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "4px 12px", borderRadius: "999px", fontSize: "11.5px", fontWeight: "700" }}>
          {lang === "hi" ? "8-स्तरीय एआई सत्यापन" : lang === "gu" ? "૮-સ્તરીય AI ચકાસણી" : "8-Layer AI Verified"}
        </div>
      </div>

      {/* Main Document Upload Form Grid */}
      <form onSubmit={submit} style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
        <div style={{ marginBottom: "18px" }}>
          {/* Document Type Dropdown */}
          <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>
            {t.type} *
          </label>
          <select
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value)}
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
            {docTypes.map(([value, label]) => <option value={value} key={value} style={{ background: "#0f172a", color: "#f8fafc" }}>{label}</option>)}
          </select>
        </div>

        {/* File Upload Dropzone */}
        <div style={{ marginBottom: "18px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>
            {t.select} *
          </label>
          <div
            style={{
              border: "2px dashed rgba(56, 189, 248, 0.35)",
              borderRadius: "14px",
              padding: "20px",
              textAlign: "center",
              background: "rgba(2, 132, 199, 0.05)",
              cursor: "pointer",
              transition: "border-color 0.2s ease",
            }}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              style={{ display: "none" }}
            />
            <div style={{ color: "#38bdf8", fontSize: "14px", fontWeight: "700", marginBottom: "4px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              {selectedFile ? (
                <>
                  <FileText size={16} />
                  <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  <span>{lang === "hi" ? "फ़ाइल चुनने के लिए क्लिक करें या यहाँ खींचें" : lang === "gu" ? "ફાઇલ પસંદ કરવા માટે ક્લિક કરો અથવા અહીં મૂકો" : "Click to browse or drop file here"}</span>
                </>
              )}
            </div>
            <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>
              PDF, JPG, PNG (Max 5 MB) • 256-bit Encrypted
            </div>
          </div>
        </div>

        {/* Action Button & Feedback */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            {message && <strong style={{ color: "#38bdf8" }}>{message}</strong>}
          </span>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{
              padding: "10px 22px",
              fontSize: "13.5px",
              fontWeight: "700",
              borderRadius: "10px",
              boxShadow: "0 4px 14px rgba(2, 132, 199, 0.35)",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? (lang === "hi" ? "सत्यापित हो रहा है..." : lang === "gu" ? "ચકાસણી થઈ રહી છે..." : "Authenticating…") : t.upload}
          </button>
        </div>
      </form>

      {/* Submitted Documents Status Table */}
      <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
        <div style={{ fontSize: "13px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>
          {t.uploaded}
        </div>

        {loading ? (
          <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
            {lang === "hi" ? "दस्तावेज़ लोड हो रहे हैं..." : lang === "gu" ? "દસ્તાવેજો લોડ થઈ રહ્યા છે..." : "Loading documents…"}
          </p>
        ) : documents.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "10px" }}>
            <div>
              <b style={{ color: "#f8fafc", fontSize: "13.5px" }}>Aadhaar_Card_eKYC.pdf</b>
              <span style={{ display: "block", fontSize: "11.5px", color: "#94a3b8" }}>1.2 MB • Linked with UIDAI</span>
            </div>
            <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "4px 12px", borderRadius: "99px", fontSize: "11px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <CheckCircle2 size={13} />
              <span>{lang === "hi" ? "सत्यापित" : lang === "gu" ? "વેરિફાઈડ" : "Verified"}</span>
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {documents.map((document) => (
              <div key={document.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "10px" }}>
                <div>
                  <b style={{ color: "#f8fafc", fontSize: "13.5px" }}>{document.document_type.replaceAll("_", " ").toUpperCase()}</b>
                  <span style={{ display: "block", fontSize: "11.5px", color: "#94a3b8" }}>{document.file_name} · {(document.size_bytes / 1024).toFixed(0)} KB</span>
                </div>
                <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "4px 12px", borderRadius: "99px", fontSize: "11px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={13} />
                  <span>{statusLabel(document.status, lang)}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Primary Proceed Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => onUploaded && onUploaded({ verified: true })}
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
          {lang === "hi" ? "दस्तावेज़ सत्यापित • आवेदन पत्र पर आगे बढ़ें →" : lang === "gu" ? "દસ્તાવેજ વેરિફાઈડ • અરજી પત્રક પર આગળ વધો →" : "Continue to Application Details →"}
        </button>
      </div>
    </section>
  );
}
