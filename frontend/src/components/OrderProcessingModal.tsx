import React, { useEffect } from 'react';

type Props = {
  orderId: string;
  onTimeout?: () => void;
};

const OrderProcessingModal: React.FC<Props> = ({ onTimeout }) => {
  useEffect(() => {
    const t = setTimeout(() => {
      if (onTimeout) onTimeout();
    }, 3000);
    return () => clearTimeout(t);
  }, [onTimeout]);
  return (
    <div style={{
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
      <div style={{ backgroundColor: '#fff', width: '600px', height: '280px', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ backgroundColor: '#288BCC', color: '#fff', padding: '12px 16px', fontFamily: 'SimSun, 宋体, serif', fontWeight: 700 }}>提示</div>
        <div style={{ padding: '16px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>订单已经提交，系统正在处理中，请稍等</div>
      </div>
    </div>
  );
};

export default OrderProcessingModal;
