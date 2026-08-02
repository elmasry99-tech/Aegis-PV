import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import styles from '@/app/dashboard/dashboard.module.css';

export function DashboardNav() {
  return (
    <nav className={styles.dashNav}>
      <Link href={ROUTES.HOME} className={styles.logo}>
        Aegis<span>PV</span>
      </Link>
    </nav>
  );
}
