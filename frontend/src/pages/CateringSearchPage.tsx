import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CateringSpecialties.module.css';

const CateringSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [trainNo, setTrainNo] = useState('');
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');

  const search = () => {
    const params = new URLSearchParams({ date, train: trainNo, from: fromStation, to: toStation });
    navigate(`/catering?${params.toString()}`);
  };

  return (
    <div className={styles['catering-page']} data-testid="catering-search-page">
      <div className={styles.hero}>
        <div className={styles.headline}>
          选择出行信息，搜索可预订餐饮
        </div>
        <div className={styles['search-bar']}>
          <div className={styles.field}>
            <input type="date" aria-label="日期" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className={styles.field}>
            车次
            <input aria-label="车次" placeholder="G103" value={trainNo} onChange={(e) => setTrainNo(e.target.value)} />
          </div>
          <div className={styles.field}>
            乘车站
            <input aria-label="乘车站" placeholder="北京南" value={fromStation} onChange={(e) => setFromStation(e.target.value)} />
          </div>
          <div className={styles.field}>
            到达站
            <input aria-label="到达站" placeholder="上海虹桥" value={toStation} onChange={(e) => setToStation(e.target.value)} />
          </div>
          <button className={styles['search-btn']} onClick={search}>搜索</button>
        </div>
      </div>
    </div>
  );
};

export default CateringSearchPage;
