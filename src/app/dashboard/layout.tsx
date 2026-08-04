'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { ScenarioProvider } from '@/shared/contexts/ScenarioContext';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';

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
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
        }}
      >
        {!isPreview && <DashboardSidebar />}
        <main
          style={{
            marginLeft: isPreview ? 0 : 220,
            flex: 1,
            minHeight: '100vh',
          }}
        >
          {children}
        </main>
      </div>
    </ScenarioProvider>
  );
}
