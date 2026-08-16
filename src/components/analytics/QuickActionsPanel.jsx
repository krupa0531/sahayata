import React, { useState } from 'react';
import { Zap, Radio, Download, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickActionsPanel() {
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <>
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed',
              bottom: '90px',
              right: '24px',
              background: 'rgba(5, 8, 22, 0.95)',
              border: '1px solid #00E5FF',
              color: '#00E5FF',
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 700,
              boxShadow: '0 0 25px rgba(0, 229, 255, 0.4)',
              backdropFilter: 'blur(16px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <AlertCircle size={18} color="#00E5FF" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Bar */}
      <div className="floating-quick-actions">
        <button
          className="quick-action-btn"
          onClick={() => triggerToast('Executing AI Quantum Risk Audit across 12.4M records...')}
        >
          <Zap size={14} /> AI Audit
        </button>

        <button
          className="quick-action-btn"
          onClick={() => triggerToast('Emergency Relief Broadcast sent to 4.8M active workers.')}
        >
          <Radio size={14} /> Broadcast Alert
        </button>

        <button
          className="quick-action-btn"
          onClick={() => triggerToast('Exporting Signed PDF Ledger Metadata...')}
        >
          <Download size={14} /> Export Ledger
        </button>

        <button
          className="quick-action-btn"
          onClick={() => triggerToast('Auto-Approved 142 Pending Underwriting Applications.')}
        >
          <ShieldCheck size={14} /> Batch Approve
        </button>
      </div>
    </>
  );
}
