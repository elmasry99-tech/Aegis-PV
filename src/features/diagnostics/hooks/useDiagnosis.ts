'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDiagnosis } from '@/features/diagnostics/services/diagnostics.service';
import type { ScenarioKey } from '@/shared/types';

export function useDiagnosis(scenario: ScenarioKey) {
  return useQuery({
    queryKey: ['diagnosis', scenario],
    queryFn: () => fetchDiagnosis(scenario),
  });
}
