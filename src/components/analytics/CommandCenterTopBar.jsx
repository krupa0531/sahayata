import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ShieldCheck, 
  Activity, 
  Clock, 
  User, 
  ChevronDown, 
  Sparkles,
  LogOut,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommandCenterTopBar({ searchQuery, setSearchQuery, navigateTo, role, setRole }) {
  const [timeStr, setTimeStr] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notificationsList = [
    { id: 1, text: 'New batch of 1,240 workers verified in Maharashtra', time: '1m ago', tag: 'ONBOARDING' },
    { id: 2, text: 'AI Underwriting anomaly flagged for Review SAH-9012', time: '5m ago', tag: 'RISK' },
    { id: 3, text: 'State Govt Scheme PM-SYM linked to 450 beneficiaries', time: '12m ago', tag: 'SCHEMES' },
  ];

  // Update live digital clock every second (IST format)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="command-topbar">
      {/* Search Input Box */}
      <div className="command-search-box">
        <Search size={18} className="command-search-icon" />
        <input
          type="text"
          className="command-search-input"
          placeholder="Search beneficiaries, worker IDs, schemes, loan IDs, regional hubs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="search-shortcut-tag">CTRL + K</span>
      </div>

      {/* Floating Status & Controls Right */}
      <div className="topbar-right-controls">
        {/* Live Server Status */}
        <div className="server-status-pill">
          <span className="live-beacon-dot" />
          <span>SYSTEM ONLINE • 12ms</span>
        </div>

        {/* Live Clock */}
        <div className="live-clock-box">
          <Clock size={14} />
          <span>{timeStr || '18:04:30 IST'}</span>
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            className="notification-bell-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setUnreadCount(0);
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
          </button>

          {/* Notifications Dropdown Drawer */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                style={{
                  position: 'absolute',
                  top: '50px',
                  right: 0,
                  width: '320px',
                  background: 'rgba(5, 8, 22, 0.95)',
                  border: '1px solid #00E5FF',
                  borderRadius: '14px',
                  padding: '1rem',
                  boxShadow: '0 10px 30px rgba(0, 229, 255, 0.3)',
                  backdropFilter: 'blur(20px)',
                  zIndex: 100
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid rgba(0, 229, 255, 0.15)', paddingBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#F8FAFC' }}>LIVE SYSTEM NOTIFICATIONS</strong>
                  <span style={{ fontSize: '0.7rem', color: '#00E5FF' }}>3 New Alerts</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {notificationsList.map(n => (
                    <div key={n.id} style={{ background: 'rgba(0, 229, 255, 0.05)', padding: '0.6rem', borderRadius: '8px', borderLeft: '3px solid #00E5FF' }}>
                      <div style={{ fontSize: '0.78rem', color: '#F8FAFC' }}>{n.text}</div>
                      <div style={{ fontSize: '0.68rem', color: '#2DD4BF', marginTop: '4px' }}>{n.time} • {n.tag}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clearance & Role Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            style={{
              background: 'rgba(0, 229, 255, 0.08)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '12px',
              padding: '0.45rem 0.85rem',
              color: '#F8FAFC',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <ShieldCheck size={16} color="#00E5FF" />
            <span>{role || 'Super Admin'}</span>
            <ChevronDown size={14} color="#94A3B8" />
          </button>

          {/* Role Dropdown Menu */}
          <AnimatePresence>
            {showRoleDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '200px',
                  background: 'rgba(5, 8, 22, 0.95)',
                  border: '1px solid #00E5FF',
                  borderRadius: '12px',
                  padding: '0.5rem',
                  boxShadow: '0 8px 25px rgba(0, 229, 255, 0.25)',
                  backdropFilter: 'blur(16px)',
                  zIndex: 100
                }}
              >
                {['Super Admin', 'State Admin (MH)', 'District Officer', 'NGO Coordinator', 'CSR Partner'].map(r => (
                  <div
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setShowRoleDropdown(false);
                    }}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      color: role === r ? '#00E5FF' : '#C7DDFF',
                      background: role === r ? 'rgba(0, 229, 255, 0.12)' : 'transparent',
                      fontWeight: role === r ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {r}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
