'use client';

import { History, CloudRain, CheckCircle2, Sparkles } from 'lucide-react';
import { GlassCard } from '@/features/dashboard/components/GlassCard';
import type { DashboardView } from '@/features/dashboard/types';
import { FAULT_HISTORY } from '@/lib/mock-data';
import { cn } from '@/shared/utils/cn';
import styles from '@/app/dashboard/dashboard.module.css';

const ICONS: Record<string, React.ReactNode> = {
  CloudRain: <CloudRain size={16} />,
  CheckCircle2: <CheckCircle2 size={16} />,
};

export function FaultHistoryPanel({ view }: { view: DashboardView }) {
  const d = view.diagnosis;
  const entries =
    view.mode === 'live'
      ? [
          {
            id: 'now',
            title: d.title,
            description: `Now · ${d.affectedArea} · ${view.source === 'ai' ? 'AI' : 'Rules'}`,
            icon: <Sparkles size={16} />,
            tone: d.status === 'healthy' ? 'success' : d.status,
          },
          {
            id: 'clean',
            title: 'Last cleaning (simulated profile)',
            description: `${view.key === 'riyadh' ? 14 : 6} days ago · whole array`,
            icon: <CheckCircle2 size={16} />,
            tone: 'info',
          },
        ]
      : FAULT_HISTORY.map((e) => ({ id: e.id, title: e.title, description: e.description, icon: ICONS[e.icon], tone: e.severity }));

  return (
    <GlassCard delay={0.25} aria-label="Fault history">
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <History size={18} /> Fault History
        </div>
      </div>
      <div className={styles.timeline}>
        {entries.map((e) => (
          <div key={e.id} className={styles.timelineItem}>
            <span className={cn(styles.timelineIcon, styles[e.tone])}>{e.icon}</span>
            <div>
              <p className={styles.timelineTitle}>{e.title}</p>
              <p className={styles.timelineDesc}>{e.description}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
