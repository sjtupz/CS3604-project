import React, { useMemo, useState } from 'react';
import styles from './DatePickerBar.module.css';

type Props = {
  value: string;
  onChange: (date: string) => void;
  rangeLabel?: string;
  onRangeChange?: (label: string) => void;
};

function fmt(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const DatePickerBar: React.FC<Props> = ({ value, onChange, rangeLabel = '00:00-24:00', onRangeChange }) => {
  const [invalid, setInvalid] = useState<string | null>(null);
  const days = useMemo(() => {
    const base = new Date(value);
    if (isNaN(base.getTime())) return [];
    return Array.from({ length: 14 }).map((_, i) => fmt(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i)));
  }, [value]);

  const trySet = (val: string) => {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    if (re.test(val)) { setInvalid(null); onChange(val); } else { setInvalid('日期格式错误，需 YYYY-MM-DD'); }
  };

  return (
    <div className={styles.bar}>
      {days.map(d => (
        <button key={d} className={`${styles.tab} ${d === value ? styles.active : ''}`} onClick={() => trySet(d)}>{d.slice(5)}</button>
      ))}
      <div className={styles.spacer} />
      <div className={styles.ctrl}>
        <label className={styles.label}>发车时间:</label>
        <select aria-label="发车时间选择" value={rangeLabel} onChange={e => onRangeChange?.(e.target.value)}>
          <option value="00:00-24:00">00:00-24:00</option>
          <option value="00:00-06:00">00:00-06:00</option>
          <option value="06:00-12:00">06:00-12:00</option>
          <option value="12:00-18:00">12:00-18:00</option>
          <option value="18:00-24:00">18:00-24:00</option>
        </select>
        <input role="textbox" aria-label="日期输入" aria-invalid={invalid ? 'true' : 'false'} className={styles.input} value={value} onChange={e => trySet(e.target.value)} />
        <button className={styles.btn} onClick={() => trySet(fmt(new Date(new Date(value).getTime() - 24*3600*1000)))}>前一天</button>
        <button className={styles.btn} onClick={() => trySet(fmt(new Date(new Date(value).getTime() + 24*3600*1000)))}>后一天</button>
      </div>
      {invalid && <div role="alert" aria-live="polite" className={styles.error}>{invalid}</div>}
    </div>
  );
};