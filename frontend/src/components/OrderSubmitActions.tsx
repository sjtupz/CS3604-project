import React from 'react';

interface OrderSubmitActionsProps {
  onBack: () => void;
  onSubmit: () => void;
}

const OrderSubmitActions: React.FC<OrderSubmitActionsProps> = ({ onBack, onSubmit }) => {
  return (
    <div className="order-submit-actions" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '20px', 
      marginTop: '30px',
      marginBottom: '50px'
    }}>
      <button 
        onClick={onBack}
        style={{
          padding: '10px 40px',
          backgroundColor: '#fff',
          border: '1px solid #333',
          color: '#333',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        下一步
      </button>
      <button 
        onClick={onSubmit}
        style={{
          padding: '10px 40px',
          backgroundColor: '#f60',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        提交订单
      </button>
    </div>
  );
};

export default OrderSubmitActions;
