const request = require('supertest');
const express = require('express');
const ordersRouter = require('../../src/routes/orders');
const { initializeDatabase, run } = require('../../src/db/personal_database');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/api/orders', ordersRouter);

// 模拟 Auth 中间件需要的 Token
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const testToken = jwt.sign({ id: 'user-123', username: 'zhangsan' }, JWT_SECRET);

describe('Orders API Routes', () => {
  beforeAll(async () => {
    await initializeDatabase();
    await run("INSERT OR REPLACE INTO train_tickets (train_no, date, ed_num) VALUES ('G108', '2025-12-24', '100')");
    await run("INSERT OR REPLACE INTO train_tickets (train_no, date, ed_num) VALUES ('SOLD_OUT', '2025-12-24', '0')");
    await run("INSERT OR REPLACE INTO orders (id, user_id, order_number, train_number, price, status, train_info, passenger_info) VALUES ('order-uuid-123', 'user-123', 'ORD123', 'G108', 100, '待确认', '{\"fromStationId\":\"SHH\",\"toStationId\":\"BJN\",\"travelDate\":\"2025-12-24\"}', '[]')");
  });

  test('Given 用户未选择任何乘车人 When 点击“提交订单”按钮 Then 返回 40005 错误', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        trainId: 'G108',
        fromStationId: 'SHH',
        toStationId: 'BJN',
        date: '2025-12-24',
        passengers: []
      });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe(40005);
    expect(response.body.message).toBe('请选择乘车人！');
  });

  test('Given 用户提交订单时车票售罄 When 点击“提交订单”按钮 Then 返回 40902 错误', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        trainId: 'SOLD_OUT',
        fromStationId: 'SHH',
        toStationId: 'BJN',
        date: '2025-12-24',
        passengers: [{ passengerId: 'p1', seatType: '二等座', ticketType: '成人票' }]
      });

    expect(response.status).toBe(400); // 因为 controller 中 4xx 都转为了 400
    expect(response.body.code).toBe(40902);
  });

  test('Given 用户成功提交订单 When 提交合法信息 Then 返回 201 和 orderId', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        trainId: 'G108',
        fromStationId: 'SHH',
        toStationId: 'BJN',
        date: '2025-12-24',
        passengers: [{ passengerId: 'p1', seatType: '二等座', ticketType: '成人票', price: 100 }]
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('orderId');
  });

  test('Given 用户查询订单详情 When 提供有效 orderId Then 返回订单详细信息', async () => {
    const response = await request(app)
      .get('/api/orders/order-uuid-123')
      .set('Authorization', `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id', 'order-uuid-123');
    expect(response.body.data).toHaveProperty('trainNumber');
    expect(response.body.data).toHaveProperty('passengerInfo');
  });

  test('Given 用户确认订单 When 调用确认接口 Then 返回成功消息', async () => {
    const response = await request(app)
      .post('/api/orders/order-uuid-123/confirm')
      .set('Authorization', `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('订单已确认，请尽快支付');
  });

  test('Given 用户取消订单 When 调用取消接口 Then 返回成功消息', async () => {
    // 重新插入一个待确认订单用于取消测试
    await run("INSERT OR REPLACE INTO orders (id, user_id, order_number, train_number, price, status, train_info, passenger_info) VALUES ('order-cancel-api', 'user-123', 'ORD-CANCEL-API', 'G108', 100, '待确认', '{\"fromStationId\":\"SHH\",\"toStationId\":\"BJN\",\"travelDate\":\"2025-12-24\"}', '[{\"seatType\":\"二等座\"}]')");

    const response = await request(app)
      .post('/api/orders/order-cancel-api/cancel')
      .set('Authorization', `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('订单已取消');
  });
});
