import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sun } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import styles from '@/app/page.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={`${styles.heroContent} animate-fade-in`}>
        <div className={styles.heroTag}>
          <span className={styles.heroTagIcon}></span>
          AI-Powered Solar Intelligence for GCC
        </div>
        <h1 className={styles.heroTitle}>
          Detect solar faults before <span className="text-gradient">power drops.</span>
        </h1>
        <p className={styles.heroDesc}>
          Aegis PV uses advanced AI to detect dust accumulation, shading, and equipment faults in
          real-time. Maximize energy yield without unnecessary maintenance.
        </p>
        <div className={styles.heroBtns}>
          <Link href={ROUTES.DASHBOARD} className={styles.btnPrimary}>
            Explore Dashboard{' '}
            <ArrowRight size={18} style={{ display: 'inline', marginLeft: '8px', verticalAlign: 'middle' }} />
          </Link>
        </div>
      </div>

      <div className={styles.heroVisual}>
        <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Image 
            src="/solar-panel-hero.png" 
            alt="Aegis PV Solar Panels" 
            fill 
            style={{ objectFit: 'cover' }} 
            priority
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, rgba(6,182,212,0.2) 0%, transparent 100%)' }} />
        </div>
      </div>
    </section>
  );
}
