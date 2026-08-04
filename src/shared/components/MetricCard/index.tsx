'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface MetricCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  icon: ReactNode;
  className?: string;
  delay?: number;
}

export function MetricCard({ label, value, unit, icon, className, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        'rounded-2xl border border-border-default bg-bg-secondary p-5',
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-3xl font-bold font-heading tracking-tight text-text-primary">
        {value}
        {unit && (
          <span className="text-base font-normal text-text-muted ml-1">{unit}</span>
        )}
      </div>
    </motion.div>
  );
}
