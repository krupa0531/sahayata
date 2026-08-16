import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';

const growthData = [
  { name: 'Jan', workers: 12000, schemes: 8000 },
  { name: 'Feb', workers: 19000, schemes: 12000 },
  { name: 'Mar', workers: 25000, schemes: 15000 },
  { name: 'Apr', workers: 32000, schemes: 22000 },
  { name: 'May', workers: 41000, schemes: 28000 },
  { name: 'Jun', workers: 45000, schemes: 32000 },
];

const categoryData = [
  { name: 'Delivery', value: 35 },
  { name: 'Construction', value: 25 },
  { name: 'Domestic', value: 20 },
  { name: 'Vendors', value: 15 },
  { name: 'Others', value: 5 },
];
const COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(0,0,0,0.8)', padding: '10px', borderRadius: '8px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color, margin: 0 }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdvancedCharts() {
  return (
    <div className="charts-grid">
      <div className="analytics-card chart-span-8">
        <div className="chart-header">
          <h3 className="chart-title">Monthly Platform Growth</h3>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWorkers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSchemes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="workers" name="New Workers" stroke="#38bdf8" fillOpacity={1} fill="url(#colorWorkers)" />
              <Area type="monotone" dataKey="schemes" name="Schemes Applied" stroke="#10b981" fillOpacity={1} fill="url(#colorSchemes)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="analytics-card chart-span-4">
        <div className="chart-header">
          <h3 className="chart-title">Worker Categories</h3>
        </div>
        <div className="chart-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
