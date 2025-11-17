import React from 'react';
import styles from './TicketTable.module.css';

type SeatStatus = '有' | '候补' | number | '-';
type MatrixDetail = { price: number | null; stock: SeatStatus };
type SeatMatrix = {
  business_seat?: MatrixDetail;
  first_seat?: MatrixDetail;
  second_seat?: MatrixDetail;
  soft_berth?: MatrixDetail;
  hard_berth?: MatrixDetail;
  soft_seat?: MatrixDetail;
  hard_seat?: MatrixDetail;
  none_seat?: MatrixDetail;
};
type Ticket = { trainNo: string; from: string; to: string; date: string; departureTime: string; arrivalTime: string; duration: string; seats: SeatMatrix };

function renderSeatStatus(s: SeatStatus | undefined) {
  if (s === undefined) return <span className={styles.dash}>-</span>;
  if (s === '-') return <span className={styles.dash}>-</span>;
  if (s === '候补') return <span className={styles.wait}>候补</span>;
  if (s === '有') return <span className={styles.ok}>有</span>;
  return <span>{s}</span>;
}

export const TicketTable: React.FC<{ data: Ticket[] }> = ({ data }) => {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>车次</th>
            <th className={styles.th}>出发站/到达站</th>
            <th className={styles.th}>出发/到达时间</th>
            <th className={styles.th}>历时</th>
            <th className={styles.th}>商务座</th>
            <th className={styles.th}>一等座</th>
            <th className={styles.th}>二等座</th>
            <th className={styles.th}>软卧</th>
            <th className={styles.th}>硬卧</th>
            <th className={styles.th}>软座</th>
            <th className={styles.th}>硬座</th>
            <th className={styles.th}>无座</th>
            <th className={styles.th}>预定</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {data.map(t => {
            return (
              <tr key={t.trainNo} className={styles.tr}>
                <td className={styles.td}>{t.trainNo}</td>
                <td className={styles.td}>{t.from} / {t.to}</td>
                <td className={styles.td}>{t.departureTime} / {t.arrivalTime}</td>
                <td className={styles.td}>{t.duration}</td>
                <td className={`${styles.td} ${styles.seatCell}`}>{renderSeatStatus(t.seats.business_seat?.stock)}</td>
                <td className={`${styles.td} ${styles.seatCell}`}>{renderSeatStatus(t.seats.first_seat?.stock)}</td>
                <td className={`${styles.td} ${styles.seatCell}`}>{renderSeatStatus(t.seats.second_seat?.stock)}</td>
                <td className={`${styles.td} ${styles.seatCell}`}>{renderSeatStatus(t.seats.soft_berth?.stock)}</td>
                <td className={`${styles.td} ${styles.seatCell}`}>{renderSeatStatus(t.seats.hard_berth?.stock)}</td>
                <td className={`${styles.td} ${styles.seatCell}`}>{renderSeatStatus(t.seats.soft_seat?.stock)}</td>
                <td className={`${styles.td} ${styles.seatCell}`}>{renderSeatStatus(t.seats.hard_seat?.stock)}</td>
                <td className={`${styles.td} ${styles.seatCell}`}>{renderSeatStatus(t.seats.none_seat?.stock)}</td>
                <td className={styles.td}><button className={styles.btn}>预订</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};