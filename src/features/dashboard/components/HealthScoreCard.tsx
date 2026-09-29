'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { DashboardView } from '@/features/dashboard/types';
import { CountUp } from './CountUp';
import { GlassCard } from './GlassCard';
import styles from '@/app/dashboard/dashboard.module.css';

const R = 70;
const C = 2 * Math.PI * R;

function tone(score: number) {
  if (score >= 85) return { color: 'var(--color-brand-emerald)', label: 'Healthy' };
  if (score >= 60) return { color: 'var(--color-brand-yellow)', label: 'Needs attention' };
  return { color: 'var(--color-brand-red)', label: 'Critical' };
}

/** Report: "A 0 to 100 score based on current performance, open faults, and data quality." */
export function HealthScoreCard({ view }: { view: DashboardView }) {
  const score = view.diagnosis.healthScore;
  const { color, label } = tone(score);
  const reduce = useReducedMotion();

  return (
    <GlassCard className={styles.health} aria-label="System health score">
      <div className={styles.ringWrap}>
        <svg width="168" height="168" viewBox="0 0 168 168" role="img" aria-label={`Health score ${score} of 100`}>
          <circle cx="84" cy="84" r={R} fill="none" stroke="var(--color-border)" strokeWidth="12" />
          <motion.circle
            cx="84"
            cy="84"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={C}
            transform="rotate(-90 84 84)"
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C - (score / 100) * C }}
            transition={{ duration: reduce ? 0 : 1.1, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className={styles.ringCenter}>
          <span className={styles.ringValue} style={{ color }}>
            <CountUp value={score} />
          </span>
          <span className={styles.ringLabel}>Health</span>
        </div>
      </div>
      <p className={styles.healthCaption}>
        <strong style={{ color }}>{label}</strong> · {view.diagnosis.confidence}% confidence
      </p>
    </GlassCard>
  );
}
