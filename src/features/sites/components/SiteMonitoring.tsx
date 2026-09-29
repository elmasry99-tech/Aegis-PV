'use client';

import { Factory, MapPin } from 'lucide-react';
import { GlassCard } from '@/features/dashboard/components/GlassCard';
import type { DashboardView } from '@/features/dashboard/types';
import { useSites } from '@/features/sites/hooks/useSites';
import { useLiveAnalysis } from '@/features/live/hooks/useLiveAnalysis';
import { useScenarioContext } from '@/shared/contexts/ScenarioContext';
import { SITE_IDS, type SiteId } from '@/lib/live/types';
import type { ScenarioKey } from '@/shared/types';
import { cn } from '@/shared/utils/cn';
import styles from '@/app/dashboard/dashboard.module.css';

export function SiteMonitoring({ view }: { view: DashboardView }) {
  return (
    <GlassCard delay={0.2} aria-label="Sites">
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <Factory size={18} /> {view.mode === 'live' ? 'Live Sites' : 'Multi-site Monitoring (Riyadh)'}
        </div>
      </div>
      <div className={styles.siteGrid}>
        {view.mode === 'live' ? SITE_IDS.map((id) => <LiveSiteCard key={id} id={id} />) : <DemoSites scenario={view.key as ScenarioKey} />}
      </div>
    </GlassCard>
  );
}

function DemoSites({ scenario }: { scenario: ScenarioKey }) {
  const { data: sites } = useSites(scenario);
  if (!sites) return Array.from({ length: 3 }).map((_, i) => <div key={i} className={styles.skeleton} style={{ height: 76 }} />);
  return sites.map((s) => (
    <div key={s.id} className={styles.siteCard}>
      <div className={styles.siteHeader}>
        <span className={styles.siteName}>{s.name}</span>
        <span className={cn(styles.dot, styles[s.status])} />
      </div>
      <div className={styles.siteMeta}>
        <span>{s.statusLabel}</span>
        <span>{s.confidence}%</span>
      </div>
    </div>
  ));
}

const LABEL: Record<SiteId, { name: string; place: string }> = {
  riyadh: { name: 'Riyadh', place: 'Al-Malqa · 6.0 kWp' },
  dhahran: { name: 'Dhahran', place: 'KFUPM · 5.0 kWp' },
};

/** Both live sites; selecting one switches the dashboard. Only the active site triggers analysis. */
function LiveSiteCard({ id }: { id: SiteId }) {
  const { site, setSite } = useScenarioContext();
  const active = site === id;
  const { data } = useLiveAnalysis(id, active);
  return (
    <button type="button" className={styles.siteCard} aria-pressed={active} onClick={() => setSite(id)}>
      <div className={styles.siteHeader}>
        <span className={styles.siteName}>{LABEL[id].name}</span>
        <span className={cn(styles.dot, data ? styles[data.diagnosis.status] : styles.pending)} />
      </div>
      <div className={styles.siteMeta}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {LABEL[id].place}</span>
        <span>{data ? `${data.diagnosis.healthScore}/100` : active ? '…' : 'Tap to analyse'}</span>
      </div>
    </button>
  );
}
