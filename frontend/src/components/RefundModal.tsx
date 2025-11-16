// TODO: 实现退票申请弹窗组件
import React, { useState, useEffect } from 'react';

interface Order {
  orderId: string;
  trainNumber?: string;
  price?: number;
}

interface RefundModalProps {
  order?: Order;
  isOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const RefundModal: React.FC<RefundModalProps> = ({
  order,
  isOpen,
  onConfirm,
  onCancel
}) => {
  const [refundFee, setRefundFee] = useState<number>(10.5); // 模拟手续费
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (order && order.price) {
      // TODO: 根据退票规则计算手续费
      setRefundFee(10.5); // 暂时硬编码
    }
  }, [order]);

  const handleConfirm = () => {
    setIsSubmitting(true);
    onConfirm?.();
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    onCancel?.();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onClick={handleCancel}
      >
        {/* 弹窗内容 */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            zIndex: 1001,
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 style={{ marginTop: 0 }}>退票申请</h2>

          {order && (
            <div style={{ marginBottom: '20px' }}>
              <p>订单号：{order.orderId}</p>
              {order.trainNumber && <p>车次：{order.trainNumber}</p>}
            </div>
          )}

          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>退款手续费用：¥{refundFee}</p>
          </div>

          <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>注意事项：</h3>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>退票后将无法恢复，请确认后再操作</li>
              <li>退款将在3-7个工作日内退回原支付账户</li>
              <li>退票手续费将不予退还</li>
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
            <button
              onClick={handleCancel}
              style={{
                padding: '10px 20px',
                border: '1px solid #ccc',
                backgroundColor: 'white',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: '#1890ff',
                color: 'white',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                borderRadius: '4px'
              }}
            >
              {isSubmitting ? '处理中...' : '确认'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RefundModal;
