'use client';

import { SITE_PORTFOLIO } from '@/lib/constants';
import { ScenarioSelector } from '@/shared/components/ScenarioSelector';
import type { ScenarioKey } from '@/shared/types';
import styles from '@/app/dashboard/dashboard.module.css';

interface DashboardHeaderProps {
  scenario: ScenarioKey;
  onScenarioChange: (s: ScenarioKey) => void;
}

export function DashboardHeader({ scenario, onScenarioChange }: DashboardHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>AI Operations Center</h1>
        <p className={styles.subtitle}>{SITE_PORTFOLIO}</p>
      </div>
      <div className={styles.controls}>
        <ScenarioSelector value={scenario} onChange={onScenarioChange} />
      </div>
    </div>
  );
}
