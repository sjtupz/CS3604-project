// TODO: 实现未完成订单列表组件
import React from 'react';

interface Order {
  orderId: string;
  orderNumber?: string;
  trainNumber?: string;
  passengerName?: string;
  trainInfo?: string;
  passengerInfo?: string;
  seatInfo?: string;
  price?: number;
}

interface UncompletedOrdersProps {
  orders?: Order[];
  onNavigateToPayment?: (orderId: string) => void;
  onNavigateToBooking?: () => void;
}

const UncompletedOrders: React.FC<UncompletedOrdersProps> = ({
  orders = [],
  onNavigateToPayment,
  onNavigateToBooking
}) => {
  const isEmpty = orders.length === 0;

  return (
    <div style={{ padding: '20px', border: '1px solid #e8e8e8', borderRadius: '4px' }}>
      {/* 未完成订单主体部分 - 浅蓝色边框 */}
      <div
        style={{
          border: '1px solid #91d5ff',
          borderRadius: '4px',
          padding: '20px',
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isEmpty ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              gap: '20px'
            }}
          >
            <img
              src="/assets/uncompleted-order-icon.png"
              alt="未完成订单图标"
              style={{
                width: '120px',
                height: '120px',
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', color: '#666', marginBottom: '10px', textAlign: 'left' }}>
                您没有未完成的订单哦～
              </div>
              <div style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', textAlign: 'left' }}>
                您可以通过
                <span
                  onClick={onNavigateToBooking}
                  style={{
                    color: '#1890ff',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  车票预定
                </span>
                功能，来制定出行计划。
              </div>
            </div>
          </div>
        ) : (
        <div style={{ width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>订单号</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>车次信息</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>旅客信息</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>席位信息</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>票价</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {order.orderNumber || order.orderId}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {order.trainNumber || order.trainInfo}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {order.passengerName || order.passengerInfo}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {order.seatInfo || '-'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    ¥{order.price || 0}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button
                      onClick={() => onNavigateToPayment?.(order.orderId)}
                      style={{
                        padding: '5px 15px',
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      跳转支付
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* 温馨提示框 - 在浅蓝色边框外面 */}
      <div
        style={{
          marginTop: '30px',
          padding: '8px 16px',
          border: '2px solid #b8860b',
          borderRadius: '4px',
          backgroundColor: '#fff8dc'
        }}
      >
        <h4 style={{ 
          marginTop: 0, 
          marginBottom: '6px',
          fontSize: '13px',
          fontWeight: 'bold',
          color: '#000'
        }}>
          温馨提示
        </h4>
        <div style={{ fontSize: '13px', lineHeight: '1.3', color: '#666' }}>
          <p style={{ margin: '3px 0' }}>
            1.席位已锁定，请在指定时间内完成网上支付。
          </p>
          <p style={{ margin: '3px 0' }}>
            2.逾期未支付，系统将取消本次交易。
          </p>
          <p style={{ margin: '3px 0' }}>
            3.在完成支付或取消本订单之前，您将无法购买其他车票。
          </p>
          <p style={{ margin: '3px 0' }}>
            4.未尽事宜详见《国铁集团铁路旅客运输规程》《广深港高速铁路跨境旅客运输组织规则》《中老铁路跨境旅客联运组织规则》等有关规定和车站公告。
          </p>
        </div>
      </div>
    </div>
  );
};

export default UncompletedOrders;
