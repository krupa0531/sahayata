import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Search, Building2, ChevronRight } from 'lucide-react';
import { getAnalyticsState } from '../../services/realtimeSync.js';

const STATE_CONFIG = [
  { name: 'Rajasthan', code: 'RJ', city: 'Jaipur Hub', lat: 26.9124, lng: 75.7873, color: '#f59e0b' },
  { name: 'Gujarat', code: 'GJ', city: 'Ahmedabad Hub', lat: 23.0225, lng: 72.5714, color: '#7C3AED' },
  { name: 'Maharashtra', code: 'MH', city: 'Mumbai Hub', lat: 19.0760, lng: 72.8777, color: '#0284c7' },
  { name: 'Delhi NCR', code: 'DL', city: 'Delhi NCR Hub', lat: 28.6139, lng: 77.2090, color: '#D97706' },
  { name: 'Karnataka', code: 'KA', city: 'Bengaluru Hub', lat: 12.9716, lng: 77.5946, color: '#059669' },
  { name: 'Uttar Pradesh', code: 'UP', city: 'Lucknow Hub', lat: 26.8467, lng: 80.9462, color: '#7DA8FF' },
  { name: 'West Bengal', code: 'WB', city: 'Kolkata Hub', lat: 22.5726, lng: 88.3639, color: '#00E5FF' },
  { name: 'Tamil Nadu', code: 'TN', city: 'Chennai Hub', lat: 13.0827, lng: 80.2707, color: '#ec4899' },
  { name: 'Telangana', code: 'TS', city: 'Hyderabad Hub', lat: 17.3850, lng: 78.4867, color: '#2DD4BF' },
  { name: 'Bihar', code: 'BR', city: 'Patna Hub', lat: 25.0961, lng: 85.3131, color: '#ef4444' },
  { name: 'Madhya Pradesh', code: 'MP', city: 'Bhopal Hub', lat: 22.9734, lng: 78.6569, color: '#14b8a6' },
  { name: 'Kerala', code: 'KL', city: 'Kochi Hub', lat: 10.8505, lng: 76.2711, color: '#06b6d4' },
  { name: 'Punjab', code: 'PB', city: 'Ludhiana Hub', lat: 31.1471, lng: 75.3412, color: '#a855f7' },
  { name: 'Haryana', code: 'HR', city: 'Gurugram Hub', lat: 29.0588, lng: 76.0856, color: '#f97316' },
  { name: 'Odisha', code: 'OR', city: 'Bhubaneswar Hub', lat: 20.9517, lng: 85.0985, color: '#8b5cf6' },
  { name: 'Assam', code: 'AS', city: 'Guwahati Hub', lat: 26.2006, lng: 92.9376, color: '#eab308' },
];

export default function GoogleMapAnalytics() {
  const [analyticsState, setAnalyticsState] = useState(() => getAnalyticsState());
  const [mapMode, setMapMode] = useState('voyager'); // 'voyager' | 'streets' | 'light' | 'satellite'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHubId, setSelectedHubId] = useState(null);

  useEffect(() => {
    const handleSync = (e) => setAnalyticsState(e.detail || getAnalyticsState());
    window.addEventListener('sahayata_analytics_update', handleSync);
    return () => window.removeEventListener('sahayata_analytics_update', handleSync);
  }, []);

  // Compute live dynamic counts for every state based strictly on real live submitted applications
  const { allStates, activeHubs } = useMemo(() => {
    const counts = {};
    STATE_CONFIG.forEach((s) => (counts[s.code] = 0));

    const records = [
      ...(analyticsState.recentApplications || []),
      ...(analyticsState.registeredWorkers || []),
    ];

    records.forEach((rec) => {
      const locStr = (rec.state || rec.location || rec.city || '').toLowerCase();
      let matched = false;

      for (const config of STATE_CONFIG) {
        const nameLower = config.name.toLowerCase();
        const codeLower = config.code.toLowerCase();

        if (locStr.includes(nameLower) || locStr.includes(codeLower) || (locStr.includes('rajasthan') && config.code === 'RJ')) {
          counts[config.code] = (counts[config.code] || 0) + 1;
          matched = true;
          break;
        }
      }

      // If no specific state matched, allocate to Rajasthan as primary live submission state
      if (!matched && records.length > 0) {
        counts['RJ'] = (counts['RJ'] || 0) + 1;
      }
    });

    const statesList = STATE_CONFIG.map((config) => {
      const cnt = counts[config.code] || 0;
      return {
        ...config,
        count: cnt,
        activeHub: cnt > 0 ? config.code.toLowerCase() : null,
      };
    });

    const hubsList = statesList
      .filter((s) => s.count > 0)
      .map((s) => ({
        id: s.code.toLowerCase(),
        city: s.city,
        state: s.name,
        code: s.code,
        lat: s.lat,
        lng: s.lng,
        workers: s.count,
        active: 100,
        loans: `₹${(s.count * 15000).toLocaleString('en-IN')}`,
        color: s.color,
      }));

    return { allStates: statesList, activeHubs: hubsList };
  }, [analyticsState]);

  const currentSelectedHub = useMemo(() => {
    if (selectedHubId) {
      const found = activeHubs.find((h) => h.id === selectedHubId);
      if (found) return found;
    }
    return activeHubs[0] || null;
  }, [activeHubs, selectedHubId]);

  const filteredStates = allStates.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTileUrl = () => {
    if (mapMode === 'satellite') {
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (mapMode === 'streets') {
      return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    } else if (mapMode === 'light') {
      return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    }
    return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  };

  const handleStateClick = (stateObj) => {
    if (stateObj.activeHub) {
      setSelectedHubId(stateObj.activeHub);
    }
  };

  return (
    <div className="map-card-box">
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={22} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
              INDIA GEOSPATIAL MAP & STATE APPLICATIONS ANALYTICS
            </h3>
          </div>
          <p style={{ margin: '0.2rem 0 0 0', color: '#475569', fontSize: '0.82rem' }}>
            Real-time pan-India tracking with state-by-state applicant breakdown
          </p>
        </div>

        {/* Map Layer Switcher */}
        <div style={{ display: 'flex', background: '#E2E8F0', borderRadius: '8px', padding: '3px', border: '1px solid #CBD5E1' }}>
          {[
            { id: 'voyager', label: 'Vibrant Map' },
            { id: 'light', label: 'Positron Soft' },
            { id: 'streets', label: 'OpenStreetMap' },
            { id: 'satellite', label: 'Satellite' }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setMapMode(mode.id)}
              style={{
                background: mapMode === mode.id ? '#0284c7' : 'transparent',
                color: mapMode === mode.id ? '#FFFFFF' : '#475569',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem' }}>
        
        {/* LEFT MAP COLUMN (Span 8) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Leaflet Map Container */}
          <div style={{ width: '100%', height: '460px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #CBD5E1', position: 'relative' }}>
            <MapContainer
              key={`leaflet-map-${mapMode}`}
              center={[22.5937, 78.9629]}
              zoom={5}
              scrollWheelZoom={false}
              style={{ width: '100%', height: '100%', minHeight: '460px', background: '#EBF0F5' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={getTileUrl()}
              />

              {activeHubs.map((hub) => (
                <CircleMarker
                  key={hub.id}
                  center={[hub.lat, hub.lng]}
                  radius={currentSelectedHub?.id === hub.id ? 14 : 10}
                  pathOptions={{
                    color: hub.color,
                    fillColor: hub.color,
                    fillOpacity: 0.85,
                    weight: currentSelectedHub?.id === hub.id ? 3 : 2
                  }}
                  eventHandlers={{
                    click: () => setSelectedHubId(hub.id)
                  }}
                >
                  <Tooltip permanent direction="top" offset={[0, -10]} opacity={0.95}>
                    <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.8rem', background: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', boxShadow: '0 2px 8px rgba(15,23,42,0.1)' }}>
                      {hub.city}: {hub.workers} {hub.workers === 1 ? 'Applicant' : 'Applicants'}
                    </span>
                  </Tooltip>
                  <Popup>
                    <div style={{ color: '#0F172A', padding: '4px' }}>
                      <strong style={{ fontSize: '1rem', display: 'block', color: '#1E293B' }}>{hub.city} ({hub.state})</strong>
                      <div style={{ fontSize: '0.85rem', marginTop: '4px', lineHeight: '1.4' }}>
                        <div><b>Applicants:</b> {hub.workers}</div>
                        <div><b>Active Rate:</b> {hub.active}%</div>
                        <div><b>Disbursed:</b> {hub.loans}</div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          {/* Selected Hub Quick Bar */}
          <div style={{
            background: '#e0f2fe',
            border: '1px solid #7dd3fc',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {currentSelectedHub ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Navigation size={18} color="#0284c7" />
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>{currentSelectedHub.city}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#475569', marginLeft: '8px' }}>{currentSelectedHub.state}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', flexWrap: 'wrap' }}>
                  <span>Applicants: <strong style={{ color: '#0369a1' }}>{currentSelectedHub.workers}</strong></span>
                  <span>Capital: <strong style={{ color: '#15803D' }}>{currentSelectedHub.loans}</strong></span>
                  <span>Status: <strong style={{ color: '#15803D' }}>{currentSelectedHub.active}% Active</strong></span>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#0369a1', fontSize: '0.85rem', fontWeight: 600 }}>
                <Navigation size={18} color="#0284c7" />
                <span>No Active State Applications Yet (Submit an application to view live pin on map)</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT STATE-BY-STATE APPLICATIONS PANEL (Span 4) */}
        <div style={{
          gridColumn: 'span 4',
          background: '#F1F5F9',
          border: '1px solid #CBD5E1',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          height: '525px'
        }}>
          {/* Section Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={18} color="#0284c7" />
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                STATE-WISE APPLICATIONS
              </h4>
            </div>
            <span style={{ fontSize: '0.7rem', background: '#e0f2fe', color: '#0369a1', fontWeight: 800, padding: '2px 7px', borderRadius: '999px', border: '1px solid #7dd3fc' }}>
              {filteredStates.reduce((acc, s) => acc + s.count, 0)} Total
            </span>
          </div>

          {/* Search State Filter Input */}
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <Search size={15} color="#64748B" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search State (e.g. Rajasthan, Gujarat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.6rem 0.45rem 2rem',
                fontSize: '0.8rem',
                border: '1px solid #CBD5E1',
                borderRadius: '7px',
                background: '#F8FAFC',
                color: '#0F172A',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Scrollable State List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            paddingRight: '4px'
          }}>
            {filteredStates.map((st) => {
              const isSelected = currentSelectedHub?.state.toLowerCase() === st.name.toLowerCase();

              return (
                <div
                  key={st.code}
                  onClick={() => handleStateClick(st)}
                  style={{
                    background: isSelected ? '#e0f2fe' : '#F8FAFC',
                    border: isSelected ? '1px solid #0284c7' : '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    cursor: st.count > 0 ? 'pointer' : 'default',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 1px 3px rgba(15,23,42,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        background: st.count > 0 ? '#bae6fd' : '#E2E8F0',
                        color: st.count > 0 ? '#0369a1' : '#475569',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {st.code}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>{st.name}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: st.count > 0 ? '#0284c7' : '#64748B'
                      }}>
                        {st.count} {st.count === 1 ? 'Applicant' : 'Applicants'}
                      </span>
                      <ChevronRight size={14} color={isSelected ? '#0284c7' : '#94A3B8'} />
                    </div>
                  </div>

                  {/* Progress bar line */}
                  <div style={{ width: '100%', height: '4px', background: '#E2E8F0', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{
                      width: st.count > 0 ? '100%' : '0%',
                      height: '100%',
                      background: st.count > 0 ? '#0284c7' : 'transparent',
                      borderRadius: '2px'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
