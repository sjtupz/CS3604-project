// TODO: 瀹炵幇鏈嚭琛岃鍗曞垪琛ㄧ粍浠?
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
  const [queryType, setQueryType] = useState<'鎸夎绁ㄦ棩鏈? | '鎸変箻杞︽棩鏈?>('鎸夎绁ㄦ棩鏈?);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // 鎸夋棩鏈熺瓫閫?
    if (startDate && endDate) {
      filtered = filtered.filter(order => {
        const dateField = queryType === '鎸夎绁ㄦ棩鏈? ? order.bookingDate : order.travelDate;
        if (!dateField) return false;
        return dateField >= startDate && dateField <= endDate;
      });
    }

    // 鎸夎鍗曞彿/杞︽/濮撳悕绛涢€?
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
    // TODO: 璋冪敤API鏌ヨ璁㈠崟
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const isEmpty = filteredOrders.length === 0;

  return (
    <div style={{ padding: '20px', border: '1px solid #e8e8e8', borderRadius: '4px' }}>
      {/* 鏌ヨ鍔熻兘 */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
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
            placeholder="璁㈠崟鍙?杞︽/濮撳悕"
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
            {isLoading ? '鏌ヨ涓?..' : '鏌ヨ'}
          </button>
        </div>
      </div>

      {/* 璁㈠崟鍒楄〃 */}
      <div style={{ marginBottom: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>璁㈢エ鏃ユ湡</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>杞︽淇℃伅</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>鏃呭淇℃伅</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>甯綅淇℃伅</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>绁ㄤ环</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>杞︾エ鐘舵€?/th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>鎿嶄綔</th>
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
                  楼{order.price || 0}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {order.status || '鏈嚭琛?}
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
                    閫€绁?
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
                    鏀圭
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 鎻愮ず淇℃伅 */}
      <div style={{ marginTop: '10px', fontSize: '14px', color: '#999' }}>
        鎻愮ず锛氬彧淇濈暀涓夊崄澶╀俊鎭?
      </div>
    </div>
  );
};

export default UpcomingOrders;

