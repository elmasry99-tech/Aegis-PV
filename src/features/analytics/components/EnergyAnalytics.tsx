'use client';

import { useReducedMotion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { GlassCard } from '@/features/dashboard/components/GlassCard';
import type { DashboardView } from '@/features/dashboard/types';
import styles from '@/app/dashboard/dashboard.module.css';

const STATUS_COLOR = {
  healthy: 'var(--color-brand-emerald)',
  warning: 'var(--color-brand-yellow)',
  critical: 'var(--color-brand-red)',
} as const;

interface TooltipEntry { dataKey?: string | number; name?: string; value?: number | string; color?: string }

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const expected = Number(payload.find((p) => p.dataKey === 'expected')?.value ?? 0);
  const actual = Number(payload.find((p) => p.dataKey === 'actual')?.value ?? 0);
  const gap = expected > 0 ? ((expected - actual) / expected) * 100 : 0;
  return (
    <div className="glass" style={{ padding: '0.6rem 0.8rem', borderRadius: 12, fontSize: 13 }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ color: 'var(--color-text-secondary)' }}>Expected {expected.toFixed(2)} kW</div>
      <div>Actual {actual.toFixed(2)} kW</div>
      {expected > 0 && <div style={{ color: 'var(--color-text-muted)' }}>Gap {gap.toFixed(1)}%</div>}
    </div>
  );
}

/** Report: "Gap analysis graph — expected and actual power on the same time line." */
export function EnergyAnalytics({ view }: { view: DashboardView }) {
  const animated = !useReducedMotion();
  const actualColor = STATUS_COLOR[view.diagnosis.status];
  const gradientId = `expected-${view.key}`;

  return (
    <GlassCard delay={0.1} aria-label="Expected versus actual output">
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <Activity size={18} /> Gap Analysis · Today
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}><span className={`${styles.legendSwatch} ${styles.legendDashed}`} /> Expected (twin)</span>
          <span className={styles.legendItem}><span className={styles.legendSwatch} style={{ background: actualColor }} /> Actual</span>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={view.chart} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand-cyan)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--color-brand-cyan)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} minTickGap={16} />
            <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} unit=" kW" width={64} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--color-border-hover)' }} />
            <Area type="monotone" dataKey="expected" name="Expected" stroke="var(--color-text-muted)" strokeDasharray="5 5" strokeWidth={1.5} fill={`url(#${gradientId})`} isAnimationActive={animated} animationDuration={800} />
            <Line type="monotone" dataKey="actual" name="Actual" stroke={actualColor} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} isAnimationActive={animated} animationDuration={900} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.gapStrip}>
        <span>Energy today <strong>{view.metrics.energyTodayKwh.toFixed(1)} kWh</strong></span>
        <span>Expected <strong>{view.metrics.expectedEnergyTodayKwh.toFixed(1)} kWh</strong></span>
        <span>Gap <strong>{view.metrics.gapPct.toFixed(1)}%</strong></span>
      </div>
    </GlassCard>
  );
}
