'use client';

import { Factory } from 'lucide-react';
import { SiteCard } from '@/shared/components/SiteCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useSites } from '@/features/sites/hooks/useSites';
import type { ScenarioKey } from '@/shared/types';
import styles from '@/app/dashboard/dashboard.module.css';

interface SiteMonitoringProps {
  scenario: ScenarioKey;
}

export function SiteMonitoring({ scenario }: SiteMonitoringProps) {
  const { data: sites, isLoading } = useSites(scenario);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <Factory size={18} /> Multi-site Monitoring (Riyadh)
        </div>
      </div>
      <div className={styles.siteGrid}>
        {isLoading || !sites
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))
          : sites.map((site) => <SiteCard key={site.id} site={site} />)}
      </div>
    </div>
  );
}
