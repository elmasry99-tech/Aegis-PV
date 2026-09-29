'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLiveAnalysis } from '@/features/live/services/live.service';
import type { SiteId } from '@/lib/live/types';

const FIFTEEN_MIN = 15 * 60 * 1000;

export const liveQueryKey = (site: SiteId) => ['live', site] as const;

/** Analyse on open / site switch; the server caches 15 min, so does the client. */
export function useLiveAnalysis(site: SiteId, enabled = true) {
  return useQuery({
    queryKey: liveQueryKey(site),
    queryFn: () => fetchLiveAnalysis(site),
    enabled,
    staleTime: FIFTEEN_MIN,
    gcTime: FIFTEEN_MIN * 2,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/** ⟳ button: forces a fresh weather + AI run and replaces the cached result. */
export function useRefreshLive(site: SiteId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => fetchLiveAnalysis(site, true),
    onSuccess: (data) => qc.setQueryData(liveQueryKey(site), data),
  });
}
