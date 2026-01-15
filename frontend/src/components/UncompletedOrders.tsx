// TODO: 实现未完成订单列表组件
import React, { useEffect, useState } from 'react';
import OrderCancelConfirmModal from './OrderCancelConfirmModal';

interface Order {
  orderId: string;
  orderNumber?: string;
  trainNumber?: string;
  passengerName?: string;
  trainInfo?: string;
  passengerInfo?: string;
  seatInfo?: string;
  price?: number;
  status?: string;
  travelDate?: string;
  fromStation?: string;
  toStation?: string;
  departureTime?: string;
  ticketType?: string;
  passengerIdTypes?: string;
  hasNoSeat?: boolean;
  passengers?: {
    name?: string;
    idType?: string;
    seatInfo?: string;
    ticketType?: string;
    price?: number;
    status?: string;
  }[];
}

interface UncompletedOrdersProps {
  orders?: Order[];
  onNavigateToPayment?: (orderId: string) => void;
  onNavigateToBooking?: () => void;
  onCancelOrder?: (orderId: string, hasNoSeat?: boolean) => void | Promise<void>;
}

const UncompletedOrders: React.FC<UncompletedOrdersProps> = ({
  orders = [],
  onNavigateToPayment,
  onNavigateToBooking,
  onCancelOrder
}) => {
  const [displayOrders, setDisplayOrders] = useState<Order[]>(orders)
  useEffect(() => {
    setDisplayOrders(orders)
  }, [orders])
  const isEmpty = displayOrders.length === 0;
  const [showCancel, setShowCancel] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null)

  return (
    <div style={{ padding: '20px', border: '1px solid #e8e8e8', borderRadius: '4px' }}>
      <div
        style={{
          border: '1px solid #91d5ff',
          borderRadius: '4px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start'
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
              src="/assets/personal_center/未完成订单.png"
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
                  车票预订
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
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>车次信息</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>旅客信息</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>席位信息</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>票价</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>车票状态</th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((order) => {
                  const passengers = Array.isArray(order.passengers) && order.passengers.length > 0
                    ? order.passengers
                    : [
                        {
                          name: order.passengerName || order.passengerInfo,
                          idType: order.passengerIdTypes,
                          seatInfo: order.seatInfo,
                          ticketType: order.ticketType,
                          price: order.price,
                          status: order.status,
                        },
                      ];

                  return passengers.map((p, index) => (
                    <tr key={`${order.orderId}-${index}`}>
                      {index === 0 && (
                        <td rowSpan={passengers.length} style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <div style={{ color: '#333' }}>
                            {(order.fromStation || '-') + ' → ' + (order.toStation || '-')}
                            {' '}
                            {(order.trainNumber || '-')}
                          </div>
                          <div style={{ color: '#666', fontSize: '13px' }}>
                            {(order.travelDate || '-') + '    ' + (order.departureTime || '-') + ' 开'}
                          </div>
                        </td>
                      )}
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <div style={{ color: '#333' }}>{p.name || order.passengerName || order.passengerInfo || '-'}</div>
                        <div style={{ color: '#666', fontSize: '13px' }}>{p.idType || order.passengerIdTypes || '-'}</div>
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <div style={{ color: '#333' }}>{p.seatInfo || order.seatInfo || '-'}</div>
                        <div style={{ color: '#666', fontSize: '13px' }}>{p.ticketType || order.ticketType || '-'}</div>
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <div style={{ color: '#333' }}>{p.ticketType || order.ticketType || '成人票'}</div>
                        <div style={{ color: '#666', fontSize: '13px' }}>{((p.price ?? order.price) ?? 0) + '元'}</div>
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <div style={{ color: '#333' }}>{p.status || order.status || '-'}</div>
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button
                onClick={() => {
                  if (!displayOrders[0]) return
                  setCancelTarget(displayOrders[0])
                  setShowCancel(true)
                }}
                style={{
                  padding: '6px 16px',
                  backgroundColor: '#fff',
                  color: '#000',
                  border: '1px solid #000',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                取消订单
              </button>
              <button
                onClick={() => displayOrders[0] && onNavigateToPayment?.(displayOrders[0].orderId)}
                style={{
                  padding: '6px 16px',
                  backgroundColor: '#f60',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                去支付
              </button>
            </div>
          </div>
        )}
      </div>

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

      {showCancel && (
        <OrderCancelConfirmModal
          cancelText="取消"
          confirmText="确定"
          message="在一天内3次申请车票成功后取消订单（包含无座票时取消5次计为取消1次），当日将不能在12306继续购票。"
          onCancel={() => {
            setShowCancel(false)
            setCancelTarget(null)
          }}
          onConfirm={() => {
            const target = cancelTarget
            setShowCancel(false)
            setCancelTarget(null)
            if (target) {
              if (target.hasNoSeat === undefined) {
                void onCancelOrder?.(target.orderId)
              } else {
                void onCancelOrder?.(target.orderId, target.hasNoSeat)
              }
              setDisplayOrders((prev) => prev.filter((o) => o.orderId !== target.orderId))
            }
          }}
        />
      )}
    </div>
  );
};

export default UncompletedOrders;
