import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  HandCoins, 
  ShieldCheck, 
  Building2, 
  MessageSquareCode, 
  AlertTriangle, 
  UserPlus 
} from 'lucide-react';
import { getAnalyticsState, syncStatsFromBackend } from '../../services/realtimeSync';

export default function GlowingKpiCards() {
  const [syncState, setSyncState] = useState(getAnalyticsState());

  useEffect(() => {
    // Sync latest from backend on mount
    syncStatsFromBackend().then((st) => {
      if (st) setSyncState(st);
    });

    const handleSyncUpdate = (e) => {
      setSyncState(e.detail || getAnalyticsState());
    };

    window.addEventListener('sahayata_analytics_update', handleSyncUpdate);
    return () => window.removeEventListener('sahayata_analytics_update', handleSyncUpdate);
  }, []);

  const totalWorkers = syncState.totalWorkersCount ?? 4;
  const activeSchemes = syncState.submittedApplicationsCount ?? 0;
  const loansDisbursed = syncState.disbursedLoansAmount ?? 0;
  const aiChats = syncState.aiConversationsCount ?? 6;
  const fraudBlocked = syncState.fraudAttemptsCount ?? 3;

  const KPI_LIST = [
    {
      id: 'workers',
      label: 'Total Workers',
      displayVal: String(totalWorkers),
      trend: 'Live',
      isUp: true,
      icon: Users,
      color: '#0284c7',
      bg: '#f0f9ff',
      border: '#e0f2fe'
    },
    {
      id: 'schemes',
      label: 'Active Schemes',
      displayVal: String(activeSchemes),
      trend: `${activeSchemes} Active`,
      isUp: true,
      icon: FileText,
      color: '#7C3AED',
      bg: '#F5F3FF',
      border: '#EDE9FE'
    },
    {
      id: 'ekyc',
      label: 'e-KYC Verified',
      displayVal: String(totalWorkers),
      trend: '100% Verified',
      isUp: true,
      icon: ShieldCheck,
      color: '#059669',
      bg: '#ECFDF5',
      border: '#D1FAE5'
    },
    {
      id: 'insurance',
      label: 'Active Insurance',
      displayVal: '0',
      trend: '0 Active',
      isUp: true,
      icon: ShieldCheck,
      color: '#0891B2',
      bg: '#ECFEFF',
      border: '#CFFAFE'
    },
    {
      id: 'ngos',
      label: 'Partner NGOs',
      displayVal: '0',
      trend: '0 NGOs',
      isUp: true,
      icon: Building2,
      color: '#4F46E5',
      bg: '#EEF2FF',
      border: '#E0E7FF'
    },
    {
      id: 'ai_chats',
      label: 'AI Conversations',
      displayVal: String(aiChats),
      trend: 'Real-time',
      isUp: true,
      icon: MessageSquareCode,
      color: '#0284C7',
      bg: '#F0F9FF',
      border: '#E0F2FE'
    },
    {
      id: 'pending_cases',
      label: 'Fraud Blocked',
      displayVal: String(fraudBlocked),
      trend: `${fraudBlocked} Blocked`,
      isUp: false,
      icon: AlertTriangle,
      color: '#E11D48',
      bg: '#FFF1F2',
      border: '#FFE4E6'
    },
    {
      id: 'todays_reg',
      label: "Today's Registrations",
      displayVal: '0',
      trend: '0 Today',
      isUp: true,
      icon: UserPlus,
      color: '#0D9488',
      bg: '#F0FDFA',
      border: '#CCFBF1'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } }
  };

  return (
    <motion.div
      className="kpi-cards-grid"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {KPI_LIST.map((kpi) => {
        const IconComponent = kpi.icon;

        return (
          <motion.div
            key={kpi.id}
            className="kpi-metric-card"
            variants={itemVariants}
          >
            {/* TOP ROW: ICON + TREND PILL */}
            <div className="kpi-top-row">
              <div 
                className="kpi-card-icon"
                style={{ 
                  background: kpi.bg, 
                  color: kpi.color, 
                  border: `1px solid ${kpi.border}` 
                }}
              >
                <IconComponent size={17} />
              </div>
              <span className={`kpi-trend-badge ${kpi.isUp ? 'positive' : 'negative'}`}>
                {kpi.isUp ? '▲' : '▼'} {kpi.trend}
              </span>
            </div>

            {/* MIDDLE & BOTTOM: BIG VALUE + CLEAN TITLE */}
            <div className="kpi-value-block">
              <div className="kpi-value-text">{kpi.displayVal}</div>
              <div className="kpi-label-text" title={kpi.label}>{kpi.label}</div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
