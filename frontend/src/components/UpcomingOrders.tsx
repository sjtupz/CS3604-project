// TODO: 实现未出行订单列表组件
import React, { useState, useMemo, useEffect } from 'react';

interface Order {
  orderId: string;
  orderNumber?: string;
  trainNumber?: string;
  passengerName?: string;
  bookingDate?: string;
  travelDate?: string;
  fromStation?: string;
  toStation?: string;
  departureTime?: string;
  trainInfo?: string;
  passengerInfo?: string;
  passengerIdTypes?: string;
  seatInfo?: string;
  price?: number;
  status?: string;
  ticketType?: string;
  passengers?: {
    name?: string;
    idType?: string;
    seatInfo?: string;
    ticketType?: string;
    price?: number;
    status?: string;
  }[];
}

interface UpcomingOrdersProps {
  orders?: Order[];
  onRefund?: (orderId: string) => void;
  onModify?: (orderId: string) => void;
  onNavigateToBooking?: () => void;
}

const UpcomingOrders: React.FC<UpcomingOrdersProps> = ({
  orders = [],
  onRefund,
  onNavigateToBooking
}) => {
  const [queryType, setQueryType] = useState<'按订票日期' | '按乘车日期'>('按订票日期');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    const end = new Date();
    end.setDate(end.getDate() + 90); // 默认显示未来90天的订单

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  }, []);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // 按日期筛选
    if (startDate && endDate) {
      // 检查日期筛选逻辑
      // 如果日期范围未设置或默认值，是否应该过滤？
      // 目前逻辑：必须有 start 和 end 才会过滤
      // 但是默认值是过去30天到今天。
      // 对于未出行订单，travelDate 应该是未来的。
      // 如果默认范围是过去30天到今天，那么未来的订单就会被过滤掉！
      // 修复：未出行订单不应受默认“过去30天”的限制，或者默认范围应该覆盖未来。
      // 12306 默认显示所有未出行订单，查询条件可能只是辅助。
      // 这里我们暂时放宽筛选，或者修改默认日期范围。
      // Better fix: 对于“未出行订单”，默认显示全部，只有当用户手动点击查询时才应用筛选？
      // 或者调整默认 endDate 为未来足够远的时间。
      // 让我们调整 endDate 为未来 30 天，或者不进行日期过滤除非用户指定。
      // 鉴于 12306 逻辑，未出行订单通常默认全显。
      // 让我们暂时移除默认的日期过滤，或者修正默认 endDate。
      // 但是代码里 useEffect 设置了默认值。
      
      // Fix: 仅仅当 queryType 是 '按订票日期' 时，或者 travelDate 在范围内。
      // 但是 refund 后，状态变了，但它仍然在 orders 列表中（由父组件传入）。
      // 问题是 filteredOrders 逻辑把它们过滤掉了吗？
      // 如果退票了，它还是“未出行”吗？在 12306 中，“未出行”通常指“已支付且未过期且未退票”？
      // 不，用户说“应当以灰色显示”，意味着它应该在列表中。
      
      // 关键问题：默认日期范围是过去30天 (start) 到今天 (end)。
      // 未出行订单的 travelDate 通常是**明天或未来**。
      // 所以默认的 endDate = new Date() 会把所有未来的订单都过滤掉！
      // 这解释了为什么订单会“消失”（不仅仅是退票的，所有未出行的都可能消失，除非 bookingDate 在范围内且 queryType 是按订票日期）。
      // 默认 queryType 是 '按订票日期'。bookingDate 通常是过去或今天。
      // 如果我今天买的票（bookingDate = 今天），它在范围内。
      // 如果我昨天买的票，也在范围内。
      // 那么为什么退票后消失了？
      // 也许退票操作更新了订单的某些属性，导致筛选失败？
      // 或者退票后，orders 列表变了？
      
      // 让我们先修复日期范围问题，确保未来订单可见。
      // 修改 useEffect 中的 endDate 为未来 30 天。
    }

    filtered = filtered.filter(order => {
        if (!startDate || !endDate) return true;
        const rawDate = queryType === '按订票日期' ? order.bookingDate : order.travelDate;
        if (!rawDate) return true; // Keep if no date
        const dateField = rawDate.replace(/\//g, '-');
        // 简单的字符串比较 YYYY-MM-DD
        return dateField >= startDate && dateField <= endDate;
    });

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

  const isEmpty = filteredOrders.length === 0;

  return (
    <div style={{ padding: '20px', border: '1px solid #e8e8e8', borderRadius: '4px' }}>
      {/* 查询功能 */}
      <div style={{ marginBottom: '20px', padding: '15px', borderRadius: '4px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            aria-label="日期类型"
            value={queryType}
            onChange={(e) => setQueryType(e.target.value as '按订票日期' | '按乘车日期')}
            style={{ height: '32px', padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
          >
            <option value="按订票日期">按订票日期查询</option>
            <option value="按乘车日期">按乘车日期查询</option>
          </select>
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
          alignItems: isEmpty ? 'center' : 'flex-start',
          justifyContent: isEmpty ? 'center' : 'flex-start'
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
              alt="未出行订单图标"
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
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>车次信息</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>旅客信息</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>席位信息</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>票价</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>车票状态</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const passengers = Array.isArray(order.passengers) && order.passengers.length > 0
                    ? order.passengers
                    : [
                        {
                          name: order.passengerName || order.passengerInfo,
                          idType: order.passengerIdTypes,
                          seatInfo: order.seatInfo,
                          ticketType: order.ticketType,
                          price: order.price,
                          status: order.status ?? '已支付',
                        },
                      ];

                  const dateText = (order.travelDate || order.bookingDate || '-').replace(/\//g, '-');
                  const timeText = (order.departureTime || '-') + '\u00A0开';
                  
                  // 判断整个订单是否已退票（如果所有乘客都退票了）
                  // 这里简单根据乘客状态判断显示
                  
                  return passengers.map((p, index) => {
                    const isRefunded = p.status?.includes('退') || order.status?.includes('退');
                    const textColor = isRefunded ? '#999' : '#333';
                    const subTextColor = isRefunded ? '#ccc' : '#666';

                    return (
                    <tr key={`${order.orderId}-${index}`}>
                      {index === 0 && (
                        <td rowSpan={passengers.length} style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <div style={{ color: textColor }}>
                            {(order.fromStation || '-') + '→' + (order.toStation || '-') + ' ' + (order.trainNumber || '-')}
                          </div>
                          <div style={{ color: subTextColor, fontSize: '13px' }}>
                            <span>{dateText}</span>
                            <span>{'\u00A0\u00A0\u00A0\u00A0'}</span>
                            <span>{timeText}</span>
                          </div>
                        </td>
                      )}
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <div style={{ color: textColor }}>{p.name || order.passengerName || order.passengerInfo || '-'}</div>
                        <div style={{ color: subTextColor, fontSize: '13px' }}>{p.idType || order.passengerIdTypes || '-'}</div>
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <span style={{ color: textColor }}>{p.seatInfo || order.seatInfo || '-'}</span>
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <div style={{ color: textColor }}>{p.ticketType || order.ticketType || '成人票'}</div>
                        <div style={{ color: subTextColor, fontSize: '13px' }}>{((p.price ?? order.price) ?? 0) + '元'}</div>
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <div style={{ color: textColor }}>{p.status || order.status || '已支付'}</div>
                        {!isRefunded && (
                        <button
                          type="button"
                          onClick={() => onRefund?.(order.orderId)}
                          style={{
                            padding: 0,
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: '#1890ff',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '13px'
                          }}
                        >
                          退票
                        </button>
                        )}
                      </td>
                    </tr>
                  )});
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
            1.订单信息保存期限为30日。
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

export default UpcomingOrders;
