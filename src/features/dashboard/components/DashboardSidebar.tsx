'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Activity,
  MapPin,
  Leaf,
  Cpu,
  Play,
  LogOut,
} from 'lucide-react';
import { logout } from '@/lib/auth';
import { cn } from '@/shared/utils/cn';
import styles from './DashboardSidebar.module.css';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Diagnostics', icon: Activity, href: '/dashboard/diagnostics' },
  { label: 'Sites', icon: MapPin, href: '/dashboard/sites' },
  { label: 'Impact', icon: Leaf, href: '/dashboard/impact' },
  { label: 'Pipeline', icon: Cpu, href: '/dashboard/pipeline' },
  { label: 'Demo', icon: Play, href: '/dashboard/demo' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={styles.sidebar}
    >
      <div className={styles.logo}>
        Aegis
        <span>PV</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(styles.link, isActive && styles.linkActive)}
            >
              <Icon size={16} strokeWidth={1.75} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.logoutWrap}>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={16} strokeWidth={1.75} />
          <span>Logout</span>
        </button>
      </div>
    </motion.aside>
  );
}
