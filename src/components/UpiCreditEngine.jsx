import { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { analyzeUpiCredit } from "../api";

const copy = {
  en: { title: "UPI activity report", sub: "Recent transaction pattern", amount: "Amount", date: "Day & date", pattern: "Pattern", normal: "Normal", suspicious: "Suspicious", loading: "Loading recent UPI activity…", empty: "No transaction data available." },
  hi: { title: "UPI गतिविधि रिपोर्ट", sub: "हाल का लेनदेन पैटर्न", amount: "राशि", date: "दिन और तारीख", pattern: "पैटर्न", normal: "सामान्य", suspicious: "संदिग्ध", loading: "हाल की UPI गतिविधि लोड हो रही है…", empty: "कोई लेनदेन डेटा उपलब्ध नहीं है।" },
  gu: { title: "UPI પ્રવૃત્તિ રિપોર્ટ", sub: "તાજેતરનો વ્યવહાર પેટર્ન", amount: "રકમ", date: "દિવસ અને તારીખ", pattern: "પેટર્ન", normal: "સામાન્ય", suspicious: "શંકાસ્પદ", loading: "તાજેતરની UPI પ્રવૃત્તિ લોડ થઈ રહી છે…", empty: "કોઈ વ્યવહાર ડેટા ઉપલબ્ધ નથી." },
};

export default function UpiCreditEngine({ loanAmount = 15000, profileId = "DEMO-VENDOR", lang = "en" }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const language = copy[lang] ? lang : "en";
  const t = copy[language];

  useEffect(() => {
    setData(null); setError(null);
    analyzeUpiCredit({ profile_id: profileId, loan_amount: loanAmount }).then(setData).catch((err) => setError(err.message));
  }, [loanAmount, profileId]);

  if (!data && !error) return <div className="card card-accent-purple"><div className="card-title">{t.loading}</div></div>;
  if (error) return <div className="card card-accent-purple"><div className="card-title">{t.title}</div><p className="credit-error">{error}</p></div>;

  const threshold = Math.max((data.features?.daily_throughput || 0) * 5, 10000);
  const warningKeys = new Set((data.anomaly_warnings || []).map((item) => `${item.txn_date}|${item.amount}`));
  const entries = data.recent_transactions || [];
  const report = data.verification_report;
  return <div className="card card-accent-purple compact-upi-report" id="upi-credit-engine">
    <div className="eyebrow">NBFC / BANK VERIFICATION COPY</div>
    <div className="card-title"><Activity size={18} /> UPI cash-flow underwriting report</div>
    {report && <section className="upi-verification-report" aria-label="NBFC verification report">
      <div className={`upi-decision ${report.review_status === "ready_for_nbfc_review" ? "approved" : "review"}`}><b>{report.review_status === "ready_for_nbfc_review" ? "READY FOR NBFC REVIEW" : "MANUAL REVIEW REQUIRED"}</b><span>{report.next_step}</span></div>
      <div className="upi-report-summary"><div><small>Requested amount</small><strong>₹{Number(report.requested_loan_amount).toLocaleString("en-IN")}</strong></div><div><small>Eligible limit</small><strong>₹{Number(report.eligible_limit).toLocaleString("en-IN")}</strong></div><div><small>Risk assessment</small><strong>{data.credit_score.risk_level.toUpperCase()}</strong></div><div><small>Decision</small><strong>{report.recommended_decision.replaceAll("_", " ")}</strong></div></div>
      <div className="upi-check-list">{report.verification_checks.map((check) => <div key={check.name} className={`upi-check ${check.status}`}><span>{check.status === "pass" ? "✓" : "!"}</span><div><b>{check.name}</b><small>{check.detail}</small></div><em>{check.status === "pass" ? "PASSED" : "REVIEW"}</em></div>)}</div>
    </section>}
    <div className="card-sub">{t.sub} · {data.transaction_count.toLocaleString("en-IN")} transactions analysed</div>
    {entries.length ? <div className="upi-table" role="table">
      <div className="upi-row upi-head" role="row"><span>{t.amount}</span><span>{t.date}</span><span>{t.pattern}</span></div>
      {entries.map((item) => {
        const isSuspicious = item.amount >= threshold || warningKeys.has(`${item.txn_date}|${item.amount}`);
        const date = new Date(item.txn_date);
        const dayDate = Number.isNaN(date.getTime()) ? item.txn_date.slice(0, 10) : date.toLocaleDateString(language === "hi" ? "hi-IN" : language === "gu" ? "gu-IN" : "en-IN", { weekday: "short", day: "numeric", month: "short" });
        return <div className="upi-row" role="row" key={`${item.txn_date}-${item.amount}-${item.customer_id}`}><b>₹{Number(item.amount).toLocaleString("en-IN")}</b><span>{dayDate}</span><span className={isSuspicious ? "upi-pattern suspicious" : "upi-pattern normal"}>{isSuspicious ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}{isSuspicious ? t.suspicious : t.normal}</span></div>;
      })}
    </div> : <p className="card-sub">{t.empty}</p>}
    <p className="upi-rule">{t.suspicious} label is shown only when an unusually high transaction is detected.</p>
  </div>;
}
