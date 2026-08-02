import { DIAGNOSES } from '@/lib/mock-data';
import type { Diagnosis, ScenarioKey } from '@/shared/types';

export async function fetchDiagnosis(scenario: ScenarioKey): Promise<Diagnosis> {
  await new Promise((r) => setTimeout(r, 0));
  return DIAGNOSES[scenario];
}
