const orderService = require('../../src/services/orderService');
const { run } = require('../../src/db/database');

describe('Order Service', () => {
  beforeEach(async () => {
    // 清理测试订单
    try {
      await run('DELETE FROM orders WHERE id IN (?, ?)', ['test-order-id', 'test-order-id-2']);
    } catch (err) {
      // 忽略错误
    }
    
    // 插入测试订单（未出行状态，可以退票）
    await run(`
      INSERT INTO orders (id, user_id, order_number, train_number, passenger_name, 
                         booking_date, travel_date, price, status)
      VALUES ('test-order-id', 'test-user-id', 'TEST123', 'G108', '张三',
              '2025-01-01', '2025-01-15', 100.0, '未出行')
    `);
  });

  afterEach(async () => {
    // 清理测试订单
    try {
      await run('DELETE FROM orders WHERE id IN (?, ?)', ['test-order-id', 'test-order-id-2']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 有效的用户ID和订单状态 When 调用getOrdersByStatus Then 应返回对应状态的订单列表', async () => {
    // Arrange
    const userId = 'test-user-id';
    const status = '未完成';

    // Act
    const result = await orderService.getOrdersByStatus(userId, status);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    // TODO: 验证返回的订单状态都为指定状态
  });

  test('Given 有效的查询参数 When 调用getOrdersByDateRange Then 应返回筛选后的订单列表', async () => {
    // Arrange
    const userId = 'test-user-id';
    const queryParams = {
      status: '未出行',
      queryType: '按订票日期',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      orderNumber: 'TEST123',
      trainNumber: 'G108',
      passengerName: '张三'
    };

    // Act
    const result = await orderService.getOrdersByDateRange(userId, queryParams);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    // TODO: 验证返回的订单符合查询条件
  });

  test('Given 可以退票的订单ID When 调用processRefund Then 应成功处理退票', async () => {
    // Arrange
    const orderId = 'test-order-id';
    const refundData = { refundFee: 10.0 };

    // Act
    const result = await orderService.processRefund(orderId, refundData);

    // Assert
    expect(result).toHaveProperty('orderId');
    expect(result).toHaveProperty('refundFee');
    expect(result).toHaveProperty('refundDate');
    expect(result.status).toBe('已退票');
  });

  test('Given 不能退票的订单ID When 调用processRefund Then 应抛出错误', async () => {
    // Arrange
    const invalidOrderId = 'invalid-order-id';

    // Act & Assert
    await expect(orderService.processRefund(invalidOrderId)).rejects.toThrow();                                                       
  });

  test('Given 有效的订单ID和新状态 When 调用updateOrderStatus Then 应成功更新状态', async () => {
    // Arrange
    const orderId = 'test-order-id';
    const newStatus = '历史';

    // Act
    const result = await orderService.updateOrderStatus(orderId, newStatus);    

    // Assert
    expect(result).toBe(true);
  });
});
