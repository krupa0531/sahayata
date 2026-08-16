import fs from "fs";

// 1. UPDATE src/services/realtimeSync.js
const syncContent = `/**
 * SAHAYATA REAL-TIME ANALYTICS & BACKEND SYNC SERVICE
 * Synchronizes AI Conversations, Scheme Submissions, and Fraud Alerts to the Admin Dashboard in Real-Time
 */

const SYNC_KEY = "sahayata_analytics_state";

const DEFAULT_STATE = {
  totalWorkersCount: 4,
  submittedApplicationsCount: 0,
  disbursedLoansAmount: 0,
  aiConversationsCount: 0,
  fraudAttemptsCount: 3,
  verifiedDocsCount: 0,
  recentApplications: [],
};

export function getAnalyticsState() {
  try {
    const data = localStorage.getItem(SYNC_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_STATE,
        ...parsed,
      };
    }
  } catch (e) {
    console.warn("Analytics state read error:", e);
  }
  return DEFAULT_STATE;
}

export function saveAnalyticsState(state) {
  try {
    localStorage.setItem(SYNC_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event("sahayata_analytics_update"));
  } catch (e) {
    console.warn("Analytics state save error:", e);
  }
}

// RESET ALL COUNTERS (Total Workers = 4, Fraud Blocked = 3)
export function resetAnalyticsStateToZero() {
  saveAnalyticsState(DEFAULT_STATE);
  return DEFAULT_STATE;
}

// 1. INCREMENT AI CONVERSATION COUNT (+1 on every Sai chat message)
export function recordAiConversation() {
  const state = getAnalyticsState();
  state.aiConversationsCount = (state.aiConversationsCount || 0) + 1;
  saveAnalyticsState(state);
  return state.aiConversationsCount;
}

// 2. RECORD NEW SCHEME / LOAN APPLICATION SUBMISSION (+1 on application submit)
export function recordApplicationSubmission(application) {
  const state = getAnalyticsState();
  state.submittedApplicationsCount = (state.submittedApplicationsCount || 0) + 1;
  const numericAmount = parseInt((application.eligibleAmount || "15000").replace(/[^0-9]/g, ""), 10) || 15000;
  state.disbursedLoansAmount = (state.disbursedLoansAmount || 0) + numericAmount;

  const newApp = {
    id: application.applicationId || \`SAH-2026-\${Math.floor(10000 + Math.random() * 90000)}\`,
    applicantName: "Ramesh Kumar Patel",
    schemeName: application.scheme || "PM SVANidhi",
    recommendedBank: application.lender || "State Bank of India (SBI)",
    loanAmount: application.eligibleAmount || "₹35,000",
    monthlyIncome: "₹22,000",
    authenticityScore: "96%",
    fraudRisk: "Low (6%)",
    status: "Pending Bank Review",
    submissionTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  state.recentApplications = [newApp, ...(state.recentApplications || []).slice(0, 19)];
  saveAnalyticsState(state);
  return state;
}

// 3. RECORD FRAUD ATTEMPT (+1 when 8-Layer AI Fraud Engine catches fake image)
export function recordFraudAttempt() {
  const state = getAnalyticsState();
  state.fraudAttemptsCount = (state.fraudAttemptsCount || 3) + 1;
  saveAnalyticsState(state);
  return state.fraudAttemptsCount;
}
`;

fs.writeFileSync("src/services/realtimeSync.js", syncContent, "utf8");

// 2. UPDATE GlowingKpiCards.jsx
const kpiContent = `import React, { useEffect, useState } from 'react';
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
import { getAnalyticsState } from '../../services/realtimeSync';

export default function GlowingKpiCards() {
  const [syncState, setSyncState] = useState(getAnalyticsState());

  useEffect(() => {
    const handleSyncUpdate = () => {
      setSyncState(getAnalyticsState());
    };

    window.addEventListener('sahayata_analytics_update', handleSyncUpdate);
    return () => window.removeEventListener('sahayata_analytics_update', handleSyncUpdate);
  }, []);

  const totalWorkers = syncState.totalWorkersCount ?? 4;
  const activeSchemes = syncState.submittedApplicationsCount ?? 0;
  const loansDisbursed = syncState.disbursedLoansAmount ?? 0;
  const aiChats = syncState.aiConversationsCount ?? 0;
  const fraudBlocked = syncState.fraudAttemptsCount ?? 3;

  const KPI_LIST = [
    {
      id: 'workers',
      label: 'Total Workers',
      displayVal: String(totalWorkers),
      trend: 'Real-time Live',
      isUp: true,
      icon: Users,
      sparkline: [1, 2, 3, 4]
    },
    {
      id: 'schemes',
      label: 'Active Schemes',
      displayVal: String(activeSchemes),
      trend: \`\${activeSchemes} Active Applications\`,
      isUp: true,
      icon: FileText,
      sparkline: [0, activeSchemes]
    },
    {
      id: 'loans',
      label: 'Loans Disbursed',
      displayVal: \`₹\${loansDisbursed.toLocaleString()}\`,
      trend: \`₹\${loansDisbursed.toLocaleString()} Disbursed\`,
      isUp: true,
      icon: HandCoins,
      sparkline: [0, loansDisbursed]
    },
    {
      id: 'insurance',
      label: 'Active Insurance',
      displayVal: '0',
      trend: '0 Active',
      isUp: true,
      icon: ShieldCheck,
      sparkline: [0, 0]
    },
    {
      id: 'ngos',
      label: 'Partner NGOs',
      displayVal: '0',
      trend: '0 NGOs',
      isUp: true,
      icon: Building2,
      sparkline: [0, 0]
    },
    {
      id: 'ai_chats',
      label: 'AI Conversations',
      displayVal: String(aiChats),
      trend: \`\${aiChats} Real-time Chats\`,
      isUp: true,
      icon: MessageSquareCode,
      sparkline: [0, aiChats]
    },
    {
      id: 'pending_cases',
      label: 'Fraud Blocked',
      displayVal: String(fraudBlocked),
      trend: \`\${fraudBlocked} Fraud Blocked\`,
      isUp: false,
      icon: AlertTriangle,
      sparkline: [1, 2, fraudBlocked]
    },
    {
      id: 'todays_reg',
      label: "Today's Registrations",
      displayVal: '0',
      trend: '0 Today',
      isUp: true,
      icon: UserPlus,
      sparkline: [0, 0]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
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
        const sparkMax = Math.max(...kpi.sparkline) || 1;
        const points = kpi.sparkline
          .map((val, index) => {
            const x = (index / (kpi.sparkline.length - 1)) * 90;
            const y = 28 - (val / sparkMax) * 22;
            return \`\${x},\${y}\`;
          })
          .join(' ');

        return (
          <motion.div
            key={kpi.id}
            className="command-glass-card kpi-futuristic-card"
            variants={itemVariants}
          >
            <div className="kpi-card-header">
              <span className="kpi-label">{kpi.label}</span>
              <div className="kpi-icon-glow">
                <IconComponent size={20} />
              </div>
            </div>

            <div className="kpi-main-metric">
              {kpi.displayVal}
            </div>

            <div className="kpi-footer-row">
              <span className={\`kpi-trend-pill \${kpi.isUp ? 'up' : 'down'}\`}>
                {kpi.isUp ? '▲' : '▼'} {kpi.trend}
              </span>

              <svg className="kpi-sparkline-svg" viewBox="0 0 90 28">
                <defs>
                  <linearGradient id={\`sparkGrad-\${kpi.id}\`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon
                  points={\`0,28 \${points} 90,28\`}
                  fill={\`url(#sparkGrad-\${kpi.id})\`}
                />
                <polyline
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  points={points}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
`;

fs.writeFileSync("src/components/analytics/GlowingKpiCards.jsx", kpiContent, "utf8");
console.log("Successfully updated Total Workers = 4 and Fraud Blocked = 3");
