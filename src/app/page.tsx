import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { Header } from '@/features/landing/components/Header';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { ProblemSection } from '@/features/landing/components/ProblemSection';
import { EvidenceSection } from '@/features/landing/components/EvidenceSection';
import { FeaturesSection } from '@/features/landing/components/FeaturesSection';
import { PipelineSection } from '@/features/landing/components/PipelineSection';
import { ComparisonSection } from '@/features/landing/components/ComparisonSection';
import { WhyAdoptedSection } from '@/features/landing/components/WhyAdoptedSection';
import { BenefitsSection } from '@/features/landing/components/BenefitsSection';
import { CTASection } from '@/features/landing/components/CTASection';
import styles from './page.module.css';

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Dashboard', href: ROUTES.DASHBOARD },
      { label: 'Features', href: '#features' },
      { label: 'Technology', href: '#how-it-works' },
      { label: 'Demo scenarios', href: '#compare' },
    ],
  },
  {
    title: 'Why Aegis PV',
    links: [
      { label: 'The Problem', href: '#problem' },
      { label: 'The Evidence', href: '#evidence' },
      { label: 'Compare', href: '#compare' },
      { label: 'Impact', href: '#benefits' },
    ],
  },
  {
    title: 'Get Started',
    links: [
      { label: 'Log in', href: ROUTES.LOGIN },
      { label: 'Explore the dashboard', href: ROUTES.DASHBOARD },
    ],
  },
];

export default function LandingPage() {
  return (
    <main id="top" className={styles.main}>
      <div className={styles.bgGlow1} />

      <Header />

      <div className="container">
        <HeroSection />
        <div className={styles.bgGlow2} />
        <ProblemSection />
        <EvidenceSection />
        <FeaturesSection />
        <PipelineSection />
        <ComparisonSection />
        <WhyAdoptedSection />
        <BenefitsSection />
        <CTASection />
      </div>

      <footer className={styles.footer}>
        <div className={`${styles.footerContent} container`}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>Aegis<span>PV</span></div>
            <p className={styles.footerDesc}>
              The virtual solar technician — built specifically for Saudi Arabia and the GCC.
              AI-powered fault diagnosis that turns raw inverter data into maintenance decisions.
            </p>
            <div className={styles.footerStatus}>
              <span className={styles.footerStatusDot} />
              Built for KSA Vision 2030
            </div>
          </div>

          <div className={styles.footerLinks}>
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title} className={styles.footerCol}>
                <h4>{col.title}</h4>
                {col.links.map((link) =>
                  link.href.startsWith('#') ? (
                    <a key={link.label} href={link.href}>{link.label}</a>
                  ) : (
                    <Link key={link.label} href={link.href}>{link.label}</Link>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.footerBottom} container`}>
          <div>&copy; 2026 {APP_NAME}. All rights reserved.</div>
          <div className={styles.footerBottomRight}>
            <span>Team Aegis-PV · Competition Submission</span>
            <a href="#top" className={styles.backToTop}>
              Back to top <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
