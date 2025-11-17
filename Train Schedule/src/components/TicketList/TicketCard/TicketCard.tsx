import React from 'react';
import styles from './TicketCard.module.css';

type Props = {
  trainNo: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  arrivalType?: '当日到达' | '次日到达';
};

export const TicketCard: React.FC<Props> = React.memo(({ trainNo, fromStation, toStation, departureTime, arrivalTime, duration, price, arrivalType }) => {
  const amount = Math.round(price || 0).toString();
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.trainNo}>{trainNo}</div>
        <div className={styles.stations}>{fromStation} → {toStation}</div>
      </div>
      <div className={styles.middle}>
        <div className={styles.timeItem}>
          <div className={styles.timeLabel}>出发</div>
          <div className={styles.timeValue}>{departureTime}</div>
        </div>
        <div className={styles.timeItem}>
          <div className={styles.timeLabel}>到达</div>
          <div className={styles.timeValue}>{arrivalTime}</div>
        </div>
        <div className={styles.timeItem}>
          <div className={styles.timeLabel}>历时</div>
          <div className={styles.timeValue}>{duration}{arrivalType ? ` · ${arrivalType}` : ''}</div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.price}><span className={styles.currency}>¥</span><span className={styles.amount}>{amount}</span></div>
        <button className={styles.bookBtn} aria-label="预订">预订</button>
      </div>
    </div>
  );
});