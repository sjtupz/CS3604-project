// TODO: 实现未出行订单列表组件
import React, { useState, useMemo } from 'react';

interface Order {
  orderId: string;
  orderNumber?: string;
  trainNumber?: string;
  passengerName?: string;
  bookingDate?: string;
  travelDate?: string;
  trainInfo?: string;
  passengerInfo?: string;
  seatInfo?: string;
  price?: number;
  status?: string;
}

interface UpcomingOrdersProps {
  orders?: Order[];
  onRefund?: (orderId: string) => void;
  onModify?: (orderId: string) => void;
}

const UpcomingOrders: React.FC<UpcomingOrdersProps> = ({
  orders = [],
  onRefund,
  onModify
}) => {
  const [queryType, setQueryType] = useState<'按订票日期' | '按乘车日期'>('按订票日期');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // 按日期筛选
    if (startDate && endDate) {
      filtered = filtered.filter(order => {
        const dateField = queryType === '按订票日期' ? order.bookingDate : order.travelDate;
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
  }, [orders, queryType, startDate, endDate, searchText]);

  const handleQuery = () => {
    setIsLoading(true);
    // TODO: 调用API查询订单
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* 查询功能 */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            id="queryType"
            value={queryType}
            onChange={(e) => setQueryType(e.target.value as '按订票日期' | '按乘车日期')}
            style={{ padding: '5px 10px' }}
          >
            <option value="按订票日期">按订票日期</option>
            <option value="按乘车日期">按乘车日期</option>
          </select>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '5px 10px' }}
          />
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

      {/* 订单列表 */}
      <div style={{ marginBottom: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>订票日期</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>车次信息</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>旅客信息</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>席位信息</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>票价</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>车票状态</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderId}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {order.bookingDate || '-'}
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
                  {order.status || '未出行'}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => onRefund?.(order.orderId)}
                    style={{
                      marginRight: '10px',
                      padding: '5px 10px',
                      backgroundColor: '#ff4d4f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    退票
                  </button>
                  <button
                    onClick={() => onModify?.(order.orderId)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#1890ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    改签
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 提示信息 */}
      <div style={{ marginTop: '10px', fontSize: '14px', color: '#999' }}>
        提示：只保留三十天信息
      </div>
    </div>
  );
};

export default UpcomingOrders;
