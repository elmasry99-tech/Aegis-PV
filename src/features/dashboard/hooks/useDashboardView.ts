'use client';

import { useMemo } from 'react';
import { useScenarioContext } from '@/shared/contexts/ScenarioContext';
import { useLiveAnalysis, useRefreshLive } from '@/features/live/hooks/useLiveAnalysis';
import type { LiveAnalysis } from '@/lib/live/types';
import { demoView } from '../demo-view';
import type { DashboardView } from '../types';

function liveView(a: LiveAnalysis): DashboardView {
  return {
    mode: 'live',
    key: a.site.id,
    title: 'AI Operations Center',
    subtitle: `${a.site.name} · ${a.site.city}`,
    source: a.source,
    model: a.model,
    stale: a.stale,
    fallbackReason: a.fallbackReason,
    updatedAt: a.generatedAt,
    isDaylight: a.isDaylight,
    metrics: {
      currentOutputKw: a.metrics.currentOutputKw,
      expectedOutputKw: a.metrics.expectedOutputKw,
      energyTodayKwh: a.metrics.energyTodayKwh,
      expectedEnergyTodayKwh: a.metrics.expectedEnergyTodayKwh,
      gapPct: a.metrics.gapPct,
      ghi: a.metrics.ghi,
      ambientTempC: a.metrics.ambientTempC,
      cellTempC: a.metrics.cellTempC,
    },
    chart: a.chart,
    diagnosis: a.diagnosis,
  };
}

/** The dashboard's single data source: a demo scenario or a live site, same shape. */
export function useDashboardView() {
  const { mode, scenario, site } = useScenarioContext();
  const live = useLiveAnalysis(site, mode === 'live');
  const refresh = useRefreshLive(site);

  const view = useMemo<DashboardView | null>(() => {
    if (mode === 'demo') return demoView(scenario);
    return live.data ? liveView(live.data) : null;
  }, [mode, scenario, live.data]);

  return {
    view,
    isLoading: mode === 'live' && live.isPending,
    error: mode === 'live' ? (refresh.error ?? live.error) : null,
    refresh: () => refresh.mutate(),
    isRefreshing: refresh.isPending || (mode === 'live' && live.isFetching),
  };
}
