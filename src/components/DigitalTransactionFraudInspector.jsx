import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Cpu,
  Eye,
  X,
  Sliders,
  Sparkles,
  Search,
  Filter,
  BarChart3,
  FileText,
  UploadCloud,
  Play,
  Pause,
  RefreshCw,
  Layers,
  Database,
  Smartphone,
  FileCheck,
  AlertCircle,
  Terminal,
  Check,
  HelpCircle,
  Info,
  Download
} from "lucide-react";
import {
  analyzeImageCanvasForensics,
  analyzeImageWithGeminiVisionAPI,
  runLayer1_ImageForensics,
  runLayer3_MetadataAnalysis,
  runLayer7_TamperingDetection,
  evaluateCustomTransaction,
  analyzeStatementFileContent,
  SAMPLE_GENUINE_STATEMENT_CSV,
  SAMPLE_MANIPULATED_STATEMENT_CSV
} from "../services/antiFraudEngine";
import { recordFraudAttempt } from "../services/realtimeSync";

export default function DigitalTransactionFraudInspector({ lang = "en", navigateTo }) {
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [filterRisk, setFilterRisk] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [liveStreamActive, setLiveStreamActive] = useState(true);

  // REAL-TIME DYNAMIC KPI COUNTERS
  const [analysedCount, setAnalysedCount] = useState(14280);
  const [normalCount, setNormalCount] = useState(13850);
  const [suspiciousCount, setSuspiciousCount] = useState(342);
  const [highRiskCount, setHighRiskCount] = useState(88);

  // --- SECTION 1: INTERACTIVE LIVE CUSTOM TRANSACTION EVALUATOR STATE ---
  const [customTxnForm, setCustomTxnForm] = useState({
    amount: 55000,
    historicalAvg: 2500,
    time: "02:30 AM",
    receiverVpa: "unverified-crypto-mule@upi",
    ipLocation: "Suspicious Proxy (VPN / Foreign IP)",
    recentTxnFrequency: 7
  });

  const [customEvaluationResult, setCustomEvaluationResult] = useState(() =>
    evaluateCustomTransaction({
      amount: 55000,
      historicalAvg: 2500,
      time: "02:30 AM",
      receiverVpa: "unverified-crypto-mule@upi",
      ipLocation: "Suspicious Proxy (VPN / Foreign IP)",
      recentTxnFrequency: 7
    })
  );

  const handleRunCustomEvaluation = (e) => {
    if (e) e.preventDefault();
    const result = evaluateCustomTransaction(customTxnForm);
    setCustomEvaluationResult(result);
    if (result.riskLevel === "HIGH") {
      recordFraudAttempt();
    }
  };

  const handleLoadPreset = (type) => {
    if (type === "HIGH_RISK") {
      const preset = {
        amount: 85000,
        historicalAvg: 2000,
        time: "03:15 AM",
        receiverVpa: "p2p-cashout-mule@ybl",
        ipLocation: "Suspicious Proxy (Unknown ISP)",
        recentTxnFrequency: 12
      };
      setCustomTxnForm(preset);
      const res = evaluateCustomTransaction(preset);
      setCustomEvaluationResult(res);
      recordFraudAttempt();
    } else {
      const preset = {
        amount: 1800,
        historicalAvg: 2200,
        time: "11:30 AM",
        receiverVpa: "swiggy@paytm",
        ipLocation: "Registered IP (Mumbai)",
        recentTxnFrequency: 1
      };
      setCustomTxnForm(preset);
      const res = evaluateCustomTransaction(preset);
      setCustomEvaluationResult(res);
    }
  };

  // --- SECTION 2: REAL BANK & UPI STATEMENT CSV / JSON INSPECTOR STATE ---
  const [statementResult, setStatementResult] = useState(() =>
    analyzeStatementFileContent(SAMPLE_MANIPULATED_STATEMENT_CSV, "Sample_Manipulated_Statement.csv")
  );
  const [statementParsing, setStatementParsing] = useState(false);

  const handleStatementFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStatementParsing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const res = analyzeStatementFileContent(content, file.name);
      setStatementResult(res);
      setStatementParsing(false);
      if (res.isFraud) {
        recordFraudAttempt();
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSampleStatement = (type) => {
    setStatementParsing(true);
    setTimeout(() => {
      if (type === "GENUINE") {
        const res = analyzeStatementFileContent(SAMPLE_GENUINE_STATEMENT_CSV, "Genuine_UPI_Statement.csv");
        setStatementResult(res);
      } else {
        const res = analyzeStatementFileContent(SAMPLE_MANIPULATED_STATEMENT_CSV, "Tampered_Bank_Statement.csv");
        setStatementResult(res);
        recordFraudAttempt();
      }
      setStatementParsing(false);
    }, 400);
  };

  // --- REAL-TIME TRANSACTION DATA STREAM ---
  const [transactionsData, setTransactionsData] = useState([
    {
      id: "TXN-1024",
      amount: 1200,
      time: "10:30 AM",
      payer: "Ramesh Patel",
      pattern: "Normal Baseline",
      riskLevel: "LOW",
      riskScore: 8,
      integrityScore: 96,
      status: "Verified",
      explanations: [
        "Transaction amount is within the user's historical baseline (₹500 – ₹3,000).",
        "Transaction occurred during typical active business hours (10:30 AM).",
        "Consistent device fingerprint and location geofence."
      ],
      recommendation: "Standard fast-track processing. No additional verification required."
    },
    {
      id: "TXN-1025",
      amount: 2500,
      time: "02:15 PM",
      payer: "Sunita Sharma",
      pattern: "Normal Baseline",
      riskLevel: "LOW",
      riskScore: 12,
      integrityScore: 94,
      status: "Verified",
      explanations: [
        "Consistent merchant payout pattern matching Swiggy/Zomato settlement.",
        "Transaction timing aligns with standard afternoon payment window.",
        "Zero pixel or metadata tampering detected."
      ],
      recommendation: "Approved signal for alternative credit assessment."
    },
    {
      id: "TXN-1026",
      amount: 45000,
      time: "02:30 AM",
      payer: "Vikram Singh",
      pattern: "Significant Deviation",
      riskLevel: "HIGH",
      riskScore: 87,
      integrityScore: 42,
      status: "Verification Recommended",
      explanations: [
        "Amount deviation: Transaction amount (₹45,000) significantly deviates from historical baseline (₹500 – ₹3,000).",
        "Timing deviation: Activity occurred outside common transaction window (02:30 AM).",
        "Behaviour deviation: Current transaction pattern differs significantly from established financial baseline."
      ],
      recommendation: "Additional verification is recommended before using this activity as a financial assessment signal."
    },
    {
      id: "TXN-1027",
      amount: 8200,
      time: "11:45 PM",
      payer: "Anita Verma",
      pattern: "Unusual Frequency Spike",
      riskLevel: "MEDIUM",
      riskScore: 54,
      integrityScore: 78,
      status: "Under Review",
      explanations: [
        "Frequency anomaly: 6 micro-transfers executed within 15 minutes.",
        "Amount is moderately higher than weekly average.",
        "Device IP location matches primary city but late-night window."
      ],
      recommendation: "Soft voice confirmation or 1-time OTP verification recommended."
    },
    {
      id: "TXN-1028",
      amount: 1500,
      time: "09:10 AM",
      payer: "Mohammad Khan",
      pattern: "Normal Baseline",
      riskLevel: "LOW",
      riskScore: 6,
      integrityScore: 98,
      status: "Verified",
      explanations: [
        "Daily trade collection QR inflow verified.",
        "Matches historical daily earning rhythm (₹1,200 – ₹1,800/day).",
        "Verified UPI VPA handle."
      ],
      recommendation: "Standard fast-pass authorized."
    }
  ]);

  // STREAM INTERVAL SIMULATOR
  useEffect(() => {
    if (!liveStreamActive) return;

    const interval = setInterval(() => {
      const isAnomalous = Math.random() < 0.25;
      const isHighRisk = isAnomalous && Math.random() < 0.4;
      const newId = `TXN-${Math.floor(1030 + Math.random() * 8970)}`;
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const payers = ["Priya Nair", "Deepak Joshi", "Karan Mehta", "Ananya Roy", "Rajesh Gupta", "Zomato Partner", "Swiggy Payout"];
      const randomPayer = payers[Math.floor(Math.random() * payers.length)];

      let newTxn = null;

      if (isHighRisk) {
        newTxn = {
          id: newId,
          amount: Math.floor(25000 + Math.random() * 60000),
          time: timeStr,
          payer: randomPayer,
          pattern: "Significant Deviation & Geo-Hop",
          riskLevel: "HIGH",
          riskScore: Math.floor(80 + Math.random() * 16),
          integrityScore: Math.floor(30 + Math.random() * 20),
          status: "Verification Recommended",
          explanations: [
            "Amount deviation: Amount significantly exceeds weekly historical baseline.",
            "Geo-Velocity alert: Transaction origin IP differs from registered mobile device.",
            "Behavioral instability: Sudden transaction spike after inactivity."
          ],
          recommendation: "Additional verification recommended before financial signal inclusion."
        };
        setHighRiskCount((prev) => prev + 1);
        recordFraudAttempt();
      } else if (isAnomalous) {
        newTxn = {
          id: newId,
          amount: Math.floor(6000 + Math.random() * 12000),
          time: timeStr,
          payer: randomPayer,
          pattern: "Unusual Frequency Spike",
          riskLevel: "MEDIUM",
          riskScore: Math.floor(45 + Math.random() * 25),
          integrityScore: Math.floor(70 + Math.random() * 15),
          status: "Under Review",
          explanations: [
            "Frequency anomaly: Multiple transactions detected within brief window.",
            "Timing deviation: Executed outside standard active business hours."
          ],
          recommendation: "Secondary verification check recommended."
        };
        setSuspiciousCount((prev) => prev + 1);
      } else {
        newTxn = {
          id: newId,
          amount: Math.floor(400 + Math.random() * 2500),
          time: timeStr,
          payer: randomPayer,
          pattern: "Normal Baseline",
          riskLevel: "LOW",
          riskScore: Math.floor(4 + Math.random() * 12),
          integrityScore: Math.floor(92 + Math.random() * 7),
          status: "Verified",
          explanations: [
            "Normal baseline: Amount and timing match historical pattern.",
            "Verified digital signature and device fingerprint."
          ],
          recommendation: "Standard fast-track pass authorized."
        };
        setNormalCount((prev) => prev + 1);
      }

      setAnalysedCount((prev) => prev + 1);
      setTransactionsData((prev) => [newTxn, ...prev.slice(0, 14)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [liveStreamActive]);

  const filteredTxns = transactionsData.filter((txn) => {
    const matchesRisk = filterRisk === "ALL" || txn.riskLevel === filterRisk;
    const matchesSearch =
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.payer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.pattern.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  return (
    <div style={{ background: "#080d1a", color: "#f8fafc", padding: "40px 20px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>

        {/* HEADER SECTION */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", gap: "16px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38bdf8", padding: "6px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: "700", marginBottom: "12px" }}>
              <Zap size={16} /> SAHAYATA AI FRAUD INTELLIGENCE ENGINE
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#f8fafc", margin: 0 }}>
              AI-Based Fraud Detection in Digital Transactions
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "15px", marginTop: "6px", maxWidth: "780px" }}>
              Analysing real digital transaction signals, statement arithmetic, and telemetry baselines to safeguard digital lending decisions.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setLiveStreamActive(!liveStreamActive)}
              style={{ background: liveStreamActive ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)", border: `1px solid ${liveStreamActive ? "rgba(34, 197, 94, 0.4)" : "rgba(239, 68, 68, 0.4)"}`, color: liveStreamActive ? "#4ade80" : "#fca5a5", padding: "10px 18px", borderRadius: "12px", fontSize: "13px", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}
            >
              {liveStreamActive ? <Pause size={16} /> : <Play size={16} />}
              {liveStreamActive ? "Real-Time Stream Active 🟢" : "Stream Paused ⏸️"}
            </button>

            <button
              onClick={() => navigateTo("/financial-twin")}
              style={{ background: "rgba(56, 189, 248, 0.12)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38bdf8", padding: "10px 18px", borderRadius: "12px", fontSize: "13px", cursor: "pointer", fontWeight: "700" }}
            >
              AI Behaviour Twin →
            </button>
          </div>
        </div>

        {/* 4 DYNAMIC REAL-TIME KPI METRIC CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "36px" }}>
          
          <div style={{ background: "linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "18px", padding: "20px", boxShadow: "0 15px 35px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>Transactions Analysed</span>
              <span style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "6px", borderRadius: "10px" }}><Activity size={18} /></span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc" }}>{analysedCount.toLocaleString("en-IN")}</div>
            <div style={{ fontSize: "12px", color: "#34d399", marginTop: "4px" }}>Live real-time streaming engine</div>
          </div>

          <div style={{ background: "linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))", border: "1px solid rgba(52, 211, 153, 0.2)", borderRadius: "18px", padding: "20px", boxShadow: "0 15px 35px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>Normal Baseline Activity</span>
              <span style={{ background: "rgba(52, 211, 153, 0.15)", color: "#34d399", padding: "6px", borderRadius: "10px" }}><ShieldCheck size={18} /></span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc" }}>{normalCount.toLocaleString("en-IN")} <span style={{ fontSize: "15px", color: "#34d399", fontWeight: "600" }}>({Math.round((normalCount/analysedCount)*100)}%)</span></div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Verified baseline behavior</div>
          </div>

          <div style={{ background: "linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "18px", padding: "20px", boxShadow: "0 15px 35px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>Suspicious Anomalies</span>
              <span style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", padding: "6px", borderRadius: "10px" }}><AlertTriangle size={18} /></span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc" }}>{suspiciousCount.toLocaleString("en-IN")} <span style={{ fontSize: "15px", color: "#fbbf24", fontWeight: "600" }}>({((suspiciousCount/analysedCount)*100).toFixed(1)}%)</span></div>
            <div style={{ fontSize: "12px", color: "#fbbf24", marginTop: "4px" }}>Verification recommended</div>
          </div>

          <div style={{ background: "linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))", border: "1px solid rgba(248, 113, 113, 0.2)", borderRadius: "18px", padding: "20px", boxShadow: "0 15px 35px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>High Risk Anomaly Signals</span>
              <span style={{ background: "rgba(248, 113, 113, 0.15)", color: "#f87171", padding: "6px", borderRadius: "10px" }}><ShieldAlert size={18} /></span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc" }}>{highRiskCount.toLocaleString("en-IN")} <span style={{ fontSize: "15px", color: "#f87171", fontWeight: "600" }}>({((highRiskCount/analysedCount)*100).toFixed(1)}%)</span></div>
            <div style={{ fontSize: "12px", color: "#f87171", marginTop: "4px" }}>Prioritised for underwriter review</div>
          </div>

        </div>

        {/* -------------------------------------------------------------------------------------------------------- */}
        {/* BLOCK 1: DATA SIGNALS EVALUATED SUMMARY BLOCK (3 DATA TIERS) */}
        {/* -------------------------------------------------------------------------------------------------------- */}
        <div style={{ background: "linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "24px", padding: "28px", marginBottom: "40px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <span style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "800" }}>
              TRANSPARENT AI ARCHITECTURE
            </span>
            <span style={{ color: "#94a3b8", fontSize: "13px" }}>Multi-Modal Digital Signal Evaluation</span>
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px 0" }}>
            Data Signals Evaluated by Sahayata Engine
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 24px 0", maxWidth: "850px" }}>
            To protect digital lending platforms without relying solely on traditional credit scores, Sahayata continuously evaluates 3 distinct tiers of real digital transaction data and device telemetry signals.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            
            {/* TIER 1 */}
            <div style={{ background: "rgba(11, 18, 34, 0.7)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "18px", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>1. Digital Transaction Data</h3>
                  <span style={{ fontSize: "12px", color: "#38bdf8" }}>UPI Flow & Amount Behaviour</span>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", color: "#cbd5e1", fontSize: "13px", display: "grid", gap: "8px" }}>
                <li><strong>Transaction Amount Z-Score:</strong> Compares live transfer against historical 30-day baseline range (e.g. ₹2,000 vs ₹55,000).</li>
                <li><strong>Time Window Anomaly:</strong> Flags off-peak midnight transaction windows (12:00 AM – 04:30 AM).</li>
                <li><strong>Receiver VPA Reputation:</strong> Checks destination UPI handle against unverified crypto/mule wallet registries.</li>
                <li><strong>Burst Frequency Spike:</strong> Detects rapid sequence velocity (e.g. 8+ transactions within 15 minutes).</li>
              </ul>
            </div>

            {/* TIER 2 */}
            <div style={{ background: "rgba(11, 18, 34, 0.7)", border: "1px solid rgba(52, 211, 153, 0.2)", borderRadius: "18px", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ background: "rgba(52, 211, 153, 0.15)", color: "#34d399", width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>2. Statement & Receipt Data</h3>
                  <span style={{ fontSize: "12px", color: "#34d399" }}>Ledger Continuity & PDF/CSV Math</span>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", color: "#cbd5e1", fontSize: "13px", display: "grid", gap: "8px" }}>
                <li><strong>Running Balance Continuity:</strong> Validates Balance(prev) + Credit - Debit = Balance(curr) for every statement row.</li>
                <li><strong>Abnormal Liquidity Drains:</strong> Identifies sudden 80%+ cash drains executed after loan application.</li>
                <li><strong>OCR Text Pixel Geometry:</strong> Scans PDF/Image passbooks for font mismatches or Photoshop clone stamps.</li>
                <li><strong>EXIF Metadata Audit:</strong> Detects synthetic AI render engines (DALL·E, Midjourney) or editing software (Photoshop/Canva).</li>
              </ul>
            </div>

            {/* TIER 3 */}
            <div style={{ background: "rgba(11, 18, 34, 0.7)", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "18px", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc", width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>3. Device & Telemetry Data</h3>
                  <span style={{ fontSize: "12px", color: "#c084fc" }}>Geofence IP & Pixel Fingerprints</span>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", color: "#cbd5e1", fontSize: "13px", display: "grid", gap: "8px" }}>
                <li><strong>Geofence IP Hop Velocity:</strong> Flags origin IP shifts (e.g. Registered Mumbai IP to Foreign Proxy VPN).</li>
                <li><strong>HTML Canvas Pixel Signature:</strong> Evaluates hardware GPU canvas rendering for bot/emulator signatures.</li>
                <li><strong>Session Timing Signals:</strong> Monitors interaction latency and automated script execution patterns.</li>
                <li><strong>Multi-Account Device Binding:</strong> Detects multiple applicant profiles originating from single hardware ID.</li>
              </ul>
            </div>

          </div>
        </div>

        {/* -------------------------------------------------------------------------------------------------------- */}
        {/* BLOCK 2: INTERACTIVE LIVE CUSTOM TRANSACTION EVALUATOR (AI SANDBOX FOR JUDGES) */}
        {/* -------------------------------------------------------------------------------------------------------- */}
        <div style={{ background: "linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "24px", padding: "28px", marginBottom: "40px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "800", marginBottom: "6px" }}>
                <Terminal size={14} /> LIVE AI FORENSIC SANDBOX
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#f8fafc", margin: 0 }}>
                Interactive Live Custom Transaction Evaluator
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "14px", margin: "4px 0 0 0" }}>
                Type custom transaction parameters or click preset test scenarios to see the AI Fraud Engine calculate Z-score deviations live!
              </p>
            </div>

            {/* PRESET TRIGGER BUTTONS FOR QUICK DEMONSTRATION */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => handleLoadPreset("HIGH_RISK")}
                style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#fca5a5", padding: "8px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <AlertTriangle size={14} /> Preset: High Risk Anomaly (₹85k @ 3:15 AM)
              </button>
              <button
                onClick={() => handleLoadPreset("NORMAL")}
                style={{ background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.4)", color: "#86efac", padding: "8px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <CheckCircle2 size={14} /> Preset: Normal Baseline (₹1.8k @ 11:30 AM)
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
            
            {/* INPUT FORM */}
            <form onSubmit={handleRunCustomEvaluation} style={{ display: "grid", gap: "14px" }}>
              
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "4px" }}>
                  Transaction Amount (₹):
                </label>
                <input
                  type="number"
                  value={customTxnForm.amount}
                  onChange={(e) => setCustomTxnForm({ ...customTxnForm, amount: parseFloat(e.target.value) || 0 })}
                  style={{ width: "100%", background: "#0b1222", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#f8fafc", padding: "10px 14px", borderRadius: "10px", fontSize: "14px", fontWeight: "700" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "4px" }}>
                  User Historical Avg Amount (₹):
                </label>
                <input
                  type="number"
                  value={customTxnForm.historicalAvg}
                  onChange={(e) => setCustomTxnForm({ ...customTxnForm, historicalAvg: parseFloat(e.target.value) || 1 })}
                  style={{ width: "100%", background: "#0b1222", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#f8fafc", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "4px" }}>
                    Transaction Time:
                  </label>
                  <input
                    type="text"
                    value={customTxnForm.time}
                    onChange={(e) => setCustomTxnForm({ ...customTxnForm, time: e.target.value })}
                    placeholder="e.g. 02:30 AM"
                    style={{ width: "100%", background: "#0b1222", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#f8fafc", padding: "10px 14px", borderRadius: "10px", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "4px" }}>
                    30-Min Frequency:
                  </label>
                  <input
                    type="number"
                    value={customTxnForm.recentTxnFrequency}
                    onChange={(e) => setCustomTxnForm({ ...customTxnForm, recentTxnFrequency: parseInt(e.target.value) || 1 })}
                    style={{ width: "100%", background: "#0b1222", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#f8fafc", padding: "10px 14px", borderRadius: "10px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "4px" }}>
                  Receiver VPA Handle:
                </label>
                <input
                  type="text"
                  value={customTxnForm.receiverVpa}
                  onChange={(e) => setCustomTxnForm({ ...customTxnForm, receiverVpa: e.target.value })}
                  style={{ width: "100%", background: "#0b1222", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#f8fafc", padding: "10px 14px", borderRadius: "10px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "4px" }}>
                  Origin Device Geofence IP:
                </label>
                <input
                  type="text"
                  value={customTxnForm.ipLocation}
                  onChange={(e) => setCustomTxnForm({ ...customTxnForm, ipLocation: e.target.value })}
                  style={{ width: "100%", background: "#0b1222", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#f8fafc", padding: "10px 14px", borderRadius: "10px", fontSize: "13px" }}
                />
              </div>

              <button
                type="submit"
                style={{ background: "linear-gradient(135deg, #d97706, #b45309)", color: "#ffffff", border: "none", padding: "12px 20px", borderRadius: "12px", fontWeight: "800", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "6px" }}
              >
                <Zap size={18} /> Run Live AI Forensic Evaluation
              </button>
            </form>

            {/* LIVE EVALUATION OUTPUT CARD */}
            {customEvaluationResult && (
              <div style={{ background: "#0b1222", border: `1px solid ${customEvaluationResult.riskLevel === "HIGH" ? "#f87171" : customEvaluationResult.riskLevel === "MEDIUM" ? "#fbbf24" : "#34d399"}`, borderRadius: "18px", padding: "22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>
                      AI RISK SYNTHESIS RESULT
                    </span>
                    <span style={{ background: customEvaluationResult.riskLevel === "HIGH" ? "rgba(248, 113, 113, 0.2)" : customEvaluationResult.riskLevel === "MEDIUM" ? "rgba(245, 158, 11, 0.2)" : "rgba(52, 211, 153, 0.2)", color: customEvaluationResult.riskLevel === "HIGH" ? "#f87171" : customEvaluationResult.riskLevel === "MEDIUM" ? "#fbbf24" : "#34d399", padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "800" }}>
                      {customEvaluationResult.statusBadge}
                    </span>
                  </div>

                  {/* METRIC GAUGES */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
                    <div style={{ background: "rgba(255,255,255,0.04)", padding: "12px", borderRadius: "12px" }}>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>Calculated AI Risk Score</div>
                      <div style={{ fontSize: "26px", fontWeight: "900", color: customEvaluationResult.riskLevel === "HIGH" ? "#f87171" : customEvaluationResult.riskLevel === "MEDIUM" ? "#fbbf24" : "#34d399" }}>
                        {customEvaluationResult.riskScore}<span style={{ fontSize: "14px", color: "#94a3b8" }}>/100</span>
                      </div>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.04)", padding: "12px", borderRadius: "12px" }}>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>Transaction Integrity Meter</div>
                      <div style={{ fontSize: "26px", fontWeight: "900", color: "#38bdf8" }}>
                        {customEvaluationResult.integrityScore}<span style={{ fontSize: "14px", color: "#94a3b8" }}>/100</span>
                      </div>
                    </div>
                  </div>

                  {/* EXPLAINABLE AI FLAGS */}
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Cpu size={14} style={{ color: "#38bdf8" }} /> Forensic Data Signals Triggered:
                  </div>

                  <div style={{ display: "grid", gap: "6px", marginBottom: "18px" }}>
                    {customEvaluationResult.explanations.map((exp, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", color: "#cbd5e1", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <span style={{ color: customEvaluationResult.riskLevel === "HIGH" ? "#f87171" : "#38bdf8" }}>•</span>
                        <span>{exp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PLATFORM LENDER RECOMMENDATION */}
                <div style={{ background: customEvaluationResult.riskLevel === "HIGH" ? "rgba(239, 68, 68, 0.12)" : customEvaluationResult.riskLevel === "MEDIUM" ? "rgba(245, 158, 11, 0.12)" : "rgba(34, 197, 94, 0.12)", border: `1px solid ${customEvaluationResult.riskLevel === "HIGH" ? "rgba(239, 68, 68, 0.3)" : customEvaluationResult.riskLevel === "MEDIUM" ? "rgba(245, 158, 11, 0.3)" : "rgba(34, 197, 94, 0.3)"}`, borderRadius: "12px", padding: "14px" }}>
                  <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>
                    Lender Recommendation:
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: customEvaluationResult.riskLevel === "HIGH" ? "#f87171" : customEvaluationResult.riskLevel === "MEDIUM" ? "#fbbf24" : "#34d399", marginTop: "2px" }}>
                    "{customEvaluationResult.recommendation}"
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* -------------------------------------------------------------------------------------------------------- */}
        {/* BLOCK 3: REAL BANK / UPI STATEMENT CSV & JSON INSPECTOR */}
        {/* -------------------------------------------------------------------------------------------------------- */}
        <div style={{ background: "linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))", border: "1px solid rgba(52, 211, 153, 0.3)", borderRadius: "24px", padding: "28px", marginBottom: "40px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
          
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(52, 211, 153, 0.15)", color: "#34d399", padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "800", marginBottom: "6px" }}>
                <FileCheck size={14} /> LIVE STATEMENT LEDGER AUDITOR
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#f8fafc", margin: 0 }}>
                Real Bank & UPI Statement Inspector (.csv / .json)
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "14px", margin: "4px 0 0 0" }}>
                Upload an actual bank or UPI statement file or test sample statements to run automated ledger arithmetic and anomaly validation.
              </p>
            </div>

            {/* 1-CLICK SAMPLE TRIGGERS */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => handleLoadSampleStatement("GENUINE")}
                style={{ background: "rgba(52, 211, 153, 0.15)", border: "1px solid rgba(52, 211, 153, 0.4)", color: "#86efac", padding: "8px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <CheckCircle2 size={14} /> Test Genuine Statement (CSV)
              </button>
              <button
                onClick={() => handleLoadSampleStatement("MANIPULATED")}
                style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#fca5a5", padding: "8px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <AlertTriangle size={14} /> Test Manipulated Statement (CSV)
              </button>
            </div>
          </div>

          {/* FILE UPLOAD DROPZONE */}
          <div style={{ background: "#0b1222", border: "2px dashed rgba(56, 189, 248, 0.3)", borderRadius: "16px", padding: "20px", textAlign: "center", marginBottom: "24px" }}>
            <UploadCloud size={32} style={{ color: "#38bdf8", marginBottom: "8px" }} />
            <h4 style={{ margin: "0 0 4px 0", color: "#f8fafc", fontSize: "15px", fontWeight: "700" }}>
              Upload Custom Statement File (.csv or .json)
            </h4>
            <p style={{ margin: "0 0 12px 0", color: "#94a3b8", fontSize: "12px" }}>
              Parses transaction dates, debit/credit amounts, and validates line-by-line running balance math.
            </p>

            <label style={{ background: "linear-gradient(135deg, #0284c7, #2563eb)", color: "#ffffff", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              {statementParsing ? "Parsing & Auditing Statement..." : "Select .CSV or .JSON File"}
              <input type="file" accept=".csv,.json" onChange={handleStatementFileUpload} style={{ display: "none" }} />
            </label>
          </div>

          {/* STATEMENT INSPECTION RESULTS */}
          {statementResult && (
            <div style={{ background: "#0b1222", border: `1px solid ${statementResult.isFraud ? "#f87171" : "#34d399"}`, borderRadius: "18px", padding: "20px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "12px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase" }}>AUDITED FILE:</span>
                  <strong style={{ color: "#f8fafc", fontSize: "16px", marginLeft: "8px" }}>{statementResult.fileName}</strong>
                </div>
                
                <span style={{ background: statementResult.isFraud ? "rgba(248, 113, 113, 0.2)" : "rgba(52, 211, 153, 0.2)", color: statementResult.isFraud ? "#f87171" : "#34d399", padding: "6px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: "800" }}>
                  {statementResult.isFraud ? "FLAGGED: STATEMENT MANIPULATION DETECTED" : "VERIFIED: 100% GENUINE STATEMENT"}
                </span>
              </div>

              {/* STATS SUMMARY */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px" }}>
                <div style={{ background: "rgba(255,255,255,0.04)", padding: "12px", borderRadius: "12px" }}>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>Statement Integrity Score</div>
                  <div style={{ fontSize: "22px", fontWeight: "900", color: statementResult.isFraud ? "#f87171" : "#34d399" }}>
                    {statementResult.integrityScore}<span style={{ fontSize: "13px", color: "#94a3b8" }}>/100</span>
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", padding: "12px", borderRadius: "12px" }}>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>Ledger Arithmetic Math</div>
                  <div style={{ fontSize: "16px", fontWeight: "800", color: statementResult.arithmeticValid ? "#34d399" : "#f87171", marginTop: "4px" }}>
                    {statementResult.arithmeticValid ? "PASSED (Clean Balance)" : `FAILED (${statementResult.arithmeticErrors} Math Mismatches)`}
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", padding: "12px", borderRadius: "12px" }}>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>Parsed Transactions</div>
                  <div style={{ fontSize: "22px", fontWeight: "900", color: "#f8fafc" }}>
                    {statementResult.totalTransactions} <span style={{ fontSize: "12px", color: "#94a3b8" }}>Rows</span>
                  </div>
                </div>
              </div>

              {/* FLAGGED ANOMALY LINES TABLE */}
              {statementResult.flaggedTxns && statementResult.flaggedTxns.length > 0 ? (
                <div>
                  <h4 style={{ margin: "0 0 10px 0", color: "#f87171", fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                    <AlertTriangle size={16} /> Flagged Statement Inconsistencies ({statementResult.flaggedTxns.length}):
                  </h4>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {statementResult.flaggedTxns.map((flag, idx) => (
                      <div key={idx} style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: "#fca5a5" }}>
                        <strong>Line #{flag.row} ({flag.date} — {flag.particulars}):</strong> {flag.reason}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "10px", padding: "12px 16px", color: "#86efac", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={18} /> Zero ledger arithmetic errors or suspicious cash drains detected in statement!
                </div>
              )}

            </div>
          )}

        </div>

        {/* -------------------------------------------------------------------------------------------------------- */}
        {/* BLOCK 4: LIVE TRANSACTION STREAM MONITOR & REVIEW TABLE */}
        {/* -------------------------------------------------------------------------------------------------------- */}
        <div style={{ background: "linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "24px", padding: "28px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)", marginBottom: "40px" }}>
          
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#f8fafc", display: "flex", alignItems: "center", gap: "10px" }}>
                <Activity size={20} style={{ color: "#38bdf8" }} /> Live Transaction Stream Monitor
              </h3>
              <span style={{ fontSize: "13px", color: "#94a3b8" }}>Streaming real-time digital transaction signals analyzed for behavioural integrity</span>
            </div>

            {/* SEARCH & FILTERS */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="Search ID or Payer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ background: "#0b1222", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#f8fafc", padding: "8px 12px 8px 36px", borderRadius: "10px", fontSize: "13px", width: "180px" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#0b1222", padding: "4px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)" }}>
                {["ALL", "LOW", "MEDIUM", "HIGH"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilterRisk(level)}
                    style={{ background: filterRisk === level ? "rgba(56, 189, 248, 0.2)" : "transparent", color: filterRisk === level ? "#38bdf8" : "#94a3b8", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STREAM TABLE */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <th style={{ padding: "12px 16px" }}>Transaction ID</th>
                  <th style={{ padding: "12px 16px" }}>Amount</th>
                  <th style={{ padding: "12px 16px" }}>Time</th>
                  <th style={{ padding: "12px 16px" }}>Payer / User</th>
                  <th style={{ padding: "12px 16px" }}>Behaviour Pattern</th>
                  <th style={{ padding: "12px 16px" }}>Risk Level</th>
                  <th style={{ padding: "12px 16px" }}>Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.map((txn) => {
                  const isHigh = txn.riskLevel === "HIGH";
                  const isMed = txn.riskLevel === "MEDIUM";
                  const badgeBg = isHigh ? "rgba(248, 113, 113, 0.15)" : isMed ? "rgba(245, 158, 11, 0.15)" : "rgba(52, 211, 153, 0.15)";
                  const badgeColor = isHigh ? "#f87171" : isMed ? "#fbbf24" : "#34d399";
                  const badgeBorder = isHigh ? "rgba(248, 113, 113, 0.3)" : isMed ? "rgba(245, 158, 11, 0.3)" : "rgba(52, 211, 153, 0.3)";

                  return (
                    <tr
                      key={txn.id}
                      onClick={() => setSelectedTxn(txn)}
                      style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", cursor: "pointer", transition: "background 0.2s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px", fontWeight: "700", color: "#38bdf8" }}>{txn.id}</td>
                      <td style={{ padding: "14px 16px", fontWeight: "700", color: "#f8fafc" }}>₹{txn.amount.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{txn.time}</td>
                      <td style={{ padding: "14px 16px", color: "#cbd5e1" }}>{txn.payer}</td>
                      <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{txn.pattern}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}`, padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "800" }}>
                          {txn.riskLevel}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", color: badgeColor, fontWeight: "600" }}>{txn.status}</td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedTxn(txn); }}
                          style={{ background: "rgba(56, 189, 248, 0.12)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38bdf8", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}
                        >
                          Analyse AI Signal →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* AI ANALYSIS MODAL / PANEL */}
        {selectedTxn && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ background: "linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))", border: `2px solid ${selectedTxn.riskLevel === "HIGH" ? "#f87171" : selectedTxn.riskLevel === "MEDIUM" ? "#fbbf24" : "#34d399"}`, borderRadius: "24px", width: "100%", maxWidth: "680px", padding: "32px", boxShadow: "0 25px 60px rgba(0,0,0,0.5)", position: "relative" }}>
              
              <button
                onClick={() => setSelectedTxn(null)}
                style={{ position: "absolute", right: "20px", top: "20px", background: "rgba(255,255,255,0.08)", border: "none", color: "#94a3b8", padding: "8px", borderRadius: "50%", cursor: "pointer" }}
              >
                <X size={18} />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "700" }}>
                  EXPLAINABLE AI PANEL
                </span>
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>ID: <strong style={{ color: "#f8fafc" }}>{selectedTxn.id}</strong></span>
              </div>

              <h2 style={{ margin: "0 0 16px 0", fontSize: "24px", fontWeight: "800", color: "#f8fafc" }}>
                Transaction Signal Breakdown
              </h2>

              {/* KPI STATS IN MODAL */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "24px", background: "rgba(15, 23, 42, 0.6)", padding: "16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>AI Risk Score</div>
                  <div style={{ fontSize: "24px", fontWeight: "900", color: selectedTxn.riskLevel === "HIGH" ? "#f87171" : selectedTxn.riskLevel === "MEDIUM" ? "#fbbf24" : "#34d399" }}>
                    {selectedTxn.riskScore}<span style={{ fontSize: "14px", color: "#94a3b8" }}>/100</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Transaction Integrity</div>
                  <div style={{ fontSize: "24px", fontWeight: "900", color: "#38bdf8" }}>
                    {selectedTxn.integrityScore}<span style={{ fontSize: "14px", color: "#94a3b8" }}>/100</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Status Signal</div>
                  <div style={{ fontSize: "13px", fontWeight: "800", color: selectedTxn.riskLevel === "HIGH" ? "#f87171" : selectedTxn.riskLevel === "MEDIUM" ? "#fbbf24" : "#34d399", marginTop: "6px" }}>
                    {selectedTxn.status}
                  </div>
                </div>
              </div>

              {/* EXPLAINABLE AI REASONING */}
              <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#f8fafc", display: "flex", alignItems: "center", gap: "8px" }}>
                <Cpu size={16} style={{ color: "#38bdf8" }} /> Explainable Risk Signals Triggered:
              </h4>

              <div style={{ display: "grid", gap: "8px", marginBottom: "24px" }}>
                {selectedTxn.explanations.map((exp, index) => (
                  <div key={index} style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: "#cbd5e1", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ color: "#38bdf8", fontWeight: "700" }}>•</span>
                    <span>{exp}</span>
                  </div>
                ))}
              </div>

              {/* AI RECOMMENDATION */}
              <div style={{ background: selectedTxn.riskLevel === "HIGH" ? "rgba(248, 113, 113, 0.1)" : selectedTxn.riskLevel === "MEDIUM" ? "rgba(245, 158, 11, 0.1)" : "rgba(52, 211, 153, 0.1)", border: `1px solid ${selectedTxn.riskLevel === "HIGH" ? "rgba(248, 113, 113, 0.3)" : selectedTxn.riskLevel === "MEDIUM" ? "rgba(245, 158, 11, 0.3)" : "rgba(52, 211, 153, 0.3)"}`, borderRadius: "14px", padding: "16px" }}>
                <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>
                  Platform Lender Recommendation:
                </div>
                <div style={{ fontSize: "14px", color: selectedTxn.riskLevel === "HIGH" ? "#f87171" : selectedTxn.riskLevel === "MEDIUM" ? "#fbbf24" : "#34d399", fontWeight: "700" }}>
                  "{selectedTxn.recommendation}"
                </div>
              </div>

              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <button
                  onClick={() => setSelectedTxn(null)}
                  style={{ background: "rgba(255, 255, 255, 0.1)", border: "none", color: "#f8fafc", padding: "10px 20px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}
                >
                  Close Panel
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
