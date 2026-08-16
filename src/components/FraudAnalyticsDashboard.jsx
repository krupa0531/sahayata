import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Zap,
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Cpu,
  Clock,
  Building2,
} from "lucide-react";
import "./SahayataHomepage.css";

export default function FraudAnalyticsDashboard({ onClose }) {
  const [activeFilter, setActiveFilter] = useState("All");

  // Mock Real-Time Analytics State
  const stats = {
    totalDocuments: 1482,
    verifiedDocs: 1280,
    rejectedDocs: 142,
    manualReview: 60,
    aiGeneratedCaught: 84,
    tamperedCaught: 58,
    avgProcessingTime: "3.1s",
    systemTrustScore: 98.4,
  };

  const bankStats = [
    { bank: "State Bank of India (SBI)", total: 540, verified: 512, fraud: 28, trust: "97.8%" },
    { bank: "HDFC Bank", total: 410, verified: 395, fraud: 15, trust: "98.5%" },
    { bank: "ICICI Bank", total: 320, verified: 308, fraud: 12, trust: "98.1%" },
    { bank: "Axis Bank", total: 212, verified: 203, fraud: 9, trust: "97.2%" },
  ];

  const recentFraudLogs = [
    {
      id: "FRD-2026-9081",
      fileName: "SBI_Statement_Jul2026_Edited.png",
      uploadedBy: "User #8942",
      detectedReason: "Layer 1: TruFor Noise Anomaly (ChatGPT/DALL-E Output)",
      aiConfidence: "96%",
      layerFailed: "Layer 1 (AI Image Forensics)",
      status: "Fraud Blocked",
      timestamp: "10 mins ago",
    },
    {
      id: "FRD-2026-9082",
      fileName: "HDFC_Passbook_Scan_Photoshop.jpg",
      uploadedBy: "User #9012",
      detectedReason: "Layer 7: Clone Stamp Balance Alteration Detected",
      aiConfidence: "91%",
      layerFailed: "Layer 7 (Tampering Detection)",
      status: "Fraud Blocked",
      timestamp: "24 mins ago",
    },
    {
      id: "FRD-2026-9083",
      fileName: "Canva_Utility_Bill_Draft.pdf",
      uploadedBy: "User #7712",
      detectedReason: "Layer 3: EXIF Metadata Canva Export Signature",
      aiConfidence: "88%",
      layerFailed: "Layer 3 (Metadata Analysis)",
      status: "Fraud Blocked",
      timestamp: "1 hour ago",
    },
    {
      id: "FRD-2026-9084",
      fileName: "SBI_Original_Passbook_Blur.jpg",
      uploadedBy: "User #6621",
      detectedReason: "Layer 2: Unclear Font Alignment (Blurry Capture)",
      aiConfidence: "45%",
      layerFailed: "Layer 2 (OCR Validation)",
      status: "Manual Review",
      timestamp: "2 hours ago",
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(4, 8, 20, 0.95)",
        backdropFilter: "blur(20px)",
        overflowY: "auto",
        padding: "32px 24px",
        color: "#ffffff",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Dashboard Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <ShieldAlert size={28} color="#38bdf8" />
              <h1 style={{ fontSize: "26px", fontWeight: "800", letterSpacing: "-0.5px" }}>
                SAHAYATA AI — 8-Layer Anti-Fraud Dashboard
              </h1>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              Real-time Computer Vision, TruFor Forensics, OCR & RAG Benchmark Inspection System
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: "999px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <XCircle size={15} />
              <span>Close Dashboard</span>
            </span>
          </button>
        </div>

        {/* 6 Key Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "20px", borderRadius: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>
              <span>Total Documents</span>
              <FileCheck size={16} color="#38bdf8" />
            </div>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#ffffff" }}>{stats.totalDocuments}</div>
            <div style={{ fontSize: "11px", color: "#38bdf8", marginTop: "4px" }}>↑ 12% today</div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(34, 197, 94, 0.3)", padding: "20px", borderRadius: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>
              <span>Verified Genuine</span>
              <ShieldCheck size={16} color="#22c55e" />
            </div>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#4ade80" }}>{stats.verifiedDocs}</div>
            <div style={{ fontSize: "11px", color: "#4ade80", marginTop: "4px" }}>86.3% Pass Rate</div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "20px", borderRadius: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>
              <span>Fraud Attempts</span>
              <AlertTriangle size={16} color="#ef4444" />
            </div>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#f87171" }}>{stats.rejectedDocs}</div>
            <div style={{ fontSize: "11px", color: "#f87171", marginTop: "4px" }}>Auto-Blocked</div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "20px", borderRadius: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>
              <span>AI Generated Caught</span>
              <Cpu size={16} color="#f59e0b" />
            </div>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#fbbf24" }}>{stats.aiGeneratedCaught}</div>
            <div style={{ fontSize: "11px", color: "#fbbf24", marginTop: "4px" }}>TruFor / UniFD Layer</div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(168, 85, 247, 0.3)", padding: "20px", borderRadius: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>
              <span>Tampered / Edited</span>
              <Layers size={16} color="#a855f7" />
            </div>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#c084fc" }}>{stats.tamperedCaught}</div>
            <div style={{ fontSize: "11px", color: "#c084fc", marginTop: "4px" }}>Photoshop / Clone Stamp</div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(56, 189, 248, 0.3)", padding: "20px", borderRadius: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>
              <span>Avg Verification Speed</span>
              <Clock size={16} color="#38bdf8" />
            </div>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#38bdf8" }}>{stats.avgProcessingTime}</div>
            <div style={{ fontSize: "11px", color: "#38bdf8", marginTop: "4px" }}>Real-time 8-Layer Pipeline</div>
          </div>
        </div>

        {/* Bank-wise Statistics Table & Risk Distribution */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "32px" }}>
          {/* Bank Statistics */}
          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <Building2 size={20} color="#38bdf8" />
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Bank-Wise Verification & Fraud Audit</h3>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8" }}>
                  <th style={{ padding: "10px 0" }}>Partner Bank</th>
                  <th>Total Scanned</th>
                  <th>Verified</th>
                  <th>Fraud Caught</th>
                  <th>RAG Trust Score</th>
                </tr>
              </thead>
              <tbody>
                {bankStats.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "14px 0", fontWeight: "600", color: "#ffffff" }}>{item.bank}</td>
                    <td>{item.total}</td>
                    <td style={{ color: "#4ade80", fontWeight: "600" }}>{item.verified}</td>
                    <td style={{ color: "#f87171", fontWeight: "600" }}>{item.fraud}</td>
                    <td style={{ color: "#38bdf8", fontWeight: "700" }}>{item.trust}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Risk Level Distribution */}
          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <Activity size={20} color="#38bdf8" />
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Risk Level Distribution</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={13} color="#22c55e" />
                    <span>Low Risk (Verified)</span>
                  </span>
                  <span style={{ color: "#4ade80", fontWeight: "700" }}>86.3%</span>
                </div>
                <div style={{ height: "8px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: "86.3%", height: "100%", background: "#22c55e" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <AlertTriangle size={13} color="#f59e0b" />
                    <span>Medium Risk (Manual Review)</span>
                  </span>
                  <span style={{ color: "#fbbf24", fontWeight: "700" }}>4.1%</span>
                </div>
                <div style={{ height: "8px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: "4.1%", height: "100%", background: "#f59e0b" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <XCircle size={13} color="#ef4444" />
                    <span>High Risk (Fraud Blocked)</span>
                  </span>
                  <span style={{ color: "#f87171", fontWeight: "700" }}>9.6%</span>
                </div>
                <div style={{ height: "8px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: "9.6%", height: "100%", background: "#ef4444" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Fraud Audit Logs */}
        <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ShieldAlert size={20} color="#f87171" />
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Recent Anti-Fraud Audit Log</h3>
            </div>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Live Real-Time Monitoring</span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8" }}>
                <th style={{ padding: "10px 0" }}>Audit ID</th>
                <th>Uploaded File</th>
                <th>Layer Failed</th>
                <th>Detection Reason</th>
                <th>Fraud Confidence</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {recentFraudLogs.map((log, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <td style={{ padding: "14px 0", fontFamily: "monospace", color: "#38bdf8" }}>{log.id}</td>
                  <td style={{ fontWeight: "600", color: "#ffffff" }}>{log.fileName}</td>
                  <td style={{ color: "#fbbf24" }}>{log.layerFailed}</td>
                  <td style={{ color: "#94a3b8" }}>{log.detectedReason}</td>
                  <td style={{ color: "#f87171", fontWeight: "700" }}>{log.aiConfidence}</td>
                  <td style={{ fontWeight: "700" }}>{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
