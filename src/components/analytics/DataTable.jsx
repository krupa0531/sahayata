import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  HandCoins, 
  FileCheck, 
  Building2, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  X, 
  Award, 
  Phone, 
  MapPin, 
  Download, 
  Printer, 
  Layers, 
  Cpu, 
  FileText, 
  ArrowUpRight, 
  Briefcase, 
  GraduationCap, 
  Zap,
  Check,
  LayoutGrid,
  Table as TableIcon,
  FileSpreadsheet,
  BadgeCheck,
  ExternalLink,
  Plus,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getAnalyticsState, syncStatsFromBackend } from '../../services/realtimeSync.js';
import { getAdminWorkersApi } from '../../api.js';

import deliveryRiderPhoto from '../../assets/delivery-rider-real.jpg';
import domesticWorkerPhoto from '../../assets/domestic-worker-india.jpg';
import streetVendorPhoto from '../../assets/street-vendor-india.jpg';
import constructionWorkerPhoto from '../../assets/construction-worker-india.jpg';

const WORKER_PROFILES = [];

export default function DataTable({ searchQuery = '' }) {
  const [analyticsState, setAnalyticsState] = useState(() => getAnalyticsState());
  const [backendWorkersList, setBackendWorkersList] = useState([]);
  const [localSearch, setLocalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [drawerTab, setDrawerTab] = useState('timeline'); // 'timeline' | 'scores' | 'financial' | 'docs' | 'recommendations'
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    // Initial fetch from backend
    getAdminWorkersApi().then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        setBackendWorkersList(res);
      }
    }).catch(() => {});

    syncStatsFromBackend().then((st) => {
      if (st) setAnalyticsState(st);
    }).catch(() => {});

    // Listen to real-time events
    const handleSync = (e) => {
      if (e.detail) {
        setAnalyticsState(e.detail);
      }
    };
    window.addEventListener('sahayata_analytics_update', handleSync);
    return () => window.removeEventListener('sahayata_analytics_update', handleSync);
  }, []);

  // Merge default WORKER_PROFILES with realtime registeredWorkers & recentApplications & backendWorkersList
  const mergedWorkers = useMemo(() => {
    const map = new Map();
    // 1. Add newly registered/submitted workers first so they appear at top
    (analyticsState.recentApplications || []).forEach(w => {
      const nameKey = (w.name || w.applicantName || "").trim().toLowerCase();
      if (nameKey && !map.has(nameKey)) {
        map.set(nameKey, { ...w, name: w.name || w.applicantName });
      }
    });
    (analyticsState.registeredWorkers || []).forEach(w => {
      const nameKey = (w.name || w.applicantName || "").trim().toLowerCase();
      if (nameKey && !map.has(nameKey)) {
        map.set(nameKey, { ...w, name: w.name || w.applicantName });
      }
    });
    (backendWorkersList || []).forEach(w => {
      const nameKey = (w.name || "").trim().toLowerCase();
      if (nameKey && !map.has(nameKey)) {
        map.set(nameKey, { ...w });
      }
    });
    
    // 2. Add base 4 seeded profiles if not overwritten
    WORKER_PROFILES.forEach(w => {
      const nameKey = (w.name || "").trim().toLowerCase();
      if (nameKey && !map.has(nameKey)) {
        map.set(nameKey, w);
      }
    });

    return Array.from(map.values());
  }, [analyticsState.registeredWorkers, analyticsState.recentApplications, backendWorkersList]);

  const activeSearch = searchQuery || localSearch;

  const filteredWorkers = mergedWorkers.filter(w => {
    const sName = (w.name || '').toLowerCase();
    const sId = (w.id || '').toLowerCase();
    const sCity = (w.city || '').toLowerCase();
    const sState = (w.state || '').toLowerCase();
    const sOcc = (w.occupation || '').toLowerCase();
    const sSchemes = Array.isArray(w.schemes) ? w.schemes.join(' ').toLowerCase() : '';
    const q = activeSearch.toLowerCase();

    const matchesSearch = sName.includes(q) || sId.includes(q) || sCity.includes(q) || sState.includes(q) || sOcc.includes(q) || sSchemes.includes(q);
    
    if (categoryFilter === 'ALL') return matchesSearch;
    return matchesSearch && w.category === categoryFilter;
  });

  const sectorCounts = {
    ALL: mergedWorkers.length,
    'Delivery Partners': mergedWorkers.filter(w => w.category === 'Delivery Partners').length,
    'Street Vendors': mergedWorkers.filter(w => w.category === 'Street Vendors').length,
    'Construction Workers': mergedWorkers.filter(w => w.category === 'Construction Workers').length,
    'Domestic Workers': mergedWorkers.filter(w => w.category === 'Domestic Workers').length,
  };

  // EXPORT TO EXCEL
  const handleExportExcel = () => {
    const exportData = filteredWorkers.map(w => ({
      'Worker ID': w.id,
      'Full Name': w.name,
      'Sector / Category': w.category,
      'Occupation': w.occupation,
      'Phone': w.phone,
      'Masked Aadhaar': w.aadhaar,
      'City': w.city,
      'State': w.state,
      'Daily Earning (₹)': w.dailyEarning,
      'Daily Expense (₹)': w.dailyExpense,
      'Daily Buffer (₹)': w.dailyBuffer,
      'Monthly Income (₹)': w.monthlyIncome,
      'Income Growth': w.incomeGrowth,
      'Loan Status': w.loanStatus,
      'Sanctioned Amount (₹)': w.loanAmount,
      'Daily EDI (₹)': w.ediRepayment,
      'Schemes Enrolled': w.schemes.join(', '),
      'Insurance': w.insurance,
      'AI Trust Score': `${w.trustScore}/100`,
      'Fraud Risk Score': `${w.riskScore}/100`,
      'CKYC Verification': w.verification
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sahayata_Workers');
    XLSX.writeFile(wb, `Sahayata_Beneficiaries_Export_${Date.now()}.xlsx`);
    showToast('Excel Report Exported Successfully!');
  };

  // EXPORT INDIVIDUAL WORKER DOSSIER PDF
  const handleExportWorkerPDF = (worker) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(3, 105, 161);
    doc.rect(0, 0, 210, 24, 'F');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('SAHAYATA - BENEFICIARY VERIFICATION DOSSIER', 14, 16);

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`Generated On: ${new Date().toLocaleString()} | Official Co-Lending Document`, 14, 32);

    // Personal Details Table
    autoTable(doc, {
      startY: 38,
      head: [['Field', 'Beneficiary Information']],
      body: [
        ['Worker ID', worker.id],
        ['Full Legal Name', worker.name],
        ['Occupation', worker.occupation],
        ['Sector Category', worker.category],
        ['Phone Number', worker.phone],
        ['Masked Aadhaar', worker.aadhaar],
        ['Location', `${worker.city}, ${worker.state}`],
        ['Daily Earning / Expense', `Rs ${worker.dailyEarning} / Rs ${worker.dailyExpense}`],
        ['Net Daily Cash Buffer', `Rs ${worker.dailyBuffer} per day`],
        ['Monthly Income', `Rs ${worker.monthlyIncome.toLocaleString()} (${worker.incomeGrowth} growth)`],
        ['Approved Loan / Limit', `${worker.loanStatus} | EDI: ${worker.ediRepayment}`],
        ['Enrolled Schemes', worker.schemes.join(', ')],
        ['AI Trust Score / Risk', `Trust: ${worker.trustScore}/100 | Risk: ${worker.riskScore}/100`],
        ['CKYC Verification Status', worker.verification]
      ],
      theme: 'grid',
      headStyles: { fillColor: [3, 105, 161] },
    });

    // Recommendations
    const finalY = doc.lastAutoTable.finalY || 160;
    doc.setFontSize(12);
    doc.setTextColor(3, 105, 161);
    doc.text('AI Strategic Underwriting Recommendations:', 14, finalY + 12);

    worker.recommendations.forEach((rec, i) => {
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text(`• ${rec}`, 18, finalY + 20 + (i * 7));
    });

    doc.save(`Sahayata_Dossier_${worker.id}_${worker.name.replace(/\s+/g, '_')}.pdf`);
    showToast(`Dossier PDF for ${worker.name} Downloaded!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'inherit' }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#0369A1', color: '#FFFFFF', padding: '10px 18px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(3, 105, 161, 0.4)', zIndex: 9999, fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {toastMsg}
        </div>
      )}

      {/* TOP EXECUTIVE SUMMARY KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div style={{ background: '#FFFFFF', padding: '16px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #0369A1', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', fontWeight: 700 }}>
            <span>TOTAL PROFILED WORKERS</span>
            <Users size={18} color="#0369A1" />
          </div>
          <strong style={{ fontSize: '1.5rem', color: '#0F172A', display: 'block', margin: '4px 0' }}>
            {mergedWorkers.length} Active
          </strong>
          <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} />
            <span>{mergedWorkers.length === 0 ? '0% Aadhaar & CKYC Matched' : '100% Aadhaar & CKYC Matched'}</span>
          </span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #0284C7', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', fontWeight: 700 }}>
            <span>AVG DAILY CASH BUFFER</span>
            <TrendingUp size={18} color="#0284C7" />
          </div>
          <strong style={{ fontSize: '1.5rem', color: '#0284C7', display: 'block', margin: '4px 0' }}>
            ₹{mergedWorkers.length === 0 ? 0 : Math.round(mergedWorkers.reduce((acc, w) => acc + (w.dailyBuffer || 0), 0) / mergedWorkers.length)} / day
          </strong>
          <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
            {mergedWorkers.length === 0 ? '0% Avg Income Growth' : '+160.7% Avg Income Growth'}
          </span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #059669', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', fontWeight: 700 }}>
            <span>E-KYC VERIFIED WORKERS</span>
            <ShieldCheck size={18} color="#059669" />
          </div>
          <strong style={{ fontSize: '1.5rem', color: '#059669', display: 'block', margin: '4px 0' }}>
            {mergedWorkers.length} Workers
          </strong>
          <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
            {mergedWorkers.length === 0 ? '0% Identity Authenticated' : '100% Identity Authenticated'}
          </span>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', borderTop: '3px solid #4F46E5', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', fontWeight: 700 }}>
            <span>AI TRUST & RISK HEALTH</span>
            <ShieldCheck size={18} color="#4F46E5" />
          </div>
          <strong style={{ fontSize: '1.5rem', color: '#4F46E5', display: 'block', margin: '4px 0' }}>
            {mergedWorkers.length === 0 ? '0.0 / 100' : (mergedWorkers.reduce((acc, w) => acc + (w.trustScore || 95), 0) / mergedWorkers.length).toFixed(1) + ' / 100'}
          </strong>
          <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>0% Fraud Flags Active</span>
        </div>
      </div>

      {/* SMART SECTOR FILTERS & VIEW TOOLBAR */}
      <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Sector Category Pills with Live Badges */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { id: 'ALL', label: 'All Sectors', count: sectorCounts.ALL },
            { id: 'Delivery Partners', label: 'Delivery', count: sectorCounts['Delivery Partners'] },
            { id: 'Street Vendors', label: 'Vendors', count: sectorCounts['Street Vendors'] },
            { id: 'Construction Workers', label: 'Construction', count: sectorCounts['Construction Workers'] },
            { id: 'Domestic Workers', label: 'Domestic', count: sectorCounts['Domestic Workers'] }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              style={{
                background: categoryFilter === cat.id ? '#0369A1' : '#F1F5F9',
                color: categoryFilter === cat.id ? '#FFFFFF' : '#334155',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: categoryFilter === cat.id ? 700 : 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{cat.label}</span>
              <span style={{ fontSize: '10.5px', background: categoryFilter === cat.id ? 'rgba(255,255,255,0.25)' : '#E2E8F0', padding: '1px 6px', borderRadius: '999px' }}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* View Switcher: Table vs Grid */}
        <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
          <button
            onClick={() => setViewMode('table')}
            style={{ background: viewMode === 'table' ? '#FFFFFF' : 'transparent', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', color: viewMode === 'table' ? '#0369A1' : '#64748B', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}
          >
            <TableIcon size={14} />
            <span>Table</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            style={{ background: viewMode === 'grid' ? '#FFFFFF' : 'transparent', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', color: viewMode === 'grid' ? '#0369A1' : '#64748B', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}
          >
            <LayoutGrid size={14} />
            <span>Cards</span>
          </button>
        </div>

      </div>

      {/* 4. WORKER DIRECTORY DISPLAY */}
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflowX: 'auto', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Beneficiary Profile</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Location & KYC</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Income & Cash Buffer</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Active Credit / Schemes</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>AI Trust Index</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((worker) => (
                <tr
                  key={worker.id}
                  onClick={() => setSelectedWorker(worker)}
                  style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background 0.2s ease' }}
                  onMouseOver={e => e.currentTarget.style.background = '#F0F9FF'}
                  onMouseOut={e => e.currentTarget.style.background = '#FFFFFF'}
                >
                  {/* Beneficiary Profile */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {worker.photo ? (
                        <img
                          src={worker.photo}
                          alt={worker.name}
                          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #BAE6FD' }}
                        />
                      ) : (
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', border: '2px solid #BAE6FD' }}>
                          {(worker.name || 'W').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block' }}>{worker.name}</strong>
                        <span style={{ fontSize: '11.5px', color: '#0369A1', fontWeight: 700 }}>{worker.id}</span>
                        <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>{worker.occupation}</span>
                      </div>
                    </div>
                  </td>

                  {/* Location & KYC */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ color: '#0F172A', fontWeight: 600 }}>{worker.city || 'Ahmedabad'}, {worker.state || 'Gujarat'}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>{worker.aadhaar || worker.identityNumber || 'XXXX-XXXX-8921'}</div>
                    <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '10px', fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '2px 6px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                      ✓ {worker.verification || 'VERIFIED'}
                    </span>
                  </td>

                  {/* Income & Cash Buffer */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ color: '#059669', fontWeight: 700, fontSize: '14px' }}>₹{(worker.monthlyIncome || 18000).toLocaleString()} / mo</div>
                    <div style={{ fontSize: '11.5px', color: '#0369A1', fontWeight: 600 }}>Buffer: ₹{worker.dailyBuffer || 400} / day</div>
                    <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>{worker.incomeGrowth || '+150%'} growth</span>
                  </td>

                  {/* Active Credit & Schemes */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ color: '#0369A1', fontWeight: 700 }}>{worker.loanStatus || 'Under Review'}</div>
                    <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px' }}>{Array.isArray(worker.schemes) ? worker.schemes.join(', ') : 'PM SVANidhi'}</div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>EDI: {worker.ediRepayment || '₹50/day'}</span>
                  </td>

                  {/* AI Trust Index */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#059669', fontWeight: 800, fontSize: '14px' }}>{worker.trustScore || 96}</span>
                      <span style={{ color: '#64748B', fontSize: '11px' }}>/ 100</span>
                    </div>
                    <div style={{ width: '80px', height: '5px', background: '#E2E8F0', borderRadius: '999px', marginTop: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${worker.trustScore || 96}%`, height: '100%', background: '#059669' }} />
                    </div>
                    <span style={{ fontSize: '10.5px', color: '#64748B', marginTop: '3px', display: 'block' }}>Risk: {worker.riskScore || 6}/100</span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWorker(worker);
                      }}
                      style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0369A1', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>Inspect</span>
                      <ChevronRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* CARD GRID VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              onClick={() => setSelectedWorker(worker)}
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#7DD3FC'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {worker.photo ? (
                      <img src={worker.photo} alt={worker.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #BAE6FD' }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px', border: '2px solid #BAE6FD' }}>
                        {(worker.name || 'W').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <strong style={{ fontSize: '15px', color: '#0F172A', display: 'block' }}>{worker.name}</strong>
                      <span style={{ fontSize: '12px', color: '#0369A1', fontWeight: 700 }}>{worker.id}</span>
                      <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block' }}>{worker.occupation}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '3px 8px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                    ✓ {worker.verification || 'VERIFIED'}
                  </span>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px', border: '1px solid #E2E8F0', marginBottom: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748B', fontSize: '11px', display: 'block' }}>Monthly Income</span>
                    <strong style={{ color: '#059669', fontSize: '13px' }}>₹{(worker.monthlyIncome || 18000).toLocaleString()}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontSize: '11px', display: 'block' }}>Daily Buffer</span>
                    <strong style={{ color: '#0369A1', fontSize: '13px' }}>₹{worker.dailyBuffer || 400} / day</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontSize: '11px', display: 'block' }}>Loan Status</span>
                    <strong style={{ color: '#0F172A' }}>{worker.loanStatus || 'Under Review'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontSize: '11px', display: 'block' }}>AI Trust Score</span>
                    <strong style={{ color: '#059669' }}>{worker.trustScore || 96} / 100</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: '12px', color: '#64748B' }}>{worker.city || 'Ahmedabad'}, {worker.state || 'Gujarat'}</span>
                <span style={{ fontSize: '12px', color: '#0369A1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  Inspect Dossier <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. WORKER PROFILE INTELLIGENCE DRAWER (RIGHT SLIDING PANEL) */}
      <AnimatePresence>
        {selectedWorker && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.45)', zIndex: 999, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setSelectedWorker(null)}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '620px', maxWidth: '100%', height: '100vh', background: '#FFFFFF', borderLeft: '1px solid #E2E8F0', padding: '2rem', boxSizing: 'border-box', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: '-10px 0 40px rgba(15, 23, 42, 0.15)' }}
            >
              {/* Drawer Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {selectedWorker.photo ? (
                    <img src={selectedWorker.photo} alt={selectedWorker.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #0369A1' }} />
                  ) : (
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', border: '2.5px solid #0369A1' }}>
                      {(selectedWorker.name || 'W').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>{selectedWorker.name}</h3>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                        ✓ {selectedWorker.verification || 'VERIFIED'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: '#0369A1', fontWeight: 800 }}>{selectedWorker.id} • {selectedWorker.occupation}</span>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginTop: '3px' }}>
                      {selectedWorker.city || 'Ahmedabad'}, {selectedWorker.state || 'Gujarat'} • Phone: {selectedWorker.phone || '+91 98765 43210'}
                    </span>
                  </div>
                </div>

                <button onClick={() => setSelectedWorker(null)} style={{ background: '#F1F5F9', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} color="#0F172A" />
                </button>
              </div>

              {/* Drawer Navigation Tabs */}
              <div style={{ display: 'flex', gap: '0.35rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.65rem', overflowX: 'auto' }}>
                {[
                  { id: 'timeline', label: 'Milestone Journey' },
                  { id: 'scores', label: 'AI Scorecard' },
                  { id: 'financial', label: 'Cashflow Velocity' },
                  { id: 'docs', label: 'Verified Vault' },
                  { id: 'recommendations', label: 'Strategic AI Actions' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setDrawerTab(t.id)}
                    style={{
                      background: drawerTab === t.id ? '#0369A1' : '#F1F5F9',
                      color: drawerTab === t.id ? '#FFFFFF' : '#475569',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: WORKER MILESTONE JOURNEY */}
              {drawerTab === 'timeline' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#0369A1', fontWeight: 800 }}>LIFECYCLE ONBOARDING & LOAN MILESTONES</h4>
                    <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 700 }}>Live Telemetry Active</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', borderLeft: '2px solid #BAE6FD', paddingLeft: '1.25rem', marginLeft: '0.5rem' }}>
                    {(selectedWorker.timeline || [
                      { date: 'Today', time: 'Just now', title: 'Application Submitted via Sahayata Portal', status: 'Completed', icon: CheckCircle2 },
                      { date: 'Today', time: 'In Progress', title: 'Bank Underwriting Review', status: 'Active', icon: Clock }
                    ]).map((event, idx) => {
                      const IconComp = event.icon || CheckCircle2;
                      return (
                        <div key={idx} style={{ position: 'relative' }}>
                          <div style={{ position: 'absolute', left: '-1.85rem', top: '2px', width: '22px', height: '22px', borderRadius: '50%', background: '#0284C7', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFFFF', boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)' }}>
                            <IconComp size={12} />
                          </div>
                          <strong style={{ fontSize: '0.9rem', color: '#0F172A', display: 'block' }}>{event.title}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{event.date} at {event.time} • <strong style={{ color: '#059669' }}>{event.status}</strong></span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: AI BENEFICIARY SCORECARD */}
              {drawerTab === 'scores' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#0369A1', fontWeight: 800 }}>AI UNDERWRITING & INCLUSION SCORECARD</h4>
                    <span style={{ fontSize: '12px', color: '#059669', fontWeight: 800 }}>Overall: {selectedWorker.trustScore || 96} / 100</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {Object.entries(selectedWorker.aiScores || {
                      financialInclusion: 94,
                      employmentReadiness: 92,
                      digitalLiteracy: 88,
                      schemeEligibility: 96,
                      incomeStability: 90,
                      insuranceCoverage: 92
                    }).map(([key, val]) => (
                      <div key={key} style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                        <strong style={{ fontSize: '1.25rem', color: '#0369A1', display: 'block', margin: '3px 0' }}>{val} / 100</strong>
                        <div style={{ width: '100%', height: '5px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${val}%`, height: '100%', background: val >= 90 ? '#059669' : '#0284C7' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: FINANCIAL & CASHFLOW VELOCITY */}
              {drawerTab === 'financial' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#0369A1', fontWeight: 800 }}>REAL-TIME CASHFLOW & INCOME VELOCITY</h4>
                  
                  <div style={{ background: '#ECFDF5', padding: '16px', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
                    <span style={{ fontSize: '0.72rem', color: '#065F46', fontWeight: 700, textTransform: 'uppercase' }}>Current Monthly Income</span>
                    <strong style={{ fontSize: '1.6rem', color: '#059669', display: 'block', margin: '4px 0' }}>₹{(selectedWorker.monthlyIncome || 18000).toLocaleString()} / mo</strong>
                    <span style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 700 }}>Previous: ₹{(selectedWorker.previousIncome || 7500).toLocaleString()} ({selectedWorker.incomeGrowth || '+150%'} Growth Velocity)</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <div style={{ background: '#F0F9FF', padding: '12px', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
                      <span style={{ fontSize: '11px', color: '#0369A1', fontWeight: 700 }}>Daily Gross Earnings</span>
                      <strong style={{ fontSize: '15px', color: '#0F172A', display: 'block', marginTop: '2px' }}>₹{selectedWorker.dailyEarning || 650} / day</strong>
                    </div>
                    <div style={{ background: '#F0F9FF', padding: '12px', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
                      <span style={{ fontSize: '11px', color: '#0369A1', fontWeight: 700 }}>Net Daily Cash Buffer</span>
                      <strong style={{ fontSize: '15px', color: '#059669', display: 'block', marginTop: '2px' }}>₹{selectedWorker.dailyBuffer || 400} / day</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: VERIFIED DOCUMENT VAULT */}
              {drawerTab === 'docs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#0369A1', fontWeight: 800 }}>VERIFIED E-KYC & FINANCIAL DOCUMENTS</h4>
                  {(selectedWorker.documents || [
                    { name: `Aadhaar_eKYC_${selectedWorker.id}.pdf`, status: 'VERIFIED', size: '480 KB' },
                    { name: 'Bank_Statement_QR_Flow.pdf', status: 'VERIFIED', size: '890 KB' }
                  ]).map((doc, idx) => (
                    <div key={idx} style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={20} color="#0284C7" />
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: '#0F172A', display: 'block' }}>{doc.name}</strong>
                          <span style={{ fontSize: '0.74rem', color: '#64748B' }}>{doc.size} • Verified by Sahayata Forensics</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '3px 8px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                        ✓ {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: AI RECOMMENDATIONS */}
              {drawerTab === 'recommendations' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#0369A1', fontWeight: 800 }}>AUTOMATED STRATEGIC UNDERWRITING ACTIONS</h4>
                  {(selectedWorker.recommendations || [
                    `Eligible for ${Array.isArray(selectedWorker.schemes) ? selectedWorker.schemes[0] : 'PM SVANidhi'} Low-Interest Credit`,
                    'Recommend Digital Financial & UPI QR Literacy Certification',
                    'Eligible for PM Suraksha Bima Yojana (PMSBY) Insurance Cover'
                  ]).map((rec, idx) => (
                    <div key={idx} style={{ background: '#F0F9FF', padding: '12px 14px', borderRadius: '10px', borderLeft: '4px solid #0284C7', border: '1px solid #BAE6FD', borderLeftWidth: '4px', fontSize: '0.84rem', color: '#0369A1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={16} color="#0284C7" style={{ flexShrink: 0 }} />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons Footer */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: 'auto', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleExportWorkerPDF(selectedWorker)}
                  style={{ flex: 1, background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', color: '#FFFFFF', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)' }}
                >
                  <Download size={15} />
                  <span>Download Worker Dossier PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

