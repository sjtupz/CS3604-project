// TODO: 实现已退票订单列表组件
import React, { useState, useMemo } from 'react';

interface Order {
  orderId: string;
  orderNumber?: string;
  trainNumber?: string;
  passengerName?: string;
  travelDate?: string;
  bookingDate?: string;
  trainInfo?: string;
  passengerInfo?: string;
  seatInfo?: string;
  price?: number;
  status?: string;
  refundDate?: string;
  refundFee?: number;
}

interface RefundedOrdersProps {
  orders?: Order[];
  onPrintInfo?: (orderId: string) => void;
  onNavigateToBooking?: () => void;
}

const RefundedOrders: React.FC<RefundedOrdersProps> = ({
  orders = [],
  onPrintInfo,
  onNavigateToBooking
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // 按退票日期筛选 (如果 orders 中有 refundDate)
    if (startDate && endDate) {
      filtered = filtered.filter(order => {
        const dateField = order.refundDate || order.travelDate;
        if (!dateField) return false;
        return dateField >= startDate && dateField <= endDate;
      });
    }

    // 按订单号/车次/姓名筛选
    if (searchText) {
      filtered = filtered.filter(order =>
        order.orderNumber?.includes(searchText) ||
        order.trainNumber?.includes(searchText) ||
        order.passengerName?.includes(searchText)
      );
    }

    return filtered;
  }, [orders, startDate, endDate, searchText]);

  const handleQuery = () => {
    setIsLoading(true);
    // TODO: 调用API查询订单
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const isEmpty = filteredOrders.length === 0;

  return (
    <div style={{ padding: '20px', border: '1px solid #e8e8e8', borderRadius: '4px' }}>
      {/* 查询功能 */}
      <div style={{ marginBottom: '20px', padding: '15px', borderRadius: '4px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '14px', color: '#333' }}>退票日期</span>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '5px 10px' }}
          />
          <span style={{ color: '#999' }}>-</span>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '5px 10px' }}
          />
          <input
            id="searchText"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="订单号/车次/姓名"
            style={{ 
              padding: '5px 10px',
              width: '160px'
            }}
          />
          <button
            onClick={handleQuery}
            disabled={isLoading}
            style={{
              padding: '5px 15px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? '查询中...' : '查询'}
          </button>
        </div>
      </div>

      {/* 订单列表或空状态 - 浅蓝色边框容器 */}
      <div
        style={{
          border: '1px solid #91d5ff',
          borderRadius: '4px',
          padding: '20px',
          minHeight: '500px',
          display: 'flex',
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
              gap: '12px',
              width: '100%'
            }}
          >
            <img
              src="/assets/personal_center/未完成订单.png"
              alt="已退票订单图标"
              style={{
                width: '120px',
                height: '120px',
                flexShrink: 0
              }}
            />
            <div style={{ maxWidth: '720px' }}>
              <div style={{ fontSize: '16px', color: '#666', marginBottom: '10px', textAlign: 'center' }}>
                您没有对应的订单内容哦～
              </div>
              <div style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', textAlign: 'center' }}>
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
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>退票日期</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>车次信息</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>旅客信息</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>席位信息</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>票价</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>退票手续费</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>车票状态</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {order.refundDate || '-'}
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
                      ¥{order.refundFee || 0}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', color: '#999' }}>
                      {order.status || '已退票'}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <button
                        onClick={() => onPrintInfo && onPrintInfo(order.orderId)}
                        style={{
                          marginRight: '10px',
                          padding: '5px 10px',
                          backgroundColor: 'transparent',
                          color: '#1890ff',
                          border: '1px solid #1890ff',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefundedOrders;
