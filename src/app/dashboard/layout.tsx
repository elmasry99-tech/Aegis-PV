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

  // Public preview pages: no login, no sidebar. The evidence page belongs to the preview dashboard.
  const isPreview = pathname === '/dashboard' || pathname === '/dashboard/evidence';

  useEffect(() => {
    if (!isPreview && !isAuthenticated()) {
      router.push('/login');
    }
  }, [isPreview, router]);

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
