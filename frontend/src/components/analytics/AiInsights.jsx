import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AiInsights() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI generation delay
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="analytics-card" style={{ marginBottom: '2rem' }}>
      <div className="chart-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrainCircuit color="#8b5cf6" size={24} />
          <h3 className="chart-title">AI Executive Summary</h3>
        </div>
        <span style={{ fontSize: '0.75rem', background: '#f3f4f6', color: '#374151', padding: '4px 8px', borderRadius: '12px', fontWeight: 600 }}>
          Powered by Gemini
        </span>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ height: '12px', background: 'var(--bg-hover)', borderRadius: '4px', width: '90%', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ height: '12px', background: 'var(--bg-hover)', borderRadius: '4px', width: '75%', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ height: '12px', background: 'var(--bg-hover)', borderRadius: '4px', width: '85%', animation: 'pulse 1.5s infinite' }}></div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}
        >
          <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '1.25rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <TrendingUp size={18} color="#38bdf8" />
              <strong style={{ color: '#075985' }}>Key Growth Drivers</strong>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              This month, total platform registrations increased by <strong>18%</strong>, primarily driven by a surge in delivery partners in Maharashtra and Gujarat. Female worker participation saw a positive uptick of 9%, strongly correlated with targeted NGO campaigns.
            </p>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.25rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <Sparkles size={18} color="#f59e0b" />
              <strong style={{ color: '#b45309' }}>Financial Health</strong>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Loan approval rates improved by <strong>12%</strong> utilizing the new UPI-based alternative credit scoring models. The default risk ratio remains extremely low at 1.4% for micro-sachet loans under ₹5,000.
            </p>
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1.25rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <AlertTriangle size={18} color="#ef4444" />
              <strong style={{ color: '#991b1b' }}>AI Recommendation</strong>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Construction labourers in tier-3 cities show high registration but low scheme application rates. <strong>Recommendation:</strong> Increase localized awareness campaigns and deploy field agents in rural districts of Uttar Pradesh and Bihar.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
