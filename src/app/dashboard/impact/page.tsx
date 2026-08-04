'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Zap,
  DollarSign,
  Droplets,
  Leaf,
  Shield,
} from 'lucide-react';
import { useScenarioContext } from '@/shared/contexts/ScenarioContext';
import { IMPACT_METRICS, MONTHLY_ENERGY_RECOVERY } from '@/lib/mock-data';
import { SCENARIO_LABELS } from '@/lib/constants';

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap size={18} />,
  DollarSign: <DollarSign size={18} />,
  Droplets: <Droplets size={18} />,
  Leaf: <Leaf size={18} />,
  Shield: <Shield size={18} />,
};

const PROGRESS_BARS = [
  { label: 'Performance Recovery Rate', pct: 87, color: '#10b981' },
  { label: 'Cleaning Optimization', pct: 73, color: '#06b6d4' },
  { label: 'Fault Prevention Rate', pct: 94, color: '#a855f7' },
];

function ScenarioBadge({ scenario }: { scenario: string }) {
  return (
    <span
      style={{
        background: 'rgba(16,185,129,0.12)',
        border: '1px solid rgba(16,185,129,0.3)',
        color: '#10b981',
        borderRadius: 999,
        padding: '0.3rem 0.9rem',
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}
    >
      {SCENARIO_LABELS[scenario] ?? scenario}
    </span>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#f4f4f5',
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: 10,
        padding: '0.75rem 1rem',
      }}
    >
      <p style={{ color: '#52525b', fontSize: '0.8rem', marginBottom: '0.4rem' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontSize: '0.85rem', fontWeight: 600 }}>
          {p.name}: {p.value} kWh
        </p>
      ))}
    </div>
  );
}

export default function ImpactPage() {
  const { scenario } = useScenarioContext();

  return (
    <div
      style={{
        padding: '1.5rem',
        maxWidth: 1200,
        margin: '0 auto',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-outfit), sans-serif',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#18181b',
              marginBottom: '0.4rem',
            }}
          >
            Impact & Sustainability
          </h1>
          <p style={{ color: '#52525b', fontSize: '0.9rem' }}>
            AI-driven performance recovery results
          </p>
        </div>
        <ScenarioBadge scenario={scenario} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {IMPACT_METRICS.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            style={{
              background: '#f4f4f5',
              borderRadius: 16,
              padding: '1.25rem',
              borderTop: `2px solid ${metric.color}`,
              boxShadow: `0 0 20px ${metric.color}22`,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: metric.color,
                marginBottom: '0.25rem',
              }}
            >
              {ICON_MAP[metric.icon]}
              <span style={{ color: '#52525b', fontSize: '0.78rem', fontWeight: 500 }}>
                {metric.label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-outfit), sans-serif',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#18181b',
                  lineHeight: 1,
                }}
              >
                {metric.value.toLocaleString()}
              </span>
              <span style={{ color: '#71717a', fontSize: '0.85rem' }}>{metric.unit}</span>
            </div>
            <p style={{ color: '#71717a', fontSize: '0.72rem', lineHeight: 1.4 }}>
              {metric.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        style={{
          background: '#f4f4f5',
          borderRadius: 16,
          padding: '1.5rem',
          border: '1px solid rgba(0,0,0,0.08)',
          marginBottom: '2rem',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-outfit), sans-serif',
            fontSize: '1rem',
            fontWeight: 600,
            color: '#18181b',
            marginBottom: '1.25rem',
          }}
        >
          Monthly Energy Recovery (kWh)
        </h2>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={MONTHLY_ENERGY_RECOVERY}
              margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#52525b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#52525b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: '#52525b', paddingTop: 12 }}
              />
              <Bar dataKey="withAI" name="With AI" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="withoutAI" name="Without AI" fill="rgba(0,0,0,0.15)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.55 }}
        style={{
          background: '#f4f4f5',
          borderRadius: 16,
          padding: '1.5rem',
          border: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {PROGRESS_BARS.map((bar, i) => (
          <div key={bar.label}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ color: '#52525b', fontSize: '0.85rem', fontWeight: 500 }}>
                {bar.label}
              </span>
              <span style={{ color: '#18181b', fontSize: '0.85rem', fontWeight: 700 }}>
                {bar.pct}%
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: 'rgba(0,0,0,0.07)',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bar.pct}%` }}
                transition={{ duration: 0.9, delay: 0.6 + i * 0.15, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: bar.color,
                  borderRadius: 999,
                  boxShadow: `0 0 8px ${bar.color}88`,
                }}
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
