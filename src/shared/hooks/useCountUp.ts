'use client';

import { useEffect, useRef, useState } from 'react';

/** Animates the numeric portion of strings like "+23%", ">50%", "-20%", "13.88%". */
export function useCountUp(value: string, start: boolean, duration = 1200): string {
  const [display, setDisplay] = useState(() => value.replace(/[\d.]+/, '0'));
  const started = useRef(false);

  useEffect(() => {
    if (!start || started.current) return;
    started.current = true;

    const match = value.match(/[\d.]+/);
    if (!match || match.index === undefined) {
      // No numeric portion to animate — the initializer already set `display` to `value`.
      return;
    }

    const target = parseFloat(match[0]);
    const prefix = value.slice(0, match.index);
    const suffix = value.slice(match.index + match[0].length);
    const decimals = match[0].includes('.') ? match[0].split('.')[1].length : 0;

    const startTime = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, value, duration]);

  return display;
}
