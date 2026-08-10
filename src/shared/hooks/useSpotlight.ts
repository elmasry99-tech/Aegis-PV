'use client';

import { useCallback } from 'react';

/** Tracks the cursor over an element via CSS custom properties, for a spotlight-hover effect. */
export function useSpotlight<T extends HTMLElement>() {
  return useCallback((e: React.MouseEvent<T>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`);
  }, []);
}
