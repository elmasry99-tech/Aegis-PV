'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { ScenarioProvider } from '@/shared/contexts/ScenarioContext';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { cn } from '@/shared/utils/cn';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== '/dashboard' && !isAuthenticated()) {
      router.push('/login');
    }
  }, [pathname, router]);

  const isPreview = pathname === '/dashboard';

  return (
    <ScenarioProvider>
      <div className={styles.shell}>
        {!isPreview && <DashboardSidebar />}
        <main className={cn(styles.main, !isPreview && styles.mainWithSidebar)}>
          {children}
        </main>
      </div>
    </ScenarioProvider>
  );
}
