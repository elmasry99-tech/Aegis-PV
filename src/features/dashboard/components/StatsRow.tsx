'use client';

import { Zap, Activity, Droplet, Leaf } from 'lucide-react';
import { MetricCard } from '@/shared/components/MetricCard';
import type { ScenarioKey } from '@/shared/types';
import { CURRENT_OUTPUT } from '@/lib/mock-data';
import { STATIC_METRIC_VALUES } from '@/lib/mock-data/metrics';
import styles from '@/app/dashboard/dashboard.module.css';

interface StatsRowProps {
  scenario: ScenarioKey;
}

export function StatsRow({ scenario }: StatsRowProps) {
  const currentOutput = CURRENT_OUTPUT[scenario];

  return (
    <div className={styles.statsRow}>
      <MetricCard
        label="Current Output"
        value={<span className="text-xl">{currentOutput.toFixed(1)}</span>}
        unit="MW"
        icon={<Zap size={16} />}
        delay={0}
      />
      <MetricCard
        label="Expected Output"
        value={<span className="text-xl">{STATIC_METRIC_VALUES.expectedOutput.toFixed(1)}</span>}
        unit="MW"
        icon={<Activity size={16} />}
        delay={0.05}
      />
      <MetricCard
        label="Water Saved (YTD)"
        value={<span className="text-xl">{STATIC_METRIC_VALUES.waterSaved.toFixed(1)}</span>}
        unit="kL"
        icon={<Droplet size={16} />}
        delay={0.1}
      />
      <MetricCard
        label="CO₂ Reduction"
        value={<span className="text-xl">{STATIC_METRIC_VALUES.co2Reduction.toLocaleString()}</span>}
        unit="kg"
        icon={<Leaf size={16} />}
        delay={0.15}
      />
    </div>
  );
}
