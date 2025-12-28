import React, { useState, useEffect, useMemo } from 'react';
import { createOrder, type CreateOrderParams, getOrderDetails, confirmOrder } from '../api/orders';
import styles from './OrderConfirmModal.module.css';

interface OrderConfirmModalProps {
  orderId: string;
  onClose: () => void;
  onSuccess: (createdOrderId?: string, expireAt?: unknown) => void;
  seatRemainMap?: Record<string, string | number>;
  displayTrain?: {
    date: string;
    trainNumber: string;
    fromStation: string;
    toStation: string;
    departureTime: string;
    arrivalTime: string;
  };
  orderParams?: CreateOrderParams;
}

type OrderPassengerInfo = {
  name: string;
  idType: string;
  idNumber: string;
  ticketType: string;
  seatType?: string;
};

type OrderTrainInfo = {
  date?: string;
  trainNumber?: string;
  fromStation?: string;
  toStation?: string;
  departureTime?: string;
  arrivalTime?: string;
};

type OrderDetails = {
  trainInfo?: OrderTrainInfo;
  passengerInfo?: OrderPassengerInfo[];
  price?: number;
};

const OrderConfirmModal: React.FC<OrderConfirmModalProps> = ({ orderId, onClose, onSuccess, seatRemainMap, displayTrain, orderParams }) => {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (orderParams) {
      const trainInfo = (orderParams.trainInfo && typeof orderParams.trainInfo === 'object')
        ? (orderParams.trainInfo as OrderTrainInfo)
        : undefined;
      const passengerInfo: OrderPassengerInfo[] = (orderParams.passengers || []).map((p) => ({
        name: p.name,
        idType: p.idType,
        idNumber: p.idNumber,
        ticketType: p.ticketType,
        seatType: p.seatType,
      }));
      const price = (orderParams.passengers || []).reduce((sum, p) => sum + Number(p.price ?? 0), 0);
      setOrder({ trainInfo, passengerInfo, price });
      setLoading(false);
      return;
    }

    if (!orderId) {
      setOrder(null);
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const data = await getOrderDetails(orderId);
        const raw = (data as { data?: unknown }).data;
        const parseMaybeJson = (v: unknown): unknown => {
          if (typeof v !== 'string') return undefined;
          try {
            return JSON.parse(v) as unknown;
          } catch {
            return undefined;
          }
        };

        const rawRecord = (raw && typeof raw === 'object') ? (raw as Record<string, unknown>) : {};
        const trainInfoRaw = rawRecord['trainInfo'];
        const trainInfoParsed = (trainInfoRaw && typeof trainInfoRaw === 'object') ? trainInfoRaw : parseMaybeJson(trainInfoRaw);
        const passengerInfoRaw = rawRecord['passengerInfo'];
        const passengerInfoParsed = Array.isArray(passengerInfoRaw)
          ? passengerInfoRaw
          : (Array.isArray(parseMaybeJson(passengerInfoRaw)) ? (parseMaybeJson(passengerInfoRaw) as unknown[]) : undefined);

        setOrder({
          ...(rawRecord as unknown as OrderDetails),
          trainInfo: (trainInfoParsed && typeof trainInfoParsed === 'object') ? (trainInfoParsed as OrderTrainInfo) : undefined,
          passengerInfo: passengerInfoParsed as OrderPassengerInfo[] | undefined,
        });
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [orderId, orderParams]);

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (orderParams) {
        const created = await createOrder(orderParams);
        const createdOrderId = (created as { data?: { orderId?: unknown } })?.data?.orderId;
        const createdExpireAt = (created as { data?: { expireAt?: unknown } })?.data?.expireAt;
        const id = typeof createdOrderId === 'string' ? createdOrderId : '';
        if (!id) {
          onSuccess();
          return;
        }
        await confirmOrder(id);
        onSuccess(id, createdExpireAt);
        return;
      }
      await confirmOrder(orderId);
      onSuccess(orderId);
    } catch (e) {
      console.error('Failed to confirm order:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const trainParts = useMemo(() => {
    const src = displayTrain || order?.trainInfo || {};
    const d = (src as OrderTrainInfo).date || (order?.trainInfo as { travelDate?: string } | undefined)?.travelDate || '';
    const weekMap = ['周日','周一','周二','周三','周四','周五','周六'];
    let weekStr = '';
    try {
      const w = new Date(d).getDay();
      weekStr = `（${weekMap[w]}）`;
    } catch {}
    return {
      date: d,
      weekStr,
      trainNumber: (src as OrderTrainInfo).trainNumber || '',
      fromStation: (src as OrderTrainInfo).fromStation || '',
      toStation: (src as OrderTrainInfo).toStation || '',
      departureTime: (src as OrderTrainInfo).departureTime || '',
      arrivalTime: (src as OrderTrainInfo).arrivalTime || ''
    };
  }, [order, displayTrain]);

  const uniqueSeatTypes = useMemo(() => {
    const list = order?.passengerInfo?.map(p => String(p.seatType || '')).filter(Boolean) || [];
    const set = Array.from(new Set(list));
    if (set.length === 0) {
      const t = (order?.trainInfo as { seatType?: string } | undefined)?.seatType;
      return t ? [String(t)] : [];
    }
    return set;
  }, [order]);

  const remainText = useMemo(() => {
    if (uniqueSeatTypes.length === 0) return null;
    if (!seatRemainMap) {
      const items = uniqueSeatTypes.map(st => `${st}余票若干张`);
      return `本次列车，${items.join('，')}。`;
    }
    const items = uniqueSeatTypes.map(st => {
      const val = seatRemainMap[st];
      let show = '有';
      if (typeof val === 'number') show = String(val);
      else if (typeof val === 'string') {
        const n = parseInt(val);
        show = Number.isNaN(n) ? (val === '无' ? '0' : '有') : String(n);
      }
      return `${st}余票${show}张`;
    });
    return `本次列车，${items.join('，')}。`;
  }, [seatRemainMap, uniqueSeatTypes]);

  const maskId = (id: string) => {
    if (!id || id.length < 8) return id;
    const head = id.slice(0, 4);
    const tail = id.slice(-3);
    return `${head}${'*'.repeat(Math.max(id.length - 7, 7))}${tail}`;
  };

  if (loading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>请核对以下信息</div>
        <div className={styles.content}>
          <div className={styles.trainLine}>
            {trainParts.date && <span className={styles.trainStrong}>{trainParts.date}</span>}
            {trainParts.weekStr && <span className={styles.trainMinor}> {trainParts.weekStr}</span>}
            {trainParts.trainNumber && (
              <>
                {' '}
                <span className={styles.trainStrong}>{trainParts.trainNumber}</span>
                <span className={styles.trainMinor}>次</span>
              </>
            )}
            {' '}
            {trainParts.fromStation && <span className={styles.trainStrong}>{trainParts.fromStation}</span>}
            {trainParts.departureTime && (
              <span className={styles.trainMinor}>
                （<span className={styles.trainStrong}>{trainParts.departureTime}</span><span className={styles.trainMinor}>开</span>）
              </span>
            )}
            <span className={styles.trainMinor}> — </span>
            {trainParts.toStation && <span className={styles.trainStrong}>{trainParts.toStation}</span>}
            {trainParts.arrivalTime && (
              <span className={styles.trainMinor}>
                （<span className={styles.trainStrong}>{trainParts.arrivalTime}</span><span className={styles.trainMinor}>到</span>）
              </span>
            )}
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>序号</th>
                <th className={styles.th}>席别</th>
                <th className={styles.th}>票种</th>
                <th className={styles.th}>姓名</th>
                <th className={styles.th}>证件类型</th>
                <th className={styles.th}>证件号码</th>
              </tr>
            </thead>
            <tbody>
              {order?.passengerInfo?.map((p, index) => (
                <tr key={index} className={styles.tr}>
                  <td className={styles.tdCenter}>{index + 1}</td>
                  <td className={styles.tdCenter}>{p.seatType || (order?.trainInfo as { seatType?: string } | undefined)?.seatType || ''}</td>
                  <td className={styles.tdCenter}>{p.ticketType}</td>
                  <td className={styles.td}>{p.name}</td>
                  <td className={styles.tdCenter}>{p.idType}</td>
                  <td className={styles.tdCenter}>{maskId(p.idNumber)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {remainText ? (
            seatRemainMap ? (
              <div className={styles.remain}>
                {remainText.split('，').map((seg, i) => {
                  const m = seg.match(/(.*?余票)(\d+|有|0)(张)/);
                  if (!m) return <span key={i}>{i === 0 && !seg.startsWith('本次列车') ? (i===0?`本次列车，${seg}`:seg) : seg}{i < remainText.split('，').length - 1 ? '，' : ''}</span>;
                  const pre = m[1];
                  const num = m[2];
                  const suf = m[3];
                  return (
                    <span key={i} className={styles.remainSeat}>
                      {i===0 ? '本次列车，' : ''}
                      {pre}<strong className={styles.remainNum}>{num}</strong>{suf}
                      {i < remainText.split('，').length - 1 ? '，' : ''}
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className={styles.remain}>{remainText}</div>
            )
          ) : null}
        </div>
        <div className={styles.footer}>
          <button className={styles.btnSecondary} onClick={onClose}>返回修改</button>
          <button className={styles.btnPrimary} onClick={handleConfirm} disabled={submitting}>{submitting ? '确认中…' : '确认'}</button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmModal;
