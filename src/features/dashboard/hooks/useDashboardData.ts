'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '@/features/dashboard/services/dashboard.service';
import type { ScenarioKey } from '@/shared/types';

export function useDashboardData(scenario: ScenarioKey) {
  return useQuery({
    queryKey: ['dashboard', scenario],
    queryFn: () => fetchDashboardData(scenario),
  });
}
