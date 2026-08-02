'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { ScenarioProvider } from '@/shared/contexts/ScenarioContext';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  return (
    <ScenarioProvider>
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
        }}
      >
        <DashboardSidebar />
        <main
          style={{
            marginLeft: 220,
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
