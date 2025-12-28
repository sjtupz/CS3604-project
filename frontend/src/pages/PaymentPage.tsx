import React, { useEffect, useMemo, useRef, useState } from 'react';
import OrderCancelConfirmModal from '../components/OrderCancelConfirmModal';
import { getOrderDetails, payOrder, cancelOrder } from '../api/orders';
import { useNavigate } from 'react-router-dom';

const PaymentPage: React.FC = () => {
  const [countdown, setCountdown] = useState(20 * 60);
  const [showCancel, setShowCancel] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderRows, setOrderRows] = useState<Array<{ name: string; idType: string; idNumber: string; ticketType: string; seatType: string; carriage: string; seatNo: string; price: number }>>([]);
  const orderId = useMemo(() => sessionStorage.getItem('currentOrderId') || '', []);
  const navigate = useNavigate();
  const lastTickNowMsRef = useRef<number | null>(null);

  const parseExpireAtMs = (v: string | null): number | null => {
    if (!v) return null
    const t = Date.parse(v)
    return Number.isNaN(t) ? null : t
  }

  const [expireAtMs, setExpireAtMs] = useState<number | null>(() => parseExpireAtMs(sessionStorage.getItem('currentOrderExpireAt')))

  useEffect(() => {
    if (!orderId) return;
    getOrderDetails(orderId).then(res => {
      const d = res?.data || {};

      const parseMaybeJson = (v: unknown): unknown => {
        if (typeof v !== 'string') return undefined;
        try {
          return JSON.parse(v) as unknown;
        } catch {
          return undefined;
        }
      };

      const trainInfoRaw = (d as { trainInfo?: unknown }).trainInfo;
      const trainInfoParsed = (trainInfoRaw && typeof trainInfoRaw === 'object') ? trainInfoRaw : parseMaybeJson(trainInfoRaw);
      const trainInfo = (trainInfoParsed && typeof trainInfoParsed === 'object') ? (trainInfoParsed as Record<string, unknown>) : undefined;

      try {
        const storedExpireAtMs = parseExpireAtMs(sessionStorage.getItem('currentOrderExpireAt'))
        if (storedExpireAtMs) {
          setExpireAtMs(storedExpireAtMs)
        } else if (typeof d.createdAt === 'string') {
          const createdAtMs = Date.parse(d.createdAt)
          if (!Number.isNaN(createdAtMs)) {
            const nextExpireAtMs = createdAtMs + 20 * 60 * 1000
            sessionStorage.setItem('currentOrderExpireAt', new Date(nextExpireAtMs).toISOString())
            setExpireAtMs(nextExpireAtMs)
          }
        }
      } catch {}

      const passengerInfoRaw = (d as { passengerInfo?: unknown }).passengerInfo;
      const passengerInfo = Array.isArray(passengerInfoRaw)
        ? passengerInfoRaw
        : (Array.isArray(parseMaybeJson(passengerInfoRaw)) ? (parseMaybeJson(passengerInfoRaw) as unknown[]) : []);

      const passengers: Array<{ name: string; idType: string; idNumber: string; ticketType: string; seatType?: string; price?: number }> =
        Array.isArray(passengerInfo)
          ? (passengerInfo as Array<{ name: string; idType: string; idNumber: string; ticketType: string; seatType?: string; price?: number }>)
          : [];

      const seatsRaw = trainInfo ? trainInfo['seats'] : undefined;
      const seatPriceMap: Record<string, number> = (Array.isArray(seatsRaw) ? seatsRaw : [])
        .reduce((acc: Record<string, number>, s: { type?: string; price?: number }) => {
          if (s?.type) acc[String(s.type)] = typeof s.price === 'number' ? s.price : 0;
          return acc;
        }, {});
      const rows = passengers.map((p, idx) => {
        const st = p.seatType || (typeof trainInfo?.['seatType'] === 'string' ? String(trainInfo?.['seatType']) : undefined) || '二等座';
        const price = typeof p.price === 'number' ? p.price : (seatPriceMap[st] ?? 0);
        return {
          name: p.name,
          idType: p.idType,
          idNumber: p.idNumber,
          ticketType: p.ticketType,
          seatType: st,
          carriage: '01',
          seatNo: String(10 + idx),
          price
        };
      });
      setOrderRows(rows);
      setTotalPrice(rows.reduce((sum, r) => sum + (r.price || 0), 0));
    }).catch(() => { /* ignore */ });
  }, [orderId]);

  useEffect(() => {
    if (!expireAtMs) return
    const tick = () => {
      const now = Date.now()
      const lastNow = lastTickNowMsRef.current
      const jumped = typeof lastNow === 'number' && now - lastNow > 1500

      let remain = Math.max(0, Math.floor((expireAtMs - now) / 1000))
      if (jumped && remain > 0) remain += 1
      setCountdown(remain)

      lastTickNowMsRef.current = now
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [expireAtMs]);

  const minutes = Math.floor(countdown / 60);
  const seconds = String(countdown % 60).padStart(2, '0');

  const handlePay = async () => {
    if (!orderId) return;
    try { await payOrder(orderId); } catch { /* ignore */ }
    navigate('/payment/success');
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff' }}>
      <div style={{
        border: '1px solid #9fd1f0',
        borderRadius: '4px',
        padding: '14px 16px',
        minHeight: '72px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontFamily: 'SimSun, 宋体, serif',
        lineHeight: 1.6
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3aa8e6"/>
              <stop offset="100%" stopColor="#1d7fc6"/>
            </linearGradient>
          </defs>
          <circle cx="14" cy="14" r="13" fill="url(#g)" stroke="#5fb3e6"/>
          <rect x="8" y="12" width="12" height="9" rx="2" fill="#fff"/>
          <path d="M10 12v-2.2a4 4 0 0 1 8 0V12h-2v-2.2a2 2 0 0 0-4 0V12z" fill="#fff"/>
        </svg>
        <div>
          席位已锁定，请在提示时间内尽快完成支付，完成网上购票。支付剩余时间：
          <span style={{ color: '#ff7f00', fontWeight: 700 }}>{minutes}分{seconds}秒</span>
        </div>
      </div>

      <div style={{ backgroundColor: '#288BCC', color: '#fff', padding: '12px 16px', fontFamily: 'SimSun, 宋体, serif', fontWeight: 700, borderRadius: '4px 4px 0 0', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>订单信息</div>
      <div style={{ border: '1px solid #ddd', borderTop: 'none', padding: '16px', borderRadius: '0 0 4px 4px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>序号</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>姓名</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>证件类型</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>证件号码</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>票种</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>席别</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>车厢</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>席位号</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>票价（元）</th>
            </tr>
          </thead>
          <tbody>
            {orderRows.length === 0 ? (
              <tr style={{ textAlign: 'center' }}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>张三</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>身份证</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>110***********1234</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>成人票</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>二等座</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>01</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>10</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td>
              </tr>
            ) : (
              orderRows.map((r, idx) => (
                <tr key={idx} style={{ textAlign: 'center' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{r.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{r.idType}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{r.idNumber}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{r.ticketType}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{r.seatType}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{r.carriage}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{r.seatNo}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{r.price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>总票价：{totalPrice}元</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '16px' }}>
        <button onClick={() => setShowCancel(true)} style={{ padding: '8px 24px', backgroundColor: '#fff', color: '#000', border: '1px solid #000' }}>取消订单</button>
        <button onClick={handlePay} style={{ padding: '8px 24px', backgroundColor: '#f60', color: '#fff', border: 'none' }}>网上支付</button>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '4px', width: '100%', maxWidth: '1200px', margin: '16px auto 0' }}>温馨提示</div>

      {showCancel && (
        <OrderCancelConfirmModal
          title="交易提示"
          message="在一天内3次申请车票成功后取消订单（包含无座票时取消5次计为取消1次），当日将不能在12306继续购票。"
          onCancel={() => setShowCancel(false)}
          onConfirm={async () => {
            setShowCancel(false);
            if (orderId) {
              try { await cancelOrder(orderId); } catch { /* ignore */ }
            }
            navigate('/tickets');
          }}
        />
      )}
    </div>
  );
};

export default PaymentPage;
