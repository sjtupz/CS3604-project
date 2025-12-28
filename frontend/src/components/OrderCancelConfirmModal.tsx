import React from 'react';

type Props = {
  onCancel?: () => void;
  onConfirm?: () => void;
  title?: string;
  message?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
};

const OrderCancelConfirmModal: React.FC<Props> = ({ onCancel, onConfirm, title, message, cancelText, confirmText }) => {
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
      <div style={{ backgroundColor: '#fff', width: '480px', borderRadius: '4px', overflow: 'hidden' }}>
        {title ? (
          <div style={{ backgroundColor: '#1890ff', color: '#fff', padding: '12px 0', textAlign: 'center', fontWeight: 700 }}>
            {title}
          </div>
        ) : null}
        <div style={{ padding: '24px', textAlign: 'center' }}>{message ?? '您确认取消订单吗？'}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '16px', borderTop: '1px solid #eee' }}>
          <button onClick={onCancel} style={{ padding: '8px 24px', backgroundColor: '#fff', color: '#000', border: '1px solid #000' }}>{cancelText ?? '取消'}</button>
          <button onClick={onConfirm} style={{ padding: '8px 24px', backgroundColor: '#f60', color: '#fff', border: 'none' }}>{confirmText ?? '确认'}</button>
        </div>
      </div>
    </div>
  );
};

export default OrderCancelConfirmModal;
