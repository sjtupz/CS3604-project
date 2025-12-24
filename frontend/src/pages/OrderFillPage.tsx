import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TopNavigationBar } from '../components/TopNavigationBar';
import { QuickAccessMenu } from '../components/QuickAccessMenu';
import TrainInfoBox from '../components/TrainInfoBox';
import PassengerSelection from '../components/PassengerSelection';
import OrderSubmitActions from '../components/OrderSubmitActions';
import OrderConfirmModal from '../components/OrderConfirmModal';
import { AlertModal } from '../components/AlertModal';
import { Footer } from '../components/Footer';
import { getPassengers, Passenger } from '../api/passengers';
import { createOrder } from '../api/orders';

const OrderFillPage: React.FC = () => {
  let location: any = { state: null };
  let navigate: any = () => {};
  
  try {
    location = useLocation();
    navigate = useNavigate();
  } catch (e) {
    // 允许在没有 Router 的测试环境下渲染
  }
  
  // 从 location.state 获取选中的车次和席位信息
  const trainData = location.state?.train || {
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
  };

  const [allPassengers, setAllPassengers] = useState<Passenger[]>([]);
  const [selectedPassengers, setSelectedPassengers] = useState<Passenger[]>([]);
  const [selectedSeatType, setSelectedSeatType] = useState(trainData.seats?.[0]?.type || '二等座');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

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
    setSelectedPassengers(prev => {
      const exists = prev.find(p => p.passengerId === passenger.passengerId);
      if (exists) {
        return prev.filter(p => p.passengerId !== passenger.passengerId);
      } else {
        return [...prev, passenger];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedPassengers.length === 0) {
      setAlertMessage('请选择乘车人！');
      setShowAlert(true);
      return;
    }

    try {
      const orderParams = {
        trainId: trainData.trainNumber,
        date: trainData.date,
        fromStationId: trainData.fromStation,
        toStationId: trainData.toStation,
        seatType: selectedSeatType,
        passengers: selectedPassengers.map(p => ({
          id: p.passengerId,
          name: p.name,
          idType: p.idType,
          idNumber: p.idNumber,
          ticketType: '成人票'
        })),
        trainInfo: trainData
      };
      
      const result = await createOrder(orderParams);
      setOrderId(result.data.orderId);
      setShowConfirmModal(true);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || '网络忙，请稍后再试';
      setAlertMessage(errorMsg);
      setShowAlert(true);
    }
  };

  const handleConfirmSuccess = () => {
    setShowConfirmModal(false);
    navigate('/profile', { state: { activeTab: 'orders' } });
  };

  return (
    <div className="order-fill-page">
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
                                value={selectedSeatType} 
                                onChange={(e) => setSelectedSeatType(e.target.value)}
                                style={{ padding: '5px' }}
                              >
                                {trainData.seats.map((s: any) => (
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
                    <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
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
          onClose={() => setShowConfirmModal(false)}
          onSuccess={handleConfirmSuccess}
        />
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
