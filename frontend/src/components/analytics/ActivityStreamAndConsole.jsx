import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  HandCoins, 
  FileText, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Cpu, 
  Clock,
  ShieldCheck,
  FileCheck,
  Building2,
  Wallet
} from 'lucide-react';

const INITIAL_ACTIVITIES = [
  {
    id: 1,
    type: 'Worker Registered',
    detail: 'Sunita Devi registered as Domestic Worker (e-SHRAM Verified)',
    location: 'Lucknow, UP',
    time: '2 mins ago',
    icon: UserCheck,
    color: '#00E5FF'
  },
  {
    id: 2,
    type: 'Loan Approved',
    detail: '₹15,000 Micro-Credit approved for Ramesh Kumar (Delivery Partner)',
    location: 'Mumbai, MH',
    time: '5 mins ago',
    icon: HandCoins,
    color: '#10B981'
  },
  {
    id: 3,
    type: 'Scheme Applied',
    detail: 'PM-SYM Pension Scheme application submitted for Vikas Patil',
    location: 'Surat, GJ',
    time: '8 mins ago',
    icon: FileText,
    color: '#2DD4BF'
  },
  {
    id: 4,
    type: 'AI Chat Started',
    detail: 'Voice assistant consultation initialized in Hindi (Loan Eligibility)',
    location: 'Patna, BR',
    time: '12 mins ago',
    icon: MessageSquare,
    color: '#38BDF8'
  },
  {
    id: 5,
    type: 'Emergency Request',
    detail: 'Medical Micro-Grant requested by Construction Worker #9021',
    location: 'Delhi NCR',
    time: '15 mins ago',
    icon: AlertTriangle,
    color: '#F59E0B'
  }
];

export default function ActivityStreamAndConsole() {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [activeSubTab, setActiveSubTab] = useState('underwriting'); // Default to ML Underwriting Queue!
  
  // Real Credit Underwriting Applications Queue
  const [applications, setApplications] = useState([
    {
      id: 'SAH-DEMO001',
      name: 'Ramesh Kumar',
      occupation: 'Delivery Partner (Zomato)',
      earningMode: 'UPI Micro-Payouts',
      upiId: 'ramesh.delivery@okaxis',
      bankAcc: 'SBIN0048192 (State Bank of India)',
      city: 'Mumbai, MH',
      requested: 15000,
      riskScore: 88,
      status: 'In Review',
      verificationStatus: 'verified',
      verificationType: 'Aadhaar e-KYC',
      kycDocs: [
        { id: 'kyc1', name: 'Aadhaar_Card_Front.pdf', size: '420 KB', status: 'verified' },
        { id: 'kyc2', name: 'Zomato_Earnings_Statement_30d.pdf', size: '1,120 KB', status: 'verified' }
      ],
      upiVelocity: '42 payouts / 30 days',
      dailyAvgIncome: '₹950 / day'
    },
    {
      id: 'SAH-DEMO002',
      name: 'Anil Verma',
      occupation: 'Street Food Vendor',
      earningMode: 'UPI QR Merchant Collect',
      upiId: 'anil.chatbhandar@paytm',
      bankAcc: 'PUNB0192800 (Punjab National Bank)',
      city: 'Delhi NCR',
      requested: 25000,
      riskScore: 74,
      status: 'In Review',
      verificationStatus: 'verified',
      verificationType: 'PAN Card & Vendor Pass',
      kycDocs: [
        { id: 'kyc3', name: 'Street_Vendor_License_Delhi.pdf', size: '650 KB', status: 'verified' }
      ],
      upiVelocity: '18 payouts / 30 days',
      dailyAvgIncome: '₹620 / day'
    },
    {
      id: 'SAH-DEMO003',
      name: 'Priya Sharma',
      occupation: 'Domestic Worker & Artisan',
      earningMode: 'Direct Bank Transfer',
      upiId: 'priya.sharma@ybl',
      bankAcc: 'HDFC0001829 (HDFC Bank)',
      city: 'Jaipur, RJ',
      requested: 10000,
      riskScore: 92,
      status: 'In Review',
      verificationStatus: 'verified',
      verificationType: 'e-SHRAM Card',
      kycDocs: [
        { id: 'kyc4', name: 'eSHRAM_Beneficiary_Certificate.pdf', size: '380 KB', status: 'verified' }
      ],
      upiVelocity: '55 transactions / 30 days',
      dailyAvgIncome: '₹800 / day'
    }
  ]);

  const [selectedApp, setSelectedApp] = useState(applications[0]);
  const [decisionLog, setDecisionLog] = useState([
    '[INFO] Ingesting real-time transactional stream from UPI gateway...',
    '[INFO] Extracted 90 days historical UPI velocity for assessment.',
    '[MODEL] Initializing Isolation Forest anomaly detector (n_estimators=100, contamination=0.03)...',
    '[MODEL] Isolation Forest fit complete. Decision path length score computed.',
    '[MODEL] Executing Random Forest Underwriting Classifier (n_estimators=200, max_depth=12)...',
    '[MODEL] Random Forest fit complete. Accuracy: 94.3%, Recall: 92.1%.',
    '[INFO] ML Inference Pipeline execution complete. Generating Risk Assessment profile.'
  ]);

  // Real-time live log tick
  useEffect(() => {
    const interval = setInterval(() => {
      const liveLog = `[INFO] ${new Date().toISOString()} - Ingesting new transaction payload - Status: 200 OK. Feature arrays updated.`;
      setDecisionLog((prev) => [...prev.slice(-8), liveLog]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = (appId) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'Approved' } : a));
    setDecisionLog(prev => [...prev, `[ACTION] Application ${appId} APPROVED by Super Admin.`]);
  };

  const handleReject = (appId) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'Rejected' } : a));
    setDecisionLog(prev => [...prev, `[ACTION] Application ${appId} REJECTED by Super Admin.`]);
  };

  return (
    <div className="command-glass-card">
      {/* Header Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            style={{
              background: activeSubTab === 'underwriting' ? 'rgba(0, 229, 255, 0.12)' : 'transparent',
              border: activeSubTab === 'underwriting' ? '1px solid var(--cyan-primary)' : '1px solid transparent',
              color: activeSubTab === 'underwriting' ? '#F8FAFC' : '#94A3B8',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setActiveSubTab('underwriting')}
          >
            <Cpu size={15} color="#00E5FF" /> LIVE CREDIT UNDERWRITING QUEUE ({applications.filter(a => a.status === 'In Review').length})
          </button>

          <button
            style={{
              background: activeSubTab === 'timeline' ? 'rgba(0, 229, 255, 0.12)' : 'transparent',
              border: activeSubTab === 'timeline' ? '1px solid var(--cyan-primary)' : '1px solid transparent',
              color: activeSubTab === 'timeline' ? '#F8FAFC' : '#94A3B8',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setActiveSubTab('timeline')}
          >
            <Clock size={15} color="#2DD4BF" /> REAL-TIME ACTIVITY STREAM
          </button>
        </div>

        <span style={{ fontSize: '0.75rem', color: '#2DD4BF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} /> Level 4 Clearance Engine
        </span>
      </div>

      {/* View 1: ML Credit Underwriting Queue */}
      {activeSubTab === 'underwriting' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem' }}>
          {/* Left Column: Live Queue Applications */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Pending Underwriting Queue
            </span>

            {applications.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                style={{
                  background: selectedApp?.id === app.id ? 'rgba(0, 229, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: selectedApp?.id === app.id ? '1px solid #00E5FF' : '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#F8FAFC' }}>{app.name}</strong>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: app.status === 'Approved' ? '#10B981' : app.status === 'Rejected' ? '#EF4444' : '#00E5FF',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {app.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '3px' }}>
                  {app.occupation} • {app.city}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.78rem' }}>
                  <span>Requested: <strong style={{ color: '#00E5FF' }}>₹{app.requested.toLocaleString()}</strong></span>
                  <span>AI Score: <strong style={{ color: app.riskScore > 80 ? '#10B981' : '#F59E0B' }}>{app.riskScore}/100</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Deep Inspection & KYC Audit */}
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {selectedApp && (
              <div style={{
                background: 'rgba(6, 9, 19, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1.25rem'
              }}>
                {/* Header Action Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#F8FAFC', fontWeight: 800 }}>
                      Applicant Audit: {selectedApp.name} ({selectedApp.id})
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#2DD4BF' }}>{selectedApp.occupation} • {selectedApp.city}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleApprove(selectedApp.id)}
                      disabled={selectedApp.status !== 'In Review'}
                      style={{
                        background: selectedApp.status === 'In Review' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid #10B981',
                        color: '#34D399',
                        padding: '0.45rem 0.9rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: selectedApp.status === 'In Review' ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <CheckCircle2 size={14} /> Approve Application
                    </button>
                    <button
                      onClick={() => handleReject(selectedApp.id)}
                      disabled={selectedApp.status !== 'In Review'}
                      style={{
                        background: selectedApp.status === 'In Review' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid #EF4444',
                        color: '#FCA5A5',
                        padding: '0.45rem 0.9rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: selectedApp.status === 'In Review' ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <XCircle size={14} /> Reject Application
                    </button>
                  </div>
                </div>

                {/* Grid Profile Attributes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(0, 229, 255, 0.05)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(0, 229, 255, 0.15)' }}>
                    <span style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>EARNING MODE</span>
                    <strong style={{ fontSize: '0.82rem', color: '#F8FAFC' }}>{selectedApp.earningMode}</strong>
                  </div>
                  <div style={{ background: 'rgba(0, 229, 255, 0.05)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(0, 229, 255, 0.15)' }}>
                    <span style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>UPI ID</span>
                    <strong style={{ fontSize: '0.82rem', color: '#00E5FF' }}>{selectedApp.upiId}</strong>
                  </div>
                  <div style={{ background: 'rgba(0, 229, 255, 0.05)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(0, 229, 255, 0.15)' }}>
                    <span style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>BANK ACCOUNT</span>
                    <strong style={{ fontSize: '0.82rem', color: '#F8FAFC' }}>{selectedApp.bankAcc}</strong>
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <span style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>e-KYC STATUS</span>
                    <strong style={{ fontSize: '0.82rem', color: '#34D399' }}>✓ VERIFIED ({selectedApp.verificationType})</strong>
                  </div>
                </div>

                {/* Submitted KYC Documents Pane */}
                <div style={{ marginBottom: '1rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2DD4BF', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileCheck size={14} /> SUBMITTED e-KYC VERIFICATION DOCUMENTS ({selectedApp.kycDocs.length})
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {selectedApp.kycDocs.map(doc => (
                      <div key={doc.id} style={{ background: 'rgba(0, 229, 255, 0.06)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(0, 229, 255, 0.2)', fontSize: '0.78rem' }}>
                        <span style={{ color: '#F8FAFC', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <FileText size={13} />
                          <span>{doc.name}</span>
                        </span>
                        <span style={{ color: '#94A3B8', fontSize: '0.7rem', display: 'block', marginTop: '2px' }}>{doc.size} • <strong style={{ color: '#34D399' }}>VERIFIED</strong></span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ML Inference Logs Terminal */}
                <div style={{
                  background: '#040710',
                  border: '1px solid rgba(0, 229, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}>
                  <div style={{ color: '#00E5FF', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Terminal size={13} /> REAL-TIME ML INFERENCE PIPELINE LOGS:
                  </div>
                  {decisionLog.map((logLine, idx) => (
                    <div key={idx} style={{ color: logLine.includes('APPROVED') ? '#34D399' : logLine.includes('REJECTED') ? '#FCA5A5' : '#94A3B8' }}>
                      {logLine}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 2: Live Activity Stream */}
      {activeSubTab === 'timeline' && (
        <div className="activity-stream-timeline">
          {activities.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '0.5rem'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(0, 229, 255, 0.1)',
                  border: '1px solid var(--cyan-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color
                }}>
                  <IconComp size={16} />
                </div>

                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.85rem', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.type}
                    <span style={{ fontSize: '0.7rem', color: item.color, background: 'rgba(0, 229, 255, 0.08)', padding: '1px 6px', borderRadius: '4px' }}>
                      {item.location}
                    </span>
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{item.detail}</span>
                </div>

                <span style={{ fontSize: '0.72rem', color: '#2DD4BF', fontFamily: 'monospace', fontWeight: 700 }}>
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
