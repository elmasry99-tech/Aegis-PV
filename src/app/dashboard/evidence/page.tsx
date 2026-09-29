import type { Metadata } from 'next';
import { EvidenceView } from '@/features/live/components/EvidenceView';
import type { SiteId } from '@/lib/live/types';

export const metadata: Metadata = {
  title: 'Evidence · Aegis PV',
  description: 'The exact data sent to the AI for a live site, grouped as in the Aegis-PV report.',
};

export default async function EvidencePage({ searchParams }: PageProps<'/dashboard/evidence'>) {
  const { site } = await searchParams;
  const siteId: SiteId = site === 'riyadh' ? 'riyadh' : 'dhahran';
  return <EvidenceView site={siteId} />;
}
