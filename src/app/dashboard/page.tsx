'use client';

import { RefreshCw } from 'lucide-react';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { HealthScoreCard } from '@/features/dashboard/components/HealthScoreCard';
import { StatsRow } from '@/features/dashboard/components/StatsRow';
import { useDashboardView } from '@/features/dashboard/hooks/useDashboardView';
import { EnergyAnalytics } from '@/features/analytics/components/EnergyAnalytics';
import { SiteMonitoring } from '@/features/sites/components/SiteMonitoring';
import { DiagnosisPanel } from '@/features/diagnostics/components/DiagnosisPanel';
import { PipelinePanel } from '@/features/diagnostics/components/PipelinePanel';
import { FaultHistoryPanel } from '@/features/history/components/FaultHistoryPanel';
import { cn } from '@/shared/utils/cn';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { view, isLoading, error, refresh, isRefreshing } = useDashboardView();

  return (
    <div className={styles.dashboard}>
      <div className={styles.glow1} aria-hidden />
      <div className={styles.glow2} aria-hidden />

      <DashboardHeader view={view} onRefresh={refresh} isRefreshing={isRefreshing} />

      {error && !view ? (
        <div className={cn('glass', styles.card, styles.errorCard)} role="alert">
          <h2 className={styles.errorTitle}>Live data unavailable</h2>
          <p className={styles.errorText}>{error.message}</p>
          <button type="button" className={styles.iconButton} onClick={refresh} disabled={isRefreshing}>
            <RefreshCw size={14} className={cn(isRefreshing && styles.spin)} /> Try again
          </button>
        </div>
      ) : isLoading || !view ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className={styles.topRow}>
            <HealthScoreCard view={view} />
            <StatsRow view={view} />
          </div>
          <div className={styles.grid}>
            <div className={styles.column}>
              <EnergyAnalytics view={view} />
              <SiteMonitoring view={view} />
            </div>
            <div className={styles.column}>
              <DiagnosisPanel view={view} />
              <PipelinePanel view={view} />
              <FaultHistoryPanel view={view} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Analysing live data">
      <div className={styles.topRow}>
        <div className={styles.skeleton} style={{ height: 250 }} />
        <div className={styles.statsRow}>
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className={styles.skeleton} style={{ height: 150 }} />)}
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.skeleton} style={{ height: 420 }} />
        <div className={styles.skeleton} style={{ height: 420 }} />
      </div>
    </div>
  );
}
