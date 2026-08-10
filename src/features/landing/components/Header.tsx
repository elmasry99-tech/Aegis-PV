'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ROUTES } from '@/lib/constants';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import styles from '@/app/page.module.css';

const NAV_LINKS = [
  { href: '#problem', label: 'Problem' },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'Technology' },
  { href: '#compare', label: 'Compare' },
  { href: '#benefits', label: 'Impact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.href.slice(1))).filter(
      (el): el is HTMLElement => el !== null
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHash(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.div className={styles.scrollProgress} style={{ scaleX: progress }} />
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.logo}>
          Aegis<span>PV</span>
        </div>
        <nav className={styles.navLinks}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${activeHash === link.href ? styles.navLinkActive : ''}`}
            >
              {link.label}
              {activeHash === link.href && (
                <motion.span
                  layoutId="nav-indicator"
                  className={styles.navIndicator}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>
        <div className={styles.headerActions}>
          <ThemeToggle />
          <Link href={ROUTES.LOGIN} className={styles.btnPrimary}>Log in</Link>
        </div>
      </header>
    </>
  );
}
