import React from 'react';
import styles from './Orders.module.css';

export default function Orders() {
  const orders = [
    { id: '20251116001', trainNo: 'G108', date: '2025-11-20', from: '北京南', to: '上海虹桥', amount: 553 },
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.list}>
        {orders.map(o => (
          <div key={o.id} className={styles.item}>
            <div>{o.trainNo} · {o.from} → {o.to} · {o.date}</div>
            <button className={styles.btn}>支付</button>
          </div>
        ))}
      </div>
    </div>
  );
}