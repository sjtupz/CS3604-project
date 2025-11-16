const request = require('supertest');
const app = require('../../src/app');
const { run } = require('../../src/db/database');

describe('API-GET-Orders', () => {
  beforeEach(async () => {
    // 清理测试订单
    try {
      await run('DELETE FROM orders WHERE id = ?', ['test-order-route-id']);
    } catch (err) {
      // 忽略错误
    }
    
    // 插入测试订单
    await run(`
      INSERT INTO orders (id, user_id, order_number, train_number, passenger_name, 
                         booking_date, travel_date, price, status)
      VALUES ('test-order-route-id', 'test-user-id', 'TEST123', 'G108', '张三',
              '2025-01-01', '2025-01-15', 100.0, '未完成')
    `);
  });

  afterEach(async () => {
    // 清理测试订单
    try {
      await run('DELETE FROM orders WHERE id = ?', ['test-order-route-id']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 用户已登录 When 请求获取未完成订单 Then 应返回200 OK和订单列表', async () => {
    // Arrange
    const userToken = 'test-token';
    const queryParams = {
      status: '未完成'
    };

    // Act
    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', userToken)
      .query(queryParams);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('orders');
    expect(Array.isArray(response.body.orders)).toBe(true);
  });

  test('Given 用户已登录且提供查询条件 When 请求获取筛选后的订单 Then 应返回200 OK和筛选后的订单列表', async () => {
    // Arrange
    const userToken = 'test-token';
    const queryParams = {
      status: '未出行',
      queryType: '按订票日期',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      orderNumber: 'TEST123'
    };

    // Act
    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', userToken)
      .query(queryParams);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('orders');
    // TODO: 验证订单列表根据查询条件筛选
  });
});

describe('API-POST-Refund', () => {
  beforeEach(async () => {
    // 清理测试订单
    try {
      await run('DELETE FROM orders WHERE id = ?', ['test-order-refund-route-id']);
    } catch (err) {
      // 忽略错误
    }
    
    // 插入测试订单（未出行状态，可以退票）
    await run(`
      INSERT INTO orders (id, user_id, order_number, train_number, passenger_name, 
                         booking_date, travel_date, price, status)
      VALUES ('test-order-refund-route-id', 'test-user-id', 'TEST456', 'G109', '李四',
              '2025-01-01', '2025-01-20', 150.0, '未出行')
    `);
  });

  afterEach(async () => {
    // 清理测试订单
    try {
      await run('DELETE FROM orders WHERE id = ?', ['test-order-refund-route-id']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 用户已登录且订单可以退票 When 请求退票 Then 应返回200 OK和退票信息', async () => {
    // Arrange
    const userToken = 'test-token';
    const orderId = 'test-order-refund-route-id';
    const refundData = { refundFee: 15.0 };

    // Act
    const response = await request(app)
      .post(`/api/orders/${orderId}/refund`)
      .set('Authorization', userToken)
      .send(refundData);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('orderId');
    expect(response.body).toHaveProperty('refundFee');
    expect(response.body).toHaveProperty('refundDate');
  });

  test('Given 用户已登录但订单不能退票 When 请求退票 Then 应返回400 Bad Request', async () => {
    // Arrange
    const userToken = 'test-token';
    
    // 创建一个已退票的订单（不能再次退票）
    const orderId = 'test-order-cannot-refund-id';
    try {
      await run('DELETE FROM orders WHERE id = ?', [orderId]);
      await run(`
        INSERT INTO orders (id, user_id, order_number, train_number, passenger_name, 
                           booking_date, travel_date, price, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [orderId, 'test-user-id', 'TEST789', 'G110', '王五',
          '2025-01-01', '2025-01-30', 200.0, '已退票']);
    } catch (err) {
      // 忽略错误
    }

    // Act
    const response = await request(app)
      .post(`/api/orders/${orderId}/refund`)
      .set('Authorization', userToken)
      .send({ refundFee: 10.0 });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Order cannot be refunded.');
    
    // 清理
    try {
      await run('DELETE FROM orders WHERE id = ?', [orderId]);
    } catch (err) {
      // 忽略错误
    }
  });
});
