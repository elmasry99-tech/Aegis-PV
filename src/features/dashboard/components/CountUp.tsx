'use client';

import { animate, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

/** Animates a number from its previous value; writes to the DOM directly (no re-renders). */
export function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = value.toFixed(decimals);
      from.current = value;
      return;
    }
    const controls = animate(from.current, value, {
      duration: 0.9,
      ease: 'easeOut',
      onUpdate: (v) => { node.textContent = v.toFixed(decimals); },
    });
    from.current = value;
    return () => controls.stop();
  }, [value, decimals, reduce]);

  return <span ref={ref}>{value.toFixed(decimals)}</span>;
}
