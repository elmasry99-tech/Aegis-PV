'use client';
import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from 'react';
import type { ScenarioKey } from '@/shared/types';
import type { SiteId } from '@/lib/live/types';
import type { DashboardMode } from '@/features/dashboard/types';

interface Ctx {
  scenario: ScenarioKey;
  setScenario: (s: ScenarioKey) => void;
  mode: DashboardMode;
  setMode: (m: DashboardMode) => void;
  site: SiteId;
  setSite: (s: SiteId) => void;
}

const ScenarioContext = createContext<Ctx>({
  scenario: 'dust',
  setScenario: () => {},
  mode: 'demo',
  setMode: () => {},
  site: 'dhahran',
  setSite: () => {},
});

// Deep links (?mode=live&site=riyadh) — used by the evidence page's back link and visual-probe.
const noSubscribe = () => () => {};
const useQueryParam = (key: string) =>
  useSyncExternalStore(noSubscribe, () => new URLSearchParams(window.location.search).get(key), () => null);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<ScenarioKey>('dust');
  const [chosenMode, setMode] = useState<DashboardMode | null>(null);
  const [chosenSite, setSite] = useState<SiteId | null>(null);
  const urlMode = useQueryParam('mode');
  const urlSite = useQueryParam('site');

  // A user's choice wins; until they choose, the URL decides.
  const mode: DashboardMode = chosenMode ?? (urlMode === 'live' ? 'live' : 'demo');
  const site: SiteId = chosenSite ?? (urlSite === 'riyadh' ? 'riyadh' : 'dhahran');

  return (
    <ScenarioContext.Provider value={{ scenario, setScenario, mode, setMode, site, setSite }}>
      {children}
    </ScenarioContext.Provider>
  );
}

export const useScenarioContext = () => useContext(ScenarioContext);
