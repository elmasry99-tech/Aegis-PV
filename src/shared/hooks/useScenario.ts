'use client';

import { useState } from 'react';
import type { ScenarioKey } from '@/shared/types';
import { SCENARIOS } from '@/lib/constants';

export function useScenario(initial: ScenarioKey = SCENARIOS.DUST) {
  const [scenario, setScenario] = useState<ScenarioKey>(initial);
  return { scenario, setScenario };
}
