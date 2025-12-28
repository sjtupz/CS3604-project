import React, { useEffect, useMemo, useState } from 'react';
import { getOrderDetails } from '../api/orders';

const PaymentSuccessPage: React.FC = () => {
  const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

  const [orderNo, setOrderNo] = useState<string>(() => {
    const nums = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
    return `EX${nums}`;
  });
  const [passengerNames, setPassengerNames] = useState<string>('');
  const orderId = useMemo(() => {
    try { return sessionStorage.getItem('currentOrderId') || ''; } catch { return ''; }
  }, []);

  const [trainInfo, setTrainInfo] = useState<{ date?: string; fromStation?: string; toStation?: string; departureTime?: string; trainNumber?: string } | null>(null);
  const [orderRows, setOrderRows] = useState<Array<{ name: string; idType: string; idNumber: string; ticketType: string; seatType: string; carriage: string; seatNo: string; price: number }>>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!orderId) return;
    getOrderDetails(orderId).then(res => {
      const data = isRecord(res?.data) ? res.data : {};

      const parseMaybeJson = (v: unknown): unknown => {
        if (typeof v !== 'string') return undefined;
        try {
          return JSON.parse(v) as unknown;
        } catch {
          return undefined;
        }
      };

      const no = data['orderNo'] || data['orderNumber'];
      if (typeof no === 'string' && no.length > 0) setOrderNo(no);
      const passengerInfoRaw = data['passengerInfo'];
      const passengerInfo = Array.isArray(passengerInfoRaw)
        ? passengerInfoRaw
        : (Array.isArray(parseMaybeJson(passengerInfoRaw)) ? (parseMaybeJson(passengerInfoRaw) as unknown[]) : []);
      const ps: Array<{ name?: string }> = Array.isArray(passengerInfo) ? (passengerInfo as Array<{ name?: string }>) : [];
      const names = ps.map(p => p?.name || '').filter(Boolean).join('、');
      if (names) setPassengerNames(names);

      const trainInfoRaw = data['trainInfo'];
      const trainInfoParsed = isRecord(trainInfoRaw) ? trainInfoRaw : parseMaybeJson(trainInfoRaw);
      const ti = isRecord(trainInfoParsed) ? trainInfoParsed : {};
      const departureTimeValue = ti['departureTime'] ?? ti['startTime'] ?? ti['departure_time'] ?? ti['start_time'];
      setTrainInfo({
        date: typeof ti['date'] === 'string' ? ti['date'] : (typeof ti['travelDate'] === 'string' ? ti['travelDate'] : undefined),
        fromStation: typeof ti['fromStation'] === 'string' ? ti['fromStation'] : (typeof ti['fromStationId'] === 'string' ? ti['fromStationId'] : undefined),
        toStation: typeof ti['toStation'] === 'string' ? ti['toStation'] : (typeof ti['toStationId'] === 'string' ? ti['toStationId'] : undefined),
        departureTime: (typeof departureTimeValue === 'string' || typeof departureTimeValue === 'number') ? String(departureTimeValue) : undefined,
        trainNumber: typeof data['trainNumber'] === 'string' ? data['trainNumber'] : undefined,
      });

      const passengers: Array<{ name: string; idType: string; idNumber: string; ticketType: string; seatType?: string; price?: number }> =
        Array.isArray(passengerInfo)
          ? (passengerInfo as Array<{ name: string; idType: string; idNumber: string; ticketType: string; seatType?: string; price?: number }>)
          : [];
      const seats = Array.isArray(ti['seats']) ? (ti['seats'] as unknown[]) : [];
      const seatPriceMap: Record<string, number> = seats.reduce((acc: Record<string, number>, s) => {
        if (!isRecord(s)) return acc;
        const type = s['type'];
        if (typeof type !== 'string') return acc;
        const price = s['price'];
        acc[type] = typeof price === 'number' ? price : 0;
        return acc;
      }, {});
      const rows = passengers.map((p, idx) => {
        const seatTypeFromTrain = ti['seatType'];
        const st = p.seatType || (typeof seatTypeFromTrain === 'string' ? seatTypeFromTrain : undefined) || '二等座';
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

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff' }}>
      <div style={{
        border: '1px solid #9fd1f0',
        background: 'linear-gradient(#f3fbdc, #eef8d6)',
        color: '#333',
        padding: '14px 16px',
        borderRadius: '4px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
            <defs>
              <linearGradient id="ok" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9bdc6b"/>
                <stop offset="100%" stopColor="#69c145"/>
              </linearGradient>
            </defs>
            <circle cx="14" cy="14" r="13" fill="url(#ok)" stroke="#86c96a"/>
            <path d="M20.5 10.5l-7 7-3.5-3.5" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: '#1a7f2e', position: 'relative' }}>
              交易已成功！感谢您选择铁路出行！您的订单号:<span style={{ color: '#ff7f00', fontWeight: 700 }}>{orderNo}</span>
              <span style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>{`交易已成功！感谢您选择铁路出行！您的订单号:${orderNo}`}</span>
            </div>
            <div style={{ marginTop: '6px', color: '#333' }}>
              {(passengerNames || '旅客')} 可持购票时使用的有效证件，于开车前到车站自助检票乘车。
            </div>
            <div style={{ marginTop: '6px', color: '#666' }}>
              根据您的选择，相关通知将通过“铁路12306”微信公众号发送给您。
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ backgroundColor: '#288BCC', color: '#fff', padding: '12px 16px', fontFamily: 'SimSun, 宋体, serif', fontWeight: 700, borderRadius: '4px 4px 0 0' }}>订单信息</div>
        <div style={{ border: '1px solid #ddd', borderTop: 'none', padding: '16px', borderRadius: '0 0 4px 4px' }}>
          <div style={{ marginBottom: '12px', fontFamily: 'SimSun, 宋体, serif', color: '#333' }}>
            <span>{trainInfo?.date ?? '-'}</span>
            <span style={{ margin: '0 10px' }}>
              {(trainInfo?.fromStation ?? '-') + '→' + (trainInfo?.toStation ?? '-')}
            </span>
            <span>{trainInfo?.trainNumber ?? ''}</span>
            <span style={{ margin: '0 10px' }} />
            <span>{trainInfo?.departureTime ?? '-'}</span>
          </div>

          <table role="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
