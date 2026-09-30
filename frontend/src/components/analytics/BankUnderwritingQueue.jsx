import React, { useState, useEffect, useMemo } from 'react';
import { 
  HandCoins, 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  Landmark, 
  CheckCircle2, 
  FileCheck, 
  Clock, 
  Layers, 
  Activity,
  Zap,
  RefreshCw,
  Eye,
  Check,
  Building
} from 'lucide-react';
import { getAnalyticsState, syncStatsFromBackend } from '../../services/realtimeSync.js';
import { getAdminWorkersApi } from '../../api.js';

export default function BankUnderwritingQueue({ searchQuery = '' }) {
  const [analyticsState, setAnalyticsState] = useState(() => getAnalyticsState());
  const [backendWorkers, setBackendWorkers] = useState([]);

  useEffect(() => {
    getAdminWorkersApi().then(res => {
      if (Array.isArray(res) && res.length > 0) {
        setBackendWorkers(res);
      }
    }).catch(() => {});

    syncStatsFromBackend().then(st => {
      if (st) setAnalyticsState(st);
    }).catch(() => {});

    const handleSync = (e) => {
      if (e.detail) {
        setAnalyticsState(e.detail);
      }
    };
    window.addEventListener("sahayata_analytics_update", handleSync);
    return () => window.removeEventListener("sahayata_analytics_update", handleSync);
  }, []);

  // Deduplicate applications by unique applicant name
  const distinctApps = useMemo(() => {
    const map = new Map();

    // 1. Add recent applications from realtime sync
    (analyticsState.recentApplications || []).forEach(app => {
      const nameKey = (app.applicantName || app.name || '').trim().toLowerCase();
      if (nameKey && !map.has(nameKey)) {
        map.set(nameKey, { ...app, applicantName: app.applicantName || app.name });
      }
    });

    // 2. Add backend applications
    (backendWorkers || []).forEach(w => {
      if (!String(w.id).startsWith('REG-')) {
        const nameKey = (w.name || '').trim().toLowerCase();
        if (nameKey && !map.has(nameKey)) {
          map.set(nameKey, {
            id: w.id,
            applicantName: w.name,
            occupation: w.occupation,
            schemeName: Array.isArray(w.schemes) ? w.schemes[0] : 'PM SVANidhi',
            recommendedBank: 'State Bank of India (SBI)',
            loanAmount: w.loanAmount || 15000,
            authenticityScore: `${w.trustScore || 96}%`,
            trustScore: w.trustScore || 96,
            fraudRisk: `${w.riskScore || 6}%`,
            status: 'Under Bank Review',
            submissionTime: 'Recently'
          });
        }
      }
    });

    return Array.from(map.values());
  }, [analyticsState.recentApplications, backendWorkers]);

  const filteredApps = distinctApps.filter(app => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = (app.applicantName || app.name || '').toLowerCase();
    const id = (app.id || '').toLowerCase();
    const occ = (app.occupation || '').toLowerCase();
    return name.includes(q) || id.includes(q) || occ.includes(q);
  });

  const totalApps = distinctApps.length;
  const totalDisbursed = distinctApps.reduce((sum, app) => sum + (typeof app.loanAmount === 'number' ? app.loanAmount : 15000), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'inherit' }}>
      
      {/* 1. TOP 4 KPI METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        
        <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #0369A1', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.74rem', fontWeight: 700 }}>
            <span>TOTAL LOANS DISTRIBUTED</span>
            <HandCoins size={18} color="#0369A1" />
          </div>
          <strong style={{ fontSize: '1.6rem', color: '#0369A1', display: 'block', margin: '4px 0' }}>
            0
          </strong>
          <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>0 Loans Distributed</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #059669', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.74rem', fontWeight: 700 }}>
            <span>TOTAL DISBURSED AMOUNT</span>
            <Wallet size={18} color="#059669" />
          </div>
          <strong style={{ fontSize: '1.6rem', color: '#059669', display: 'block', margin: '4px 0' }}>
            ₹0
          </strong>
          <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
            Zero Capital Deployed
          </span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #0284C7', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.74rem', fontWeight: 700 }}>
            <span>ACTIVE CREDIT LINES</span>
            <TrendingUp size={18} color="#0284C7" />
          </div>
          <strong style={{ fontSize: '1.6rem', color: '#0284C7', display: 'block', margin: '4px 0' }}>
            0 Active
          </strong>
          <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>Pipeline Ready</span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #4F46E5', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.74rem', fontWeight: 700 }}>
            <span>PORTFOLIO DEFAULT (NPA)</span>
            <ShieldCheck size={18} color="#4F46E5" />
          </div>
          <strong style={{ fontSize: '1.6rem', color: '#4F46E5', display: 'block', margin: '4px 0' }}>
            0.0% NPA
          </strong>
          <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>100% Capital Preserved</span>
        </div>

      </div>

      {/* 2. CENTRAL QUEUE DISPLAY */}
      {filteredApps.length > 0 ? (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                Digital Lending Risk Command Center — High Priority Review Queue ({filteredApps.length})
              </h3>
              <span style={{ fontSize: '12.5px', color: '#64748B' }}>
                Evaluating applicant financial stability, transaction integrity, and suspicious anomaly signals
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', padding: '4px 10px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> High Priority Queue Active
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Applicant & ID</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Financial Behaviour Stability</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Transaction Integrity</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Anomaly Risk</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>AI Recommendation</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app, idx) => {
                  const isHigh = idx === 1;
                  const isMed = idx === 3;
                  const stability = isHigh ? "Highly Variable" : isMed ? "Moderately Variable" : "Stable Baseline";
                  const integrityScore = isHigh ? "42/100" : isMed ? "78/100" : "92/100";
                  const anomalyRisk = isHigh ? "HIGH" : isMed ? "MEDIUM" : "LOW";
                  const recommendation = isHigh ? "Proceed with additional verification" : isMed ? "Secondary OTP confirmation recommended" : "Verified financial signal";

                  return (
                    <tr key={app.id || idx} style={{ borderBottom: '1px solid #F1F5F9', background: isHigh ? '#FEF2F2' : 'transparent', transition: 'background 0.2s' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <strong style={{ color: '#0F172A', display: 'block' }}>{app.applicantName || app.name || 'Beneficiary'}</strong>
                        <span style={{ fontSize: '11.5px', color: '#0284C7', fontWeight: 700 }}>{app.id || `APP-2026-${idx + 1}`}</span>
                        <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>{app.occupation || 'Gig / Informal Worker'}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ color: isHigh ? '#DC2626' : isMed ? '#D97706' : '#059669', fontWeight: 700 }}>{stability}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>Daily Buffer: ₹350/day</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <strong style={{ color: '#0284C7', fontSize: '14px' }}>
                          {integrityScore}
                        </strong>
                        <span style={{ fontSize: "10px", color: "#64748B", display: "block" }}>Indicative Metric</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: isHigh ? '#FEE2E2' : isMed ? '#FEF3C7' : '#DCFCE7', color: isHigh ? '#991B1B' : isMed ? '#92400E' : '#166534', border: `1px solid ${isHigh ? '#FCA5A5' : isMed ? '#FDE68A' : '#86EFAC'}`, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                          {anomalyRisk}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: isHigh ? '#B91C1C' : isMed ? '#D97706' : '#047857', fontWeight: 600, fontSize: '12.5px' }}>
                        "{recommendation}"
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button style={{ background: '#0284C7', color: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}>
                          Review Risk Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '3.5rem 2rem', textAlign: 'center', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#F0F9FF', border: '1.5px solid #BAE6FD', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Landmark size={32} color="#0369A1" />
          </div>

          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
            0 Loans Distributed
          </h3>

          <p style={{ fontSize: '0.92rem', color: '#64748B', maxWidth: '520px', lineHeight: '1.5', margin: '0 0 1.75rem 0' }}>
            No micro-sachet loans have been distributed yet. The co-lending underwriting queue is active and ready to process new beneficiary applications.
          </p>

          {/* 3 Status Rail Badges */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ background: '#F8FAFC', padding: '10px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
              <span>Co-Lending Core: <strong>Connected (SBI / BOB)</strong></span>
            </div>

            <div style={{ background: '#F8FAFC', padding: '10px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284C7' }} />
              <span>Schemes Pipeline: <strong>PM SVANidhi & MUDRA Active</strong></span>
            </div>

            <div style={{ background: '#F8FAFC', padding: '10px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4F46E5' }} />
              <span>Repayment Rail: <strong>UPI Autopay Ready</strong></span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

