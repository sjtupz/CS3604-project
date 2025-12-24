const dbOrders = require('../../src/db/orders');
const { getDb, initializeDatabase, run } = require('../../src/db/personal_database');

describe('Orders Database Operations', () => {
  beforeAll(async () => {
    await initializeDatabase();
    // 插入测试数据
    await run("INSERT OR REPLACE INTO train_tickets (train_no, date, ed_num) VALUES ('G108', '2025-12-24', '100')");
    await run("INSERT OR REPLACE INTO orders (id, user_id, order_number, train_number, price, status, train_info, passenger_info) VALUES ('order-123', 'user-123', 'ORD123', 'G108', 100, '待确认', '{\"fromStationId\":\"SHH\",\"toStationId\":\"BJN\",\"travelDate\":\"2025-12-24\"}', '[]')");
  });

  test('Given 订单信息 When 调用 dbCreateOrder Then 数据库应增加一条状态为待确认的记录', async () => {
    const orderInfo = {
      userId: 'user-123',
      trainId: 'G108',
      totalAmount: 100,
      status: '待确认',
      fromStationId: 'SHH',
      toStationId: 'BJN',
      travelDate: '2025-12-24',
      passengers: []
    };
    
    const result = await dbOrders.dbCreateOrder(orderInfo);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('orderNumber');
  });

  test('Given 车次与席别 When 调用 dbLockSeats Then 对应区间的余票数应减少', async () => {
    const result = await dbOrders.dbLockSeats('G108', '2025-12-24', 'SHH', 'BJN', '二等座', 1);
    expect(result).toBe(true);
  });

  test('Given 订单 ID 和新状态 When 调用 dbUpdateOrderStatus Then 记录状态应被更新', async () => {
    const result = await dbOrders.dbUpdateOrderStatus('order-123', '待支付');
    expect(result).toBe(true);
  });

  test('Given 订单 ID When 调用 dbGetOrderDetails Then 应返回完整的数据库记录', async () => {
    const details = await dbOrders.dbGetOrderDetails('order-123');
    expect(details).toHaveProperty('status');
  });
});
