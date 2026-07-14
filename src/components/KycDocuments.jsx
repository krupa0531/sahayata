import { useEffect, useRef, useState } from "react";
import { listKycDocuments, uploadKycDocument } from "../api";

const DOCUMENT_TYPES = [
  ["aadhaar", "Aadhaar card"],
  ["pan", "PAN card"],
  ["e_shram", "e-Shram card"],
  ["bank_statement", "Bank statement"],
];

function statusLabel(status) {
  return status === "pending_review" ? "Pending review" : status.replaceAll("_", " ");
}

const COPY = {
  en: { eyebrow: "e-KYC documents", title: "Document verification", sub: "Upload Aadhaar, PAN, e-Shram card, or bank statement. PDF, JPG, PNG; maximum 5 MB.", type: "Document type", select: "Select document", upload: "Upload document", uploaded: "Your submitted documents", empty: "No documents uploaded yet." },
  hi: { eyebrow: "e-KYC dastavez", title: "Dastavez satyapan", sub: "Aadhaar, PAN, e-Shram card ya bank statement upload karein. PDF, JPG, PNG; adhiktam 5 MB.", type: "Dastavez ka prakar", select: "Dastavez chunein", upload: "Dastavez upload karein", uploaded: "Aapke jama kiye dastavez", empty: "Abhi koi dastavez upload nahi hai." },
  gu: { eyebrow: "e-KYC dastavejo", title: "Dastavez chakasani", sub: "Aadhaar, PAN, e-Shram card athva bank statement upload karo. PDF, JPG, PNG; vadhu ma vadhu 5 MB.", type: "Dastavez no prakar", select: "Dastavez pasand karo", upload: "Dastavez upload karo", uploaded: "Tamara jama karela dastavejo", empty: "Haji koi dastavez upload nathi." },
};

export default function KycDocuments({ onUploaded, lang = "en" }) {
  const t = COPY[lang] || COPY.en;
  const inputRef = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [documentType, setDocumentType] = useState("aadhaar");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadDocuments = () => {
    setLoading(true);
    listKycDocuments().then((data) => {
      setDocuments(data);
      if (data.length) onUploaded?.(data[0]);
    }).catch((error) => {
      setMessage(error.message === "Not authenticated" ? "KYC upload ke liye login karein." : error.message);
    }).finally(() => setLoading(false));
  };

  useEffect(loadDocuments, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return setMessage("Pehle document choose karein.");
    if (selectedFile.size > 5 * 1024 * 1024) return setMessage("File 5 MB ya usse chhoti honi chahiye.");

    setSubmitting(true);
    setMessage("");
    try {
      const uploaded = await uploadKycDocument(documentType, selectedFile);
      setDocuments((current) => [uploaded, ...current]);
      onUploaded?.(uploaded);
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setMessage("Document upload ho gaya. Verification ke liye pending hai.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card card-accent-teal kyc-card" id="kyc-documents">
      <div className="eyebrow">{t.eyebrow}</div>
      <h3 className="card-title">{t.title}</h3>
      <p className="card-sub">{t.sub}</p>

      <form className="kyc-form" onSubmit={submit}>
        <label>
          {t.type}
          <select value={documentType} onChange={(event) => setDocumentType(event.target.value)}>
            {DOCUMENT_TYPES.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </label>
        <label>
          {t.select}
          <input ref={inputRef} type="file" accept="application/pdf,image/jpeg,image/png" onChange={(event) => setSelectedFile(event.target.files?.[0] || null)} />
        </label>
        <button className="btn-primary" type="submit" disabled={submitting}>{submitting ? "Uploading…" : "Upload document"}</button>
      </form>

      {message && <p className="kyc-message" role="status">{message}</p>}
      <div className="kyc-list" aria-live="polite">
        <strong>{t.uploaded}</strong>
        {loading ? <span>Loading documents…</span> : documents.length === 0 ? <span>No documents uploaded yet.</span> : documents.map((document) => (
          <div className="kyc-item" key={document.id}>
            <div><b>{document.document_type.replaceAll("_", " ")}</b><span>{document.file_name} · {(document.size_bytes / 1024).toFixed(0)} KB</span></div>
            <em className={`kyc-status ${document.status}`}>{statusLabel(document.status)}</em>
          </div>
        ))}
      </div>
    </section>
  );
}
