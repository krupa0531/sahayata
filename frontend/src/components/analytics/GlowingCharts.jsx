import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon } from 'lucide-react';

const monthlyGrowth = [
  { month: 'Jan', workers: 1, credit: 0, schemes: 0 },
  { month: 'Feb', workers: 1, credit: 0, schemes: 0 },
  { month: 'Mar', workers: 2, credit: 0, schemes: 0 },
  { month: 'Apr', workers: 2, credit: 0, schemes: 0 },
  { month: 'May', workers: 3, credit: 0, schemes: 0 },
  { month: 'Jun', workers: 4, credit: 0, schemes: 0 },
  { month: 'Jul', workers: 4, credit: 0, schemes: 0 },
];

const categoryDist = [
  {
    name: 'Delivery Partners (1)',
    value: 25,
    color: '#0284c7',
  },
  {
    name: 'Street Vendors (1)',
    value: 25,
    color: '#0D9488',
  },
  {
    name: 'Construction Wage (1)',
    value: 25,
    color: '#4F46E5',
  },
  {
    name: 'Domestic Workers (1)',
    value: 25,
    color: '#059669',
  },
];

const CustomChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.10)',
      }}
    >
      <p
        style={{
          margin: '0 0 6px',
          fontWeight: 800,
          color: '#0284c7',
          fontSize: '0.85rem',
        }}
      >
        {label}
      </p>

      {payload.map((entry, index) => (
        <p
          key={index}
          style={{
            margin: '4px 0',
            color: '#475569',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          {entry.name}:{' '}
          <span
            style={{
              color: '#0F172A',
              fontWeight: 800,
            }}
          >
            {entry.name === 'Credit Disbursed'
              ? `₹${Number(entry.value).toLocaleString()}`
              : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
};

export default function GlowingCharts() {
  return (
    <div className="glowing-charts-layout">

      {/* ================= CREDIT / WORKER GROWTH ================= */}
      <div className="command-glass-card glowing-growth-card">

        <div className="glowing-chart-header">

          <div className="glowing-chart-title-area">

            <div className="glowing-chart-title-row">
              <TrendingUp size={19} color="#0284c7" />

              <h3>
                CREDIT DISBURSEMENT & BENEFICIARY
                <br />
                GROWTH VELOCITY
              </h3>
            </div>

            <p>
              7-Month cumulative credit underwriting momentum and
              onboarding trajectory
            </p>

          </div>

          <div className="glowing-chart-legend">

            <span className="legend-credit">
              <span className="legend-dot" />
              Credit Disbursed
            </span>

            <span className="legend-workers">
              <span className="legend-dot" />
              Active Workers
            </span>

          </div>

        </div>

        <div className="growth-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyGrowth}
              margin={{
                top: 12,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>

                <linearGradient
                  id="colorCredit"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#0284c7"
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="95%"
                    stopColor="#0284c7"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="colorWorkers"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#059669"
                    stopOpacity={0.20}
                  />
                  <stop
                    offset="95%"
                    stopColor="#059669"
                    stopOpacity={0}
                  />
                </linearGradient>

              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={{
                  stroke: '#E2E8F0',
                }}
              />

              <YAxis
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={{
                  stroke: '#E2E8F0',
                }}
                tickFormatter={(value) => `₹${value}`}
              />

              <RechartsTooltip
                content={<CustomChartTooltip />}
              />

              <Area
                type="monotone"
                dataKey="credit"
                name="Credit Disbursed"
                stroke="#0284c7"
                strokeWidth={3}
                fill="url(#colorCredit)"
                fillOpacity={1}
              />

              <Area
                type="monotone"
                dataKey="workers"
                name="Active Workers"
                stroke="#059669"
                strokeWidth={2.5}
                fill="url(#colorWorkers)"
                fillOpacity={1}
              />

            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ================= WORKER SECTOR ================= */}
      <div className="command-glass-card glowing-sector-card">

        <div className="sector-header">

          <div className="sector-title-row">
            <PieIcon size={20} color="#0284c7" />

            <h3>
              WORKER SECTOR
              <br />
              DISTRIBUTION
            </h3>
          </div>

          <p>
            Percentage breakdown of onboarded informal labour categories
          </p>

        </div>

        <div className="sector-pie-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={categoryDist}
                cx="50%"
                cy="50%"
                innerRadius="52%"
                outerRadius="78%"
                paddingAngle={4}
                dataKey="value"
              >
                {categoryDist.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>

              <RechartsTooltip />

            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="sector-legend">

          {categoryDist.map((item) => (
            <div
              key={item.name}
              className="sector-legend-row"
            >
              <span className="sector-name">
                <span
                  className="sector-dot"
                  style={{
                    background: item.color,
                  }}
                />

                {item.name}
              </span>

              <strong>
                {item.value}%
              </strong>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}