import React from 'react';
import styles from './EmptyState.module.css';

export const EmptyState: React.FC<{ text?: string }> = ({ text = '未查询到符合条件的车次' }) => {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="#9aa3af" strokeWidth="2" />
        <path d="M9 9l6 6M15 9l-6 6" stroke="#9aa3af" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className={styles.text}>{text}</div>
    </div>
  );
};