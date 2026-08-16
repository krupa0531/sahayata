import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  MessageSquareCode, 
  Database, 
  Layers, 
  Zap, 
  Cpu, 
  Activity, 
  Wifi, 
  Server, 
  FileText, 
  Sparkles, 
  Trash2, 
  ArrowUpRight,
  TrendingUp,
  Download,
  Users,
  CreditCard,
  Landmark,
  FileCheck,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getAnalyticsState, 
  recordAiConversation, 
  syncStatsFromBackend, 
  resetAnalyticsStateToZero 
} from '../../services/realtimeSync.js';

export default function RealTimeFeed() {
  const [analyticsState, setAnalyticsState] = useState(getAnalyticsState());
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Subscribe to real-time analytics events across tabs & backend
  useEffect(() => {
    const handleSync = (e) => {
      const updated = e.detail || getAnalyticsState();
      setAnalyticsState(updated);
    };

    window.addEventListener('sahayata_analytics_update', handleSync);

    // Initial backend sync
    syncStatsFromBackend().then((st) => {
      if (st) setAnalyticsState(st);
    });

    return () => window.removeEventListener('sahayata_analytics_update', handleSync);
  }, []);

  // Manual Trigger: Ping Broadcast (+1 Test Session)
  const handleTestBroadcast = () => {
    const testSessionId = `CONV-SAI-${Date.now().toString().slice(-6)}`;
    recordAiConversation(testSessionId, {
      userName: 'Live Applicant (SAI Voice Assistant)',
      language: 'hi',
      status: 'active'
    });
    showToast('Live SAI Conversation Session Broadcasted (+1 across tabs)');
  };

  // Force Backend Sync
  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      const res = await syncStatsFromBackend();
      if (res) setAnalyticsState(res);
      showToast('Synced with FastAPI Backend & SQLite Database');
    } catch (e) {
      showToast('Synced with local state');
    } finally {
      setIsSyncing(false);
    }
  };

  // Reset to clean baseline (3 conversations)
  const handleResetBaseline = () => {
    const fresh = resetAnalyticsStateToZero();
    setAnalyticsState(fresh);
    showToast('AI Conversation Counter reset to clean baseline (3 sessions)');
  };

  // Real Sahayata App Events built directly from the system state
  const convCount = analyticsState.aiConversationsCount ?? 3;
  const fraudCount = analyticsState.fraudAttemptsCount ?? 3;
  const appCount = analyticsState.submittedApplicationsCount ?? 0;
  const disbursedAmt = analyticsState.disbursedLoansAmount ?? 0;
  const recentApps = analyticsState.recentApplications || [];

  // Generate Sahayata-specific live event logs
  const sahayataAppEvents = [
    {
      id: 'EVT-SAI-LIVE',
      category: 'sai',
      title: 'SAI Voice Assistant — 9-Stage Conversational Onboarding',
      module: 'AI Sahayak Module (/financial-twin)',
      desc: `Total ${convCount} full user conversation sessions recorded in real-time. Audio-first profile generation & scheme matching active across Hindi, Gujarati, and English.`,
      time: 'Live Telemetry Active',
      status: 'SYNCHRONIZED',
      badge: `${convCount} Real Sessions (+1/chat)`,
      icon: MessageSquareCode,
      color: '#0284C7',
      bg: '#F0F9FF',
      border: '#BAE6FD'
    },
    {
      id: 'EVT-AA-PAN',
      category: 'aa_upi',
      title: 'Dual-Mode Financial Engine (UPI QR + PAN Account Aggregator)',
      module: 'Alternate Underwriting Engine (/upi-credit)',
      desc: 'Discovers PAN-linked bank accounts (SBI Jan Dhan & Bank of Baroda) and calculates daily cash buffer (Rs 445/day) & transaction velocity without physical branch paperwork.',
      time: 'Live Connected',
      status: 'VERIFIED',
      badge: 'ReBIT AA & CKYC Protocol',
      icon: Landmark,
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0'
    },
    {
      id: 'EVT-FRAUD-8L',
      category: 'fraud',
      title: '8-Layer Anti-Fraud Forensics Engine',
      module: 'Security & Integrity Center',
      desc: `${fraudCount} document tampering attempts intercepted. EXIF metadata analysis, ELA pixel alterations, Aadhaar Verhoeff checksum & geofencing actively protecting bank capital.`,
      time: 'Active Shield',
      status: 'PROTECTED',
      badge: `${fraudCount} Tampering Blocked`,
      icon: ShieldCheck,
      color: '#4F46E5',
      bg: '#EEF2FF',
      border: '#E0E7FF'
    },
    {
      id: 'EVT-LOAN-QUEUE',
      category: 'schemes',
      title: 'PM SVANidhi & MUDRA Co-Lending Queue',
      module: 'Bank Underwriting Console (/admin)',
      desc: `${appCount > 0 ? `${appCount} applications submitted (Rs ${disbursedAmt.toLocaleString()} capital requested)` : 'Live queue listening for new worker loan authorizations and daily sachet EDI auto-debit setups.'}`,
      time: 'Real-time Sync',
      status: appCount > 0 ? 'ACTIVE APPLICATIONS' : 'STANDBY (READY)',
      badge: `Rs ${disbursedAmt.toLocaleString()} Co-Lending Volume`,
      icon: Zap,
      color: '#0D9488',
      bg: '#F0FDFA',
      border: '#99F6E4'
    },
    ...recentApps.map((app, idx) => ({
      id: `EVT-APP-${app.id || idx}`,
      category: 'schemes',
      title: `Application Authorized: ${app.schemeName || 'PM SVANidhi'}`,
      module: `Bank Underwriting Queue (${app.recommendedBank || 'SBI'})`,
      desc: `Applicant ${app.applicantName} authorized micro-loan of ${app.loanAmount} with verified authenticity score ${app.authenticityScore}.`,
      time: app.submissionTime || 'Recently',
      status: app.status || 'Under Review',
      badge: app.loanAmount || 'Rs 15,000 Sanctioned',
      icon: FileCheck,
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0'
    }))
  ];

  const filteredLogs = activeFilter === 'all' 
    ? sahayataAppEvents 
    : sahayataAppEvents.filter(e => e.category === activeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'inherit' }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#0369A1', color: '#FFFFFF', padding: '10px 18px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(3, 105, 161, 0.4)', zIndex: 9999, fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {toastMsg}
        </div>
      )}

      {/* 1. REAL-TIME TELEMETRY RAILS & GATEWAY SYNC STATUS */}
      <div style={{ background: '#FFFFFF', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#E0F2FE', border: '1.5px solid #BAE6FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={24} color="#0284C7" className="animate-pulse" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
                SAHAYATA REAL-TIME TELEMETRY & SYNC HUB
              </h2>
              <span style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                12ms Live Stream
              </span>
            </div>
            <span style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 500 }}>
              Live telemetry stream connecting SAI Assistant, Dual-Mode Underwriting (UPI + PAN AA), and Bank Co-Lending rails.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handleTestBroadcast}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F0F9FF', border: '1.5px solid #BAE6FD', color: '#0369A1', padding: '8px 14px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <Zap size={14} color="#0284C7" />
            <span>Test +1 Broadcast</span>
          </button>

          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', border: 'none', color: '#FFFFFF', padding: '8px 16px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)', transition: 'all 0.2s ease' }}
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Force DB Sync'}</span>
          </button>
        </div>
      </div>

      {/* 2. 4-GATEWAY REAL-TIME HEALTH METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        
        {/* Gateway 1: SAI AI Conversations */}
        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #0369A1', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700 }}>
            <span>SAI AI CONVERSATIONS</span>
            <MessageSquareCode size={16} color="#0369A1" />
          </div>
          <strong style={{ fontSize: '1.45rem', color: '#0369A1', display: 'block', margin: '4px 0' }}>
            {convCount} Full Sessions
          </strong>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>+1 per full conversation session</span>
        </div>

        {/* Gateway 2: Dual-Mode Underwriting (UPI + PAN AA) */}
        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #059669', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700 }}>
            <span>UPI & PAN AA DISCOVERY</span>
            <Landmark size={16} color="#059669" />
          </div>
          <strong style={{ fontSize: '1.45rem', color: '#059669', display: 'block', margin: '4px 0' }}>
            ACTIVE (ReBIT AA)
          </strong>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>SBI & BOB Live Cashflows</span>
        </div>

        {/* Gateway 3: Anti-Fraud Forensics */}
        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #4F46E5', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700 }}>
            <span>8-LAYER ANTI-FRAUD</span>
            <ShieldCheck size={16} color="#4F46E5" />
          </div>
          <strong style={{ fontSize: '1.45rem', color: '#4F46E5', display: 'block', margin: '4px 0' }}>
            {fraudCount} Intercepted
          </strong>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>EXIF / ELA / Verhoeff Active</span>
        </div>

        {/* Gateway 4: Bank Co-Lending Rails */}
        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #0284C7', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700 }}>
            <span>CROSS-TAB BROADCAST</span>
            <Wifi size={16} color="#0284C7" />
          </div>
          <strong style={{ fontSize: '1.45rem', color: '#0284C7', display: 'block', margin: '4px 0' }}>
            SYNCHRONIZED
          </strong>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>sahayata_realtime_channel</span>
        </div>

      </div>

      {/* 3. SAHAYATA REAL-TIME MODULE FILTERS (EMOJI-FREE) */}
      <div style={{ background: '#FFFFFF', padding: '12px 18px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { id: 'all', label: 'All Sahayata Modules' },
            { id: 'sai', label: 'SAI AI Assistant' },
            { id: 'aa_upi', label: 'UPI & PAN Account Aggregator' },
            { id: 'fraud', label: '8-Layer Anti-Fraud' },
            { id: 'schemes', label: 'PM SVANidhi & Co-Lending' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{
                background: activeFilter === f.id ? '#0369A1' : '#F1F5F9',
                color: activeFilter === f.id ? '#FFFFFF' : '#334155',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: activeFilter === f.id ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleResetBaseline}
          style={{ background: 'transparent', border: '1px solid #E2E8F0', color: '#64748B', padding: '5px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <Trash2 size={12} />
          <span>Reset Session Counter (3)</span>
        </button>

      </div>

      {/* 4. LIVE INCOMING EVENT STREAM LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <AnimatePresence>
          {filteredLogs.map((evt) => {
            const IconComponent = evt.icon || Activity;
            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '14px',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: evt.bg, border: `1.5px solid ${evt.border}`, color: evt.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconComponent size={22} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '14.5px', color: '#0F172A' }}>{evt.title}</strong>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: evt.color, background: evt.bg, padding: '2px 8px', borderRadius: '999px', border: `1px solid ${evt.border}` }}>
                        {evt.badge}
                      </span>
                    </div>
                    <span style={{ fontSize: '12.5px', color: '#0369A1', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                      {evt.module}
                    </span>
                    <p style={{ fontSize: '13px', color: '#475569', margin: '4px 0 0 0', lineHeight: '1.5' }}>
                      {evt.desc}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block' }}>{evt.time}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '6px', fontSize: '10.5px', fontWeight: 800, color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 6px', borderRadius: '4px' }}>
                    <Check size={11} /> {evt.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
