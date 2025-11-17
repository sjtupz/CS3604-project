import React from 'react';
import styles from './TicketCardSkeleton.module.css';

export const TicketCardSkeletonList: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card} aria-busy="true" aria-live="polite">
          <div>
            <div className={`${styles.shimmer} ${styles.leftLine}`} />
            <div className={`${styles.shimmer} ${styles.leftSub}`} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <div className={`${styles.shimmer} ${styles.midItem}`} />
            <div className={`${styles.shimmer} ${styles.midItem}`} />
            <div className={`${styles.shimmer} ${styles.midItem}`} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <div className={`${styles.shimmer} ${styles.price}`} />
            <div className={`${styles.shimmer} ${styles.btn}`} />
          </div>
        </div>
      ))}
    </div>
  );
};