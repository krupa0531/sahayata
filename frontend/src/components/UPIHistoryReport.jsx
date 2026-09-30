import { useState, useEffect } from "react";
import { 
  Activity, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  Landmark, 
  CreditCard, 
  ShieldCheck, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Sparkles,
  Building2,
  FileCheck
} from "lucide-react";
import { fetchUpiHistory } from "../api";

const copy = {
  en: {
    title: "Real-Time Cash & Credit History Engine",
    titleAdmin: "NPCI & RBI Account Aggregator - Applicant Financial Ledger",
    subtitle: "Extract live transaction velocity, cash deposits, and banking flows via UPI Handle or PAN Card (RBI AA)",
    subtitleAdmin: "Decrypted copy of consenting applicant's UPI & Account Aggregator statement",
    modeUpi: "UPI Virtual Payment Address",
    modePan: "PAN Card (Account Aggregator AA & CKYC)",
    upiInputLabel: "UPI ID / Virtual Payment Address",
    panInputLabel: "PAN Card Number (10-Digit Alpha-Numeric)",
    placeholderUpi: "Enter UPI ID (e.g., ramesh@oksbi)",
    placeholderPan: "Enter PAN Card Number (e.g., ABCDE1234F)",
    btnGenerate: "Generate Ledger & Credit Report",
    btnGenerating: "Fetching Financial Records...",
    invalidVpa: "Please enter a valid UPI ID (containing '@').",
    invalidPan: "Please enter a valid 10-digit PAN format (e.g., ABCDE1234F).",
    presetLabel: "Quick Simulation Presets:",
    metricsTitle: "Cashflow & Underwriting Metrics",
    totalTxns: "Total Transactions",
    successTxns: "Successful Transactions",
    totalVol: "Total Volume (INR)",
    cashDeposits: "Cash Deposits (CDM/Branch)",
    upiInflows: "UPI QR Inflows",
    avgBalance: "Avg Monthly Balance",
    linkedBanksTitle: "Discovered Bank Accounts (RBI Account Aggregator Framework)",
    tableTitle: "Ledger Statement Details (Sensitive Data Masked)",
    tableTitleUser: "Verified Multi-Rail Ledger Statement",
    colTxId: "Transaction ID",
    colDate: "Timestamp",
    colMerchant: "Channel / Source",
    colStatus: "Status",
    colAmount: "Amount",
    colRemarks: "Category & Remarks",
    successBadge: "SUCCESS",
    pendingBadge: "PENDING",
    failedBadge: "FAILED",
    noData: "Please enter a UPI ID or PAN Card Number above to generate a real-time transaction ledger.",
    noDataAdmin: "No financial transaction records found for this applicant identifier."
  },
  hi: {
    title: "रियल-टाइम कैश व क्रेडिट इतिहास इंजन",
    titleAdmin: "NPCI एवं RBI अकाउंट एग्रीगेटर - आवेदक वित्तीय लेजर",
    subtitle: "UPI आईडी या PAN कार्ड (RBI AA) के माध्यम से लाइव लेनदेन, नकद जमा और बैंकिंग फ्लो का विश्लेषण करें",
    subtitleAdmin: "सहमति देने वाले आवेदक के UPI एवं अकाउंट एग्रीगेटर स्टेटमेंट की डिक्रिप्टेड कॉपी",
    modeUpi: "UPI वर्चुअल पेमेंट एड्रेस",
    modePan: "PAN कार्ड (RBI अकाउंट एग्रीगेटर AA)",
    upiInputLabel: "UPI आईडी / वर्चुअल पेमेंट एड्रेस",
    panInputLabel: "PAN कार्ड नंबर (10-अंकीय अल्फा-न्यूमेरिक)",
    placeholderUpi: "UPI आईडी डालें (जैसे, ramesh@oksbi)",
    placeholderPan: "PAN नंबर डालें (जैसे, ABCDE1234F)",
    btnGenerate: "लेजर व क्रेडिट रिपोर्ट बनाएं",
    btnGenerating: "वित्तीय रिकॉर्ड फेच हो रहे हैं...",
    invalidVpa: "कृपया एक सही UPI आईडी दर्ज करें (जिसमें '@' हो)।",
    invalidPan: "कृपया 10-अंकीय मान्य PAN नंबर दर्ज करें (जैसे, ABCDE1234F)।",
    presetLabel: "त्वरित सिमुलेशन प्रीसेट:",
    metricsTitle: "कैश-फ्लो और अंडरराइटिंग मेट्रिक्स",
    totalTxns: "कुल लेनदेन",
    successTxns: "सफल लेनदेन",
    totalVol: "कुल टर्नओवर (INR)",
    cashDeposits: "नकद जमा (CDM/ब्रांच)",
    upiInflows: "UPI QR इनफ्लो",
    avgBalance: "औसत मासिक बैलेंस",
    linkedBanksTitle: "लिंक्ड बैंक खाते (RBI अकाउंट एग्रीगेटर फ्रेमवर्क)",
    tableTitle: "लेजर विवरण (संवेदनशील डेटा एन्क्रिप्टेड)",
    tableTitleUser: "सत्यापित मल्टी-रेल लेजर स्टेटमेंट",
    colTxId: "लेनदेन आईडी",
    colDate: "समय",
    colMerchant: "चैनल / स्रोत",
    colStatus: "स्थिति",
    colAmount: "राशि",
    colRemarks: "श्रेणी व विवरण",
    successBadge: "सफल",
    pendingBadge: "लंबित",
    failedBadge: "विफल",
    noData: "कृपया रीयल-टाइम लेनदेन इतिहास रिपोर्ट बनाने के लिए ऊपर UPI आईडी या PAN कार्ड नंबर दर्ज करें।",
    noDataAdmin: "इस आवेदक के लिए कोई लेनदेन रिकॉर्ड नहीं मिला।"
  },
  gu: {
    title: "રીઅલ-ટાઇમ કેશ અને ક્રેડિટ હિસ્ટ્રી એન્જિન",
    titleAdmin: "NPCI અને RBI એકાઉન્ટ એગ્રીગેટર - નાણાકીય લેજર",
    subtitle: "UPI ID અથવા PAN કાર્ડ (RBI AA) દ્વારા લાઇવ ટ્રાન્ઝેક્શન, રોકડ જમા અને બેંકિંગ ફ્લોનું વિશ્લેષણ",
    subtitleAdmin: "સંમતિ આપનાર અરજદારના UPI અને એકાઉન્ટ એગ્રીગેટર સ્ટેટમેન્ટની ડિક્રિપ્ટેડ કોપી",
    modeUpi: "UPI વર્ચ્યુઅલ પેમેન્ટ એડ્રેસ",
    modePan: "PAN કાર્ડ (RBI એકાઉન્ટ એગ્રીગેટર AA)",
    upiInputLabel: "UPI ID / વર્ચ્યુઅલ પેમેન્ટ એડ્રેસ",
    panInputLabel: "PAN કાર્ડ નંબર (10-અંક આલ્ફા-ન્યુમેરિક)",
    placeholderUpi: "UPI ID દાખલ કરો (દા.ત., ramesh@oksbi)",
    placeholderPan: "PAN નંબર દાખલ કરો (દા.ત., ABCDE1234F)",
    btnGenerate: "લેજર અને ક્રેડિટ રીપોર્ટ બનાવો",
    btnGenerating: "રેકોર્ડ્સ મેળવાઈ રહ્યા છે...",
    invalidVpa: "કૃપા કરીને સાચો UPI ID દાખલ કરો (જેમાં '@' હોય).",
    invalidPan: "કૃપા કરીને માન્ય 10-અંકનો PAN નંબર દાખલ કરો (દા.ત., ABCDE1234F).",
    presetLabel: "ઝડપી સિમ્યુલેશન પ્રીસેટ્સ:",
    metricsTitle: "કેશ-ફ્લો અને અંડરરાઇટિંગ મેટ્રિક્સ",
    totalTxns: "કુલ વ્યવહારો",
    successTxns: "સફળ વ્યવહારો",
    totalVol: "કુલ વોલ્યુમ (INR)",
    cashDeposits: "રોકડ જમા (CDM/શાખા)",
    upiInflows: "UPI QR આવક",
    avgBalance: "સરેરાશ માસિક બેલેન્સ",
    linkedBanksTitle: "શોધાયેલા બેંક એકાઉન્ટ્સ (RBI Account Aggregator)",
    tableTitle: "ખાતાવહી વિગત (સંવેદનશીલ વિગતો એન્ક્રિપ્ટેડ)",
    tableTitleUser: "વેરિફાઇડ લેજર સ્ટેટમેન્ટ",
    colTxId: "ટ્રાન્ઝેક્શન ID",
    colDate: "સમય",
    colMerchant: "ચેનલ / સ્ત્રોત",
    colStatus: "સ્થિતિ",
    colAmount: "રકમ",
    colRemarks: "કેટેગરી અને નોંધ",
    successBadge: "સફળ",
    pendingBadge: "બાકી",
    failedBadge: "નિષ્ફળ",
    noData: "રીઅલ-ટાઇમ ટ્રાન્ઝેક્શન લેજર જનરેટ કરવા માટે કૃપા કરીને ઉપર UPI ID અથવા PAN કાર્ડ નંબર દાખલ કરો.",
    noDataAdmin: "આ અરજદાર માટે કોઈ વ્યવહાર રેકોર્ડ મળ્યો નથી."
  }
};

export default function UPIHistoryReport({ lang = "en", adminView = false, upiId = "" }) {
  const [inputMode, setInputMode] = useState("upi"); // 'upi' or 'pan'
  const [inputValue, setInputValue] = useState(upiId || "");
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const language = copy[lang] ? lang : "en";
  const t = copy[language];

  const presetsUpi = ["ramesh@oksbi", "rahul@okaxis", "savita@paytm", "farmer_kisan@ybl"];
  const presetsPan = ["ABCDE1234F", "BNZPK9821M", "AAAPL0192K", "CRKPS4581L"];

  const handleFetch = async (val, overrideMode) => {
    const id = (val || inputValue).trim();
    const modeToUse = overrideMode || inputMode;

    if (!id) {
      setErrorMsg(modeToUse === "pan" ? t.invalidPan : t.invalidVpa);
      return;
    }

    if (modeToUse === "upi" && !id.includes("@")) {
      setErrorMsg(t.invalidVpa);
      return;
    }

    if (modeToUse === "pan" && !/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(id)) {
      setErrorMsg(t.invalidPan);
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const data = await fetchUpiHistory(id, modeToUse);
      if (data.status === "success") {
        setReportData(data);
      } else {
        setErrorMsg("Failed to load financial data.");
      }
    } catch (err) {
      console.error("API Pipeline Exception:", err);
      setErrorMsg(err.message || "Unable to reach database.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleFetch();
  };

  const selectPreset = (preset, mode) => {
    setInputMode(mode);
    setInputValue(preset);
    handleFetch(preset, mode);
  };

  // Auto-fetch for Admin Dashboard when upiId changes
  useEffect(() => {
    if (adminView && upiId) {
      const detectedMode = upiId.includes("@") ? "upi" : "pan";
      setInputMode(detectedMode);
      setInputValue(upiId);
      setReportData(null);
      handleFetch(upiId, detectedMode);
    } else if (adminView && !upiId) {
      setReportData(null);
    }
  }, [adminView, upiId]);

  return (
    <div className="upi-history-inner" id="upi-history-report" style={{ color: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "8px" }}>
        <span style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc", padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "6px" }}>
          <ShieldCheck size={13} />
          <span>{adminView ? "NPCI & RBI ACCOUNT AGGREGATOR CO-LENDER UNIT" : "NPCI UPI & RBI ACCOUNT AGGREGATOR CREDIT ENGINE"}</span>
        </span>
        <span style={{ fontSize: "11.5px", color: "#a1a1aa" }}>RBI / CKYC Compliant</span>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
        <Activity size={20} style={{ color: "#a855f7" }} />
        <h4 style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: "#f8fafc" }}>
          {adminView ? t.titleAdmin : t.title}
        </h4>
      </div>
      <p style={{ margin: "0 0 18px 0", fontSize: "12.5px", color: "#94a3b8" }}>{adminView ? t.subtitleAdmin : t.subtitle}</p>

      {/* Main input controls - hidden in adminView */}
      {!adminView && (
        <div className="upi-history-controls" style={{ marginTop: "20px", paddingBottom: "20px", borderBottom: "1px solid #2e2e2e" }}>
          
          {/* Dual-Mode Selector Tabs */}
          <div style={{ display: "inline-flex", gap: "4px", background: "#18181b", padding: "4px", borderRadius: "10px", border: "1px solid #3f3f46", marginBottom: "16px" }}>
            <button
              type="button"
              onClick={() => {
                setInputMode("upi");
                setErrorMsg(null);
                if (inputValue && !inputValue.includes("@")) setInputValue("ramesh@oksbi");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 16px",
                borderRadius: "8px",
                border: "none",
                background: inputMode === "upi" ? "#a855f7" : "transparent",
                color: "#fff",
                fontSize: "12.5px",
                fontWeight: inputMode === "upi" ? "700" : "500",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <CreditCard size={14} />
              <span>{t.modeUpi}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setInputMode("pan");
                setErrorMsg(null);
                if (inputValue && inputValue.includes("@")) setInputValue("ABCDE1234F");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 16px",
                borderRadius: "8px",
                border: "none",
                background: inputMode === "pan" ? "#a855f7" : "transparent",
                color: "#fff",
                fontSize: "12.5px",
                fontWeight: inputMode === "pan" ? "700" : "500",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <Landmark size={14} />
              <span>{t.modePan}</span>
            </button>
          </div>

          <form onSubmit={handleFormSubmit} style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: "240px" }}>
              <label style={{ fontSize: "12px", color: "#a1a1aa", fontWeight: "500", display: "flex", alignItems: "center", gap: "5px" }}>
                {inputMode === "pan" ? <Landmark size={13} color="#a855f7" /> : <CreditCard size={13} color="#a855f7" />}
                <span>{inputMode === "pan" ? t.panInputLabel : t.upiInputLabel}</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={inputMode === "pan" ? t.placeholderPan : t.placeholderUpi}
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 38px",
                    borderRadius: "8px",
                    border: "1px solid #3f3f46",
                    background: "#18181b",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    textTransform: inputMode === "pan" ? "uppercase" : "none",
                    letterSpacing: inputMode === "pan" ? "1px" : "normal",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#a855f7")}
                  onBlur={(e) => (e.target.style.borderColor = "#3f3f46")}
                />
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#71717a" }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{
                padding: "10px 22px",
                height: "42px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600",
                boxShadow: "0 4px 10px rgba(124, 58, 237, 0.35)",
                transition: "transform 0.1s, opacity 0.2s"
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>{t.btnGenerating}</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>{t.btnGenerate}</span>
                </>
              )}
            </button>
          </form>

          {/* Simulation presets */}
          <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#a1a1aa" }}>{t.presetLabel}</span>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(inputMode === "pan" ? presetsPan : presetsUpi).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => selectPreset(preset, inputMode)}
                  style={{
                    padding: "4px 10px",
                    fontSize: "11px",
                    borderRadius: "20px",
                    background: "#27272a",
                    border: "1px solid #3f3f46",
                    color: "#e4e4e7",
                    cursor: "pointer",
                    transition: "background 0.2s, color 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#3f3f46";
                    e.target.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#27272a";
                    e.target.style.color = "#e4e4e7";
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div style={{ marginTop: "12px", color: "#ef4444", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
              <AlertTriangle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Report results display */}
      {reportData ? (
        <div style={{ marginTop: "24px", animation: "fadeIn 0.3s ease-out" }}>
          
          {/* Discovered Bank Accounts Card (for PAN Mode) */}
          {reportData.mode === "pan" && reportData.linked_accounts && (
            <div style={{ background: "rgba(124, 58, 237, 0.10)", border: "1px solid rgba(168, 85, 247, 0.3)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Landmark size={18} color="#c084fc" />
                  <h4 style={{ color: "#f3e8ff", fontSize: "14px", fontWeight: "700", margin: 0 }}>
                    {t.linkedBanksTitle}
                  </h4>
                </div>
                <span style={{ fontSize: "11px", fontWeight: "700", background: "rgba(34, 197, 94, 0.15)", color: "#22c55e", border: "1px solid rgba(34, 197, 94, 0.3)", padding: "2px 8px", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={12} />
                  <span>PAN Linked Accounts: {reportData.linked_accounts_count || 2}</span>
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
                {reportData.linked_accounts.map((acc, idx) => (
                  <div key={idx} style={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", padding: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <div>
                        <div style={{ color: "#fff", fontWeight: "700", fontSize: "13px" }}>{acc.bank_name}</div>
                        <div style={{ color: "#a1a1aa", fontSize: "11.5px" }}>{acc.account_type} • {acc.account_number}</div>
                      </div>
                      <div style={{ color: "#22c55e", fontWeight: "700", fontSize: "13px" }}>{acc.balance}</div>
                    </div>
                    <div style={{ fontSize: "10.5px", color: "#a855f7", display: "flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle2 size={11} />
                      <span>{acc.aa_consent_status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KPI metrics row */}
          <h4 style={{ color: "#e4e4e7", fontSize: "14px", marginBottom: "12px", fontWeight: "600" }}>{t.metricsTitle}</h4>
          <div className="upi-metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "24px" }}>
            
            <div className="metric-box" style={{ background: "rgba(39, 39, 42, 0.4)", backdropFilter: "blur(4px)", border: "1px solid #27272a", padding: "14px", borderRadius: "10px" }}>
              <div style={{ fontSize: "11px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.totalTxns}</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#fff", marginTop: "6px", display: "flex", alignItems: "baseline", gap: "6px" }}>
                {reportData.metrics.total_transactions}
                <span style={{ fontSize: "11px", color: "#71717a", fontWeight: "normal" }}>records</span>
              </div>
            </div>

            <div className="metric-box" style={{ background: "rgba(39, 39, 42, 0.4)", backdropFilter: "blur(4px)", border: "1px solid #27272a", padding: "14px", borderRadius: "10px" }}>
              <div style={{ fontSize: "11px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.totalVol}</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#c084fc", marginTop: "6px" }}>
                ₹{reportData.metrics.total_volume_inr.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="metric-box" style={{ background: "rgba(39, 39, 42, 0.4)", backdropFilter: "blur(4px)", border: "1px solid #27272a", padding: "14px", borderRadius: "10px" }}>
              <div style={{ fontSize: "11px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.cashDeposits}</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#22c55e", marginTop: "6px" }}>
                ₹{(reportData.metrics.cash_deposits_inr || 8450).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="metric-box" style={{ background: "rgba(39, 39, 42, 0.4)", backdropFilter: "blur(4px)", border: "1px solid #27272a", padding: "14px", borderRadius: "10px" }}>
              <div style={{ fontSize: "11px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.avgBalance}</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#38bdf8", marginTop: "6px" }}>
                ₹{(reportData.metrics.average_monthly_balance_inr || 23625).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

          </div>

          {/* Ledger table */}
          <h4 style={{ color: "#e4e4e7", fontSize: "14px", marginBottom: "12px", fontWeight: "600" }}>
            {adminView ? t.tableTitle : t.tableTitleUser}
          </h4>
          <div className="table-responsive" style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid #27272a" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#18181b", borderBottom: "1px solid #27272a" }}>
                  <th style={{ padding: "12px", color: "#a1a1aa" }}>{t.colTxId}</th>
                  <th style={{ padding: "12px", color: "#a1a1aa" }}>{t.colDate}</th>
                  <th style={{ padding: "12px", color: "#a1a1aa" }}>{t.colMerchant}</th>
                  <th style={{ padding: "12px", color: "#a1a1aa" }}>{t.colStatus}</th>
                  <th style={{ padding: "12px", color: "#a1a1aa" }}>{t.colRemarks}</th>
                  <th style={{ padding: "12px", color: "#a1a1aa", textAlign: "right" }}>{t.colAmount}</th>
                </tr>
              </thead>
              <tbody>
                {reportData.history.map((tx) => {
                  const statusColors = {
                    SUCCESS: { bg: "rgba(34, 197, 94, 0.15)", text: "#22c55e", icon: CheckCircle2 },
                    PENDING: { bg: "rgba(249, 115, 22, 0.15)", text: "#f97316", icon: Clock },
                    FAILED: { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444", icon: AlertTriangle }
                  }[tx.payment_status] || { bg: "rgba(113, 113, 122, 0.15)", text: "#71717a", icon: Clock };
                  
                  const StatusIcon = statusColors.icon;
                  const statusText = {
                    SUCCESS: t.successBadge,
                    PENDING: t.pendingBadge,
                    FAILED: t.failedBadge
                  }[tx.payment_status] || tx.payment_status;

                  return (
                    <tr key={tx.transaction_id} style={{ borderBottom: "1px solid #27272a", background: "#09090b" }}>
                      <td style={{ padding: "12px", fontFamily: "monospace", color: "#a1a1aa" }}>
                        {adminView ? `${tx.transaction_id.slice(0, 7)}••••` : tx.transaction_id}
                      </td>
                      <td style={{ padding: "12px", color: "#e4e4e7" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Calendar size={13} style={{ color: "#71717a" }} />
                          <span>{tx.transaction_date}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px", color: "#fff", fontWeight: "500" }}>{tx.merchant_name}</td>
                      <td style={{ padding: "12px" }}>
                        {adminView ? (
                          <span style={{ color: "#71717a", fontWeight: "600", fontSize: "14px", letterSpacing: "1px" }}>••••••••</span>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: "600",
                              background: statusColors.bg,
                              color: statusColors.text
                            }}
                          >
                            <StatusIcon size={12} />
                            {statusText}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "12px", color: "#a1a1aa" }}>
                        {adminView ? "••••••••" : tx.payment_remarks}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#fff" }}>
                        ₹{tx.amount.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "24px", padding: "30px 20px", textAlign: "center", background: "rgba(24, 24, 27, 0.3)", borderRadius: "8px", border: "1px dashed #3f3f46" }}>
          {isLoading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "#a1a1aa" }}>
              <RefreshCw className="animate-spin" size={16} />
              <span>Fetching financial &amp; banking records...</span>
            </div>
          ) : (
            <p style={{ color: "#71717a", fontSize: "14px", margin: 0 }}>
              {adminView ? t.noDataAdmin : t.noData}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
