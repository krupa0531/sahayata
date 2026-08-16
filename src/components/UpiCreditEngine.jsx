import { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { analyzeUpiCredit, uploadUpiStatement } from "../api";

const copy = {
  en: { 
    title: "UPI activity report", 
    sub: "Recent transaction pattern", 
    amount: "Amount", 
    date: "Day & date", 
    pattern: "Pattern", 
    normal: "Normal", 
    suspicious: "Suspicious", 
    loading: "Loading recent UPI activity…", 
    empty: "No transaction data available.",
    modeLabel: "Scoring Mode",
    modeDemo: "Analyze UPI ID (Simulation)",
    modeUpload: "Upload Bank Statement (CSV)",
    upiIdLbl: "UPI ID / Mobile Number",
    fileLbl: "Select Statement CSV",
    btnAnalyze: "Analyze ID",
    btnUpload: "Upload & Analyze",
    errorEmptyFile: "Please select a CSV statement file first.",
    errorEmptyUpi: "Please enter a UPI ID or Mobile Number first.",
    successUpload: "Statement uploaded and credit report generated successfully!"
  },
  hi: { 
    title: "UPI गतिविधि रिपोर्ट", 
    sub: "हाल का लेनदेन पैटर्न", 
    amount: "राशि", 
    date: "दिन और तारीख", 
    pattern: "पैटर्न", 
    normal: "सामान्य", 
    suspicious: "संदिग्ध", 
    loading: "हाल की UPI गतिविधि लोड हो रही है…", 
    empty: "कोई लेनदेन डेटा उपलब्ध नहीं है।",
    modeLabel: "मूल्यांकन मोड",
    modeDemo: "UPI ID का विश्लेषण करें (सिमुलेशन)",
    modeUpload: "बैंक स्टेटमेंट अपलोड करें (CSV)",
    upiIdLbl: "UPI ID / मोबाइल नंबर",
    fileLbl: "स्टेटमेंट CSV फ़ाइल चुनें",
    btnAnalyze: "ID विश्लेषण करें",
    btnUpload: "अपलोड और विश्लेषण करें",
    errorEmptyFile: "कृपया पहले एक CSV स्टेटमेंट फ़ाइल चुनें।",
    errorEmptyUpi: "कृपया पहले एक UPI ID या मोबाइल नंबर दर्ज करें।",
    successUpload: "स्टेटमेंट अपलोड हो गया और क्रेड रिपोर्ट सफलतापूर्वक तैयार हो गई!"
  },
  gu: { 
    title: "UPI પ્રવૃત્તિ રિપોર્ટ", 
    sub: "તાજેતરનો વ્યવહાર પેટર્ન", 
    amount: "રકમ", 
    date: "દિવસ અને તારીખ", 
    pattern: "પેટર્ન", 
    normal: "સામાન્ય", 
    suspicious: "શંકાસ્પદ", 
    loading: "તાજેતરની UPI પ્રવૃત્તિ લોડ થઈ રહી છે…", 
    empty: "કોઈ વ્યવહાર ડેટા ઉપલબ્ધ નથી.",
    modeLabel: "મૂલ્યાંકન મોડ",
    modeDemo: "UPI ID નું વિશ્લેષણ કરો (સિમ્યુલેશન)",
    modeUpload: "બેંક સ્ટેટમેન્ટ અપલોડ કરો (CSV)",
    upiIdLbl: "UPI ID / મોબાઇલ નંબર",
    fileLbl: "સ્ટેટમેન્ટ CSV ફાઇલ પસંદ કરો",
    btnAnalyze: "ID વિશ્લેષણ કરો",
    btnUpload: "અપલોડ અને વિશ્લેષણ કરો",
    errorEmptyFile: "કૃપા કરીને પહેલા CSV સ્ટેટમેન્ટ ફાઇલ પસંદ કરો.",
    errorEmptyUpi: "કૃપા કરીને પહેલા UPI ID અથવા મોબાઇલ નંબર લખો.",
    successUpload: "સ્ટેટમેન્ટ અપલોડ થઈ ગયું અને ક્રેડિટ રિપોર્ટ સફળતાપૂર્વક તૈયાર થઈ ગયો!"
  }
};

export default function UpiCreditEngine({ loanAmount = 15000, profileId = "DEMO-VENDOR", lang = "en" }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("demo"); // demo, upload
  const [inputUpiId, setInputUpiId] = useState(profileId);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [message, setMessage] = useState("");

  const language = copy[lang] ? lang : "en";
  const t = copy[language];

  const fetchReport = (id) => {
    setLoadingReport(true);
    setError(null);
    analyzeUpiCredit({ profile_id: id, loan_amount: loanAmount })
      .then((res) => {
        setData(res);
        setLoadingReport(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingReport(false);
      });
  };

  useEffect(() => {
    fetchReport(profileId);
    setInputUpiId(profileId);
  }, [loanAmount, profileId]);

  const handleAction = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(null);

    const upiId = inputUpiId.trim();
    if (!upiId) {
      setError(t.errorEmptyUpi);
      return;
    }

    if (mode === "upload") {
      if (!selectedFile) {
        setError(t.errorEmptyFile);
        return;
      }
      setLoadingReport(true);
      try {
        const res = await uploadUpiStatement(upiId, selectedFile);
        setData(res);
        setMessage(t.successUpload);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingReport(false);
      }
    } else {
      fetchReport(upiId);
    }
  };

  const threshold = Math.max((data?.features?.daily_throughput || 0) * 5, 10000);
  const warningKeys = new Set((data?.anomaly_warnings || []).map((item) => `${item.txn_date}|${item.amount}`));
  const entries = data?.recent_transactions || [];
  const report = data?.verification_report;

  return (
    <div className="card card-accent-purple compact-upi-report" id="upi-credit-engine">
      <div className="eyebrow">NBFC / BANK VERIFICATION COPY</div>
      <div className="card-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Activity size={18} /> UPI cash-flow underwriting report
      </div>

      <div 
        className="upi-engine-controls" 
        style={{ 
          marginTop: "16px", 
          marginBottom: "20px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "14px", 
          borderBottom: "1px solid #333", 
          paddingBottom: "16px" 
        }}
      >
        <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", fontWeight: "bold" }}>{t.modeLabel}:</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              type="button" 
              className={`btn-outline ${mode === "demo" ? "active-route" : ""}`} 
              onClick={() => { setMode("demo"); setMessage(""); setError(null); }}
              style={{ padding: "6px 12px", fontSize: "12px", cursor: "pointer", height: "auto" }}
            >
              {t.modeDemo}
            </button>
            <button 
              type="button" 
              className={`btn-outline ${mode === "upload" ? "active-route" : ""}`} 
              onClick={() => { setMode("upload"); setMessage(""); setError(null); }}
              style={{ padding: "6px 12px", fontSize: "12px", cursor: "pointer", height: "auto" }}
            >
              {t.modeUpload}
            </button>
          </div>
        </div>

        <form onSubmit={handleAction} style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", color: "#aaa" }}>{t.upiIdLbl}</label>
            <input 
              type="text" 
              value={inputUpiId} 
              onChange={(e) => setInputUpiId(e.target.value)} 
              placeholder="name@upi"
              style={{ 
                padding: "8px 12px", 
                borderRadius: "6px", 
                border: "1px solid #444", 
                background: "#1e1e1e", 
                color: "#fff", 
                fontSize: "13px",
                width: "200px"
              }}
            />
          </div>

          {mode === "upload" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "12px", color: "#aaa" }}>{t.fileLbl}</label>
              <input 
                type="file" 
                accept=".csv"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                style={{ 
                  color: "#ccc",
                  fontSize: "12px",
                  padding: "4px 0"
                }}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loadingReport}
            style={{ padding: "8px 16px", height: "37px", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            {loadingReport ? "Analyzing..." : mode === "demo" ? t.btnAnalyze : t.btnUpload}
          </button>
        </form>

        {message && <p style={{ margin: 0, color: "#28a745", fontSize: "12px", fontWeight: "bold" }}>{message}</p>}
        {error && <p style={{ margin: 0, color: "#dc3545", fontSize: "12px", fontWeight: "bold" }}>{error}</p>}
      </div>

      {!data && !error && !loadingReport && <div className="card-sub">{t.loading}</div>}
      
      {data && (
        <>
          {report && (
            <section className="upi-verification-report" aria-label="NBFC verification report">
              <div className={`upi-decision ${report.review_status === "ready_for_nbfc_review" ? "approved" : "review"}`}>
                <b>{report.review_status === "ready_for_nbfc_review" ? "READY FOR NBFC REVIEW" : "MANUAL REVIEW REQUIRED"}</b>
                <span>{report.next_step}</span>
              </div>
              <div className="upi-report-summary">
                <div>
                  <small>Requested amount</small>
                  <strong>₹{Number(report.requested_loan_amount).toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <small>Eligible limit</small>
                  <strong>₹{Number(report.eligible_limit).toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <small>Risk assessment</small>
                  <strong>{data.credit_score.risk_level.toUpperCase()}</strong>
                </div>
                <div>
                  <small>Decision</small>
                  <strong>{report.recommended_decision.replaceAll("_", " ")}</strong>
                </div>
              </div>
              <div className="upi-check-list">
                {report.verification_checks.map((check) => (
                  <div key={check.name} className={`upi-check ${check.status}`}>
                    <span>{check.status === "pass" ? "✓" : "!"}</span>
                    <div>
                      <b>{check.name}</b>
                      <small>{check.detail}</small>
                    </div>
                    <em>{check.status === "pass" ? "PASSED" : "REVIEW"}</em>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="card-sub">{t.sub} · {data.transaction_count.toLocaleString("en-IN")} transactions analysed</div>
          
          {entries.length ? (
            <div className="upi-table" role="table">
              <div className="upi-row upi-head" role="row">
                <span>{t.amount}</span>
                <span>{t.date}</span>
                <span>{t.pattern}</span>
              </div>
              {entries.map((item) => {
                const isSuspicious = item.amount >= threshold || warningKeys.has(`${item.txn_date}|${item.amount}`);
                const date = new Date(item.txn_date);
                const dayDate = Number.isNaN(date.getTime()) 
                  ? item.txn_date.slice(0, 10) 
                  : date.toLocaleDateString(language === "hi" ? "hi-IN" : language === "gu" ? "gu-IN" : "en-IN", { 
                      weekday: "short", 
                      day: "numeric", 
                      month: "short" 
                    });
                return (
                  <div className="upi-row" role="row" key={`${item.txn_date}-${item.amount}-${item.customer_id}`}>
                    <b>₹{Number(item.amount).toLocaleString("en-IN")}</b>
                    <span>{dayDate}</span>
                    <span className={isSuspicious ? "upi-pattern suspicious" : "upi-pattern normal"}>
                      {isSuspicious ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                      {isSuspicious ? t.suspicious : t.normal}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="card-sub">{t.empty}</p>
          )}
          <p className="upi-rule">{t.suspicious} label is shown only when an unusually high transaction is detected.</p>
        </>
      )}
    </div>
  );
}
