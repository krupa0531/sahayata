import React from 'react';
import { 
  Home,
  Users,
  HandCoins,
  FileText,
  BarChart2,
  MapPin,
  Activity,
  ShieldCheck,
  Settings, 
  LogOut 
} from 'lucide-react';

export default function CommandCenterSidebar({ activeNav, setActiveNav, navigateTo }) {
  const topMenuItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'workers', label: 'Workers', icon: Users },
    { id: 'schemes', label: 'Schemes', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'sync', label: 'Realtime Sync', icon: Activity },
  ];

  const bottomMenuItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Log out', icon: LogOut, action: () => navigateTo('/') },
  ];

  return (
    <aside className="command-sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo-brand">
          {/* 4-petal geometric SVG logo */}
          <svg width="30" height="30" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 7C11.5 7 14 11 14 14C11 14 7 11.5 7 7Z" fill="#0369a1"/>
            <path d="M27 7C22.5 7 20 11 20 14C23 14 27 11.5 27 7Z" fill="#0284c7"/>
            <path d="M7 27C11.5 27 14 23 14 20C11 20 7 22.5 7 27Z" fill="#38bdf8"/>
            <path d="M27 27C22.5 27 20 23 20 20C23 20 27 22.5 27 27Z" fill="#0369a1"/>
            <circle cx="17" cy="17" r="3.5" fill="#0284c7"/>
          </svg>
        </div>
        <div className="sidebar-title-block">
          <span className="sidebar-brand-text">SAHAYATA</span>
          <span className="sidebar-sub-brand">FINTECH</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="command-nav">
        {topMenuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeNav === item.id || (item.id === 'overview' && activeNav === 'dashboard');

          return (
            <button
              key={item.id}
              type="button"
              className={`command-nav-btn ${isActive ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveNav(item.id);
              }}
            >
              <div className={`nav-icon-wrapper ${isActive ? 'active-icon-box' : ''}`}>
                <IconComponent size={17} className="nav-icon" />
              </div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="sidebar-bottom-nav">
        {bottomMenuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeNav === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`command-nav-btn bottom-btn ${isActive ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                if (item.action) {
                  item.action();
                } else {
                  setActiveNav(item.id);
                }
              }}
            >
              <div className="nav-icon-wrapper">
                <IconComponent size={17} className="nav-icon" />
              </div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
