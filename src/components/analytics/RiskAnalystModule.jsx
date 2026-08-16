import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck, 
  Terminal, 
  Cpu, 
  Activity, 
  Layers, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  RefreshCw, 
  TrendingUp, 
  Zap, 
  Lock, 
  Check, 
  X, 
  FileSpreadsheet, 
  BadgeAlert,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getAnalyticsState } from '../../services/realtimeSync.js';

const FORENSIC_CASE_FILES = [
  {
    id: 'CASE-FR-101',
    applicantName: 'Ramesh Kumar',
    sector: 'Delivery Partners (Zomato)',
    documentType: 'Aadhaar e-KYC & Payout Sheet',
    riskScore: 8,
    trustScore: 96,
    tamperProbability: '0.2%',
    exifStatus: 'Passed (Original Camera Sensor)',
    elaStatus: 'Passed (Uniform Compression Ratio)',
    verhoeffStatus: 'Valid (Mathematical Checksum Matched)',
    isolationForestStatus: 'Normal (Continuous 90-day Inflow)',
    status: 'SECURE',
    timestamp: 'Today at 10:32 AM',
    recommendation: 'Clear for Loan Sanction'
  },
  {
    id: 'CASE-FR-102',
    applicantName: 'Vikas Patil',
    sector: 'Street Vendors (Snack Stall)',
    documentType: 'Municipal Vendor Pass & QR Ledger',
    riskScore: 6,
    trustScore: 98,
    tamperProbability: '0.1%',
    exifStatus: 'Passed (Original Mobile Device)',
    elaStatus: 'Passed (0% Pixel Splice)',
    verhoeffStatus: 'Valid (D5 Dihedral Group Match)',
    isolationForestStatus: 'Normal (Daily Merchant QR Velocity)',
    status: 'SECURE',
    timestamp: 'Today at 01:45 PM',
    recommendation: 'Clear for Tranche-2 Expansion'
  },
  {
    id: 'CASE-FR-103',
    applicantName: 'Sunita Devi',
    sector: 'Domestic Workers',
    documentType: 'e-SHRAM Card & Bank Passbook',
    riskScore: 12,
    trustScore: 92,
    tamperProbability: '0.8%',
    exifStatus: 'Passed (Direct Scan)',
    elaStatus: 'Passed (Clean Metadata Structure)',
    verhoeffStatus: 'Valid (Verhoeff Verified)',
    isolationForestStatus: 'Normal (Bi-weekly Cash Buffer)',
    status: 'SECURE',
    timestamp: 'Today at 03:15 PM',
    recommendation: 'Clear for Sachet Micro-Credit'
  },
  {
    id: 'CASE-FR-991',
    applicantName: 'Unverified Entity (W-8992)',
    sector: 'Informal Sector Applicant',
    documentType: 'Manipulated e-SHRAM Pass',
    riskScore: 94,
    trustScore: 8,
    tamperProbability: '96.8%',
    exifStatus: 'Failed (Software: Adobe Photoshop 2024)',
    elaStatus: 'Failed (High Error Gradient in DOB Field)',
    verhoeffStatus: 'Invalid (Checksum Mismatch)',
    isolationForestStatus: 'Anomaly (Single Large CDM Spike)',
    status: 'BLOCKED',
    timestamp: 'Yesterday at 04:20 PM',
    recommendation: 'Blacklisted & Fraud Alert Logged'
  },
  {
    id: 'CASE-FR-992',
    applicantName: 'Unverified Merchant (QR-482)',
    sector: 'Street Vendor Applicant',
    documentType: 'Forged Bank CDM Deposit Slip',
    riskScore: 89,
    trustScore: 11,
    tamperProbability: '92.4%',
    exifStatus: 'Failed (Web Downloaded Artifact)',
    elaStatus: 'Failed (Font Edge Inconsistency)',
    verhoeffStatus: 'Invalid (Account Number Mismatch)',
    isolationForestStatus: 'Anomaly (Artificial Velocity Spike)',
    status: 'BLOCKED',
    timestamp: '18 Sep at 11:10 AM',
    recommendation: 'Blacklisted & Co-Lending Lockout'
  },
  {
    id: 'CASE-FR-993',
    applicantName: 'Tampered Identity (AAD-192)',
    sector: 'Construction Applicant',
    documentType: 'Cloned Aadhaar Document',
    riskScore: 98,
    trustScore: 4,
    tamperProbability: '99.1%',
    exifStatus: 'Failed (Metadata Stripped)',
    elaStatus: 'Failed (Pixel Level Tampering in Photo Box)',
    verhoeffStatus: 'Failed (Algorithmic Checksum Failure)',
    isolationForestStatus: 'Anomaly (Zero Bank History)',
    status: 'BLOCKED',
    timestamp: '17 Sep at 02:45 PM',
    recommendation: 'Permanent Blacklist'
  }
];

export default function RiskAnalystModule() {
  const [selectedCase, setSelectedCase] = useState(FORENSIC_CASE_FILES[0]);
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'SECURE' | 'BLOCKED'
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredCases = FORENSIC_CASE_FILES.filter(c => {
    if (filterMode === 'SECURE') return c.status === 'SECURE';
    if (filterMode === 'BLOCKED') return c.status === 'BLOCKED';
    return true;
  });

  // Export Risk Audit Certificate PDF
  const handleExportRiskCertificate = (caseFile) => {
    const doc = new jsPDF();
    
    doc.setFillColor(3, 105, 161);
    doc.rect(0, 0, 210, 24, 'F');
    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    doc.text('SAHAYATA - 8-LAYER AI FORENSIC RISK AUDIT CERTIFICATE', 14, 16);

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`Official Forensic Audit ID: ${caseFile.id} | Generated: ${new Date().toLocaleString()}`, 14, 32);

    autoTable(doc, {
      startY: 38,
      head: [['Forensic Layer', 'Audit Evaluation', 'Result Status']],
      body: [
        ['Case ID', caseFile.id, caseFile.status],
        ['Applicant / Profile', caseFile.applicantName, caseFile.sector],
        ['Document Inspected', caseFile.documentType, 'Complete'],
        ['1. EXIF Metadata', caseFile.exifStatus, caseFile.status === 'SECURE' ? 'PASSED' : 'FAILED'],
        ['2. Error Level Analysis (ELA)', caseFile.elaStatus, caseFile.status === 'SECURE' ? 'PASSED' : 'FAILED'],
        ['3. Aadhaar Verhoeff Algorithm', caseFile.verhoeffStatus, caseFile.status === 'SECURE' ? 'PASSED' : 'FAILED'],
        ['4. Isolation Forest ML Anomaly', caseFile.isolationForestStatus, caseFile.status === 'SECURE' ? 'PASSED' : 'FAILED'],
        ['5. Overall Tamper Probability', caseFile.tamperProbability, caseFile.status === 'SECURE' ? 'LOW' : 'CRITICAL'],
        ['6. AI Trust Score', `${caseFile.trustScore} / 100`, caseFile.status === 'SECURE' ? 'PRIME' : 'HIGH RISK'],
        ['7. Risk Officer Final Action', caseFile.recommendation, caseFile.status]
      ],
      theme: 'grid',
      headStyles: { fillColor: [3, 105, 161] },
    });

    const finalY = doc.lastAutoTable.finalY || 160;
    doc.setFontSize(11);
    doc.setTextColor(3, 105, 161);
    doc.text('Risk Analyst Attestation & Security Mandate:', 14, finalY + 12);

    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text('This forensic audit was executed using Sahayata 8-Layer Anti-Fraud Engine.', 14, finalY + 20);
    doc.text('Zero physical document tampering detected on verified profiles, ensuring 0% NPA capital safety.', 14, finalY + 27);

    doc.save(`Sahayata_Risk_Audit_${caseFile.id}.pdf`);
    showToast(`Risk Certificate for ${caseFile.applicantName} Downloaded`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'inherit' }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#0369A1', color: '#FFFFFF', padding: '10px 18px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(3, 105, 161, 0.4)', zIndex: 9999, fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {toastMsg}
        </div>
      )}

      {/* 1. TOP EXECUTIVE RISK KPI RIBBON */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        
        <div style={{ background: '#FFFFFF', padding: '16px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #4F46E5', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700 }}>
            <span>FRAUD ATTEMPTS INTERCEPTED</span>
            <ShieldAlert size={18} color="#4F46E5" />
          </div>
          <strong style={{ fontSize: '1.5rem', color: '#4F46E5', display: 'block', margin: '4px 0' }}>
            3 Blocked
          </strong>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>100% Capital Loss Prevented</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #0284C7', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700 }}>
            <span>ISOLATION FOREST ANOMALIES</span>
            <Activity size={18} color="#0284C7" />
          </div>
          <strong style={{ fontSize: '1.5rem', color: '#0284C7', display: 'block', margin: '4px 0' }}>
            0 Anomalies
          </strong>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Continuous Inflow Velocity</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #059669', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700 }}>
            <span>VERHOEFF CHECKSUM RATE</span>
            <Fingerprint size={18} color="#059669" />
          </div>
          <strong style={{ fontSize: '1.5rem', color: '#059669', display: 'block', margin: '4px 0' }}>
            100% Validated
          </strong>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Aadhaar & PAN Match</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #0369A1', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700 }}>
            <span>PORTFOLIO NPA HEALTH</span>
            <ShieldCheck size={18} color="#0369A1" />
          </div>
          <strong style={{ fontSize: '1.5rem', color: '#0369A1', display: 'block', margin: '4px 0' }}>
            0.0% NPA
          </strong>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>98.4% On-time EDI Collection</span>
        </div>

      </div>

      {/* 2. 8-LAYER AI ANTI-FRAUD FORENSICS OVERVIEW MATRIX */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.25rem 1.5rem', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <strong style={{ fontSize: '1rem', color: '#0F172A', fontWeight: 800 }}>
              8-Layer AI Anti-Fraud Forensics Architecture
            </strong>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block', marginTop: '2px' }}>
              Multi-dimensional real-time tamper screening before loan underwriting approval.
            </span>
          </div>
          <span style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '3px 10px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 700 }}>
            All 8 Layers Active
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
          {[
            { num: '01', name: 'EXIF Metadata Analysis', desc: 'Hardware sensor & camera origin validation' },
            { num: '02', name: 'Error Level Analysis (ELA)', desc: 'Compression level tampering & pixel cloning scan' },
            { num: '03', name: 'Verhoeff Checksum Algorithm', desc: 'Dihedral D5 Aadhaar mathematical validation' },
            { num: '04', name: 'Account Aggregator ReBIT Hash', desc: 'Cryptographic multi-bank statement signature' },
            { num: '05', name: 'Isolation Forest Anomaly Scan', desc: 'Spike & artificial velocity deposit filter' },
            { num: '06', name: 'GPS Geofencing Telemetry', desc: 'Vending stall & delivery route consistency' },
            { num: '07', name: 'Device Root & Clone Detection', desc: 'Emulators and rooted handsets lockout' },
            { num: '08', name: 'Cross-Lender Velocity Guard', desc: 'Simultaneous multi-application spam prevention' }
          ].map(layer => (
            <div key={layer.num} style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0369A1', background: '#E0F2FE', padding: '2px 6px', borderRadius: '4px' }}>
                L{layer.num}
              </span>
              <div>
                <strong style={{ fontSize: '12.5px', color: '#0F172A', display: 'block' }}>{layer.name}</strong>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '2px' }}>{layer.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CASE FILES & DEEP FORENSIC DOSSIER */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem' }}>
        
        {/* LEFT COLUMN: FORENSIC CASE LIST */}
        <div style={{ gridColumn: 'span 5', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
            <div>
              <strong style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: 800 }}>
                Forensic Case Files
              </strong>
              <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block' }}>
                {filteredCases.length} case records analyzed
              </span>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {['ALL', 'SECURE', 'BLOCKED'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterMode(f)}
                  style={{
                    background: filterMode === f ? '#0369A1' : '#F1F5F9',
                    color: filterMode === f ? '#FFFFFF' : '#475569',
                    border: 'none',
                    padding: '4px 9px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '520px' }}>
            {filteredCases.map(c => {
              const isSelected = selectedCase?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  style={{
                    background: isSelected ? '#F0F9FF' : '#FFFFFF',
                    border: isSelected ? '1.5px solid #0284C7' : '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(2, 132, 199, 0.12)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>{c.applicantName}</strong>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: c.status === 'SECURE' ? '#059669' : '#DC2626',
                      background: c.status === 'SECURE' ? '#ECFDF5' : '#FEF2F2',
                      border: c.status === 'SECURE' ? '1px solid #A7F3D0' : '1px solid #FCA5A5',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {c.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#0369A1', fontWeight: 600, marginTop: '2px' }}>
                    {c.id} • {c.documentType}
                  </div>

                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                    {c.sector} • {c.timestamp}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #F1F5F9', fontSize: '11.5px' }}>
                    <span>Tamper Prob: <strong style={{ color: c.status === 'SECURE' ? '#059669' : '#DC2626' }}>{c.tamperProbability}</strong></span>
                    <span>Trust: <strong style={{ color: '#059669' }}>{c.trustScore}/100</strong></span>
                    <span>Risk: <strong style={{ color: c.riskScore > 50 ? '#DC2626' : '#059669' }}>{c.riskScore}/100</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: DEEP FORENSIC AUDIT DOSSIER */}
        <div style={{ gridColumn: 'span 7', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {selectedCase ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={22} color={selectedCase.status === 'SECURE' ? '#059669' : '#DC2626'} />
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                      {selectedCase.applicantName} ({selectedCase.id})
                    </h3>
                  </div>
                  <span style={{ fontSize: '12.5px', color: '#0369A1', fontWeight: 700, display: 'block', marginTop: '3px' }}>
                    {selectedCase.documentType} • {selectedCase.sector}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                    Inspected: {selectedCase.timestamp}
                  </span>
                </div>

                <span style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: selectedCase.status === 'SECURE' ? '#059669' : '#DC2626',
                  background: selectedCase.status === 'SECURE' ? '#ECFDF5' : '#FEF2F2',
                  border: selectedCase.status === 'SECURE' ? '1px solid #A7F3D0' : '1px solid #FCA5A5',
                  padding: '4px 12px',
                  borderRadius: '6px'
                }}>
                  {selectedCase.status === 'SECURE' ? 'AUTHENTIC PROFILE' : 'TAMPERING INTERCEPTED'}
                </span>
              </div>

              {/* 4-Box Deep Forensics Signals */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                
                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>1. EXIF Hardware Metadata</span>
                  <strong style={{ fontSize: '13px', color: selectedCase.status === 'SECURE' ? '#059669' : '#DC2626', display: 'block', marginTop: '2px' }}>
                    {selectedCase.exifStatus}
                  </strong>
                </div>

                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>2. Error Level Analysis (ELA)</span>
                  <strong style={{ fontSize: '13px', color: selectedCase.status === 'SECURE' ? '#059669' : '#DC2626', display: 'block', marginTop: '2px' }}>
                    {selectedCase.elaStatus}
                  </strong>
                </div>

                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>3. Verhoeff Algorithm Checksum</span>
                  <strong style={{ fontSize: '13px', color: selectedCase.status === 'SECURE' ? '#059669' : '#DC2626', display: 'block', marginTop: '2px' }}>
                    {selectedCase.verhoeffStatus}
                  </strong>
                </div>

                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>4. Isolation Forest ML Inflow</span>
                  <strong style={{ fontSize: '13px', color: selectedCase.status === 'SECURE' ? '#059669' : '#DC2626', display: 'block', marginTop: '2px' }}>
                    {selectedCase.isolationForestStatus}
                  </strong>
                </div>

              </div>

              {/* Status Summary Banner */}
              <div style={{ background: selectedCase.status === 'SECURE' ? '#ECFDF5' : '#FEF2F2', padding: '14px', borderRadius: '10px', border: selectedCase.status === 'SECURE' ? '1px solid #A7F3D0' : '1px solid #FCA5A5' }}>
                <strong style={{ fontSize: '13.5px', color: selectedCase.status === 'SECURE' ? '#065F46' : '#991B1B', display: 'block' }}>
                  Risk Officer Recommendation: {selectedCase.recommendation}
                </strong>
                <span style={{ fontSize: '12px', color: selectedCase.status === 'SECURE' ? '#047857' : '#B91C1C', display: 'block', marginTop: '2px' }}>
                  Tamper Probability: {selectedCase.tamperProbability} • AI Trust Score: {selectedCase.trustScore}/100 • Fraud Risk: {selectedCase.riskScore}/100
                </span>
              </div>

              {/* Action Buttons Footer */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: 'auto', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleExportRiskCertificate(selectedCase)}
                  style={{ flex: 1, background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', color: '#FFFFFF', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)' }}
                >
                  <Download size={14} />
                  <span>Download Forensic Audit PDF</span>
                </button>
              </div>

            </>
          ) : (
            <div style={{ color: '#64748B', padding: '3rem', textAlign: 'center' }}>
              Select a case file from the left to view detailed forensic telemetry.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
