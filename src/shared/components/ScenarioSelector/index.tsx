'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SCENARIO_LABELS } from '@/lib/constants';
import type { ScenarioKey } from '@/shared/types';

interface ScenarioSelectorProps {
  value: ScenarioKey;
  onChange: (value: ScenarioKey) => void;
}

export function ScenarioSelector({ value, onChange }: ScenarioSelectorProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
      <span className="text-sm text-text-secondary shrink-0">Demo Control Panel:</span>
      <Select value={value} onValueChange={(v) => onChange(v as ScenarioKey)}>
        <SelectTrigger className="w-full sm:w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SCENARIO_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
