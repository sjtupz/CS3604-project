const { initializeDatabase, run } = require('../../src/db/personal_database');
const ordersDb = require('../../src/db/orders');

describe('DB-ListUserOrdersByStatus', () => {
  beforeAll(async () => {
    await initializeDatabase();
    await run("DELETE FROM orders");
    const info = JSON.stringify({ fromStationId: 'SHH', toStationId: 'BJN', travelDate: '2025-12-25' });
    const pinfo = JSON.stringify([{ name: '张三', seatType: '二等座', coach: '05', seatNo: '06A', price: 100 }]);
    await run("INSERT INTO orders (id, user_id, order_number, train_number, price, status, train_info, passenger_info, created_at) VALUES ('ord-pending-1','user-abc','EX000000001','G108',100,'待支付',?, ?, CURRENT_TIMESTAMP)", [info, pinfo]);
    await run("INSERT INTO orders (id, user_id, order_number, train_number, price, status, train_info, passenger_info, created_at) VALUES ('ord-paid-1','user-abc','EX000000002','G109',200,'已支付',?, ?, CURRENT_TIMESTAMP)", [info, pinfo]);
  });

  test('Given 用户与状态=待支付 When 查询 Then 返回待支付订单列表', async () => {
    const items = await ordersDb.dbGetOrdersByUser('user-abc', ['待支付'], null);
    expect(items.length).toBe(1);
    expect(items[0].status).toBe('待支付');
  });

  test('Given 用户与状态=已支付 When 查询 Then 返回已支付订单列表', async () => {
    const items = await ordersDb.dbGetOrdersByUser('user-abc', ['已支付'], null);
    expect(items.length).toBe(1);
    expect(items[0].status).toBe('已支付');
  });
});
