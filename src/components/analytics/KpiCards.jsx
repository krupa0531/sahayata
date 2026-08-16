import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, Stethoscope, HandCoins, Building2, TrendingUp, ShieldAlert, FileText } from 'lucide-react';

const kpiData = [
  { id: 1, title: 'Total Registered Workers', value: '45.2M', trend: '+12.5%', isUp: true, icon: Users, color: '#38bdf8' },
  { id: 2, title: 'Active Workers (30d)', value: '38.7M', trend: '+8.2%', isUp: true, icon: UserCheck, color: '#10b981' },
  { id: 3, title: 'Loans Approved', value: '12.4M', trend: '+15.3%', isUp: true, icon: HandCoins, color: '#8b5cf6' },
  { id: 4, title: 'Gov Schemes Applied', value: '28.9M', trend: '+22.1%', isUp: true, icon: FileText, color: '#f59e0b' },
  { id: 5, title: 'NGO Partners', value: '1,245', trend: '+45', isUp: true, icon: Building2, color: '#0ea5e9' },
  { id: 6, title: 'Insurance Active', value: '18.2M', trend: '+5.4%', isUp: true, icon: Stethoscope, color: '#ec4899' },
  { id: 7, title: 'Pending Verifications', value: '452K', trend: '-12%', isUp: false, icon: ShieldAlert, color: '#ef4444' },
  { id: 8, title: 'Avg Monthly Growth', value: '14.2%', trend: '+2.1%', isUp: true, icon: TrendingUp, color: '#14b8a6' },
];

export default function KpiCards() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="kpi-grid"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {kpiData.map((kpi) => (
        <motion.div key={kpi.id} className="analytics-card kpi-card" variants={item} style={{ '--accent-start': kpi.color, '--accent-end': `${kpi.color}88` }}>
          <div className="kpi-header">
            <span className="kpi-title">{kpi.title}</span>
            <kpi.icon className="kpi-icon" size={32} style={{ color: kpi.color, backgroundColor: `${kpi.color}15` }} />
          </div>
          <div className="kpi-value">{kpi.value}</div>
          <div className={`kpi-trend ${kpi.isUp ? 'trend-up' : 'trend-down'}`}>
            {kpi.isUp ? '↑' : '↓'} {kpi.trend} vs last month
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
