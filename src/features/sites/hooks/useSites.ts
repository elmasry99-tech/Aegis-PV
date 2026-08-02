'use client';

import { useQuery } from '@tanstack/react-query';
import { SITES_BY_SCENARIO } from '@/lib/mock-data';
import type { ScenarioKey } from '@/shared/types';

export function useSites(scenario: ScenarioKey) {
  return useQuery({
    queryKey: ['sites', scenario],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 0));
      return SITES_BY_SCENARIO[scenario];
    },
  });
}
