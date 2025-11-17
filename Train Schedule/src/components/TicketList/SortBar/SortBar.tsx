import React from 'react';
import styles from './SortBar.module.css';

type Props = { value?: 'departure_asc' | 'duration_asc' | 'price_asc'; onChange?: (v: 'departure_asc' | 'duration_asc' | 'price_asc') => void };

const tabs: Array<{key: Props['value'], label: string}> = [
  { key: 'departure_asc', label: '出发时间' },
  { key: 'duration_asc', label: '历时' },
  { key: 'price_asc', label: '票价' },
];

export const SortBar: React.FC<Props> = ({ value = 'departure_asc', onChange }) => (
  <div className={styles.bar}>
    <span className={styles.label}>排序</span>
    {tabs.map(t => (
      <button key={t.key} className={`${styles.tab} ${value === t.key ? styles.active : ''}`} onClick={() => onChange?.(t.key!)}>{t.label}</button>
    ))}
  </div>
);