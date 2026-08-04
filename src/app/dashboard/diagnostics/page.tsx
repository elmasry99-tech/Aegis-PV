'use client';

import { motion } from 'framer-motion';
import {
  TrendingDown,
  Cloud,
  Clock,
  CloudRain,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
} from 'recharts';
import { useScenarioContext } from '@/shared/contexts/ScenarioContext';
import { SCENARIO_LABELS, CHART_TIME_LABELS, CHART_EXPECTED_DATA, CHART_ACTUAL_DATA, COLORS } from '@/lib/constants';
import { CLIMATE_DATA } from '@/lib/mock-data/climate';
import { FAULT_HISTORY } from '@/lib/mock-data/history';
import type { FaultHistoryEntry } from '@/shared/types';

const CARD_STYLE: React.CSSProperties = {
  background: '#f4f4f5',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: 16,
  padding: '1.5rem',
};

function sectionAnim(delayIndex: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay: delayIndex * 0.1 },
  };
}

interface TooltipPayloadEntry {
  dataKey?: string | number;
  name?: string;
  value?: number | string;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function OutputTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#f4f4f5',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
      }}
    >
      <p style={{ color: '#18181b', fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((e) => (
        <p key={String(e.dataKey)} style={{ color: e.color, margin: '2px 0' }}>
          {e.name}: {e.value} kW
        </p>
      ))}
    </div>
  );
}

function ClimateTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#f4f4f5',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
      }}
    >
      <p style={{ color: '#18181b', fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((e) => (
        <p key={String(e.dataKey)} style={{ color: e.color, margin: '2px 0' }}>
          {e.name}: {e.value}
        </p>
      ))}
    </div>
  );
}

const FAULT_ICONS: Record<string, React.ReactNode> = {
  CloudRain: <CloudRain size={16} />,
  CheckCircle2: <CheckCircle2 size={16} />,
  AlertTriangle: <AlertTriangle size={16} />,
  Zap: <Zap size={16} />,
};

const SEVERITY_CONFIG = {
  success: {
    dot: '#10b981',
    dotGlow: '0 0 8px rgba(16,185,129,0.8)',
    border: 'rgba(16,185,129,0.3)',
    icon: '#10b981',
    iconBg: 'rgba(16,185,129,0.1)',
    chip: { background: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'Resolved' },
  },
  warning: {
    dot: '#eab308',
    dotGlow: '0 0 8px rgba(234,179,8,0.8)',
    border: 'rgba(234,179,8,0.3)',
    icon: '#eab308',
    iconBg: 'rgba(234,179,8,0.1)',
    chip: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Active' },
  },
  critical: {
    dot: '#ef4444',
    dotGlow: '0 0 8px rgba(239,68,68,0.8)',
    border: 'rgba(239,68,68,0.3)',
    icon: '#ef4444',
    iconBg: 'rgba(239,68,68,0.1)',
    chip: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Active' },
  },
};

function TimelineEntry({ entry, index }: { entry: FaultHistoryEntry; index: number }) {
  const cfg = SEVERITY_CONFIG[entry.severity];
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.12, ease: 'easeOut' }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        paddingBottom: 20,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: cfg.dot,
            boxShadow: cfg.dotGlow,
            marginTop: 4,
            flexShrink: 0,
          }}
        />
        {index < FAULT_HISTORY.length - 1 && (
          <div
            style={{
              width: 1,
              flex: 1,
              minHeight: 32,
              background: 'rgba(0,0,0,0.08)',
              marginTop: 4,
            }}
          />
        )}
      </div>

      <div
        style={{
          flex: 1,
          background: 'rgba(0,0,0,0.03)',
          border: `1px solid ${cfg.border}`,
          borderRadius: 10,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            background: cfg.iconBg,
            color: cfg.icon,
            borderRadius: 8,
            padding: 8,
            display: 'flex',
            flexShrink: 0,
          }}
        >
          {FAULT_ICONS[entry.icon] ?? <AlertTriangle size={16} />}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#18181b', fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{entry.title}</p>
          <p style={{ color: '#71717a', fontSize: '0.8rem' }}>{entry.description}</p>
        </div>
        <span
          style={{
            background: cfg.chip.background,
            color: cfg.chip.color,
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 999,
            flexShrink: 0,
          }}
        >
          {cfg.chip.label}
        </span>
      </div>
    </motion.div>
  );
}

export default function DiagnosticsPage() {
  const { scenario } = useScenarioContext();

  const actualColor = scenario === 'healthy' ? COLORS.emerald : COLORS.red;

  const outputData = CHART_TIME_LABELS.map((time, i) => ({
    time,
    expected: CHART_EXPECTED_DATA[i],
    actual: (CHART_ACTUAL_DATA[scenario] ?? CHART_EXPECTED_DATA)[i],
  }));

  const hasLoss = scenario !== 'healthy';
  const lossStart = hasLoss
    ? scenario === 'hardware'
      ? '12:00'
      : scenario === 'shading'
      ? '10:00'
      : '06:00'
    : null;
  const lossEnd = hasLoss ? '18:00' : null;

  const scenarioLabel = SCENARIO_LABELS[scenario] ?? scenario;

  const scenarioBadgeColor =
    scenario === 'healthy'
      ? { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.25)' }
      : scenario === 'hardware'
      ? { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.25)' }
      : { bg: 'rgba(234,179,8,0.1)', color: '#eab308', border: 'rgba(234,179,8,0.25)' };

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: 1100,
        margin: '0 auto',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#18181b',
              marginBottom: '0.4rem',
              letterSpacing: '-0.03em',
            }}
          >
            Diagnostics
          </h1>
          <p style={{ color: '#52525b', fontSize: '1rem' }}>
            AI-powered fault detection &amp; classification
          </p>
        </div>
        <span
          style={{
            background: scenarioBadgeColor.bg,
            color: scenarioBadgeColor.color,
            border: `1px solid ${scenarioBadgeColor.border}`,
            borderRadius: 999,
            fontSize: '0.8rem',
            fontWeight: 600,
            padding: '5px 14px',
            letterSpacing: '0.02em',
          }}
        >
          {scenarioLabel}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <motion.section {...sectionAnim(0)} style={CARD_STYLE}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: '1.25rem',
              color: '#52525b',
              fontSize: '1.05rem',
              fontWeight: 600,
            }}
          >
            <TrendingDown size={18} style={{ color: actualColor }} />
            Time-Series Analysis
          </div>

          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={outputData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  unit=" kW"
                />
                <Tooltip content={<OutputTooltip />} />
                <Legend
                  wrapperStyle={{ color: '#52525b', fontSize: 12, paddingTop: 8 }}
                  iconType="plainline"
                />
                {hasLoss && lossStart && lossEnd && (
                  <ReferenceArea
                    x1={lossStart}
                    x2={lossEnd}
                    fill={actualColor}
                    fillOpacity={0.06}
                    stroke={actualColor}
                    strokeOpacity={0.15}
                    strokeDasharray="4 4"
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="expected"
                  name="Expected Output"
                  stroke="#06b6d4"
                  strokeDasharray="6 4"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive
                  animationDuration={900}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual Output"
                  stroke={actualColor}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive
                  animationDuration={900}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: '1.25rem',
            }}
          >
            {[
              { label: 'Gradual Decline → Dust', bg: 'rgba(234,179,8,0.12)', color: '#eab308', border: 'rgba(234,179,8,0.25)' },
              { label: 'Daily Dip → Shading', bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: 'rgba(59,130,246,0.25)' },
              { label: 'Sudden Drop → Equipment Fault', bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.25)' },
            ].map(({ label, bg, color, border }) => (
              <span
                key={label}
                style={{
                  background: bg,
                  color,
                  border: `1px solid ${border}`,
                  borderRadius: 999,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '4px 12px',
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </motion.section>

        <motion.section {...sectionAnim(1)} style={CARD_STYLE}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: '1.25rem',
              color: '#52525b',
              fontSize: '1.05rem',
              fontWeight: 600,
            }}
          >
            <Cloud size={18} style={{ color: '#06b6d4' }} />
            Environmental Factors
          </div>

          <div style={{ height: 250, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={CLIMATE_DATA} margin={{ top: 8, right: 20, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={3}
                />
                <YAxis
                  yAxisId="left"
                  domain={[0, 100]}
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 1000]}
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ClimateTooltip />} />
                <Legend
                  wrapperStyle={{ color: '#52525b', fontSize: 12, paddingTop: 8 }}
                  iconType="plainline"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature (°C)"
                  stroke="#ef4444"
                  strokeWidth={1.75}
                  dot={false}
                  isAnimationActive
                  animationDuration={900}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity (%)"
                  stroke="#3b82f6"
                  strokeWidth={1.75}
                  dot={false}
                  isAnimationActive
                  animationDuration={900}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="irradiance"
                  name="Irradiance (W/m²)"
                  stroke="#eab308"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive
                  animationDuration={900}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <p
            style={{
              marginTop: '1rem',
              fontSize: '0.8rem',
              color: '#71717a',
              lineHeight: 1.6,
            }}
          >
            AI model correlates environmental factors with output deviations to isolate fault causes.
          </p>
        </motion.section>

        <motion.section {...sectionAnim(2)} style={CARD_STYLE}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: '1.5rem',
              color: '#52525b',
              fontSize: '1.05rem',
              fontWeight: 600,
            }}
          >
            <Clock size={18} style={{ color: '#52525b' }} />
            Fault Event Log
          </div>

          <div style={{ position: 'relative' }}>
            {FAULT_HISTORY.map((entry, i) => (
              <TimelineEntry key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
