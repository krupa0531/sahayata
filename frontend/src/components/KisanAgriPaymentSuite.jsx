import React, { useState, useEffect } from "react";
import {
  Wheat,
  Volume2,
  QrCode,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Landmark,
  CheckCircle2,
  Wifi,
  WifiOff,
  Sparkles,
  ArrowRight,
  FileCheck,
  Receipt,
  Coins,
  Sprout,
  Mic,
  RefreshCw,
  PhoneCall,
  ChevronRight
} from "lucide-react";
import "./AboutUs.css";
import { t as translate } from "../services/i18n";

const CROPS_DATA = [
  { id: "wheat", name: "Wheat (गेहूं)", msp: 2275, yieldPerAcre: 18, season: "Rabi" },
  { id: "paddy", name: "Paddy/Rice (धान)", msp: 2183, yieldPerAcre: 22, season: "Kharif" },
  { id: "cotton", name: "Cotton (कपास)", msp: 6620, yieldPerAcre: 10, season: "Kharif" },
  { id: "mustard", name: "Mustard (सरसों)", msp: 5650, yieldPerAcre: 8, season: "Rabi" },
  { id: "sugarcane", name: "Sugarcane (गन्ना)", msp: 315, yieldPerAcre: 350, season: "Zaid" },
];

export default function KisanAgriPaymentSuite({ lang = "en", navigateTo }) {
  const [selectedCrop, setSelectedCrop] = useState(CROPS_DATA[0]);
  const [landAcres, setLandAcres] = useState(3);
  const [season, setSeason] = useState("Rabi");
  const [isOffline, setIsOffline] = useState(false);
  const [soundboxSpeaking, setSoundboxSpeaking] = useState(false);
  const [soundboxText, setSoundboxText] = useState(
    "₹5,400 Wheat (गेहूं) Mandi payment received from Merchant Ramesh Kumar"
  );
  
  // Mandi Scanner State
  const [mandiBillAmount, setMandiBillAmount] = useState(15400);
  const [mandiBillWeight, setMandiBillWeight] = useState(6.8); // Quintals
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Offline Payment Queueing State
  const [offlineTokens, setOfflineTokens] = useState([
    { id: "K-TXN-8821", amount: 2500, type: "Seeds Purchase", time: "10:15 AM", synced: true },
    { id: "K-TXN-8822", amount: 7800, type: "Mandi Deposit", time: "11:40 AM", synced: true },
  ]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Calculate seasonal crop credit limit
  const totalYieldQuintals = selectedCrop.yieldPerAcre * landAcres;
  const estimatedRevenue = totalYieldQuintals * selectedCrop.msp;
  const inputCost = Math.round(estimatedRevenue * 0.35);
  const netCropRevenue = estimatedRevenue - inputCost;
  const kisanCreditLimit = Math.min(160000, Math.round(netCropRevenue * 0.7));

  // Voice Soundbox Simulation
  const triggerSoundboxAudio = (textToSpeak) => {
    const text = textToSpeak || soundboxText;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "hi" ? "hi-IN" : lang === "gu" ? "gu-IN" : "en-IN";
      utterance.rate = 0.9;
      utterance.onstart = () => setSoundboxSpeaking(true);
      utterance.onend = () => setSoundboxSpeaking(false);
      utterance.onerror = () => setSoundboxSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Soundbox Audio: " + text);
    }
  };

  // APMC Mandi Fraud Check Simulation
  const handleVerifyMandiBill = () => {
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      const effectiveRatePerQuintal = Math.round(mandiBillAmount / mandiBillWeight);
      const mspFloor = selectedCrop.msp;
      const isBelowMsp = effectiveRatePerQuintal < mspFloor * 0.85;

      if (isBelowMsp) {
        setVerificationResult({
          status: "WARNING",
          score: 42,
          reason: `Price Flagged: Rate ₹${effectiveRatePerQuintal}/Quintal is below Government MSP Floor (₹${mspFloor}/Quintal). Possible Mandi Underpayment!`,
          layerDetails: "8-Layer Forensic Flag: Price Floor Violation & Potential Trader Exploitation Detected.",
        });
      } else {
        setVerificationResult({
          status: "VERIFIED",
          score: 98,
          reason: `Genuine Mandi Receipt Verified! Rate ₹${effectiveRatePerQuintal}/Quintal complies with Government MSP rules.`,
          layerDetails: "8-Layer Forensic Passed: Digital Watermark Valid, Bank Ledger Verified, Zero Price Manipulation.",
        });
      }
    }, 1200);
  };

  const handleCreateOfflineToken = () => {
    const newToken = {
      id: `K-TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: Math.floor(1000 + Math.random() * 4000),
      type: "Agri Input Purchase",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      synced: !isOffline,
    };
    setOfflineTokens([newToken, ...offlineTokens]);
    triggerSoundboxAudio(`Offline Token Created for ₹${newToken.amount}. Status: ${isOffline ? "Saved Offline" : "Synced Online"}`);
  };

  return (
    <div style={{ background: "#0b1222", color: "#f8fafc", padding: "40px 20px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        
        {/* HEADER & RURAL BADGE */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", gap: "16px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.3)", color: "#4ade80", padding: "6px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: "700", marginBottom: "12px" }}>
              <Wheat size={16} /> SAHAYATA KISAN & RURAL FINTECH SUITE
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#f8fafc", margin: 0 }}>
              Digital Payment & Seasonal Credit for Farmers
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "15px", marginTop: "6px" }}>
              Accessible Voice Soundbox, Seasonal Crop-Cycle Loans, Mandi Receipt Fraud Shield & Low-Connectivity Sync.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: isOffline ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.15)", color: isOffline ? "#fca5a5" : "#4ade80", border: `1px solid ${isOffline ? "rgba(239, 68, 68, 0.3)" : "rgba(34, 197, 94, 0.3)"}`, padding: "8px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: "600" }}>
              {isOffline ? <WifiOff size={16} /> : <Wifi size={16} />}
              {isOffline ? "Offline Mode (Queued)" : "Network Online"}
            </span>

            <button
              onClick={() => navigateTo("/")}
              style={{ background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#f8fafc", padding: "8px 18px", borderRadius: "12px", fontSize: "13px", cursor: "pointer", fontWeight: "600" }}
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* 4 CORE FEATURE TILES GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "40px" }}>

          {/* MODULE 1: MULTILINGUAL VOICE SOUNDBOX */}
          <div style={{ background: "linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "20px", padding: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "12px", borderRadius: "14px" }}>
                <Volume2 size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#f8fafc" }}>1. Kisan Audio Soundbox</h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>Voice confirmations in Hindi & Gujarati</span>
              </div>
            </div>

            <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5", marginBottom: "20px" }}>
              Software Soundbox that announces incoming payments in regional languages so illiterate farmers never fall for fake screenshot scams.
            </p>

            <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px", marginBottom: "16px" }}>
              <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Simulated Announcement</label>
              <input
                type="text"
                value={soundboxText}
                onChange={(e) => setSoundboxText(e.target.value)}
                style={{ width: "100%", background: "#0b1222", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38bdf8", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", outline: "none" }}
              />
            </div>

            <button
              onClick={() => triggerSoundboxAudio()}
              disabled={soundboxSpeaking}
              style={{ width: "100%", background: "linear-gradient(135deg, #0284c7, #2563eb)", color: "#ffffff", border: "none", padding: "12px", borderRadius: "12px", fontWeight: "700", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <Volume2 size={18} /> {soundboxSpeaking ? "Speaking Audio..." : "Test Audio Soundbox 🔊"}
            </button>
          </div>

          {/* MODULE 2: SEASONAL CROP HARVEST CREDIT CALCULATOR */}
          <div style={{ background: "linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: "20px", padding: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", padding: "12px", borderRadius: "14px" }}>
                <Sprout size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#f8fafc" }}>2. Seasonal Crop Credit</h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>Harvest-linked Flexi Repayment</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "#94a3b8" }}>Crop Type</label>
                <select
                  value={selectedCrop.id}
                  onChange={(e) => setSelectedCrop(CROPS_DATA.find((c) => c.id === e.target.value))}
                  style={{ width: "100%", background: "#0b1222", border: "1px solid rgba(255,255,255,0.15)", color: "#f8fafc", padding: "8px", borderRadius: "8px", fontSize: "12px" }}
                >
                  {CROPS_DATA.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#94a3b8" }}>Land Size (Acres)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={landAcres}
                  onChange={(e) => setLandAcres(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ width: "100%", background: "#0b1222", border: "1px solid rgba(255,255,255,0.15)", color: "#f8fafc", padding: "8px", borderRadius: "8px", fontSize: "12px" }}
                />
              </div>
            </div>

            <div style={{ background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: "12px", padding: "14px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>
                <span>Govt MSP Rate:</span>
                <strong style={{ color: "#f8fafc" }}>₹{selectedCrop.msp}/Quintal</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>
                <span>Est. Harvest Revenue:</span>
                <strong style={{ color: "#4ade80" }}>₹{estimatedRevenue.toLocaleString("en-IN")}</strong>
              </div>
              <div style={{ borderTop: "1px dashed rgba(255,255,255,0.1)", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "#cbd5e1", fontWeight: "600" }}>Approved Kisan Credit:</span>
                <strong style={{ color: "#38bdf8", fontSize: "16px" }}>₹{kisanCreditLimit.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            <div style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center" }}>
              💡 Zero Monthly EMIs. Bullet Repayment Post-Harvest in {selectedCrop.season === "Rabi" ? "April/May" : "October/November"}.
            </div>
          </div>

          {/* MODULE 3: APMC MANDI J-FORM FRAUD INSPECTOR */}
          <div style={{ background: "linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "20px", padding: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", padding: "12px", borderRadius: "14px" }}>
                <Receipt size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#f8fafc" }}>3. Mandi Receipt Verifier</h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>Anti-Fraud J-Form & MSP Inspector</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "#94a3b8" }}>Bill Amount (₹)</label>
                <input
                  type="number"
                  value={mandiBillAmount}
                  onChange={(e) => setMandiBillAmount(parseFloat(e.target.value) || 0)}
                  style={{ width: "100%", background: "#0b1222", border: "1px solid rgba(255,255,255,0.15)", color: "#f8fafc", padding: "8px", borderRadius: "8px", fontSize: "12px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#94a3b8" }}>Weight (Quintals)</label>
                <input
                  type="number"
                  step="0.1"
                  value={mandiBillWeight}
                  onChange={(e) => setMandiBillWeight(parseFloat(e.target.value) || 1)}
                  style={{ width: "100%", background: "#0b1222", border: "1px solid rgba(255,255,255,0.15)", color: "#f8fafc", padding: "8px", borderRadius: "8px", fontSize: "12px" }}
                />
              </div>
            </div>

            {verificationResult && (
              <div style={{ background: verificationResult.status === "VERIFIED" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)", border: `1px solid ${verificationResult.status === "VERIFIED" ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`, borderRadius: "12px", padding: "12px", marginBottom: "16px" }}>
                <div style={{ color: verificationResult.status === "VERIFIED" ? "#4ade80" : "#fca5a5", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>
                  {verificationResult.status === "VERIFIED" ? "✅ " : "🚨 "}{verificationResult.reason}
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>{verificationResult.layerDetails}</div>
              </div>
            )}

            <button
              onClick={handleVerifyMandiBill}
              disabled={isVerifying}
              style={{ width: "100%", background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "10px", borderRadius: "12px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
            >
              {isVerifying ? "Running 8-Layer AI Fraud Check..." : "Verify Mandi Bill & MSP Rate"}
            </button>
          </div>

          {/* MODULE 4: RURAL LOW-CONNECTIVITY QUEUE */}
          <div style={{ background: "linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "20px", padding: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc", padding: "12px", borderRadius: "14px" }}>
                <WifiOff size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#f8fafc" }}>4. Offline Payment Sync</h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>Low-Net Queueing for Remote Mandis</span>
              </div>
            </div>

            <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "12px", maxHeight: "110px", overflowY: "auto", marginBottom: "16px" }}>
              {offlineTokens.map((t) => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "6px 0" }}>
                  <div>
                    <strong style={{ color: "#f8fafc" }}>{t.id}</strong> — <span style={{ color: "#94a3b8" }}>{t.type}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#4ade80", fontWeight: "700" }}>₹{t.amount}</div>
                    <span style={{ fontSize: "10px", color: t.synced ? "#38bdf8" : "#fca5a5" }}>{t.synced ? "Synced" : "Queued Offline"}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleCreateOfflineToken}
              style={{ width: "100%", background: "rgba(168, 85, 247, 0.15)", color: "#c084fc", border: "1px solid rgba(168, 85, 247, 0.3)", padding: "10px", borderRadius: "12px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
            >
              + Generate Offline Payment Token
            </button>
          </div>

        </div>

        {/* DIRECT FARMER SCHEMES INTEGRATION BANNER */}
        <div style={{ background: "linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(15, 23, 42, 0.8))", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "20px", padding: "30px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px" }}>
          <div>
            <div style={{ color: "#38bdf8", fontWeight: "700", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Government Welfare Directory</div>
            <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: "#f8fafc" }}>PM-Kisan, Kisan Credit Card (KCC) & Crop Insurance</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "6px", maxWidth: "650px" }}>
              Direct access to ₹1.6 Lakh collateral-free KCC loans @ 4% interest rate, PM Fasal Bima Yojana claim assistance, and ₹6,000/yr PM-Kisan Samman Nidhi.
            </p>
          </div>

          <button
            onClick={() => navigateTo("/about")}
            style={{ background: "linear-gradient(135deg, #0284c7, #2563eb)", color: "#ffffff", border: "none", padding: "14px 28px", borderRadius: "14px", fontWeight: "700", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
          >
            Explore Kisan Schemes <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
