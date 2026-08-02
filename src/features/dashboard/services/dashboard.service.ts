import { CURRENT_OUTPUT, DIAGNOSES } from '@/lib/mock-data';
import { STATIC_METRIC_VALUES } from '@/lib/mock-data/metrics';
import type { ScenarioKey } from '@/shared/types';
import type { DashboardData } from '@/features/dashboard/types';

export async function fetchDashboardData(scenario: ScenarioKey): Promise<DashboardData> {
  await new Promise((r) => setTimeout(r, 0));

  return {
    currentOutput: CURRENT_OUTPUT[scenario],
    expectedOutput: STATIC_METRIC_VALUES.expectedOutput,
    waterSaved: STATIC_METRIC_VALUES.waterSaved,
    co2Reduction: STATIC_METRIC_VALUES.co2Reduction,
  };
}

export async function fetchDiagnosis(scenario: ScenarioKey) {
  await new Promise((r) => setTimeout(r, 0));
  return DIAGNOSES[scenario];
}
