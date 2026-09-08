import React, { useState, useEffect, useRef } from 'react';
import '../command-center.css';
import { 
  Home,
  Calendar as CalendarIcon,
  Search,
  Bell,
  SlidersHorizontal,
  Plus,
  Clock,
  Edit3,
  MoreHorizontal,
  Folder,
  Check,
  X,
  ExternalLink,
  ThumbsUp,
  BarChart2,
  Paperclip,
  ChevronDown,
  Download,
  Trash2,
  Share2,
  FileText,
  UserPlus,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Users,
  HandCoins,
  TrendingUp,
  AlertTriangle,
  Building2,
  User,
  Eye
} from 'lucide-react';
import CommandCenterSidebar from './analytics/CommandCenterSidebar';
import BankUnderwritingQueue from './analytics/BankUnderwritingQueue';
import SahayataImpactReport from './analytics/SahayataImpactReport';
import GoogleMapAnalytics from './analytics/GoogleMapAnalytics';
import DataTable from './analytics/DataTable';
import RealTimeFeed from './analytics/RealTimeFeed';
import GlowingKpiCards from './analytics/GlowingKpiCards';
import RiskAnalystModule from './analytics/RiskAnalystModule';
import { ErrorBoundary } from '../ErrorBoundary';
import { getAnalyticsState, recordApplicationSubmission, syncStatsFromBackend } from '../services/realtimeSync';

// Real worker image assets
import deliveryRiderPhoto from '../assets/delivery-rider-real.jpg';
import domesticWorkerPhoto from '../assets/domestic-worker-india.jpg';
import streetVendorPhoto from '../assets/street-vendor-india.jpg';
import constructionWorkerPhoto from '../assets/construction-worker-india.jpg';
import adminPhoto from '../assets/krupa.jpg';

export default function AdminAnalyticsModule({ navigateTo, lang }) {
  // Active Sidebar Navigation Tab
  const [activeNav, setActiveNav] = useState('overview');

  // Search & Filtering State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter Dropdowns
  const [filterAll, setFilterAll] = useState('All');
  const [filterAllOpen, setFilterAllOpen] = useState(false);
  
  const [filterWorkers, setFilterWorkers] = useState('Workers');
  const [filterWorkersOpen, setFilterWorkersOpen] = useState(false);
  
  const [filterSchemes, setFilterSchemes] = useState('Schemes');
  const [filterSchemesOpen, setFilterSchemesOpen] = useState(false);
  
  const [filterActive, setFilterActive] = useState('Active');
  const [filterActiveOpen, setFilterActiveOpen] = useState(false);

  // Topbar Dropdowns
  const [selectedDate, setSelectedDate] = useState('20 Sep');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userRole, setUserRole] = useState('Admin');

  // Modals
  const [addRecordModal, setAddRecordModal] = useState(false);
  const [activeEditModal, setActiveEditModal] = useState(null);
  const [fileVaultModal, setFileVaultModal] = useState(false);
  const [noteEditModal, setNoteEditModal] = useState(false);
  const [noteDetailsModal, setNoteDetailsModal] = useState(false);
  const [noteExpandModal, setNoteExpandModal] = useState(false);
  const [customFilterModal, setCustomFilterModal] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Real-time Sahayata State
  const [analyticsState, setAnalyticsState] = useState(getAnalyticsState());
  useEffect(() => {
    // Sync with backend on mount
    syncStatsFromBackend().then((st) => {
      if (st) setAnalyticsState(st);
    });

    const handleSync = (e) => setAnalyticsState(e.detail || getAnalyticsState());
    window.addEventListener('sahayata_analytics_update', handleSync);
    return () => window.removeEventListener('sahayata_analytics_update', handleSync);
  }, []);

  const totalWorkersCount = analyticsState.totalWorkersCount ?? 0;
  const loansDisbursed = analyticsState.disbursedLoansAmount ? `₹${analyticsState.disbursedLoansAmount.toLocaleString('en-IN')}` : '₹0';

  useEffect(() => {
    setDashboardCards(prev => prev.map(c => {
      if (c.id === 'card-1') {
        return {
          ...c,
          extraPeople: `+${totalWorkersCount} Workers`,
          desc: `${totalWorkersCount} verified workers registered across unorganised sectors.`
        };
      }
      if (c.id === 'card-2') {
        return {
          ...c,
          totalDisbursed: `${totalWorkersCount} Verified`,
          activeApplications: String(analyticsState.submittedApplicationsCount || 0)
        };
      }
      return c;
    }));
  }, [totalWorkersCount, analyticsState.submittedApplicationsCount]);

  // File Upload Reference
  const fileInputRef = useRef(null);

  // Today Note State
  const [todayNoteText, setTodayNoteText] = useState(
    'Credit verification for construction workers is pending for 12 applications.'
  );
  const [noteInputText, setNoteInputText] = useState(todayNoteText);
  const [noteDismissed, setNoteDismissed] = useState(false);

  // Real Sahayata Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: '3 Fraud Anomalies Blocked', desc: 'Device fingerprint spoofing detected & prevented in Pune node.', time: '5m ago', unread: true, type: 'alert' },
    { id: 2, title: 'Ramesh Kumar e-KYC Complete', desc: 'Zomato partner income statement & Aadhaar verified.', time: '18m ago', unread: true, type: 'success' },
    { id: 3, title: '12 Construction Worker Applications', desc: 'Pending credit verification under PM SVANidhi.', time: '20m ago', unread: true, type: 'info' }
  ]);

  // Real Sahayata Documents
  const [documentsList, setDocumentsList] = useState([
    { id: 1, name: 'Bank Statement - Aug 2024', size: '1.2 MB', format: 'pdf', type: 'PDF' },
    { id: 2, name: 'Transaction Report - Jul 2024', size: '890 KB', format: 'xlsx', type: 'XLSX' },
    { id: 3, name: 'KYC Documents - Workers', size: '2.4 MB', format: 'pdf', type: 'PDF' },
    { id: 4, name: 'Scheme Guidelines', size: '450 KB', format: 'pdf', type: 'PDF' },
    { id: 5, name: 'Credit Disbursement Report', size: '1.8 MB', format: 'xlsx', type: 'XLSX' },
    { id: 6, name: 'Aadhaar_eKYC_Batch_2024.pdf', size: '780 KB', format: 'pdf', type: 'PDF' },
    { id: 7, name: 'eSHRAM_National_Database.pdf', size: '3.1 MB', format: 'pdf', type: 'PDF' },
    { id: 8, name: 'PM_SVANidhi_Vendor_Pass.pdf', size: '650 KB', format: 'pdf', type: 'PDF' },
    { id: 9, name: 'Merchant_QR_Bank_Settlements.xlsx', size: '920 KB', format: 'xlsx', type: 'XLSX' },
    { id: 10, name: 'Underwriting_Policy_2026.docx', size: '210 KB', format: 'doc', type: 'DOC' },
    { id: 11, name: 'Lender_API_Contract_SBI.json', size: '48 KB', format: 'code', type: 'JSON' },
    { id: 12, name: 'National_Inclusion_Report.pdf', size: '4.2 MB', format: 'pdf', type: 'PDF' }
  ]);

  // Main 3 Dashboard Cards
  const [dashboardCards, setDashboardCards] = useState([
    {
      id: 'card-1',
      title: 'New Workers Added',
      desc: '32 new workers registered across 4 sectors today.',
      time: '10:00 AM - 10:30 AM',
      status: 'Today',
      isFeatured: false,
      sector: 'Workers',
      priority: 'Active',
      assignees: [deliveryRiderPhoto, streetVendorPhoto, domesticWorkerPhoto],
      extraPeople: '+4 Workers',
      likes: 12,
      isLiked: false,
      isAlertActive: false
    },
    {
      id: 'card-2',
      title: 'Scheme Verification Pipeline',
      desc: 'Government welfare scheme linkage and beneficiary Aadhaar e-KYC status tracking.',
      time: '10:00 AM - 01:00 PM',
      status: 'Today',
      isFeatured: true,
      sector: 'Schemes',
      priority: 'Active',
      filesCount: 12,
      totalDisbursed: `${totalWorkersCount} Verified`,
      activeApplications: '0',
      successRate: '100%',
      sectorsList: ['Delivery Partners', 'Street Vendors', 'Construction Workers', 'Domestic Workers'],
      progress: 100,
      assignees: [streetVendorPhoto, deliveryRiderPhoto, constructionWorkerPhoto],
      extraPeople: '+8 Welfare Schemes',
      likes: 34,
      isLiked: false,
      isAlertActive: false
    },
    {
      id: 'card-3',
      title: 'Scheme Applications Update',
      desc: '18 new scheme applications received and are under review.',
      time: '11:00 AM - 11:45 AM',
      status: 'Today',
      isFeatured: false,
      sector: 'Schemes',
      priority: 'Active',
      assignees: [domesticWorkerPhoto, constructionWorkerPhoto, deliveryRiderPhoto],
      extraPeople: '+18 Applications',
      likes: 19,
      isLiked: false,
      isAlertActive: false
    }
  ]);

  // Activity Spline Points (Total Workers Growth: 12,845, ↑ 8.5%)
  const chartPoints = [
    { month: 'Jan', percent: 45, cx: 15, cy: 90, val: '8,420' },
    { month: 'Feb', percent: 52, cx: 65, cy: 80, val: '9,850' },
    { month: 'Mar', percent: 64, cx: 115, cy: 65, val: '10,920' },
    { month: 'Apr', percent: 78, cx: 165, cy: 40, val: '11,740' },
    { month: 'May', percent: 70, cx: 215, cy: 55, val: '12,100' },
    { month: 'Jun', percent: 85, cx: 265, cy: 28, val: '12,845' },
    { month: 'Jul', percent: 92, cx: 310, cy: 18, val: '13,500' }
  ];
  const [activeChartPoint, setActiveChartPoint] = useState(chartPoints[5]); // Jun (12,845)

  // Card Action Menu
  const [openCardMenuId, setOpenCardMenuId] = useState(null);

  // Filter Cards
  const filteredCards = dashboardCards.filter(card => {
    const matchesSearch = !searchQuery || 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.desc.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAll = filterAll === 'All' || 
      (filterAll === 'Completed' ? card.status === 'Completed' : card.status === 'Today');

    const matchesWorkers = filterWorkers === 'Workers' || 
      card.sector === 'Workers' || card.title.toLowerCase().includes('worker');

    const matchesSchemes = filterSchemes === 'Schemes' || 
      card.sector === 'Schemes' || card.title.toLowerCase().includes('scheme');

    const matchesActive = filterActive === 'Active' || 
      card.priority === 'Active';

    return matchesSearch && matchesAll;
  });

  // Toggle Card Like / Quick Approve
  const toggleCardLike = (cardId) => {
    setDashboardCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const nextLiked = !c.isLiked;
        showToast(nextLiked ? 'Approved / Verified! 👍' : 'Approval reset');
        return { ...c, isLiked: nextLiked, likes: nextLiked ? c.likes + 1 : c.likes - 1 };
      }
      return c;
    }));
  };

  // Toggle Card Alert
  const toggleCardAlert = (cardId) => {
    setDashboardCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const nextAlert = !c.isAlertActive;
        showToast(nextAlert ? 'Underwriting alert enabled 🔔' : 'Alert muted');
        return { ...c, isAlertActive: nextAlert };
      }
      return c;
    }));
  };

  // Delete / Archive Card
  const deleteCard = (cardId) => {
    setDashboardCards(prev => prev.filter(c => c.id !== cardId));
    setOpenCardMenuId(null);
    showToast('Record archived 🗑️');
  };

  // Toggle Card Completed Status
  const toggleCardStatus = (cardId) => {
    setDashboardCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const nextStatus = c.status === 'Completed' ? 'Today' : 'Completed';
        showToast(`Status updated to ${nextStatus} ✅`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
    setOpenCardMenuId(null);
  };

  // Handle Add Record Form
  const handleAddRecord = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title') || 'New Worker Registration';
    const desc = formData.get('desc') || 'Aadhaar e-KYC and bank statement submitted for credit review.';
    const time = formData.get('time') || '02:00 PM - 03:00 PM';
    const sector = formData.get('sector') || 'Workers';

    const newCard = {
      id: `card-${Date.now()}`,
      title,
      desc,
      time,
      status: 'Today',
      isFeatured: false,
      sector,
      priority: 'Active',
      assignees: [deliveryRiderPhoto, domesticWorkerPhoto],
      extraPeople: '+1 Worker',
      likes: 1,
      isLiked: false,
      isAlertActive: false
    };

    setDashboardCards(prev => [newCard, ...prev]);
    recordApplicationSubmission({
      eligibleAmount: '₹20,000',
      scheme: 'PM SVANidhi',
      lender: 'State Bank of India (SBI)'
    });

    setAddRecordModal(false);
    showToast('New record added successfully! ✨');
  };

  // Handle Real File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';

    const newDoc = {
      id: Date.now(),
      name: file.name,
      size: sizeStr,
      format: ext.toLowerCase(),
      type: ext
    };

    setDocumentsList(prev => [newDoc, ...prev]);
    setDashboardCards(prev => prev.map(c => c.isFeatured ? { ...c, filesCount: (c.filesCount || 12) + 1 } : c));
    showToast(`File "${file.name}" added to My files! 📁`);
  };

  // Save Today Note
  const handleSaveNote = (e) => {
    e.preventDefault();
    setTodayNoteText(noteInputText);
    setNoteEditModal(false);
    showToast('Today note updated! 📝');
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setFilterAllOpen(false);
        setFilterWorkersOpen(false);
        setFilterCreditOpen(false);
        setFilterActiveOpen(false);
        setDateDropdownOpen(false);
        setAdminMenuOpen(false);
        setNotificationsOpen(false);
        setOpenCardMenuId(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className="sahayata-bi-root">
      {/* =========================================================
          1. SIDEBAR (ONLY IN SUPER ADMIN MODE)
      ========================================================== */}
      {(userRole === 'Admin' || userRole === 'Super Admin') && (
        <CommandCenterSidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          navigateTo={navigateTo}
        />
      )}

      {/* =========================================================
          2. MAIN CONTENT AREA
      ========================================================== */}
      <div className="sahayata-bi-main">
        
        {/* TOP HEADER (SECTION 3) */}
        <header className="sahayata-topbar">
          {/* Breadcrumb Left: Home / Dashboard / date */}
          <div className="sahayata-breadcrumbs">
            <div className="breadcrumb-item linkable" onClick={() => setActiveNav('overview')}>
              <Home size={16} className="bc-icon" />
              <span>Home</span>
            </div>
            <span className="bc-sep">/</span>
            <div className="breadcrumb-item active" onClick={() => setActiveNav('overview')} style={{ cursor: 'pointer' }}>
              <span>Dashboard</span>
            </div>
            <span className="bc-sep">/</span>
            
            {/* Interactive Date Selector */}
            <div className="dropdown-container" style={{ position: 'relative' }}>
              <div 
                className="breadcrumb-date-dropdown"
                onClick={(e) => {
                  e.stopPropagation();
                  setDateDropdownOpen(!dateDropdownOpen);
                }}
              >
                <CalendarIcon size={15} className="bc-icon" />
                <span>{selectedDate}</span>
                <ChevronDown size={14} className={`bc-arrow ${dateDropdownOpen ? 'open' : ''}`} />
              </div>

              {dateDropdownOpen && (
                <div className="popover-menu-card popover-menu-left">
                  <div className="popover-header">
                    <h4>Audit Timeframe</h4>
                    <p>Select date for dashboard statistics</p>
                  </div>
                  {['20 Sep (Today)', '19 Sep (Yesterday)', 'Last 7 Days', 'September 2026', 'Q3 2026'].map((d) => (
                    <div 
                      key={d} 
                      className={`popover-item ${selectedDate === d.split(' ')[0] ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedDate(d.split(' ')[0]);
                        setDateDropdownOpen(false);
                        showToast(`Date changed to ${d}`);
                      }}
                    >
                      <Check size={14} style={{ opacity: selectedDate === d.split(' ')[0] ? 1 : 0 }} />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Actions Right */}
          <div className="sahayata-topbar-actions dropdown-container">
            
        

            {/* Admin Dropdown */}
            <div style={{ position: 'relative' }}>
              <div 
                className="role-dropdown-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  setAdminMenuOpen(!adminMenuOpen);
                }}
              >
                <span>{userRole}</span>
                <ChevronDown size={14} />
              </div>

              {adminMenuOpen && (
                <div className="popover-menu-card">
                  <div className="popover-header">
                    <h4>Sahayata Admin</h4>
                    <p>Signed in as Super Admin</p>
                  </div>
                  <div className="popover-item" onClick={() => { setUserRole('Admin'); setAdminMenuOpen(false); showToast('Switched to Super Admin'); }}>
                    <ShieldCheck size={16} /> <span>Super Admin</span>
                  </div>
                  <div className="popover-item" onClick={() => { setUserRole('Scheme Officer'); setAdminMenuOpen(false); showToast('Switched to Scheme Officer'); }}>
                    <CheckCircle2 size={16} /> <span>Scheme Officer</span>
                  </div>
                  <div className="popover-item" onClick={() => { setUserRole('Risk Analyst'); setAdminMenuOpen(false); showToast('Switched to Risk Analyst'); }}>
                    <BarChart2 size={16} /> <span>Risk Analyst</span>
                  </div>
                  <div className="popover-divider" />
                  
                   
                  <div className="popover-item" onClick={() => navigateTo('/')} style={{ color: '#EF4444' }}>
                    <LogOut size={16} /> <span>Log out</span>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <button 
              type="button" 
              className="round-icon-btn" 
              title="Search dashboard records"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={17} />
            </button>

            {/* Notification Button */}
            <div style={{ position: 'relative' }}>
              <button 
                type="button" 
                className="round-icon-btn notification-btn" 
                title="Notifications"
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationsOpen(!notificationsOpen);
                }}
              >
                <Bell size={17} />
                {notifications.some(n => n.unread) && (
                  <span className="notif-badge-count">
                    {notifications.filter(n => n.unread).length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="popover-menu-card notification-popover">
                  <div className="popover-header">
                    <h4>Notifications</h4>
                    <p>Real-time system &amp; underwriting updates</p>
                  </div>
                  <div className="notif-list-scroll">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`notif-row ${n.unread ? 'unread' : ''}`}
                        onClick={() => {
                          setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                          if (n.type === 'alert') setActiveNav('underwriting');
                        }}
                      >
                        <div className="notif-icon-box" style={{ background: n.type === 'alert' ? '#FEE2E2' : '#f0f9ff', color: n.type === 'alert' ? '#EF4444' : '#0284c7' }}>
                          {n.type === 'alert' ? '⚠️' : '✓'}
                        </div>
                        <div className="notif-content">
                          <div className="notif-title">{n.title}</div>
                          <div className="notif-desc">{n.desc}</div>
                          <div className="notif-time">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="notif-footer">
                    <button type="button" className="clear-notif-btn" onClick={() => { setNotifications([]); showToast('All notifications cleared'); }}>
                      Clear all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            

          </div>
        </header>

        {/* SEARCH POPDOWN BAR */}
        {searchOpen && (
          <div className="search-popdown-bar">
            <Search size={18} className="search-icon-inside" />
            <input 
              type="text" 
              placeholder="Search records, workers, credit or schemes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button 
                type="button" 
                className="search-close-btn" 
                onClick={() => setSearchQuery('')}
              >
                <X size={15} />
              </button>
            )}
            <button 
              type="button" 
              className="search-close-btn" 
              onClick={() => setSearchOpen(false)}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* MAIN DASHBOARD BODY */}
        <div className="sahayata-bi-content">
          {activeNav === 'overview' || activeNav === 'dashboard' ? (
            userRole === 'Risk Analyst' ? (
              <div className="submodule-container">
                <ErrorBoundary>
                  <RiskAnalystModule />
                </ErrorBoundary>
              </div>
            ) : userRole === 'Scheme Officer' ? (
              <div className="submodule-container">
                <ErrorBoundary>
                  <BankUnderwritingQueue searchQuery={searchQuery} />
                </ErrorBoundary>
              </div>
            ) : (
              <div className="sahayata-grid-layout">
                
                {/* ================= LEFT / CENTER COLUMN ================= */}
                <div className="dashboard-left-col">
                
                {/* 4. MAIN HEADING */}
                <div className="sahayata-hero-header">
                  <h1 className="sahayata-hero-title">
                    Sahayata <span className="highlight-blue">Dashboard</span>
                  </h1>
                  <p className="sahayata-hero-sub">
                    Real-time overview of workers, credit, and financial inclusion at one place.
                  </p>

                  {/* 8 KPI EXECUTIVE METRIC BOXES */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <GlowingKpiCards />
                  </div>

                  {/* 5. & 6. FILTER ROW & ADD RECORD BUTTON */}
                  <div className="controls-row dropdown-container">
                    <div className="filters-group">
                      
                      {/* Filter 1: All */}
                      <div style={{ position: 'relative' }}>
                        <div 
                          className="filter-pill-select has-blue-dot"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilterAllOpen(!filterAllOpen);
                          }}
                        >
                          <span className="pill-blue-dot" />
                          <span>{filterAll}</span>
                          <ChevronDown size={14} />
                        </div>

                        {filterAllOpen && (
                          <div className="popover-menu-card popover-menu-left">
                            {['All', 'Today', 'Completed'].map(opt => (
                              <div 
                                key={opt} 
                                className={`popover-item ${filterAll === opt ? 'active' : ''}`}
                                onClick={() => {
                                  setFilterAll(opt);
                                  setFilterAllOpen(false);
                                  showToast(`Filtered: ${opt}`);
                                }}
                              >
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Filter 2: Workers */}
                      <div style={{ position: 'relative' }}>
                        <div 
                          className="filter-pill-select"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilterWorkersOpen(!filterWorkersOpen);
                          }}
                        >
                          <span>{filterWorkers}</span>
                          <ChevronDown size={14} />
                        </div>

                        {filterWorkersOpen && (
                          <div className="popover-menu-card popover-menu-left">
                            {['Workers', 'Delivery Partners', 'Street Vendors', 'Domestic Workers', 'Construction Workers'].map(opt => (
                              <div 
                                key={opt} 
                                className={`popover-item ${filterWorkers === opt ? 'active' : ''}`}
                                onClick={() => {
                                  setFilterWorkers(opt);
                                  setFilterWorkersOpen(false);
                                  showToast(`Filtered: ${opt}`);
                                }}
                              >
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Filter 3: Schemes */}
                      <div style={{ position: 'relative' }}>
                        <div 
                          className="filter-pill-select"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilterSchemesOpen(!filterSchemesOpen);
                          }}
                        >
                          <span>{filterSchemes}</span>
                          <ChevronDown size={14} />
                        </div>

                        {filterSchemesOpen && (
                          <div className="popover-menu-card popover-menu-left">
                            {['Schemes', 'PM SVANidhi', 'e-Shram Card', 'PM-SYM Pension', 'PM Jan Dhan'].map(opt => (
                              <div 
                                key={opt} 
                                className={`popover-item ${filterSchemes === opt ? 'active' : ''}`}
                                onClick={() => {
                                  setFilterSchemes(opt);
                                  setFilterSchemesOpen(false);
                                  showToast(`Filtered: ${opt}`);
                                }}
                              >
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Filter 4: Active */}
                      <div style={{ position: 'relative' }}>
                        <div 
                          className="filter-pill-select"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilterActiveOpen(!filterActiveOpen);
                          }}
                        >
                          <span>{filterActive}</span>
                          <ChevronDown size={14} />
                        </div>

                        {filterActiveOpen && (
                          <div className="popover-menu-card popover-menu-left">
                            {['Active', 'Pending', 'High Priority', 'Archived'].map(opt => (
                              <div 
                                key={opt} 
                                className={`popover-item ${filterActive === opt ? 'active' : ''}`}
                                onClick={() => {
                                  setFilterActive(opt);
                                  setFilterActiveOpen(false);
                                  showToast(`Filtered: ${opt}`);
                                }}
                              >
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Filter Settings Icon */}
                      <button 
                        type="button" 
                        className="filter-icon-btn" 
                        title="Filter settings"
                        onClick={() => setCustomFilterModal(true)}
                      >
                        <SlidersHorizontal size={16} />
                      </button>
                    </div>

                    {/* 6. ADD RECORD BUTTON */}
                    <button 
                      type="button" 
                      className="new-task-btn"
                      onClick={() => setAddRecordModal(true)}
                    >
                      Add Record
                    </button>
                  </div>
                </div>

                {/* 3 MAIN CARDS LIST */}
                <div className="task-cards-list">
                  
                  {filteredCards.map(card => {
                    if (card.isFeatured) {
                      /* =========================================================
                          9. LARGE FEATURED CARD: Worker Credit Overview
                      ========================================================== */
                      return (
                        <div key={card.id} className="task-card card-featured-blue">
                          <div className="card-top-bar dropdown-container">
                            <div className="status-indicator">
                              <span className="status-ring" />
                              <span className="status-text">{card.status === 'Completed' ? 'Verified' : 'Today'}</span>
                            </div>

                            <div className="card-actions">
                              {/* 12 Files Badge */}
                              <div 
                                className="files-count-badge" 
                                title="Click to view verified files"
                                onClick={() => setFileVaultModal(true)}
                              >
                                <Folder size={14} />
                                <span>{card.filesCount || 12} Files</span>
                              </div>

                              {/* Notification Button */}
                              <button 
                                type="button" 
                                className={`action-circle-btn ${card.isAlertActive ? 'liked' : ''}`}
                                title={card.isAlertActive ? 'Alert active' : 'Enable notification'}
                                onClick={() => toggleCardAlert(card.id)}
                              >
                                <Bell size={15} />
                              </button>

                              {/* Three-dot Menu */}
                              <div style={{ position: 'relative' }}>
                                <button 
                                  type="button" 
                                  className="action-circle-btn" 
                                  title="Options"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenCardMenuId(openCardMenuId === card.id ? null : card.id);
                                  }}
                                >
                                  <MoreHorizontal size={16} />
                                </button>

                                {openCardMenuId === card.id && (
                                  <div className="popover-menu-card">
                                    <div className="popover-item" onClick={() => { setActiveEditModal(card); setOpenCardMenuId(null); }}>
                                      <Edit3 size={15} /> <span>Edit Details</span>
                                    </div>
                                    <div className="popover-item" onClick={() => toggleCardStatus(card.id)}>
                                      <Check size={15} /> <span>{card.status === 'Completed' ? 'Mark Active' : 'Mark Completed'}</span>
                                    </div>
                                    <div className="popover-item" onClick={() => setFileVaultModal(true)}>
                                      <Folder size={15} /> <span>View Documents</span>
                                    </div>
                                    <div className="popover-divider" />
                                    <div className="popover-item" onClick={() => deleteCard(card.id)} style={{ color: '#EF4444' }}>
                                      <Trash2 size={15} /> <span>Archive</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="featured-body-layout" onClick={() => setActiveEditModal(card)} style={{ cursor: 'pointer' }}>
                            {/* Blue Logo Box */}
                            <div className="featured-logo-box">
                              <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="42" height="42" rx="12" fill="#0284c7" />
                                <path d="M14 13C14 13 22 13 25.5 16.5C29 20 29 24 25.5 27.5C22 31 14 31 14 31V13Z" fill="white" />
                                <path d="M18 17.5V26.5H23C24.5 26.5 25.5 25.5 25.5 24C25.5 22.5 24.5 21.5 23 21.5H21V17.5H18Z" fill="#0284c7" />
                              </svg>
                            </div>

                            <div className="featured-text-content">
                              <h2 className="card-heading">{card.title}</h2>
                              <p className="card-desc">
                                <span className="desc-label">Description : </span>
                                {card.desc}
                              </p>
                            </div>
                          </div>

                          {/* EXACT 3-METRICS GRID SPECIFIED IN SECTION 9 */}
                          <div className="featured-metrics-grid">
                            <div className="featured-metric-item">
                              <span className="featured-metric-label">Verified Beneficiaries</span>
                              <span className="featured-metric-val highlight">{card.totalDisbursed || `${totalWorkersCount} Verified`}</span>
                            </div>
                            <div className="featured-metric-item">
                              <span className="featured-metric-label">Active Applications</span>
                              <span className="featured-metric-val">{card.activeApplications || '0'}</span>
                            </div>
                            <div className="featured-metric-item">
                              <span className="featured-metric-label">Verification Rate</span>
                              <span className="featured-metric-val highlight">{card.successRate || '100%'}</span>
                            </div>
                          </div>

                          {/* Top Sectors Pill Tags & Progress */}
                          <div className="participants-progress-row">
                            <div className="participants-block">
                              <span className="row-kicker">Top Sectors :</span>
                              <div className="tags-list">
                                {(card.sectorsList || ['Delivery Partners', 'Street Vendors', 'Construction Workers', 'Domestic Workers']).map(tag => (
                                  <span 
                                    key={tag} 
                                    className="team-pill-tag"
                                    onClick={() => showToast(`Sector selected: ${tag}`)}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div 
                              className="progress-block" 
                              title="Success Rate progress" 
                              onClick={() => {
                                const nextP = card.progress >= 100 ? 50 : card.progress + 5;
                                setDashboardCards(prev => prev.map(c => c.id === card.id ? { ...c, progress: nextP } : c));
                                showToast(`Success rate updated to %${nextP}`);
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              <span className="row-kicker">Progress :</span>
                              <div className="striped-progress-track">
                                <div className="striped-progress-bar" style={{ width: `${card.progress || 78}%` }} />
                              </div>
                              <span className="progress-percent-text">%{card.progress || 78}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    /* =========================================================
                        8. CARD 1: New Workers Added & 10. CARD 3: Scheme Applications Update
                    ========================================================== */
                    return (
                      <div key={card.id} className="task-card card-white">
                        <div className="card-top-bar dropdown-container">
                          <div className="status-indicator">
                            <span className="status-ring" />
                            <span className="status-text">{card.status === 'Completed' ? 'Approved' : 'Today'}</span>
                          </div>

                          <div className="card-actions">
                            {/* Action Button: Thumbs Up or Edit */}
                            <button 
                              type="button" 
                              className={`action-circle-btn ${card.isLiked ? 'liked' : ''}`}
                              title={card.isLiked ? `Verified (${card.likes})` : `Verify / Approve (${card.likes})`}
                              onClick={() => toggleCardLike(card.id)}
                            >
                              {card.id === 'card-3' ? <ThumbsUp size={15} /> : <Edit3 size={15} onClick={(e) => { e.stopPropagation(); setActiveEditModal(card); }} />}
                            </button>

                            {/* Notification Button */}
                            <button 
                              type="button" 
                              className={`action-circle-btn ${card.isAlertActive ? 'liked' : ''}`}
                              title="Reminder Alert"
                              onClick={() => toggleCardAlert(card.id)}
                            >
                              <Bell size={15} />
                            </button>

                            {/* More Options Menu */}
                            <div style={{ position: 'relative' }}>
                              <button 
                                type="button" 
                                className="action-circle-btn" 
                                title="More options"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenCardMenuId(openCardMenuId === card.id ? null : card.id);
                                }}
                              >
                                <MoreHorizontal size={16} />
                              </button>

                              {openCardMenuId === card.id && (
                                <div className="popover-menu-card">
                                  <div className="popover-item" onClick={() => { setActiveEditModal(card); setOpenCardMenuId(null); }}>
                                    <Edit3 size={15} /> <span>Edit Details</span>
                                  </div>
                                  <div className="popover-item" onClick={() => toggleCardStatus(card.id)}>
                                    <Check size={15} /> <span>{card.status === 'Completed' ? 'Re-open' : 'Mark Completed'}</span>
                                  </div>
                                  <div className="popover-item" onClick={() => { showToast('Record copied 📋'); setOpenCardMenuId(null); }}>
                                    <Share2 size={15} /> <span>Share</span>
                                  </div>
                                  <div className="popover-divider" />
                                  <div className="popover-item" onClick={() => deleteCard(card.id)} style={{ color: '#EF4444' }}>
                                    <Trash2 size={15} /> <span>Archive</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <h2 
                          className="card-heading" 
                          onClick={() => setActiveEditModal(card)} 
                          style={{ cursor: 'pointer' }}
                        >
                          {card.title}
                        </h2>
                        <p className="card-desc">
                          <span className="desc-label">Description : </span>
                          {card.desc}
                        </p>

                        <div className="card-footer-row">
                          <div className="time-badge">
                            <Clock size={15} className="time-icon" />
                            <span>{card.time}</span>
                          </div>

                          <div 
                            className="assignees-stack" 
                            title="Workers & Applications"
                            onClick={() => setActiveNav('workers')}
                            style={{ cursor: 'pointer' }}
                          >
                            {card.assignees.map((photo, i) => (
                              <img key={i} src={photo} alt="Member" className="assignee-img" />
                            ))}
                            <span className="assignee-count">{card.extraPeople}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>

              </div>

              {/* =========================================================
                  RIGHT COLUMN WIDGETS (SECTIONS 7, 11, 12)
              ========================================================== */}
              <div className="dashboard-right-col">
                
                {/* 7. TODAY NOTE */}
                {!noteDismissed && (
                  <div className="widget-card note-card-widget">
                    <div className="note-card-header">
                      <h3 className="widget-title">Today note</h3>
                      <button 
                        type="button" 
                        className="blue-floating-btn" 
                        title="Edit Today Note"
                        onClick={() => {
                          setNoteInputText(todayNoteText);
                          setNoteEditModal(true);
                        }}
                      >
                        <Edit3 size={15} />
                      </button>
                    </div>

                    <p className="note-body-text" onClick={() => setNoteDetailsModal(true)} style={{ cursor: 'pointer' }}>
                      {todayNoteText}
                    </p>

                    <div className="note-footer-actions">
                      <div className="note-timestamp">
                        <Bell size={13} className="note-bell" />
                        <span>20min ago</span>
                      </div>

                      <div className="note-buttons-row">
                        <button 
                          type="button" 
                          className="going-pill-btn active"
                          onClick={() => setNoteDetailsModal(true)}
                        >
                          <Eye size={13} />
                          <span>View Details</span>
                        </button>
                        <button 
                          type="button" 
                          className="note-tiny-btn" 
                          title="Dismiss note"
                          onClick={() => {
                            setNoteDismissed(true);
                            showToast('Note dismissed');
                          }}
                        >
                          <X size={14} />
                        </button>
                        <button 
                          type="button" 
                          className="note-tiny-btn" 
                          title="Expand note"
                          onClick={() => setNoteExpandModal(true)}
                        >
                          <ExternalLink size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 11. MY FILES */}
                <div className="widget-card my-files-widget">
                  <div className="widget-header-row">
                    <h3 className="widget-title">My files</h3>
                    <button 
                      type="button" 
                      className="action-circle-btn" 
                      title="Manage files"
                      onClick={() => setFileVaultModal(true)}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>

                  {/* 3D Folder Stack Graphic */}
                  <div 
                    className="folder-illustration-container" 
                    onClick={() => setFileVaultModal(true)}
                    title="Open Document Vault"
                  >
                    <div className="folder-stack-graphic">
                      <div className="folder-back-layer" />
                      <div className="folder-front-layer">
                        <div className="folder-inner-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="6" fill="#0284c7" />
                            <path d="M8 7H13C15.5 7 17.5 9 17.5 12C17.5 15 15.5 17 13 17H8V7Z" fill="white"/>
                          </svg>
                        </div>
                        <div className="folder-line-placeholder" />
                      </div>
                    </div>
                  </div>

                  {/* Mini File List: Bank Statement, Transaction Report, KYC, etc. */}
                  <div className="widget-files-mini-list">
                    {documentsList.slice(0, 4).map(file => (
                      <div 
                        key={file.id} 
                        className="widget-file-mini-row"
                        onClick={() => showToast(`Opening: ${file.name} 📄`)}
                      >
                        <span className="widget-file-title">{file.name}</span>
                        <span className={`widget-file-badge badge-${file.format}`}>{file.type}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom: "More than 20 files" + "View all" button */}
                  <div className="formats-bottom-section">
                    <span className="formats-label">More than 20 files</span>
                    <div className="formats-action-row">
                      <div className="format-icons-strip">
                        <div className="format-icon-box doc-pdf" title="PDF" onClick={() => setFileVaultModal(true)}><span>P</span></div>
                        <div className="format-icon-box doc-word" title="XLSX" onClick={() => setFileVaultModal(true)}><span>X</span></div>
                        <div className="format-icon-box doc-figma" title="DOC" onClick={() => setFileVaultModal(true)}><span>D</span></div>
                        <div className="format-icon-box doc-notion" title="CSV" onClick={() => setFileVaultModal(true)}><span>C</span></div>
                        <div className="format-icon-box doc-miro" title="JSON" onClick={() => setFileVaultModal(true)}><span>J</span></div>
                      </div>

                      {/* Hidden File Input */}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleFileUpload}
                      />

                      <button 
                        type="button" 
                        className="view-all-files-btn" 
                        onClick={() => setFileVaultModal(true)}
                        title="View all documents"
                      >
                        View all
                      </button>
                    </div>
                  </div>
                </div>

                {/* 12. ACTIVITY */}
                <div className="widget-card activity-widget">
                  <div className="widget-header-row">
                    <h3 className="widget-title">Activity</h3>
                    <div className="activity-header-actions">
                      <button 
                        type="button" 
                        className="get-report-btn"
                        onClick={() => setActiveNav('reports')}
                        title="Get Sahayata Growth Report"
                      >
                        Get report
                      </button>
                      <button 
                        type="button" 
                        className="activity-icon-btn" 
                        title="View Full Analytics"
                        onClick={() => setActiveNav('reports')}
                      >
                        <BarChart2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Subtext: Total Workers Growth, 12,845, ↑ 8.5% vs last month */}
                  <div className="activity-metric-box">
                    <div className="activity-metric-label">Total Workers Growth</div>
                    <div className="activity-metric-val-row">
                      <span className="activity-big-number">12,845</span>
                      <span className="activity-trend-badge">↑ 8.5% vs last month</span>
                    </div>
                  </div>

                  {/* Interactive Spline Chart with Months: Jan, Feb, Mar, Apr, May, Jun, Jul */}
                  <div className="activity-chart-wrapper">
                    <svg className="activity-spline-svg" viewBox="0 0 320 120" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0284c7" stopOpacity="0.28" />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.01" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path
                        d="M 15 90 C 40 85, 90 70, 115 65 C 140 60, 160 42, 165 40 C 190 48, 200 60, 215 55 C 240 45, 255 30, 265 28 C 290 22, 305 18, 310 18 L 310 120 L 15 120 Z"
                        fill="url(#activityGradient)"
                      />

                      {/* Spline Stroke */}
                      <path
                        d="M 15 90 C 40 85, 90 70, 115 65 C 140 60, 160 42, 165 40 C 190 48, 200 60, 215 55 C 240 45, 255 30, 265 28 C 290 22, 305 18, 310 18"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Interactive Month Points */}
                      {chartPoints.map((pt) => (
                        <circle 
                          key={pt.month}
                          cx={pt.cx} 
                          cy={pt.cy} 
                          r={activeChartPoint.month === pt.month ? 5.5 : 3.5} 
                          fill="#0284c7" 
                          stroke="#FFFFFF" 
                          strokeWidth={2}
                          className="chart-point-target"
                          onMouseEnter={() => setActiveChartPoint(pt)}
                          onClick={() => {
                            setActiveChartPoint(pt);
                            showToast(`${pt.month} Growth: ${pt.val} workers (${pt.percent}%)`);
                          }}
                        />
                      ))}
                    </svg>

                    {/* Tooltip Badge */}
                    <div 
                      className="chart-tooltip-badge" 
                      style={{ 
                        left: `${(activeChartPoint.cx / 320) * 100}%`, 
                        top: `${(activeChartPoint.cy / 120) * 70}%` 
                      }}
                    >
                      <span>{activeChartPoint.percent}%</span>
                      <div className="tooltip-triangle" />
                    </div>

                    {/* Month Buttons on X-axis: Jan, Feb, Mar, Apr, May, Jun, Jul */}
                    <div className="chart-months-axis">
                      {chartPoints.map(pt => (
                        <button 
                          key={pt.month}
                          type="button"
                          className={`chart-month-btn ${activeChartPoint.month === pt.month ? 'active' : ''}`}
                          onClick={() => setActiveChartPoint(pt)}
                        >
                          {pt.month}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
            )
          ) : activeNav === 'workers' ? (
            /* =====================================================
                WORKERS SUBMODULE
            ===================================================== */
            <div className="submodule-container">
              <ErrorBoundary>
                <DataTable searchQuery={searchQuery} />
              </ErrorBoundary>
            </div>
          ) : activeNav === 'schemes' ? (
            /* =====================================================
                SCHEMES SUBMODULE
            ===================================================== */
            <div className="submodule-container">
              <ErrorBoundary>
                <BankUnderwritingQueue searchQuery={searchQuery} />
              </ErrorBoundary>
            </div>
          ) : activeNav === 'reports' ? (
            /* =====================================================
                REPORTS SUBMODULE
            ===================================================== */
            <div className="submodule-container">
              <ErrorBoundary>
                <SahayataImpactReport />
              </ErrorBoundary>
            </div>
          ) : activeNav === 'map' ? (
            /* =====================================================
                MAP SUBMODULE
            ===================================================== */
            <div className="submodule-container">
              <ErrorBoundary>
                <GoogleMapAnalytics />
              </ErrorBoundary>
            </div>
          ) : activeNav === 'sync' ? (
            /* =====================================================
                REALTIME SYNC SUBMODULE
            ===================================================== */
            <div className="submodule-container">
              <ErrorBoundary>
                <RealTimeFeed />
              </ErrorBoundary>
            </div>
          ) : (
            /* =====================================================
                SETTINGS FALLBACK
            ===================================================== */
            <div className="submodule-container">
              <div className="empty-submodule-card">
                <h2>{activeNav.toUpperCase()} Console</h2>
                <p>Manage your Sahayata Fintech underwriting rules, API gateways and security credentials.</p>
                <button type="button" className="new-task-btn" onClick={() => setActiveNav('overview')}>
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* =========================================================
          INTERACTIVE MODALS & DIALOGS
      ========================================================== */}

      {/* 1. ADD RECORD MODAL */}
      {addRecordModal && (
        <div className="modal-overlay" onClick={() => setAddRecordModal(false)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Record</h3>
              <button type="button" className="close-btn" onClick={() => setAddRecordModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddRecord}>
              <div className="form-group">
                <label>Record Title</label>
                <input name="title" type="text" placeholder="e.g. New Workers Added" required defaultValue="New Workers Added" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="desc" rows="3" placeholder="Enter details..." required defaultValue="32 new workers registered across 4 sectors today." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Scheduled Slot / Time</label>
                  <input name="time" type="text" defaultValue="10:00 AM - 10:30 AM" />
                </div>
                <div className="form-group">
                  <label>Sector</label>
                  <select name="sector" defaultValue="Workers">
                    <option value="Workers">Workers</option>
                    <option value="Credit">Credit</option>
                    <option value="Schemes">Schemes</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setAddRecordModal(false)}>Cancel</button>
                <button type="submit" className="new-task-btn">Add Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT CARD MODAL */}
      {activeEditModal && (
        <div className="modal-overlay" onClick={() => setActiveEditModal(null)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Details</h3>
              <button type="button" className="close-btn" onClick={() => setActiveEditModal(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const updatedTitle = fd.get('title');
              const updatedDesc = fd.get('desc');
              const updatedTime = fd.get('time');

              setDashboardCards(prev => prev.map(c => c.id === activeEditModal.id ? { ...c, title: updatedTitle, desc: updatedDesc, time: updatedTime } : c));
              setActiveEditModal(null);
              showToast('Updated successfully! ✅');
            }}>
              <div className="form-group">
                <label>Title</label>
                <input name="title" type="text" defaultValue={activeEditModal.title} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="desc" rows="3" defaultValue={activeEditModal.desc} required />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input name="time" type="text" defaultValue={activeEditModal.time} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setActiveEditModal(null)}>Cancel</button>
                <button type="submit" className="new-task-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. DOCUMENT VAULT (MY FILES) MODAL */}
      {fileVaultModal && (
        <div className="modal-overlay" onClick={() => setFileVaultModal(false)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>My files ({documentsList.length})</h3>
              <button type="button" className="close-btn" onClick={() => setFileVaultModal(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 1rem 0' }}>
              Bank Statements, Transaction Reports, Worker KYC, Scheme Guidelines and Credit Reports.
            </p>

            <div className="files-list-grid">
              {documentsList.map(doc => (
                <div key={doc.id} className="file-row-item">
                  <div className="file-info-col">
                    <FileText size={18} color="#0284c7" />
                    <div>
                      <div className="file-name">{doc.name}</div>
                      <div className="file-size">{doc.size} • {doc.type}</div>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="file-download-btn"
                    onClick={() => showToast(`Downloading: ${doc.name} 📥`)}
                  >
                    <Download size={13} /> Download
                  </button>
                </div>
              ))}
            </div>

            <div className="modal-actions" style={{ marginTop: '1.25rem' }}>
              <button 
                type="button" 
                className="add-file-btn" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus size={14} /> Upload File
              </button>
              <button type="button" className="new-task-btn" onClick={() => setFileVaultModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. EDIT TODAY NOTE MODAL */}
      {noteEditModal && (
        <div className="modal-overlay" onClick={() => setNoteEditModal(false)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Today Note</h3>
              <button type="button" className="close-btn" onClick={() => setNoteEditModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveNote}>
              <div className="form-group">
                <label>Note Content</label>
                <textarea 
                  rows="4" 
                  value={noteInputText} 
                  onChange={(e) => setNoteInputText(e.target.value)} 
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setNoteEditModal(false)}>Cancel</button>
                <button type="submit" className="new-task-btn">Save Note</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. VIEW NOTE DETAILS MODAL */}
      {noteDetailsModal && (
        <div className="modal-overlay" onClick={() => setNoteDetailsModal(false)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Pending Credit Verification Details</h3>
              <button type="button" className="close-btn" onClick={() => setNoteDetailsModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0369a1' }}>12 Construction Worker Applications</h4>
              <p style={{ fontSize: '0.9rem', color: '#0F172A', lineHeight: 1.5, margin: 0 }}>
                {todayNoteText}
              </p>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Awaiting income assessment &amp; Aadhaar verification from Delhi NCR nodal officer.
            </p>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={() => {
                  setNoteDetailsModal(false);
                  setActiveNav('underwriting');
                }}
              >
                Go to Underwriting Queue
              </button>
              <button type="button" className="new-task-btn" onClick={() => setNoteDetailsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. EXPAND NOTE MODAL */}
      {noteExpandModal && (
        <div className="modal-overlay" onClick={() => setNoteExpandModal(false)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Today note</h3>
              <button type="button" className="close-btn" onClick={() => setNoteExpandModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '1rem', color: '#0F172A', lineHeight: 1.6, margin: 0 }}>
                {todayNoteText}
              </p>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} /> Logged 20min ago by Automated Underwriting Engine
            </div>
            <div className="modal-actions">
              <button type="button" className="new-task-btn" onClick={() => setNoteExpandModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. CUSTOM FILTER MODAL */}
      {customFilterModal && (
        <div className="modal-overlay" onClick={() => setCustomFilterModal(false)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Filter Dashboard Records</h3>
              <button type="button" className="close-btn" onClick={() => setCustomFilterModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="form-group">
              <label>Timeframe Status</label>
              <select value={filterAll} onChange={(e) => setFilterAll(e.target.value)}>
                <option value="All">All Timeframes</option>
                <option value="Today">Today Only</option>
                <option value="Completed">Completed / Archived Only</option>
              </select>
            </div>
            <div className="form-group">
              <label>Worker Sector</label>
              <select value={filterWorkers} onChange={(e) => setFilterWorkers(e.target.value)}>
                <option value="Workers">All Workers</option>
                <option value="Delivery Partners">Delivery Partners</option>
                <option value="Street Vendors">Street Vendors</option>
                <option value="Domestic Workers">Domestic Workers</option>
                <option value="Construction Workers">Construction Workers</option>
              </select>
            </div>
            <div className="form-group">
              <label>Credit Type</label>
              <select value={filterCredit} onChange={(e) => setFilterCredit(e.target.value)}>
                <option value="Credit">All Credit</option>
                <option value="Disbursed">Disbursed</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Underwriting">Underwriting</option>
              </select>
            </div>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => {
                  setFilterAll('All');
                  setFilterWorkers('Workers');
                  setFilterCredit('Credit');
                  setFilterActive('Active');
                  setCustomFilterModal(false);
                  showToast('Filters reset to default');
                }}
              >
                Reset All
              </button>
              <button 
                type="button" 
                className="new-task-btn" 
                onClick={() => {
                  setCustomFilterModal(false);
                  showToast('Filters applied');
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="interactive-toast">
          <CheckCircle2 size={18} className="toast-success-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}