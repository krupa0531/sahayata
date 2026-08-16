import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Search, Building2, ChevronRight } from 'lucide-react';

const LIVE_CITY_HUBS = [
  { id: 'mumbai', city: 'Mumbai Hub', state: 'Maharashtra', code: 'MH', lat: 19.0760, lng: 72.8777, workers: 1, active: 100, loans: '₹0', color: '#0284c7' },
  { id: 'delhi', city: 'Delhi NCR Hub', state: 'Delhi', code: 'DL', lat: 28.6139, lng: 77.2090, workers: 1, active: 100, loans: '₹0', color: '#D97706' },
  { id: 'bengaluru', city: 'Bengaluru Hub', state: 'Karnataka', code: 'KA', lat: 12.9716, lng: 77.5946, workers: 1, active: 100, loans: '₹0', color: '#059669' },
  { id: 'ahmedabad', city: 'Ahmedabad Hub', state: 'Gujarat', code: 'GJ', lat: 23.0225, lng: 72.5714, workers: 1, active: 100, loans: '₹0', color: '#7C3AED' },
];

const ALL_INDIAN_STATES = [
  { name: 'Maharashtra', code: 'MH', count: 1, activeHub: 'mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Gujarat', code: 'GJ', count: 1, activeHub: 'ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Delhi NCR', code: 'DL', count: 1, activeHub: 'delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Karnataka', code: 'KA', count: 1, activeHub: 'bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Rajasthan', code: 'RJ', count: 0, activeHub: null, lat: 27.0238, lng: 74.2179 },
  { name: 'Uttar Pradesh', code: 'UP', count: 0, activeHub: null, lat: 26.8467, lng: 80.9462 },
  { name: 'West Bengal', code: 'WB', count: 0, activeHub: null, lat: 22.5726, lng: 88.3639 },
  { name: 'Tamil Nadu', code: 'TN', count: 0, activeHub: null, lat: 13.0827, lng: 80.2707 },
  { name: 'Telangana', code: 'TS', count: 0, activeHub: null, lat: 17.3850, lng: 78.4867 },
  { name: 'Bihar', code: 'BR', count: 0, activeHub: null, lat: 25.0961, lng: 85.3131 },
  { name: 'Madhya Pradesh', code: 'MP', count: 0, activeHub: null, lat: 22.9734, lng: 78.6569 },
  { name: 'Kerala', code: 'KL', count: 0, activeHub: null, lat: 10.8505, lng: 76.2711 },
  { name: 'Punjab', code: 'PB', count: 0, activeHub: null, lat: 31.1471, lng: 75.3412 },
  { name: 'Haryana', code: 'HR', count: 0, activeHub: null, lat: 29.0588, lng: 76.0856 },
  { name: 'Odisha', code: 'OR', count: 0, activeHub: null, lat: 20.9517, lng: 85.0985 },
  { name: 'Assam', code: 'AS', count: 0, activeHub: null, lat: 26.2006, lng: 92.9376 },
];

export default function GoogleMapAnalytics() {
  const [selectedHub, setSelectedHub] = useState(LIVE_CITY_HUBS[0]);
  const [mapMode, setMapMode] = useState('voyager'); // 'voyager' | 'streets' | 'light' | 'satellite'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStates = ALL_INDIAN_STATES.filter(s => 
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
      const hub = LIVE_CITY_HUBS.find(h => h.id === stateObj.activeHub);
      if (hub) setSelectedHub(hub);
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

              {LIVE_CITY_HUBS.map((hub) => (
                <CircleMarker
                  key={hub.id}
                  center={[hub.lat, hub.lng]}
                  radius={selectedHub.id === hub.id ? 14 : 9}
                  pathOptions={{
                    color: hub.color,
                    fillColor: hub.color,
                    fillOpacity: 0.85,
                    weight: selectedHub.id === hub.id ? 3 : 2
                  }}
                  eventHandlers={{
                    click: () => setSelectedHub(hub)
                  }}
                >
                  <Tooltip permanent direction="top" offset={[0, -10]} opacity={0.95}>
                    <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.8rem', background: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', boxShadow: '0 2px 8px rgba(15,23,42,0.1)' }}>
                      {hub.city}: {hub.workers} Applicant
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Navigation size={18} color="#0284c7" />
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>{selectedHub.city}</strong>
                <span style={{ fontSize: '0.78rem', color: '#475569', marginLeft: '8px' }}>{selectedHub.state}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', flexWrap: 'wrap' }}>
              <span>Applicants: <strong style={{ color: '#0369a1' }}>{selectedHub.workers}</strong></span>
              <span>Capital: <strong style={{ color: '#15803D' }}>{selectedHub.loans}</strong></span>
              <span>Status: <strong style={{ color: '#15803D' }}>{selectedHub.active}% Active</strong></span>
            </div>
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
              placeholder="Search State (e.g. Gujarat, MH)..."
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
              const isSelected = selectedHub.state.toLowerCase() === st.name.toLowerCase() || (st.name === 'Delhi NCR' && selectedHub.state === 'Delhi');

              return (
                <div
                  key={st.code}
                  onClick={() => handleStateClick(st)}
                  style={{
                    background: isSelected ? '#e0f2fe' : '#F8FAFC',
                    border: isSelected ? '1px solid #0284c7' : '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    cursor: 'pointer',
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
                      width: st.count > 0 ? '25%' : '0%',
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
