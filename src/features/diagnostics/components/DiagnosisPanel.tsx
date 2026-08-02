'use client';

import { DiagnosisCard } from '@/shared/components/DiagnosisCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useDiagnosis } from '@/features/diagnostics/hooks/useDiagnosis';
import type { ScenarioKey } from '@/shared/types';

interface DiagnosisPanelProps {
  scenario: ScenarioKey;
}

export function DiagnosisPanel({ scenario }: DiagnosisPanelProps) {
  const { data: diagnosis, isLoading } = useDiagnosis(scenario);

  if (isLoading || !diagnosis) {
    return <Skeleton className="h-40 w-full mb-6" />;
  }

  return <DiagnosisCard diagnosis={diagnosis} className="mb-6" />;
}
