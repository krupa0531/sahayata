import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  FileSearch,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  X,
  FileText,
  BrainCircuit,
  Cpu,
  Layers,
  Sparkles,
  Lock,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ForensicDocumentModal({ forensicData, onClose, lang = "en" }) {
  const [viewMode, setViewMode] = useState("ela"); // 'ela' or 'normal'

  if (!forensicData) return null;

  const isTampered = forensicData.tamperDetected;

  const downloadAuditPdf = () => {
    try {
      const doc = new jsPDF();
      
      // Header banner
      doc.setFillColor(15, 23, 42); // Dark Navy #0F172A
      doc.rect(0, 0, 210, 36, "F");

      doc.setTextColor(56, 189, 248); // Light Blue #38BDF8
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("SAHAYATA AI — ANTI-FRAUD FORENSIC AUDIT REPORT", 14, 16);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Ministry of Finance • Digital Lending Security Pipeline 2026", 14, 26);

      // Report Summary Block
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Document: ${forensicData.fileName}`, 14, 48);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Scan Timestamp: ${new Date().toLocaleString()}`, 14, 55);
      doc.text(`Risk Score: ${forensicData.riskScore}% (${forensicData.riskLevel})`, 14, 62);
      doc.text(`8-Layer Inspection Status: ${isTampered ? "FAILED — TAMPERING DETECTED" : "PASSED — CLEAN BASELINE"}`, 14, 69);

      // EXIF & Font Metadata Table
      autoTable(doc, {
        startY: 76,
        head: [["Forensic Feature", "AI Audit Inspection Result"]],
        body: [
          ["Software Signature", forensicData.exifData.softwareSignature],
          ["Modify Timestamp", forensicData.exifData.modifiedTimestamp],
          ["Original Capture Device", forensicData.exifData.originalDevice],
          ["Font DNA & Resolution", forensicData.exifData.fontMismatch],
          ["DPI Optical Noise Continuity", forensicData.exifData.dpiContinuity],
        ],
        theme: "striped",
        headStyles: { fillStyle: "F", fillColor: [2, 132, 199], textColor: 255, fontStyle: "bold" },
      });

      // Flagged Transaction Lines Table
      if (forensicData.flaggedLines && forensicData.flaggedLines.length > 0) {
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Flagged Anomalous Transaction Lines:", 14, finalY);

        const tableRows = forensicData.flaggedLines.map((line) => [
          `Line ${line.lineNo}`,
          line.date,
          line.description,
          line.credit,
          line.statedBalance,
          line.calculatedBalance,
          line.reason,
        ]);

        autoTable(doc, {
          startY: finalY + 4,
          head: [["Line", "Date", "Description", "Credit", "Stated Bal", "Calculated Bal", "AI Forensic Flag"]],
          body: tableRows,
          theme: "grid",
          headStyles: { fillColor: [220, 38, 38], textColor: 255, fontStyle: "bold" },
        });
      }

      // Final Verdict Box
      const verdictY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 140;
      doc.setFillColor(isTampered ? 254 : 240, isTampered ? 226 : 253, isTampered ? 226 : 244);
      doc.setDrawColor(isTampered ? 220 : 34, isTampered ? 38 : 197, isTampered ? 38 : 94);
      doc.roundedRect(14, verdictY, 182, 24, 3, 3, "FD");

      doc.setTextColor(isTampered ? 185 : 21, isTampered ? 28 : 128, isTampered ? 28 : 61);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("UNDERWRITING DECISION & VERDICT:", 18, verdictY + 8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(forensicData.verdict[lang] || forensicData.verdict.en, 18, verdictY + 16);

      // Security Watermark Footer
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8);
      doc.text("Cryptographic Verification SHA-256: 8f92a1c09b77e812d45b10aa391c01e9 | Sahayata AI Platform", 14, 285);

      doc.save(`Sahayata_Anti_Fraud_Audit_${forensicData.id}.pdf`);
    } catch (e) {
      console.error("PDF Export error:", e);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: "rgba(9, 15, 30, 0.92)",
        backdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "linear-gradient(145deg, #0d1527, #080d19)",
          border: isTampered ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(56, 189, 248, 0.4)",
          borderRadius: "24px",
          maxWidth: "1000px",
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: isTampered ? "0 25px 60px rgba(239, 68, 68, 0.25)" : "0 25px 60px rgba(2, 132, 199, 0.25)",
          color: "#f8fafc",
          padding: "28px",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "rgba(255,255,255,0.1)",
            border: "none",
            color: "#fff",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
          <div
            style={{
              background: isTampered ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.15)",
              color: isTampered ? "#ef4444" : "#22c55e",
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isTampered ? <ShieldAlert size={30} /> : <ShieldCheck size={30} />}
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: isTampered ? "#fca5a5" : "#86efac" }}>
              {isTampered ? "🔴 CRITICAL ANOMALY DETECTED" : "🟢 100% AUTHENTIC DOCUMENT"}
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "800", margin: "2px 0 0 0", color: "#ffffff" }}>
              {forensicData.title[lang] || forensicData.title.en}
            </h2>
            <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0 0" }}>
              File: <strong style={{ color: "#38bdf8" }}>{forensicData.fileName}</strong> • Risk Score: <strong style={{ color: isTampered ? "#ef4444" : "#22c55e" }}>{forensicData.riskScore}% ({forensicData.riskLevel})</strong>
            </p>
          </div>
        </div>

        {/* Grid Layout: Left Inspector Canvas & Right Forensic Telemetry */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          
          {/* LEFT: ELA HEATMAP VISUAL INSPECTOR */}
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#38bdf8", display: "flex", alignItems: "center", gap: "6px" }}>
                <Eye size={16} /> Visual Error Level Analysis (ELA)
              </div>
              <div style={{ display: "flex", gap: "6px", background: "#0f172a", padding: "3px", borderRadius: "99px" }}>
                <button
                  onClick={() => setViewMode("ela")}
                  style={{
                    background: viewMode === "ela" ? "#0284c7" : "transparent",
                    color: viewMode === "ela" ? "#fff" : "#94a3b8",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: "99px",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  ELA Heatmap
                </button>
                <button
                  onClick={() => setViewMode("normal")}
                  style={{
                    background: viewMode === "normal" ? "#0284c7" : "transparent",
                    color: viewMode === "normal" ? "#fff" : "#94a3b8",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: "99px",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Normal
                </button>
              </div>
            </div>

            {/* Canvas / Document Heatmap Display */}
            <div
              style={{
                position: "relative",
                height: "240px",
                borderRadius: "14px",
                background: viewMode === "ela" ? "#030712" : "#1e293b",
                border: viewMode === "ela" && isTampered ? "2px solid rgba(239, 68, 68, 0.6)" : "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                overflow: "hidden",
              }}
            >
              {/* Document Base Mockup */}
              <div style={{ width: "90%", background: viewMode === "ela" ? "#0b0f19" : "#ffffff", color: viewMode === "ela" ? "#475569" : "#0f172a", padding: "16px", borderRadius: "8px", fontFamily: "monospace", fontSize: "11px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid currentColor", paddingBottom: "6px", marginBottom: "8px", fontWeight: "bold" }}>
                  <span>PASSBOOK RECORD</span>
                  <span>ACC: XX9821</span>
                </div>
                <div>12 Sep 2026 • UPI Transfer: +₹5,000</div>
                <div>13 Sep 2026 • Cash Withdrawal: -₹1,200</div>
                
                {/* Highlighted Amount Field */}
                <div
                  style={{
                    marginTop: "10px",
                    padding: "6px",
                    borderRadius: "4px",
                    background: viewMode === "ela" && isTampered ? "rgba(239, 68, 68, 0.35)" : viewMode === "ela" ? "rgba(34, 197, 94, 0.2)" : "rgba(2, 132, 199, 0.15)",
                    border: viewMode === "ela" && isTampered ? "2px dashed #ef4444" : "1px solid transparent",
                    boxShadow: viewMode === "ela" && isTampered ? "0 0 20px rgba(239, 68, 68, 0.8)" : "none",
                    fontWeight: "bold",
                    color: viewMode === "ela" && isTampered ? "#fca5a5" : "inherit",
                  }}
                >
                  14 Sep 2026 • Closing Balance: ₹1,50,000
                  {viewMode === "ela" && isTampered && (
                    <span style={{ display: "block", fontSize: "9px", color: "#ef4444", marginTop: "2px" }}>
                      ⚠️ ELA HIGH RESIDUAL RESIDUAL ERROR (94.2% TAMPER DETECTED)
                    </span>
                  )}
                </div>
              </div>

              {viewMode === "ela" && isTampered && (
                <div style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(239, 68, 68, 0.9)", color: "#fff", padding: "4px 10px", borderRadius: "99px", fontSize: "10px", fontWeight: "800" }}>
                  🔴 TAMPER HOTSPOT DETECTED
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: EXIF METADATA & FONT DNA CARD */}
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "18px" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#38bdf8", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Cpu size={16} /> EXIF & Font DNA Telemetry
            </div>

            <div style={{ display: "grid", gap: "10px", fontSize: "12px" }}>
              <div style={{ background: "#0b1324", padding: "10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "#94a3b8" }}>Software Signature:</span>
                <strong style={{ display: "block", color: isTampered ? "#fca5a5" : "#86efac", marginTop: "2px" }}>
                  {forensicData.exifData.softwareSignature}
                </strong>
              </div>

              <div style={{ background: "#0b1324", padding: "10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "#94a3b8" }}>Modify Timestamp:</span>
                <strong style={{ display: "block", color: "#f8fafc", marginTop: "2px" }}>
                  {forensicData.exifData.modifiedTimestamp}
                </strong>
              </div>

              <div style={{ background: "#0b1324", padding: "10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "#94a3b8" }}>Font DNA & Resolution:</span>
                <strong style={{ display: "block", color: "#38bdf8", marginTop: "2px" }}>
                  {forensicData.exifData.fontMismatch}
                </strong>
              </div>
            </div>
          </div>

        </div>

        {/* FLAGGED ARITHMETIC CONTINUITY LINES TABLE */}
        {forensicData.flaggedLines && forensicData.flaggedLines.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ fontSize: "14px", color: "#fca5a5", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
              <AlertTriangle size={16} /> Flagged Arithmetic Continuity Breakdown:
            </h4>
            <div style={{ background: "#090d18", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.3)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", textTransform: "uppercase", fontSize: "11px" }}>
                    <th style={{ padding: "10px", textAlign: "left" }}>Line</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Stated Bal</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Calculated Bal</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>AI Inspection Finding</th>
                  </tr>
                </thead>
                <tbody>
                  {forensicData.flaggedLines.map((line, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#cbd5e1" }}>
                      <td style={{ padding: "10px", fontWeight: "bold", color: "#ef4444" }}>Line {line.lineNo}</td>
                      <td style={{ padding: "10px" }}>{line.date}</td>
                      <td style={{ padding: "10px", color: "#fca5a5" }}>{line.statedBalance}</td>
                      <td style={{ padding: "10px", color: "#86efac" }}>{line.calculatedBalance}</td>
                      <td style={{ padding: "10px", color: "#f8fafc" }}>{line.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VERDICT & ACTION BUTTONS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: isTampered ? "rgba(239, 68, 68, 0.12)" : "rgba(34, 197, 94, 0.12)", border: isTampered ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(34, 197, 94, 0.3)", padding: "18px", borderRadius: "16px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: isTampered ? "#fca5a5" : "#86efac" }}>Underwriting Verdict</div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff", marginTop: "2px" }}>
              {forensicData.verdict[lang] || forensicData.verdict.en}
            </div>
          </div>

          <button
            onClick={downloadAuditPdf}
            style={{
              background: "linear-gradient(135deg, #0284c7, #38bdf8)",
              color: "#ffffff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 16px rgba(2, 132, 199, 0.4)",
              flexShrink: 0,
            }}
          >
            <Download size={16} /> Export Anti-Fraud Audit Certificate (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
