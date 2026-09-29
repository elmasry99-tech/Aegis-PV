'use client';

import { Fragment } from 'react';
import { CloudSun, Cpu, Radio, ShieldCheck, Workflow } from 'lucide-react';
import { GlassCard } from '@/features/dashboard/components/GlassCard';
import type { DashboardView } from '@/features/dashboard/types';
import { cn } from '@/shared/utils/cn';
import styles from '@/app/dashboard/dashboard.module.css';

/** The report's four-stage pipeline, labelled with what actually ran. */
export function PipelinePanel({ view }: { view: DashboardView }) {
  const live = view.mode === 'live';
  const steps = [
    { icon: <Radio size={18} />, label: 'Ingest', sub: live ? 'Open-Meteo' : 'Inverter', warn: view.stale },
    { icon: <CloudSun size={18} />, label: 'Twin', sub: 'Baseline', warn: false },
    { icon: <Cpu size={18} />, label: 'Diagnose', sub: view.source === 'rules' ? 'Rules' : live ? 'Claude' : 'Model', warn: view.source === 'rules' },
    { icon: <ShieldCheck size={18} />, label: 'Action', sub: `${view.diagnosis.confidence}%`, warn: false },
  ];

  return (
    <GlassCard delay={0.2} aria-label="Processing pipeline">
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <Workflow size={18} /> AI Processing Pipeline
        </div>
      </div>
      <div className={styles.pipeline}>
        {steps.map((s, i) => (
          <Fragment key={s.label}>
            {i > 0 && <div className={styles.pipeLine} aria-hidden />}
            <div className={cn(styles.pipeStep, s.warn && styles.warn)}>
              <span className={styles.pipeIcon}>{s.icon}</span>
              <span className={styles.pipeLabel}>{s.label}</span>
              <span className={styles.pipeSub}>{s.sub}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </GlassCard>
  );
}
