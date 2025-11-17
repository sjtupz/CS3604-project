// TODO: 实现历史订单列表组件
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
}

interface HistoryOrdersProps {
  orders?: Order[];
  onPrintInfo?: (orderId: string) => void;
}

const HistoryOrders: React.FC<HistoryOrdersProps> = ({
  orders = [],
  onPrintInfo
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // 按乘车日期筛选
    if (startDate && endDate) {
      filtered = filtered.filter(order => {
        const dateField = order.travelDate;
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

      {/* 订单列表或空状态 */}
      {isEmpty ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            gap: '20px',
            minHeight: '300px'
          }}
        >
          <img
            src="/assets/uncompleted-order-icon.png"
            alt="历史订单图标"
            style={{
              width: '120px',
              height: '120px',
              flexShrink: 0
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', color: '#666', marginBottom: '10px', textAlign: 'left' }}>
              您没有对应的订单内容哦～
            </div>
            <div style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', textAlign: 'left' }}>
              您可以通过
              <span
                onClick={() => {}}
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
                    {order.status || '已完成'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button
                      onClick={() => onPrintInfo?.(order.orderId)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#1890ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      打印信息单
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 黄色提示框 */}
      <div
        style={{
          marginTop: '50px',
          padding: '8px 16px',
          border: '2px solid #ffd700',
          borderRadius: '4px',
          backgroundColor: '#fffbe6'
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
            1.订单信息在本网站保存期限为30日。
          </p>
          <p style={{ margin: '3px 0' }}>
            2.在12306.cn网站改签和退票，改签应不晚于票面日期当日24:00，变更到站不晚于开车前48小时，退票应不晚于开车前。
          </p>
          <p style={{ margin: '3px 0' }}>
            3.在本网站办理退票，只能逐次单张办理。
          </p>
          <p style={{ margin: '3px 0' }}>
            4. 车票改签、变更到站均只能办理一次。已经改签或变更到站的车票不再办理改签；对已改签车票、团体票暂不提供"变更到站"服务。
          </p>
          <p style={{ margin: '3px 0' }}>
            5.退票、改签、变更到站后，如有应退票款，按购票时所使用的在线支付工具相关规定，将在规定时间内退还至原在线支付工具账户，请及时查询。如有疑问，请致电12306人工客服查询。
          </p>
          <p style={{ margin: '3px 0' }}>
            7.投保、退保或查看电子保单状态，请点击"我的保险"或"购/赠/退保险"。
          </p>
          <p style={{ margin: '3px 0' }}>
            8."除有效期有其他规定的车票外，车票当日当次有效。旅客自行中途上车、下车的，未乘区间的票款不予退还。"
          </p>
          <p style={{ margin: '3px 0' }}>
            9.如因运力原因或其他不可控因素导致列车调度调整时，当前车型可能会发生变动。
          </p>
          <p style={{ margin: '3px 0' }}>
            10.未尽事宜详见《国铁集团铁路旅客运输规程》《广深港高速铁路跨境旅客运输组织规则》《中老铁路跨境旅客联运组织规则》等有关规定和车站公告。
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryOrders;
