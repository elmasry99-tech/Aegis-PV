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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 220,
        height: '100vh',
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 200,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '28px 24px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-outfit), Outfit, sans-serif',
            fontSize: '1.4rem',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            userSelect: 'none',
          }}
        >
          Aegis
          <span style={{ color: '#10b981' }}>PV</span>
        </span>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'background 0.15s ease, color 0.15s ease',
                color: isActive ? '#ffffff' : '#a1a1aa',
                background: isActive ? 'rgba(16,185,129,0.1)' : 'transparent',
                borderLeft: isActive ? '2px solid #10b981' : '2px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#a1a1aa';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                }
              }}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#a1a1aa',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s ease, color 0.15s ease',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#a1a1aa';
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          <LogOut size={16} strokeWidth={1.75} />
          Logout
        </button>
      </div>
    </motion.aside>
  );
}
