'use client';

import { useScenarioContext } from '@/shared/contexts/ScenarioContext';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { StatsRow } from '@/features/dashboard/components/StatsRow';
import { EnergyAnalytics } from '@/features/analytics/components/EnergyAnalytics';
import { SiteMonitoring } from '@/features/sites/components/SiteMonitoring';
import { DiagnosisPanel } from '@/features/diagnostics/components/DiagnosisPanel';
import { PipelinePanel } from '@/features/diagnostics/components/PipelinePanel';
import { FaultHistoryPanel } from '@/features/history/components/FaultHistoryPanel';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { scenario, setScenario } = useScenarioContext();

  return (
    <div className={styles.dashboard}>
      <DashboardHeader scenario={scenario} onScenarioChange={setScenario} />

      <StatsRow scenario={scenario} />

      <div className={styles.grid}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <EnergyAnalytics scenario={scenario} />
          <SiteMonitoring scenario={scenario} />
        </div>

        <div>
          <DiagnosisPanel scenario={scenario} />
          <PipelinePanel />
          <FaultHistoryPanel />
        </div>
      </div>
    </div>
  );
}
