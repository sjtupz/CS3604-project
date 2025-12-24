import React, { useState, useEffect } from 'react';
import { getOrderDetails, confirmOrder, cancelOrder } from '../api/orders';

interface OrderConfirmModalProps {
  orderId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const OrderConfirmModal: React.FC<OrderConfirmModalProps> = ({ orderId, onClose, onSuccess }) => {
  const [order, setOrder] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getOrderDetails(orderId);
        setOrder(data.data);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [orderId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onClose();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs.toString().padStart(2, '0')}秒`;
  };

  const handleConfirm = async () => {
    try {
      await confirmOrder(orderId);
      onSuccess();
    } catch (error) {
      alert('支付失败，请重试');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelOrder(orderId);
      onClose();
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  if (loading) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#fff',
        width: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '4px'
      }}>
        {/* 倒计时区域 */}
        <div style={{
          backgroundColor: '#fffbe6',
          border: '1px solid #ffe58f',
          padding: '15px',
          margin: '20px',
          textAlign: 'center'
        }}>
          席位已锁定，请在提示时间内尽快完成支付，完成网上购票。 
          <span style={{ color: '#f60', fontWeight: 'bold', marginLeft: '10px' }}>
            支付剩余时间：{formatTime(timeLeft)}
          </span>
        </div>

        {/* 订单信息区域 */}
        <div style={{ margin: '0 20px 20px' }}>
          <div style={{ backgroundColor: '#3b99fc', color: '#fff', padding: '8px 15px', fontWeight: 'bold' }}>
            订单信息
          </div>
          <div style={{ padding: '15px', border: '1px solid #ddd', borderTop: 'none' }}>
            <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>
              {order?.trainInfo?.date} {order?.trainInfo?.trainNumber} 次 {order?.trainInfo?.fromStation}（{order?.trainInfo?.departureTime}开）— {order?.trainInfo?.toStation}（{order?.trainInfo?.arrivalTime}到）
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>序号</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>姓名</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>证件类型</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>证件号码</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>票种</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>席别</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>票价</th>
                </tr>
              </thead>
              <tbody>
                {order?.passengerInfo?.map((p: any, index: number) => (
                  <tr key={index} style={{ textAlign: 'center' }}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{p.name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{p.idType}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{p.idNumber}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{p.ticketType}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.trainInfo.seatType}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', color: '#f60' }}>￥{order.price / order.passengerInfo.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 按钮区域 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px', borderTop: '1px solid #eee' }}>
          <button onClick={handleCancel} style={{ padding: '8px 30px', backgroundColor: '#fff', border: '1px solid #333', cursor: 'pointer' }}>
            取消订单
          </button>
          <button onClick={handleConfirm} style={{ padding: '8px 30px', backgroundColor: '#f60', color: '#fff', border: 'none', cursor: 'pointer' }}>
            网上支付
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmModal;
