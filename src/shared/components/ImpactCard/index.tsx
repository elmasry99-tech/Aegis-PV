'use client';

import { motion } from 'framer-motion';
import type { ImpactStat } from '@/shared/types';
import { cn } from '@/shared/utils/cn';
import { AnimatedNumber } from '@/shared/components/AnimatedNumber';
import { useSpotlight } from '@/shared/hooks/useSpotlight';

const COLOR_MAP = {
  emerald: 'text-brand-emerald',
  cyan: 'text-brand-cyan',
  yellow: 'text-brand-yellow',
};

const GLOW_MAP = {
  emerald: 'rgba(5, 150, 105, 0.18)',
  cyan: 'rgba(8, 145, 178, 0.18)',
  yellow: 'rgba(202, 138, 4, 0.18)',
};

interface ImpactCardProps {
  stat: ImpactStat;
  delay?: number;
  className?: string;
}

export function ImpactCard({ stat, delay = 0, className }: ImpactCardProps) {
  const onMouseMove = useSpotlight<HTMLDivElement>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, scale: 1.015 }}
      onMouseMove={onMouseMove}
      style={{ '--spotlight-color': GLOW_MAP[stat.color] } as React.CSSProperties}
      className={cn(
        'glass spotlight-card rounded-2xl px-6 py-14 text-center transition-shadow duration-300 hover:shadow-xl',
        className
      )}
    >
      <div className={cn('text-6xl font-bold leading-none mb-4', COLOR_MAP[stat.color])}>
        <AnimatedNumber value={stat.value} />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{stat.label}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{stat.description}</p>
    </motion.div>
  );
}
