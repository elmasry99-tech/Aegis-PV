'use client';

import Link from 'next/link';
import { FlaskConical, Radio, RefreshCw, FileSearch, Clock, MoonStar, Sparkles, ShieldCheck, TriangleAlert } from 'lucide-react';
import { ScenarioSelector } from '@/shared/components/ScenarioSelector';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { useScenarioContext } from '@/shared/contexts/ScenarioContext';
import { cn } from '@/shared/utils/cn';
import type { DashboardView } from '@/features/dashboard/types';
import type { SiteId } from '@/lib/live/types';
import { Segmented } from './Segmented';
import styles from '@/app/dashboard/dashboard.module.css';

interface DashboardHeaderProps {
  view: DashboardView | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const timeFmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Riyadh' });

export function DashboardHeader({ view, onRefresh, isRefreshing }: DashboardHeaderProps) {
  const { mode, setMode, scenario, setScenario, site, setSite } = useScenarioContext();
  const live = mode === 'live';

  return (
    <>
      <div className={styles.topline}>
        <span className={cn(styles.eyebrow, live && styles.live)}>
          <span className={styles.eyebrowDot} />
          {live ? 'Live · real weather, simulated panels' : 'Demo scenarios'}
        </span>
        <ThemeToggle />
      </div>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            AI Operations <span className="text-gradient">Center</span>
          </h1>
          <p className={styles.subtitle}>{view?.subtitle ?? (live ? 'Connecting to live site…' : '')}</p>
        </div>

        <div className={styles.controls}>
          <Segmented
            id="mode"
            label="Data mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'demo', label: <><FlaskConical size={14} /> Demo</> },
              { value: 'live', label: <><Radio size={14} /> Live</> },
            ]}
          />
          {live ? (
            <Segmented<SiteId>
              id="site"
              label="Live site"
              value={site}
              onChange={setSite}
              options={[
                { value: 'riyadh', label: 'Riyadh' },
                { value: 'dhahran', label: 'Dhahran' },
              ]}
            />
          ) : (
            <ScenarioSelector value={scenario} onChange={setScenario} />
          )}
        </div>
      </header>

      {live && (
        <div className={cn('glass', styles.statusBar)} role="status" aria-live="polite">
          <span className={styles.statusItem}>
            <Clock size={14} />
            {view?.updatedAt ? `Updated ${timeFmt.format(new Date(view.updatedAt))} (KSA)` : 'Analysing…'}
          </span>
          {view && <SourceBadge view={view} />}
          {view && !view.isDaylight && (
            <span className={cn(styles.badge, styles.badgeNight)}>
              <MoonStar size={12} /> Night — showing today’s daylight
            </span>
          )}
          <span className={styles.statusSpacer} />
          <button type="button" className={styles.iconButton} onClick={onRefresh} disabled={isRefreshing} aria-label="Run a fresh live analysis">
            <RefreshCw size={14} className={cn(isRefreshing && styles.spin)} />
            {isRefreshing ? 'Analysing' : 'Refresh'}
          </button>
          <Link href={`/dashboard/evidence?site=${site}`} className={styles.linkButton}>
            <FileSearch size={14} /> View evidence
          </Link>
        </div>
      )}
    </>
  );
}

function SourceBadge({ view }: { view: DashboardView }) {
  if (view.stale) {
    return (
      <span className={cn(styles.badge, styles.badgeStale)} title={view.fallbackReason ?? undefined}>
        <TriangleAlert size={12} /> Stale — weather offline
      </span>
    );
  }
  if (view.source === 'ai') {
    return (
      <span className={cn(styles.badge, styles.badgeAi)} title={view.model ?? undefined}>
        <Sparkles size={12} /> AI diagnosis
      </span>
    );
  }
  return (
    <span className={cn(styles.badge, styles.badgeRules)} title={view.fallbackReason ?? undefined}>
      <ShieldCheck size={12} /> Rules engine — AI unavailable
    </span>
  );
}
