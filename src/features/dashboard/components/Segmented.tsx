'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import styles from '@/app/dashboard/dashboard.module.css';

interface Option<T extends string> {
  value: T;
  label: ReactNode;
}

interface SegmentedProps<T extends string> {
  id: string;
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}

/** Pill segmented control with a sliding gradient indicator. */
export function Segmented<T extends string>({ id, label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div className={styles.segmented} role="group" aria-label={label}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            className={styles.segment}
            aria-pressed={active}
            onClick={() => onChange(o.value)}
          >
            {active && (
              <motion.span
                layoutId={`${id}-pill`}
                className={styles.segmentPill}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
