import Link from 'next/link';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { FeaturesSection } from '@/features/landing/components/FeaturesSection';
import { PipelineSection } from '@/features/landing/components/PipelineSection';
import { BenefitsSection } from '@/features/landing/components/BenefitsSection';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <main className={styles.main}>
      <div className={styles.bgGlow1} />

      <header className={styles.header}>
        <div className={styles.logo}>
          Aegis<span>PV</span>
        </div>
        <nav className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#how-it-works" className={styles.navLink}>Technology</a>
          <a href="#benefits" className={styles.navLink}>Impact</a>
        </nav>
        <div className={styles.headerActions}>
          <Link href={ROUTES.LOGIN} className={styles.btnPrimary}>Log in</Link>
        </div>
      </header>

      <div className="container">
        <HeroSection />
        <div className={styles.bgGlow2} />
        <FeaturesSection />
        <PipelineSection />
        <BenefitsSection />
      </div>

      <footer className={`${styles.footer} container`}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>Aegis<span>PV</span></div>
            <p className={styles.footerDesc}>
              The virtual solar technician — built specifically for Saudi Arabia and the GCC.
            </p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <h4>Product</h4>
              <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
              <a href="#features">Features</a>
              <a href="#how-it-works">Technology</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div>&copy; 2026 {APP_NAME}. All rights reserved.</div>        </div>
      </footer>
    </main>
  );
}
