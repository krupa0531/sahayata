import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const workerData = [
  { category: 'Gig Workers', total: 850, growth: 12, avgIncome: 18000 },
  { category: 'Delivery Partners', total: 1200, growth: 18, avgIncome: 22000 },
  { category: 'Construction', total: 2100, growth: 5, avgIncome: 15000 },
  { category: 'Farm Workers', total: 3200, growth: 2, avgIncome: 11000 },
  { category: 'Street Vendors', total: 1500, growth: 8, avgIncome: 14000 },
  { category: 'Domestic Workers', total: 950, growth: 6, avgIncome: 12000 },
];

export default function WorkerAnalytics() {
  return (
    <div className="analytics-card" style={{ marginBottom: '2rem' }}>
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Worker Category Deep-Dive</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Income vs Registration Volume</p>
        </div>
      </div>
      
      <div className="chart-container" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={workerData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="category" stroke="#6b7280" />
            <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" />
            <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
            <Tooltip 
              contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="total" name="Total (in 1000s)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="avgIncome" name="Avg Monthly Income (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
