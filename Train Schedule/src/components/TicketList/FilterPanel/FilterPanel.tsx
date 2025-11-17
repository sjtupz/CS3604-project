import React, { useState } from 'react';
import styles from './FilterPanel.module.css';

export type FilterPanelProps = {
  startDate?: string;
  departureCities?: string[];
  arrivalCities?: string[];
  departureStations?: string[];
  arrivalStations?: string[];
  seatTypes?: string[];
  onChange?: (v: { types: string[]; station?: string; seat?: string; depStations?: string[]; arrStations?: string[]; depRange?: [string, string] | undefined }) => void;
};

// 改为多行复选框布局（4.png 样式），不再使用旧的选项集合

export const FilterPanel: React.FC<FilterPanelProps> = ({ startDate, departureCities = [], arrivalCities = [], departureStations = [], arrivalStations = [], seatTypes = [], onChange }) => {
  const [types, setTypes] = useState<string[]>(['全部']);
  const [seats, setSeats] = useState<string[]>(['全部']);
  const [depStations, setDepStations] = useState<string[]>(['全部']);
  const [arrStations, setArrStations] = useState<string[]>(['全部']);
  const [dateIndex, setDateIndex] = useState<number>(1);
  const SEAT_EN: Record<string, string> = {
    '商务座': 'Business Class',
    '高级动卧': 'Deluxe EMU Sleeper',
    '优选一等座': 'First Class Preferred',
    '优选一等': 'First Class Preferred',
    '一等座': 'First Class',
    '二等座': 'Second Class',
    '高级软卧': 'Deluxe Soft Sleeper',
    '一等卧': 'First Class Sleeper',
    '二等卧': 'Second Class Sleeper',
    '动卧': 'EMU Sleeper',
    '软卧': 'Soft Sleeper',
    '硬卧': 'Hard Sleeper',
    '硬座': 'Hard Seat',
  };
  const FULL_SEATS_ORDERED: string[] = [
    '商务座','高级动卧','优选一等座','一等座','二等座','高级软卧','一等卧','二等卧','动卧','软卧','硬卧','硬座'
  ];
  const displaySeatTypes = React.useMemo(() => {
    return FULL_SEATS_ORDERED;
  }, []);

  const baseDate = React.useMemo(() => {
    if (startDate) {
      const d = new Date(startDate);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  }, [startDate]);
  const days = React.useMemo(() => {
    const fmt = (d: Date) => `${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const wk = ['周日','周一','周二','周三','周四','周五','周六'];
    return Array.from({ length: 90 }).map((_, i) => {
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + i);
      return `${fmt(d)} ${wk[d.getDay()]}`;
    });
  }, [baseDate]);

  const toggle = (current: string[], value: string, set: (v: string[]) => void) => {
    const next = value === '全部' ? ['全部'] : (current.includes(value) ? current.filter(t => t !== value) : [...current.filter(t => t !== '全部'), value]);
    set(next);
    const seatOne = seats.includes('全部') || seats.length !== 1 ? '全部' : seats[0];
    onChange?.({ types, seat: seatOne });
  };

  return (
    <div className={styles.panel}>
      <div className={styles.dateRow}>
        <div className={styles.dateStrip}>
          {days.map((label, i) => (
            <button key={i} className={`${styles.dateItem} ${i === dateIndex ? styles.dateActive : ''}`} onClick={() => setDateIndex(i)} aria-label={`选择日期${label}`}>{label}</button>
          ))}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>车次类型:</div>
        <div className={styles.options}>
          <label className={styles.option}><input type="checkbox" checked={types.includes('全部')} onChange={() => { setTypes(['全部']); onChange?.({ types: ['全部'], seat: seats[0] }); }} aria-label="选择全部" /><span>全部</span></label>
          <label className={styles.option}><input type="checkbox" checked={types.includes('G')} onChange={() => { const next = types.includes('G') ? types.filter(t => t !== 'G') : [...types.filter(t => t !== '全部'), 'G']; setTypes(next); onChange?.({ types: next, seat: seats[0] }); }} aria-label="选择G" /><span>GC-高铁/城际</span></label>
          <label className={styles.option}><input type="checkbox" checked={types.includes('D')} onChange={() => toggle(types, 'D', setTypes)} aria-label="选择D" /><span>D-动车</span></label>
          <label className={styles.option}><input type="checkbox" checked={types.includes('Z')} onChange={() => toggle(types, 'Z', setTypes)} aria-label="选择Z" /><span>Z-直达</span></label>
          <label className={styles.option}><input type="checkbox" checked={types.includes('T')} onChange={() => toggle(types, 'T', setTypes)} aria-label="选择T" /><span>T-特快</span></label>
          <label className={styles.option}><input type="checkbox" checked={types.includes('K')} onChange={() => toggle(types, 'K', setTypes)} aria-label="选择K" /><span>K-快速</span></label>
          <label className={styles.option}><input type="checkbox" checked={types.includes('其他')} onChange={() => toggle(types, '其他', setTypes)} aria-label="选择其他" /><span>其他</span></label>
          <label className={styles.option}><input type="checkbox" checked={types.includes('复兴号')} onChange={() => toggle(types, '复兴号', setTypes)} aria-label="选择复兴号" /><span>复兴号</span></label>
          <label className={styles.option}><input type="checkbox" checked={types.includes('智能动车组')} onChange={() => toggle(types, '智能动车组', setTypes)} aria-label="选择智能动车组" /><span>智能动车组</span></label>
        </div>
        <div className={styles.right}>
          <span className={styles.rightLabel}>发车时间:</span>
          <select className={styles.timeSelect} aria-label="发车时间选择" defaultValue="00:00-24:00" onChange={(e) => {
            const v = e.target.value;
            const map = (label: string): [string,string] | undefined => {
              if (label === '00:00-06:00') return ['00:00','06:00'];
              if (label === '06:00-12:00') return ['06:00','12:00'];
              if (label === '12:00-18:00') return ['12:00','18:00'];
              if (label === '18:00-24:00') return ['18:00','23:59'];
              return undefined;
            };
            const seatOne = seats.includes('全部') || seats.length !== 1 ? '全部' : seats[0];
            onChange?.({ types, depStations, arrStations, seat: seatOne, depRange: map(v) });
          }}>
            <option value="00:00-24:00">00:00~24:00</option>
            <option value="00:00-06:00">00:00~06:00</option>
            <option value="06:00-12:00">06:00~12:00</option>
            <option value="12:00-18:00">12:00~18:00</option>
            <option value="18:00-24:00">18:00~24:00</option>
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.title}>出发车站:</div>
        <div className={styles.options}>
          <label className={styles.option}><input type="checkbox" checked={depStations.includes('全部')} onChange={() => { setDepStations(['全部']); onChange?.({ types, depStations: ['全部'], arrStations, seat: seats[0] }); }} aria-label="选择出发全部" /><span>全部</span></label>
          {departureCities.map(st => (
            <label key={`dc-${st}`} className={styles.option}><input type="checkbox" checked={depStations.includes(st)} onChange={() => {
              const next = depStations.includes(st) ? depStations.filter(x => x !== st) : [...depStations.filter(x => x !== '全部'), st];
              setDepStations(next.length ? next : ['全部']);
              const seatOne = seats.includes('全部') || seats.length !== 1 ? '全部' : seats[0];
              onChange?.({ types, depStations: next.length ? next : ['全部'], arrStations, seat: seatOne });
            }} aria-label={`选择出发${st}`} /><span>{st}</span></label>
          ))}
          {departureStations.map(st => (
            <label key={st} className={styles.option}><input type="checkbox" checked={depStations.includes(st)} onChange={() => {
              const next = depStations.includes(st) ? depStations.filter(x => x !== st) : [...depStations.filter(x => x !== '全部'), st];
              setDepStations(next.length ? next : ['全部']);
              const seatOne = seats.includes('全部') || seats.length !== 1 ? '全部' : seats[0];
              onChange?.({ types, depStations: next.length ? next : ['全部'], arrStations, seat: seatOne });
            }} aria-label={`选择出发${st}`} /><span>{st}</span></label>
          ))}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.title}>到达车站:</div>
        <div className={styles.options}>
          <label className={styles.option}><input type="checkbox" checked={arrStations.includes('全部')} onChange={() => { setArrStations(['全部']); onChange?.({ types, depStations, arrStations: ['全部'], seat: seats[0] }); }} aria-label="选择到达全部" /><span>全部</span></label>
          {arrivalCities.map(st => (
            <label key={`ac-${st}`} className={styles.option}><input type="checkbox" checked={arrStations.includes(st)} onChange={() => {
              const next = arrStations.includes(st) ? arrStations.filter(x => x !== st) : [...arrStations.filter(x => x !== '全部'), st];
              setArrStations(next.length ? next : ['全部']);
              const seatOne = seats.includes('全部') || seats.length !== 1 ? '全部' : seats[0];
              onChange?.({ types, depStations, arrStations: next.length ? next : ['全部'], seat: seatOne });
            }} aria-label={`选择到达${st}`} /><span>{st}</span></label>
          ))}
          {arrivalStations.map(st => (
            <label key={st} className={styles.option}><input type="checkbox" checked={arrStations.includes(st)} onChange={() => {
              const next = arrStations.includes(st) ? arrStations.filter(x => x !== st) : [...arrStations.filter(x => x !== '全部'), st];
              setArrStations(next.length ? next : ['全部']);
              const seatOne = seats.includes('全部') || seats.length !== 1 ? '全部' : seats[0];
              onChange?.({ types, depStations, arrStations: next.length ? next : ['全部'], seat: seatOne });
            }} aria-label={`选择到达${st}`} /><span>{st}</span></label>
          ))}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.title}>车次席别:</div>
        <div className={styles.options}>
          <label className={styles.option}><input type="checkbox" checked={seats.includes('全部')} onChange={() => { setSeats(['全部']); onChange?.({ types, seat: '全部' }); }} aria-label="选择席别全部" /><span>全部</span></label>
          {displaySeatTypes.map(name => (
            <label key={name} className={styles.option}><input type="checkbox" checked={seats.includes(name)} onChange={() => toggle(seats, name, setSeats)} aria-label={`选择${name}`} /><span>{name}</span>{SEAT_EN[name] && <span className={styles.en}>({SEAT_EN[name]})</span>}</label>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.applyBtn}>筛选</button>
      </div>
    </div>
  );
};