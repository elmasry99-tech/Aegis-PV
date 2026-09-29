'use client';

import type { ReactNode } from 'react';
import { useSpotlight } from '@/shared/hooks/useSpotlight';
import { cn } from '@/shared/utils/cn';
import styles from '@/app/dashboard/dashboard.module.css';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'section' | 'div';
  'aria-label'?: string;
}

/**
 * Landing-page card treatment: glass surface, cursor spotlight, soft entrance.
 * The entrance is a CSS animation (SSR-safe, switched off by prefers-reduced-motion).
 */
export function GlassCard({ children, className, delay = 0, as: Comp = 'section', ...rest }: GlassCardProps) {
  const onMouseMove = useSpotlight<HTMLElement>();
  return (
    <Comp
      onMouseMove={onMouseMove}
      className={cn('glass spotlight-card', styles.card, styles.enter, className)}
      style={{ animationDelay: `${delay}s` }}
      aria-label={rest['aria-label']}
    >
      {children}
    </Comp>
  );
}
