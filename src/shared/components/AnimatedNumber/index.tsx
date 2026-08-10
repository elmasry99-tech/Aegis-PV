'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { useCountUp } from '@/shared/hooks/useCountUp';

interface AnimatedNumberProps {
  value: string;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({ value, duration, className }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const display = useCountUp(value, inView, duration);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
