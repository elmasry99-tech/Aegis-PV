'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ScenarioKey } from '@/shared/types';

interface Ctx {
  scenario: ScenarioKey;
  setScenario: (s: ScenarioKey) => void;
}

const ScenarioContext = createContext<Ctx>({
  scenario: 'dust',
  setScenario: () => {},
});

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<ScenarioKey>('dust');
  return (
    <ScenarioContext.Provider value={{ scenario, setScenario }}>
      {children}
    </ScenarioContext.Provider>
  );
}

export const useScenarioContext = () => useContext(ScenarioContext);
