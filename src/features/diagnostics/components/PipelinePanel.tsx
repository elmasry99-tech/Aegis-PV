import { HardDrive, Activity, Cpu, ShieldAlert } from 'lucide-react';
import styles from '@/app/dashboard/dashboard.module.css';

export function PipelinePanel() {
  return (
    <div className={styles.card} style={{ marginTop: '1.5rem' }}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <HardDrive size={18} /> AI Processing Pipeline
        </div>
      </div>
      <div className={styles.pipeline}>
        <div className={`${styles.pipeStep} ${styles.active}`}>
          <Activity size={20} /> Data Ingest
        </div>
        <div className={styles.pipeLine} />
        <div className={`${styles.pipeStep} ${styles.active}`}>
          <Cpu size={20} /> Model
        </div>
        <div className={styles.pipeLine} />
        <div className={`${styles.pipeStep} ${styles.active}`}>
          <ShieldAlert size={20} /> Classify
        </div>
      </div>
    </div>
  );
}
