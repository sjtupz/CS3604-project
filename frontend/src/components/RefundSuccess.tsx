// TODO: 实现退票成功界面组件
import React from 'react';

interface RefundSuccessProps {
  orderId: string;
  trainNumber?: string;
  refundFee?: number;
  onContinueBooking?: () => void;
  onViewOrderDetails?: () => void;
}

const RefundSuccess: React.FC<RefundSuccessProps> = ({
  orderId,
  trainNumber,
  refundFee,
  onContinueBooking,
  onViewOrderDetails
}) => {
  return (
    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px', maxWidth: '600px', margin: '50px auto' }}>
      <h2 style={{ color: '#52c41a', marginBottom: '20px' }}>退票成功！</h2>
      <p style={{ fontSize: '16px', marginBottom: '10px' }}>订单号：<strong>{orderId}</strong></p>
      {trainNumber && <p style={{ fontSize: '16px', marginBottom: '10px' }}>车次：<strong>{trainNumber}</strong></p>}
      {refundFee !== undefined && <p style={{ fontSize: '16px', marginBottom: '30px' }}>退款手续费：<strong>¥{refundFee}</strong></p>}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <button
          onClick={onContinueBooking}
          style={{
            padding: '12px 25px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          继续购票
        </button>
        <button
          onClick={onViewOrderDetails}
          style={{
            padding: '12px 25px',
            backgroundColor: '#f0f2f5',
            color: '#333',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          查看订单详情
        </button>
      </div>

      <p style={{ fontSize: '14px', color: '#999', marginTop: '40px' }}>
        退票后的车票信息现在仍处于"未出行订单"区域，但信息置灰，在该车次完成行程后归入"历史订单"板块。
      </p>
    </div>
  );
};

export default RefundSuccess;
