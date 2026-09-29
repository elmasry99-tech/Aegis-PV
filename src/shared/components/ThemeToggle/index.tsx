'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/shared/contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Both icons are always rendered and cross-faded in CSS: no mount/unmount swap that can
  // stall (AnimatePresence) and no motion under prefers-reduced-motion.
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span className={styles.icon} data-visible={!isDark} aria-hidden>
        <Sun size={16} />
      </span>
      <span className={styles.icon} data-visible={isDark} aria-hidden>
        <Moon size={16} />
      </span>
    </button>
  );
}
