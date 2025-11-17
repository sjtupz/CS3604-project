import React from 'react';
import styles from './QuerySummary.module.css';

type Props = {
  fromCity: string;
  toCity: string;
  date: string;
  onSwap?: () => void;
};

export const QuerySummary: React.FC<Props> = ({ fromCity, toCity, date, onSwap }) => {
  return (
    <div className={styles.bar}>
      <div className={styles.item}>
        <span className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9a2 2 0 100-4 2 2 0 000 4z" fill="#3B99FC" />
          </svg>
        </span>
        <span className={styles.label}>出发地</span>
        <span className={styles.value}>{fromCity}</span>
      </div>
      <button className={styles.swap} aria-label="互换出发地和目的地" onClick={onSwap}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 7h11l-3-3m3 3l-3 3M17 17H6l3 3m-3-3l3-3" stroke="#3B99FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className={styles.item}>
        <span className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9a2 2 0 100-4 2 2 0 000 4z" fill="#3B99FC" />
          </svg>
        </span>
        <span className={styles.label}>目的地</span>
        <span className={styles.value}>{toCity}</span>
      </div>
      <div className={styles.item}>
        <span className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="16" rx="2" ry="2" stroke="#3B99FC" strokeWidth="2"/>
            <path d="M16 3v4M8 3v4M3 11h18" stroke="#3B99FC" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
        <span className={styles.label}>日期</span>
        <span className={styles.value}>{date}</span>
      </div>
    </div>
  );
};