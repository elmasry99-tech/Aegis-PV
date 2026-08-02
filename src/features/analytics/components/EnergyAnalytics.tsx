'use client';

import { Activity } from 'lucide-react';
import { AnimatedChart } from '@/shared/components/AnimatedChart';
import { DATA_SOURCE } from '@/lib/constants';
import type { ScenarioKey } from '@/shared/types';
import styles from '@/app/dashboard/dashboard.module.css';

interface EnergyAnalyticsProps {
  scenario: ScenarioKey;
}

export function EnergyAnalytics({ scenario }: EnergyAnalyticsProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <Activity size={18} /> Live Energy Analytics
        </div>
        <div style={{ fontSize: '0.85rem', color: '#10b981' }}>Live Sync: {DATA_SOURCE}</div>
      </div>
      <div className={styles.chartContainer}>
        <AnimatedChart scenario={scenario} height={280} />
      </div>
    </div>
  );
}
