'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SCENARIOS } from '@/lib/constants';
import type { ScenarioKey } from '@/shared/types';
import styles from './ScenarioSelector.module.css';

// Tone follows rule U4: emerald = healthy, yellow = warning, red = critical.
const OPTIONS: { value: ScenarioKey; label: string; hint: string; tone: 'healthy' | 'warning' | 'critical' }[] = [
  { value: SCENARIOS.HEALTHY, label: 'Healthy system', hint: 'Output tracks the baseline', tone: 'healthy' },
  { value: SCENARIOS.DUST, label: 'Dust accumulation', hint: 'Gradual, even loss all day', tone: 'warning' },
  { value: SCENARIOS.SHADING, label: 'Partial shading', hint: 'Repeating dip at one hour', tone: 'warning' },
  { value: SCENARIOS.HARDWARE, label: 'Equipment fault', hint: 'Sudden drop to zero', tone: 'critical' },
];

interface ScenarioSelectorProps {
  value: ScenarioKey;
  onChange: (value: ScenarioKey) => void;
}

export function ScenarioSelector({ value, onChange }: ScenarioSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ScenarioKey)}>
      <SelectTrigger className={styles.trigger} aria-label="Demo scenario">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            <span className={styles.option}>
              <SelectItemText>
                <span className={styles.name}>
                  <span className={styles.dot} data-tone={o.tone} aria-hidden />
                  {o.label}
                </span>
              </SelectItemText>
              <span className={styles.hint}>{o.hint}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
