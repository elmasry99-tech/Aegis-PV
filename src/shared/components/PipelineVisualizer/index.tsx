'use client';

import { motion } from 'framer-motion';
import { Activity, Cpu, ShieldAlert, BarChart3, ShieldCheck } from 'lucide-react';
import type { PipelineStep } from '@/shared/types';
import { cn } from '@/shared/utils/cn';

const ICON_MAP: Record<string, React.ReactNode> = {
  Activity: <Activity size={20} />,
  Cpu: <Cpu size={20} />,
  ShieldAlert: <ShieldAlert size={20} />,
  BarChart3: <BarChart3 size={20} />,
  ShieldCheck: <ShieldCheck size={20} />,
};

interface PipelineVisualizerProps {
  steps: PipelineStep[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function PipelineVisualizer({
  steps,
  orientation = 'vertical',
  className,
}: PipelineVisualizerProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'flex-row items-center gap-0' : 'flex-col gap-0',
        className
      )}
    >
      {steps.map((step, i) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className={cn('flex', isHorizontal ? 'flex-col items-center' : 'flex-row items-center')}
        >
          <div
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
              step.isActive !== false
                ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20'
                : 'bg-bg-tertiary text-text-secondary border border-border-default'
            )}
          >
            {ICON_MAP[step.id] ?? <Activity size={20} />}
            <span>{step.label}</span>
          </div>

          {i < steps.length - 1 && (
            <div
              className={cn(
                isHorizontal ? 'w-8 h-px' : 'w-px h-6 ml-6',
                'bg-brand-emerald/30 shrink-0'
              )}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
