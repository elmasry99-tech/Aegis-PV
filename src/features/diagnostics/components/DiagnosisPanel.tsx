'use client';

import { Cpu, Home, Wrench, CheckCircle2, ShieldAlert } from 'lucide-react';
import { GlassCard } from '@/features/dashboard/components/GlassCard';
import type { DashboardView } from '@/features/dashboard/types';
import { cn } from '@/shared/utils/cn';
import styles from '@/app/dashboard/dashboard.module.css';

const AUDIENCE = {
  homeowner: { label: 'Safe for you to do', icon: <Home size={16} /> },
  technician: { label: 'Qualified technician only', icon: <Wrench size={16} /> },
  none: { label: 'No action needed', icon: <CheckCircle2 size={16} /> },
} as const;

const SEVERITY_LABEL = { none: 'None', low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' } as const;

/** Report: "Fault card — likely cause, confidence, affected area, first seen time, and severity." */
export function DiagnosisPanel({ view }: { view: DashboardView }) {
  const d = view.diagnosis;
  const audience = AUDIENCE[d.actionAudience];
  const belowThreshold = d.cause !== 'none' && !d.isFault && d.status !== 'healthy';

  return (
    <GlassCard delay={0.15} className={cn(styles.diagnosis, styles[d.status])} aria-label="AI diagnosis">
      <div className={styles.diagTop}>
        <span className={styles.diagEyebrow}>
          <Cpu size={15} /> {view.source === 'rules' ? 'Rules-engine diagnosis' : 'AI diagnosis'}
        </span>
        <span className={styles.confidence}>
          <ShieldAlert size={13} /> {d.confidence}% confidence
        </span>
      </div>

      {/* keyed so a new scenario/site replays the swap-in */}
      <div key={`${view.key}-${d.title}`} className={styles.swapIn}>
        <h2 className={styles.diagTitle}>{d.title}</h2>
        <p className={styles.diagSummary}>{d.summary}</p>
        {belowThreshold && (
          <p className={styles.watchNote}>Below the 85% alert threshold — shown as something to watch, not an alert.</p>
        )}
      </div>

      <div className={styles.facts}>
        <Fact label="Severity" value={SEVERITY_LABEL[d.severity]} />
        <Fact label="Affected area" value={d.affectedArea} />
        <Fact label="First seen" value={d.firstSeen} />
        <Fact label="Est. loss today" value={`${d.estimatedLossPct.toFixed(1)}%`} />
      </div>

      <div className={styles.action}>
        <span className={cn(styles.actionIcon, styles[d.actionAudience])}>{audience.icon}</span>
        <div>
          <div className={styles.actionAudience}>{audience.label}</div>
          <div className={styles.actionText}>{d.action}</div>
        </div>
      </div>

      <ul className={styles.evidenceList} aria-label="Evidence">
        {d.evidence.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </GlassCard>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.fact}>
      <span className={styles.factLabel}>{label}</span>
      <span className={styles.factValue}>{value}</span>
    </div>
  );
}
