import type { ChartPoint, LiveDiagnosis, SiteId } from '@/lib/live/types';
import type { ScenarioKey } from '@/shared/types';

export type DashboardMode = 'demo' | 'live';

/**
 * One shape for both modes: every dashboard panel renders from this, so Live looks exactly
 * like a scenario (rule U6).
 */
export interface DashboardView {
  mode: DashboardMode;
  key: ScenarioKey | SiteId;
  title: string;
  subtitle: string;
  source: 'demo' | 'ai' | 'rules';
  model: string | null;
  stale: boolean;
  fallbackReason: string | null;
  updatedAt: string | null;
  isDaylight: boolean;
  metrics: {
    currentOutputKw: number;
    expectedOutputKw: number;
    energyTodayKwh: number;
    expectedEnergyTodayKwh: number;
    gapPct: number;
    ghi: number;
    ambientTempC: number;
    cellTempC: number;
  };
  chart: ChartPoint[];
  diagnosis: LiveDiagnosis;
}

export interface DashboardData {
  currentOutput: number;
  expectedOutput: number;
  waterSaved: number;
  co2Reduction: number;
}
