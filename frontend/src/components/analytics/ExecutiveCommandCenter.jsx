import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Users, 
  MapPin, 
  HandCoins, 
  HeartHandshake, 
  Cpu, 
  AlertTriangle, 
  Terminal, 
  Activity, 
  Clock, 
  Globe,
  Star,
  CheckCircle2,
  ArrowUpRight,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AiEarthGlobe from './AiEarthGlobe';
import GlowingKpiCards from './GlowingKpiCards';
import GlowingCharts from './GlowingCharts';

export default function ExecutiveCommandCenter({ searchQuery = '' }) {
  const [judgeMode, setJudgeMode] = useState(false);
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const aiObservations = [
    { priority: 'HIGH', title: 'Gig Delivery Partner Surge', detail: 'Onboardings in Maharashtra & Delhi NCR expanded by +22.4% following UPI cashflow velocity scoring.', confidence: '98.4%', rec: 'Expand sachet loan ceiling from ₹15,000 to ₹30,000.' },
    { priority: 'HIGH', title: 'Female Worker Inclusion Surge', detail: 'Domestic worker drives in UP and Rajasthan boosted female participation by +18.4%.', confidence: '96.2%', rec: 'Launch dedicated women artisan micro-grants.' },
    { priority: 'MEDIUM', title: 'PM SVANidhi Scheme Demand', detail: 'Street vendors utilizing QR merchant settlements showed 31.2% higher scheme approval.', confidence: '94.8%', rec: 'Deploy QR merchant assistance booths in tier-2 hubs.' },
    { priority: 'NORMAL', title: 'Multi-lingual Voice Adoption', detail: 'Hindi (58%), Marathi (22%), and Gujarati (14%) represent top AI voice query languages.', confidence: '99.1%', rec: 'Add regional voice dialects for Kannada & Tamil.' }
  ];

  const impactScores = [
    { label: 'Financial Inclusion Score', score: 99.2, trend: '+4.2% MoM' },
    { label: 'Employment Support Score', score: 96.8, trend: '+5.1% MoM' },
    { label: 'Government Scheme Reach', score: 98.4, trend: '+3.8% MoM' },
    { label: 'Worker Welfare Score', score: 97.5, trend: '+2.9% MoM' },
    { label: 'Digital Literacy Score', score: 95.2, trend: '+6.4% MoM' },
    { label: 'Overall Social Impact', score: 98.6, trend: '+4.8% MoM' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. WELCOME HEADER BAR WITH ROTATING 3D GLOBE */}
      <div className="command-glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(8, 18, 35, 0.95), rgba(5, 8, 22, 0.98))', border: '1px solid #00E5FF', boxShadow: '0 0 30px rgba(0, 229, 255, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Header Title & Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '64px', height: '64px' }}>
              <AiEarthGlobe />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={22} color="#00E5FF" style={{ filter: 'drop-shadow(0 0 8px #00E5FF)' }} />
                <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                  SAHAYATA NATIONAL COMMAND CENTER
                </h1>
              </div>
              <p style={{ margin: '0.2rem 0 0 0', color: '#2DD4BF', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                REAL-TIME AI MISSION CONTROL & FINANCIAL INCLUSION TELEMETRY
              </p>
            </div>
          </div>

          {/* Real-Time Telemetry & Status Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(0, 229, 255, 0.08)', padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(0, 229, 255, 0.2)', fontSize: '0.78rem' }}>
              <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.68rem', fontWeight: 700 }}>SYSTEM STATUS</span>
              <strong style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> ALL SYSTEMS OPERATIONAL
              </strong>
            </div>

            <div style={{ background: 'rgba(0, 229, 255, 0.08)', padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(0, 229, 255, 0.2)', fontSize: '0.78rem' }}>
              <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.68rem', fontWeight: 700 }}>LIVE TIME</span>
              <strong style={{ color: '#00E5FF' }}>{liveTime} IST</strong>
            </div>

            {/* Hackathon Judge Presentation Mode Toggle Button */}
            <button
              onClick={() => setJudgeMode(!judgeMode)}
              style={{
                background: judgeMode ? '#00E5FF' : 'rgba(255, 255, 255, 0.06)',
                color: judgeMode ? '#060913' : '#F8FAFC',
                border: judgeMode ? '1px solid #00E5FF' : '1px solid var(--border-subtle)',
                padding: '0.6rem 1.1rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: judgeMode ? '0 0 20px rgba(0, 229, 255, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Award size={16} />
              <span>{judgeMode ? 'JUDGE PRESENTATION MODE (ACTIVE)' : 'TOGGLE HACKATHON JUDGE MODE'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. LIVE NATIONAL SUMMARY KPI CARDS GRID */}
      <GlowingKpiCards />

      {/* 4. AI INSIGHT ENGINE SECTION */}
      <div className="command-glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={22} color="#00E5FF" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF' }}>
              NATIONAL AI INSIGHT & OBSERVATION ENGINE
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#2DD4BF', fontWeight: 800 }}>
            4 HIGH-CONFIDENCE OBSERVATIONS GENERATED
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
          {aiObservations.map((obs, idx) => (
            <div key={idx} style={{ background: 'rgba(0, 229, 255, 0.04)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(0, 229, 255, 0.18)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  color: obs.priority === 'HIGH' ? '#EF4444' : obs.priority === 'MEDIUM' ? '#F59E0B' : '#00E5FF',
                  background: obs.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 229, 255, 0.12)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 229, 255, 0.2)'
                }}>
                  {obs.priority} PRIORITY
                </span>
                <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 800 }}>
                  Confidence: {obs.confidence}
                </span>
              </div>
              <strong style={{ fontSize: '0.95rem', color: '#FFFFFF', display: 'block', marginBottom: '4px' }}>{obs.title}</strong>
              <p style={{ fontSize: '0.8rem', color: '#CBD5E1', margin: 0, lineHeight: 1.4 }}>{obs.detail}</p>
              <div style={{ fontSize: '0.75rem', color: '#2DD4BF', marginTop: '6px', fontWeight: 700 }}>
                Recommendation: {obs.rec}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. SOCIAL IMPACT SCORECARD & PREDICTIVE AI GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem' }}>
        
        {/* Social Impact Score Matrix (Span 8) */}
        <div className="command-glass-card" style={{ gridColumn: 'span 8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
            <Award size={20} color="#00E5FF" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>
              SAHAYATA SOCIAL IMPACT SCORECARD (98.6 / 100)
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
            {impactScores.map((score, i) => (
              <div key={i} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block' }}>{score.label}</span>
                <strong style={{ fontSize: '1.4rem', color: '#00E5FF', display: 'block', margin: '3px 0' }}>{score.score}</strong>
                <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800 }}>{score.trend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive AI Forecasting (Span 4) */}
        <div className="command-glass-card" style={{ gridColumn: 'span 4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
            <Sparkles size={20} color="#2DD4BF" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>
              PREDICTIVE AI FORECAST
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem' }}>
            <div style={{ background: 'rgba(0, 229, 255, 0.05)', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid rgba(0, 229, 255, 0.15)' }}>
              <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.7rem' }}>EXPECTED WORKER GROWTH (NEXT 30D)</span>
              <strong style={{ color: '#00E5FF', fontSize: '0.95rem' }}>+24.5% (+2.8M Workers)</strong>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
              <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.7rem' }}>EXPECTED CREDIT DEMAND</span>
              <strong style={{ color: '#10B981', fontSize: '0.95rem' }}>₹650.0 Crore</strong>
            </div>

            <div style={{ background: 'rgba(0, 229, 255, 0.05)', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid rgba(0, 229, 255, 0.15)' }}>
              <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.7rem' }}>EXPECTED JOB PLACEMENTS</span>
              <strong style={{ color: '#2DD4BF', fontSize: '0.95rem' }}>150,000 Placements</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 6. CREDIT VELOCITY & GROWTH CHARTS */}
      <GlowingCharts />

    </div>
  );
}
