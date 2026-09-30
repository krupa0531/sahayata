import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Activity, ShieldCheck, Users, TrendingUp, Navigation, RefreshCw, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const LIVE_CITY_HUBS = [
  { id: 'mumbai', city: 'Mumbai Hub', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, workers: '4.5M', active: 90, loans: '₹45 Cr', color: '#0284c7' },
  { id: 'delhi', city: 'Delhi NCR Hub', state: 'Delhi', lat: 28.6139, lng: 77.2090, workers: '3.8M', active: 85, loans: '₹38 Cr', color: '#38bdf8' },
  { id: 'bengaluru', city: 'Bengaluru Hub', state: 'Karnataka', lat: 12.9716, lng: 77.5946, workers: '3.2M', active: 82, loans: '₹31 Cr', color: '#0284c7' },
  { id: 'ahmedabad', city: 'Ahmedabad Hub', state: 'Gujarat', lat: 23.0225, lng: 72.5714, workers: '2.8M', active: 78, loans: '₹26 Cr', color: '#7DA8FF' },
  { id: 'pune', city: 'Pune Regional', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, workers: '2.1M', active: 75, loans: '₹19 Cr', color: '#0284c7' },
  { id: 'hyderabad', city: 'Hyderabad Hub', state: 'Telangana', lat: 17.3850, lng: 78.4867, workers: '2.4M', active: 72, loans: '₹22 Cr', color: '#0284c7' },
  { id: 'chennai', city: 'Chennai Hub', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, workers: '2.2M', active: 70, loans: '₹20 Cr', color: '#38bdf8' },
  { id: 'kolkata', city: 'Kolkata Hub', state: 'West Bengal', lat: 22.5726, lng: 88.3639, workers: '1.9M', active: 65, loans: '₹16 Cr', color: '#7DA8FF' },
  { id: 'jaipur', city: 'Jaipur Hub', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, workers: '1.5M', active: 60, loans: '₹12 Cr', color: '#38bdf8' },
  { id: 'lucknow', city: 'Lucknow Hub', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, workers: '1.8M', active: 62, loans: '₹15 Cr', color: '#7DA8FF' },
];

export default function IndiaMapAnalytics() {
  const [selectedHub, setSelectedHub] = useState(LIVE_CITY_HUBS[0]);
  const [livePings, setLivePings] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  // Simulate real-time pings across India map
  useEffect(() => {
    const interval = setInterval(() => {
      const randomHub = LIVE_CITY_HUBS[Math.floor(Math.random() * LIVE_CITY_HUBS.length)];
      const newPing = {
        id: Date.now(),
        city: randomHub.city,
        type: Math.random() > 0.5 ? 'Loan Request' : 'New Registration',
        amount: `₹${(Math.floor(Math.random() * 15) + 5) * 1000}`,
        time: new Date().toLocaleTimeString()
      };
      setLivePings(prev => [newPing, ...prev.slice(0, 4)]);
      setLastUpdate(new Date().toLocaleTimeString());
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="analytics-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div className="chart-header" style={{ marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={22} color="#38bdf8" />
            <h3 className="chart-title" style={{ fontSize: '1.4rem', margin: 0 }}>
              Live Real-Time India GIS Map
            </h3>
            <span style={{
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Activity size={12} /> OPENSTREETMAP LIVE TILE ENGINE
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
            Interactive pan-India geospatial tracking with live worker pings & regional credit velocity
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#7DA8FF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RefreshCw size={12} className="spin" /> Updated: {lastUpdate}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        {/* LEAFLET REAL-TIME MAP */}
        <div style={{ gridColumn: 'span 8', height: '480px', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(199, 221, 255, 0.2)', position: 'relative' }}>
          <MapContainer 
            center={[22.5937, 78.9629]} 
            zoom={5} 
            scrollWheelZoom={true} 
            style={{ width: '100%', height: '100%', background: '#0F172A' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {LIVE_CITY_HUBS.map((hub) => (
              <CircleMarker
                key={hub.id}
                center={[hub.lat, hub.lng]}
                radius={selectedHub.id === hub.id ? 14 : 9}
                pathOptions={{
                  color: hub.color,
                  fillColor: hub.color,
                  fillOpacity: 0.7,
                  weight: selectedHub.id === hub.id ? 3 : 1
                }}
                eventHandlers={{
                  click: () => setSelectedHub(hub)
                }}
              >
                <Tooltip permanent direction="top" offset={[0, -10]} opacity={0.9} className="custom-leaflet-tooltip">
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{hub.city}: {hub.workers}</span>
                </Tooltip>
                <Popup>
                  <div style={{ color: '#0F172A', padding: '4px' }}>
                    <strong style={{ fontSize: '1rem', display: 'block' }}>{hub.city} ({hub.state})</strong>
                    <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                      <div><b>Workers:</b> {hub.workers}</div>
                      <div><b>Active Rate:</b> {hub.active}%</div>
                      <div><b>Disbursed Loans:</b> {hub.loans}</div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* SIDE PANELS FOR MAP STATS & LIVE STREAM */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Selected City Hub Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(125, 168, 255, 0.25)',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7DA8FF', textTransform: 'uppercase' }}>SELECTED REGIONAL HUB</span>
              <Navigation size={14} color="#38bdf8" />
            </div>
            <h4 style={{ margin: 0, fontSize: '1.3rem', color: '#EAF2FF' }}>{selectedHub.city}</h4>
            <span style={{ fontSize: '0.85rem', color: '#C7DDFF' }}>{selectedHub.state}</span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{ background: 'rgba(2, 132, 199, 0.12)', padding: '0.75rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: '#7DA8FF', display: 'block' }}>WORKER COUNT</span>
                <strong style={{ fontSize: '1.1rem', color: '#EAF2FF' }}>{selectedHub.workers}</strong>
              </div>
              <div style={{ background: 'rgba(56, 189, 248, 0.12)', padding: '0.75rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: '#38bdf8', display: 'block' }}>ACTIVE RATE</span>
                <strong style={{ fontSize: '1.1rem', color: '#EAF2FF' }}>{selectedHub.active}%</strong>
              </div>
            </div>
          </div>

          {/* Real-time Incoming Map Activity Stream */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(199, 221, 255, 0.15)',
            borderRadius: '12px',
            padding: '1.25rem',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
              <span className="pulse" />
              <strong style={{ fontSize: '0.85rem', color: '#EAF2FF' }}>REAL-TIME GIS STREAM</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1, overflowY: 'auto' }}>
              {livePings.map((ping) => (
                <motion.div
                  key={ping.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    background: 'rgba(2, 132, 199, 0.1)',
                    borderLeft: '3px solid #38bdf8',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#EAF2FF', fontWeight: 600 }}>
                    <span>{ping.city}</span>
                    <span style={{ color: '#7DA8FF', fontSize: '0.72rem' }}>{ping.time}</span>
                  </div>
                  <div style={{ color: '#C7DDFF', fontSize: '0.75rem', marginTop: '2px' }}>
                    {ping.type} • <strong style={{ color: '#38bdf8' }}>{ping.amount}</strong>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
