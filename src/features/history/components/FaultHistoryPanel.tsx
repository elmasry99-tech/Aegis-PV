import { History } from 'lucide-react';
import { Timeline } from '@/shared/components/Timeline';
import { FAULT_HISTORY } from '@/lib/mock-data';
import styles from '@/app/dashboard/dashboard.module.css';

export function FaultHistoryPanel() {
  return (
    <div className={styles.card} style={{ marginTop: '1.5rem' }}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <History size={18} /> Fault History
        </div>
      </div>
      <Timeline entries={FAULT_HISTORY} />
    </div>
  );
}
