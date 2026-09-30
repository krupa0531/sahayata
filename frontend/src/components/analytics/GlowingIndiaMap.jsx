import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Activity, Navigation, Radio } from 'lucide-react';

const STATE_HUBS = [
  { id: 'mh', name: 'Maharashtra (Mumbai-Pune)', workers: '4.85M', loans: '₹142.5 Cr', active: 94, x: 28, y: 58, color: '#00E5FF' },
  { id: 'dl', name: 'Delhi NCR Region', workers: '3.92M', loans: '₹118.2 Cr', active: 91, x: 38, y: 32, color: '#2DD4BF' },
  { id: 'ka', name: 'Karnataka (Bengaluru)', workers: '3.45M', loans: '₹95.8 Cr', active: 89, x: 34, y: 75, color: '#38BDF8' },
  { id: 'gj', name: 'Gujarat (Ahmedabad)', workers: '2.95M', loans: '₹84.1 Cr', active: 88, x: 20, y: 46, color: '#00E5FF' },
  { id: 'tg', name: 'Telangana (Hyderabad)', workers: '2.60M', loans: '₹72.4 Cr', active: 86, x: 42, y: 64, color: '#2DD4BF' },
  { id: 'tn', name: 'Tamil Nadu (Chennai)', workers: '2.40M', loans: '₹68.0 Cr', active: 84, x: 40, y: 84, color: '#38BDF8' },
  { id: 'wb', name: 'West Bengal (Kolkata)', workers: '2.15M', loans: '₹58.6 Cr', active: 82, x: 68, y: 48, color: '#00E5FF' },
  { id: 'up', name: 'Uttar Pradesh (Lucknow)', workers: '3.80M', loans: '₹104.2 Cr', active: 87, x: 50, y: 36, color: '#2DD4BF' },
  { id: 'rj', name: 'Rajasthan (Jaipur)', workers: '1.95M', loans: '₹49.5 Cr', active: 80, x: 29, y: 38, color: '#38BDF8' },
];

const CONNECTION_ARCS = [
  { from: 'mh', to: 'dl' },
  { from: 'mh', to: 'ka' },
  { from: 'dl', to: 'up' },
  { from: 'ka', to: 'tg' },
  { from: 'tg', to: 'tn' },
  { from: 'wb', to: 'up' },
  { from: 'gj', to: 'mh' },
];

export default function GlowingIndiaMap() {
  const [selectedHub, setSelectedHub] = useState(STATE_HUBS[0]);
  const [liveStream, setLiveStream] = useState([]);
  const [hoveredState, setHoveredState] = useState(null);

  // Live transaction stream generator
  useEffect(() => {
    const interval = setInterval(() => {
      const randomHub = STATE_HUBS[Math.floor(Math.random() * STATE_HUBS.length)];
      const types = ['Micro Credit Disbursed', 'Worker Verification OK', 'PM-SYM Application', 'AI Voice Query Processed'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const amount = Math.floor(Math.random() * 20 + 5) * 1000;

      const newPing = {
        id: Date.now(),
        hub: randomHub.name,
        type: randomType,
        val: `₹${amount.toLocaleString()}`,
        time: new Date().toLocaleTimeString()
      };

      setLiveStream((prev) => [newPing, ...prev.slice(0, 3)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="command-glass-card" style={{ padding: '1.35rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#00E5FF" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC' }}>
              INDIA GEOSPATIAL COMMAND MATRIX
            </h3>
            <span style={{
              background: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid var(--border-cyan-subtle)',
              color: '#00E5FF',
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '0.7rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Radio size={12} /> CYBER GIS
            </span>
          </div>
          <p style={{ margin: '0.2rem 0 0 0', color: '#94A3B8', fontSize: '0.82rem' }}>
            Pan-India neural network tracking real-time beneficiary pings, credit flows, and state node telemetry
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#2DD4BF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={14} /> Grid Operational
          </span>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem' }}>
        {/* SVG Interactive Map */}
        <div style={{ gridColumn: 'span 8' }} className="india-gis-container">
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="cyanArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* India Boundary Path */}
            <path
              d="M 32 10 L 45 12 L 52 18 L 54 28 L 64 30 L 78 36 L 82 44 L 75 52 L 62 55 L 56 65 L 44 86 L 36 94 L 32 82 L 28 66 L 16 50 L 18 36 L 26 25 Z"
              fill="rgba(0, 229, 255, 0.03)"
              stroke="#00E5FF"
              strokeWidth="0.8"
              strokeDasharray="2 1"
            />

            {/* Grid Overlay Lines */}
            <line x1="20" y1="40" x2="70" y2="40" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.3" />
            <line x1="25" y1="60" x2="65" y2="60" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.3" />

            {/* Connection Arcs */}
            {CONNECTION_ARCS.map((arc, i) => {
              const fromHub = STATE_HUBS.find(h => h.id === arc.from);
              const toHub = STATE_HUBS.find(h => h.id === arc.to);
              if (!fromHub || !toHub) return null;
              
              const midX = (fromHub.x + toHub.x) / 2;
              const midY = (fromHub.y + toHub.y) / 2 - 6;

              return (
                <g key={i}>
                  <path
                    d={`M ${fromHub.x} ${fromHub.y} Q ${midX} ${midY} ${toHub.x} ${toHub.y}`}
                    fill="none"
                    stroke="url(#cyanArcGrad)"
                    strokeWidth="0.6"
                    strokeDasharray="2 2"
                  />
                  <circle r="0.8" fill="#00E5FF">
                    <animateMotion
                      path={`M ${fromHub.x} ${fromHub.y} Q ${midX} ${midY} ${toHub.x} ${toHub.y}`}
                      dur={`${3 + i * 0.5}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}

            {/* Hub Nodes */}
            {STATE_HUBS.map((hub) => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <g
                  key={hub.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedHub(hub)}
                  onMouseEnter={() => setHoveredState(hub.id)}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isSelected ? 4 : 2.5}
                    fill={isSelected ? '#FFFFFF' : hub.color}
                    stroke="#00E5FF"
                    strokeWidth="0.6"
                  />
                  <text
                    x={hub.x}
                    y={hub.y - 3.5}
                    fontSize="2.2"
                    fontWeight="700"
                    fill={isSelected ? '#00E5FF' : '#CBD5E1'}
                    textAnchor="middle"
                  >
                    {hub.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {hoveredState && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: 'rgba(6, 9, 19, 0.95)',
              border: '1px solid #00E5FF',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.72rem',
              color: '#F8FAFC'
            }}>
              Node: <strong>{STATE_HUBS.find(h => h.id === hoveredState)?.name}</strong>
            </div>
          )}
        </div>

        {/* Right Info Box */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{
            background: 'rgba(0, 229, 255, 0.04)',
            border: '1px solid var(--border-cyan-subtle)',
            borderRadius: '10px',
            padding: '1rem'
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#2DD4BF', letterSpacing: '0.06em' }}>
              SELECTED REGIONAL NODE
            </span>

            <h4 style={{ margin: '0.2rem 0 0.5rem 0', fontSize: '1.05rem', color: '#F8FAFC', fontWeight: 800 }}>
              {selectedHub.name}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div style={{ background: 'rgba(0, 229, 255, 0.06)', padding: '0.55rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.65rem', color: '#94A3B8', display: 'block' }}>BENEFICIARIES</span>
                <strong style={{ fontSize: '1rem', color: '#00E5FF' }}>{selectedHub.workers}</strong>
              </div>
              <div style={{ background: 'rgba(45, 212, 191, 0.06)', padding: '0.55rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.65rem', color: '#94A3B8', display: 'block' }}>DISBURSED CREDIT</span>
                <strong style={{ fontSize: '1rem', color: '#2DD4BF' }}>{selectedHub.loans}</strong>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '1rem',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <strong style={{ fontSize: '0.78rem', color: '#F8FAFC', marginBottom: '0.5rem' }}>
              LIVE GIS STREAM
            </strong>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
              {liveStream.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(0, 229, 255, 0.05)',
                    borderLeft: '3px solid #00E5FF',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#F8FAFC', fontWeight: 600 }}>
                    <span>{item.hub.split(' ')[0]}</span>
                    <span style={{ color: '#2DD4BF', fontSize: '0.68rem' }}>{item.time}</span>
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '0.72rem', marginTop: '2px' }}>
                    {item.type} • <strong style={{ color: '#00E5FF' }}>{item.val}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
