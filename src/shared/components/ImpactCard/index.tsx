'use client';

import { motion } from 'framer-motion';
import type { ImpactStat } from '@/shared/types';
import { cn } from '@/shared/utils/cn';

const COLOR_MAP = {
  emerald: 'text-brand-emerald',
  cyan: 'text-brand-cyan',
  yellow: 'text-brand-yellow',
};

interface ImpactCardProps {
  stat: ImpactStat;
  delay?: number;
  className?: string;
}

export function ImpactCard({ stat, delay = 0, className }: ImpactCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn('glass rounded-2xl p-8 text-center', className)}
    >
      <div className={cn('text-6xl font-bold leading-none mb-4', COLOR_MAP[stat.color])}>
        {stat.value}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{stat.label}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{stat.description}</p>
    </motion.div>
  );
}
