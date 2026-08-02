'use client';

import { useQuery } from '@tanstack/react-query';
import { CHART_ACTUAL_DATA, CHART_EXPECTED_DATA, CHART_TIME_LABELS } from '@/lib/constants';
import type { ScenarioKey } from '@/shared/types';

export function useAnalytics(scenario: ScenarioKey) {
  return useQuery({
    queryKey: ['analytics', scenario],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 0));
      return {
        labels: CHART_TIME_LABELS,
        expected: CHART_EXPECTED_DATA,
        actual: CHART_ACTUAL_DATA[scenario] ?? CHART_EXPECTED_DATA,
      };
    },
  });
}
