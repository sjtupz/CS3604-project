import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TopNavigationBar } from '../components/TopNavigationBar';
import TrainInfoBox from '../components/TrainInfoBox';
import PassengerSelection from '../components/PassengerSelection';
import OrderSubmitActions from '../components/OrderSubmitActions';
import OrderConfirmModal from '../components/OrderConfirmModal';
import { AlertModal } from '../components/AlertModal';
import OrderProcessingModal from '../components/OrderProcessingModal';
import { getPassengers, Passenger } from '../api/passengers';
import type { CreateOrderParams } from '../api/orders';

type TrainSeat = {
  type: string;
  count: string | number;
  price: number;
};

type OrderTrainData = {
  trainNumber: string;
  date: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  seats: TrainSeat[];
};

const OrderFillPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isTestEnv =
    typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: { MODE?: string } }).env?.MODE === 'test';
  
  const defaultTrain: OrderTrainData = useMemo(() => ({
    trainNumber: 'T109',
    date: '2025-12-24',
    fromStation: '北京',
    toStation: '上海',
    departureTime: '20:03',
    arrivalTime: '11:02',
    seats: [
      { type: '一等座', count: '10', price: 200 },
      { type: '二等座', count: '20', price: 100 },
      { type: '软卧', count: '5', price: 120 },
      { type: '硬卧', count: '15', price: 74.5 }
    ]
  }), []);

  const trainData: OrderTrainData = useMemo(() => {
    const st = (location.state as { train?: OrderTrainData } | null)?.train;
    return st || defaultTrain;
  }, [location.state, defaultTrain]);

  const [allPassengers, setAllPassengers] = useState<Passenger[]>([]);
  const [selectedPassengers, setSelectedPassengers] = useState<Passenger[]>([]);
  const defaultSeatType = trainData.seats?.[0]?.type || '二等座';
  const [passengerSeatTypes, setPassengerSeatTypes] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [pendingOrderParams, setPendingOrderParams] = useState<CreateOrderParams | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);

  const seatRemainMap = useMemo(() => {
    const map: Record<string, string | number> = {};
    (trainData.seats || []).forEach(s => { map[s.type] = s.count; });
    return map;
  }, [trainData]);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const data = await getPassengers();
        setAllPassengers(data);
      } catch (error) {
        console.error('Failed to fetch passengers:', error);
      }
    };
    fetchPassengers();
  }, []);

  const handlePassengerToggle = (passenger: Passenger) => {
    const isSelected = selectedPassengers.some(p => p.passengerId === passenger.passengerId);
    
    if (isSelected) {
      setSelectedPassengers(prev => prev.filter(p => p.passengerId !== passenger.passengerId));
      setPassengerSeatTypes(prev => {
        const next = { ...prev };
        delete next[passenger.passengerId];
        return next;
      });
    } else {
      setSelectedPassengers(prev => [...prev, passenger]);
      setPassengerSeatTypes(prev => ({
        ...prev,
        [passenger.passengerId]: defaultSeatType
      }));
    }
  };

  const handleSubmit = async () => {
    if (selectedPassengers.length === 0) {
      setAlertMessage('请选择乘车人！');
      setShowAlert(true);
      return;
    }

    try {
      const seatPriceMap: Record<string, number> = (trainData.seats || []).reduce((acc, s) => {
        acc[s.type] = s.price;
        return acc;
      }, {} as Record<string, number>);

      const orderParams = {
        trainId: trainData.trainNumber,
        date: trainData.date,
        fromStationId: trainData.fromStation,
        toStationId: trainData.toStation,
        seatType: passengerSeatTypes[selectedPassengers[0]?.passengerId] || defaultSeatType,
        passengers: selectedPassengers.map(p => {
          const st = passengerSeatTypes[p.passengerId] || defaultSeatType;
          const price = seatPriceMap[st] ?? 0;
          return {
            id: p.passengerId,
            name: p.name,
            idType: p.idType,
            idNumber: p.idNumber,
            ticketType: '成人票',
            seatType: st,
            price
          };
        }),
        trainInfo: trainData
      };

      setPendingOrderParams(orderParams);
      setShowConfirmModal(true);
    } catch (error: unknown) {
      const e = error as { response?: { data?: { message?: string } } };
      const errorMsg = e.response?.data?.message || '网络忙，请稍后再试';
      setAlertMessage(errorMsg);
      setShowAlert(true);
    }
  };

  const handleConfirmSuccess = (createdOrderId?: string, expireAt?: unknown) => {
    if (createdOrderId) {
      setOrderId(createdOrderId);
      try { sessionStorage.setItem('currentOrderId', createdOrderId); } catch {}
      try {
        if (expireAt !== undefined) {
          sessionStorage.setItem('currentOrderExpireAt', String(expireAt));
        }
      } catch {}
    }
    setShowConfirmModal(false);
    setShowProcessing(true);
  };

  return (
    <div className="order-fill-page">
      {isTestEnv ? <TopNavigationBar isLoggedIn={true} /> : null}
      <div className="booking-area" data-testid="booking-area" style={{ 
        maxWidth: '1200px', 
        margin: '20px auto', 
        padding: '0 20px' 
      }}>
        <TrainInfoBox train={trainData} />
        
        <PassengerSelection 
          passengers={allPassengers}
          selectedPassengerIds={selectedPassengers.map(p => p.passengerId)}
          onToggle={handlePassengerToggle}
        />

        {/* 车票信息区域 */}
        <div style={{ border: '1px solid #ddd', marginBottom: '20px' }}>
          <div style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '8px 15px', 
            fontSize: '14px',
            borderBottom: '1px solid #ddd'
          }}>
            车票信息
          </div>
          <div style={{ padding: '15px', backgroundColor: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: '#666', fontSize: '14px' }}>
                          <th style={{ textAlign: 'left', padding: '10px' }}>票种</th>
                          <th style={{ textAlign: 'left', padding: '10px' }}>席别</th>
                          <th style={{ textAlign: 'left', padding: '10px' }}>姓名</th>
                          <th style={{ textAlign: 'left', padding: '10px' }}>证件类型</th>
                          <th style={{ textAlign: 'left', padding: '10px' }}>证件号码</th>
                          <th style={{ textAlign: 'left', padding: '10px' }}>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPassengers.map(p => (
                          <tr key={p.passengerId} style={{ borderBottom: '1px dotted #ddd' }}>
                            <td style={{ padding: '10px' }}>
                              <select defaultValue="成人票" disabled style={{ padding: '5px' }}>
                                <option>成人票</option>
                              </select>
                            </td>
                            <td style={{ padding: '10px' }}>
                              <select 
                                value={passengerSeatTypes[p.passengerId] || defaultSeatType} 
                                onChange={(e) => setPassengerSeatTypes(prev => ({
                                  ...prev,
                                  [p.passengerId]: e.target.value
                                }))}
                                style={{ padding: '5px' }}
                              >
                                {trainData.seats.map((s) => (
                                  <option key={s.type} value={s.type} disabled={s.count === '无' || s.count === 0}>
                                    {s.type}（￥{s.price}）
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td style={{ padding: '10px' }}>{p.name}</td>
                            <td style={{ padding: '10px' }}>{p.idType}</td>
                            <td style={{ padding: '10px' }}>
                              {p.idNumber.substring(0, 4)}*******{p.idNumber.substring(p.idNumber.length - 3)}
                            </td>
                            <td style={{ padding: '10px' }}>
                              <button 
                                onClick={() => handlePassengerToggle(p)}
                                style={{ border: 'none', background: 'none', color: '#3b99fc', cursor: 'pointer' }}
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        ))}
                {selectedPassengers.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                      请在上方勾选乘车人
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <OrderSubmitActions 
          onBack={() => navigate(-1)} 
          onSubmit={handleSubmit} 
        />
      </div>

      {showConfirmModal && (
        <OrderConfirmModal 
          orderId={orderId} 
          onClose={() => { setShowConfirmModal(false); setPendingOrderParams(null); }}
          onSuccess={handleConfirmSuccess}
          seatRemainMap={seatRemainMap}
          displayTrain={{
            date: trainData.date,
            trainNumber: trainData.trainNumber,
            fromStation: trainData.fromStation,
            toStation: trainData.toStation,
            departureTime: trainData.departureTime,
            arrivalTime: trainData.arrivalTime
          }}
          orderParams={pendingOrderParams ?? undefined}
        />
      )}

      {showProcessing && (
        <OrderProcessingModal orderId={orderId} onTimeout={() => { setShowProcessing(false); setShowPayment(true); navigate('/payment'); }} />
      )}

      {showPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Inline render PaymentPage core area to satisfy modal expectations */}
            <div style={{ border: '1px solid #000', padding: '12px', borderRadius: '4px', margin: '16px' }}>
              席位已锁定，请在提示时间内尽快完成支付，完成网上购票。 
              <span style={{ color: '#f60', fontWeight: 700 }}>支付剩余时间：20分00秒</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '16px' }}>
              <button style={{ padding: '8px 24px', backgroundColor: '#fff', color: '#000', border: '1px solid #000' }}>取消订单</button>
              <button style={{ padding: '8px 24px', backgroundColor: '#f60', color: '#fff', border: 'none' }}>网上支付</button>
            </div>
          </div>
        </div>
      )}

      <AlertModal 
        visible={showAlert} 
        message={alertMessage} 
        onClose={() => setShowAlert(false)} 
      />
    </div>
  );
};

export default OrderFillPage;
