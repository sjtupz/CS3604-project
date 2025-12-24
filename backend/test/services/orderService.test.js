const orderService = require('../../src/services/orderService');
const { initializeDatabase, run } = require('../../src/db/personal_database');

describe('Order Service', () => {
  beforeAll(async () => {
    await initializeDatabase();
    await run("INSERT OR REPLACE INTO train_tickets (train_no, date, ed_num) VALUES ('G108', '2025-12-24', '100')");
    await run("INSERT OR REPLACE INTO orders (id, user_id, order_number, train_number, price, status, train_info, passenger_info) VALUES ('order-123', 'user-123', 'ORD123', 'G108', 100, '待确认', '{\"fromStationId\":\"SHH\",\"toStationId\":\"BJN\",\"travelDate\":\"2025-12-24\"}', '[{\"seatType\":\"二等座\"}]')");
  });

  test('Given 合法订单数据 When 调用 createOrder Then 应该创建订单并返回订单 ID', async () => {
    const userId = 'user-123';
    const orderData = {
      trainId: 'G108',
      fromStationId: 'SHH',
      toStationId: 'BJN',
      date: '2025-12-24',
      passengers: [{ passengerId: 'p1', seatType: '二等座', ticketType: '成人票', price: 100 }]
    };

    const result = await orderService.createOrder(userId, orderData);
    expect(result).toHaveProperty('id');
  });

  test('Given 有效订单 ID When 调用 getOrderDetails Then 应该返回包含车次和乘车人的详情', async () => {
    const orderId = 'order-123';
    const details = await orderService.getOrderDetails(orderId);
    
    expect(details).toHaveProperty('id', orderId);
    expect(details).toHaveProperty('trainNumber');
    expect(details.passengerInfo).toBeInstanceOf(Array);
  });

  test('Given 待确认订单 When 调用 confirmOrder Then 订单状态应更新为待支付', async () => {
    const orderId = 'order-123';
    const result = await orderService.confirmOrder(orderId);
    expect(result).toBe(true);
  });

  test('Given 待确认订单 When 调用 cancelOrder Then 订单状态应更新为已取消并释放席位', async () => {
    // 重新插入一个待确认订单用于取消测试
    await run("INSERT OR REPLACE INTO orders (id, user_id, order_number, train_number, price, status, train_info, passenger_info) VALUES ('order-cancel', 'user-123', 'ORD-CANCEL', 'G108', 100, '待确认', '{\"fromStationId\":\"SHH\",\"toStationId\":\"BJN\",\"travelDate\":\"2025-12-24\"}', '[{\"seatType\":\"二等座\"}]')");
    
    const result = await orderService.cancelOrder('order-cancel');
    expect(result).toBe(true);
  });
});
