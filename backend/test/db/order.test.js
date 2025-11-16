const {
  getOrdersByStatus,
  getOrdersByDateRange,
  updateOrderStatus,
  createRefundRecord
} = require('../../src/db/order');
const { run } = require('../../src/db/database');

describe('DB-GetOrdersByStatus', () => {
  beforeEach(async () => {
    // 清理测试订单
    try {
      await run('DELETE FROM orders WHERE id = ?', ['test-order-status-id']);
    } catch (err) {
      // 忽略错误
    }
    
    // 插入测试订单
    await run(`
      INSERT INTO orders (id, user_id, order_number, train_number, passenger_name, 
                         booking_date, travel_date, price, status)
      VALUES ('test-order-status-id', 'test-user-id', 'TEST001', 'G101', '张三',
              '2025-01-01', '2025-01-15', 100.0, '未完成')
    `);
  });

  afterEach(async () => {
    // 清理测试订单
    try {
      await run('DELETE FROM orders WHERE id = ?', ['test-order-status-id']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 有效的用户ID和订单状态 When 调用getOrdersByStatus Then 应返回对应状态的订单列表', async () => {
    // Arrange
    const userId = 'test-user-id';
    const status = '未完成';

    // Act
    const result = await getOrdersByStatus(userId, status);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty('status', status);
    }
  });

  test('Given 不存在的用户ID When 调用getOrdersByStatus Then 应返回空数组', async () => {
    // Arrange
    const invalidUserId = 'invalid-user-id';
    const status = '未完成';

    // Act
    const result = await getOrdersByStatus(invalidUserId, status);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});

describe('DB-GetOrdersByDateRange', () => {
  beforeEach(async () => {
    // 清理测试订单
    try {
      await run('DELETE FROM orders WHERE id = ?', ['test-order-range-id']);
    } catch (err) {
      // 忽略错误
    }
    
    // 插入测试订单
    await run(`
      INSERT INTO orders (id, user_id, order_number, train_number, passenger_name, 
                         booking_date, travel_date, price, status)
      VALUES ('test-order-range-id', 'test-user-id', 'TEST123', 'G108', '张三',
              '2025-01-01', '2025-01-15', 100.0, '未出行')
    `);
  });

  afterEach(async () => {
    // 清理测试订单
    try {
      await run('DELETE FROM orders WHERE id = ?', ['test-order-range-id']);
    } catch (err) {
      // 忽略错误
    }
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
    const result = await getOrdersByDateRange(userId, queryParams);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    // TODO: 验证返回的订单符合查询条件
  });
});

describe('DB-UpdateOrderStatus', () => {
  beforeEach(async () => {
    // 清理测试订单
    try {
      await run('DELETE FROM orders WHERE id = ?', ['test-order-id']);
    } catch (err) {
      // 忽略错误
    }
    
    // 插入测试订单（未出行状态）
    await run(`
      INSERT INTO orders (id, user_id, order_number, train_number, passenger_name, 
                         booking_date, travel_date, price, status)
      VALUES ('test-order-id', 'test-user-id', 'TEST002', 'G102', '李四',
              '2025-01-01', '2025-01-20', 150.0, '未出行')
    `);
  });

  afterEach(async () => {
    // 清理测试订单
    try {
      await run('DELETE FROM orders WHERE id = ?', ['test-order-id']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 有效的订单ID和新状态 When 调用updateOrderStatus Then 应成功更新状态', async () => {
    // Arrange
    const orderId = 'test-order-id';
    const newStatus = '历史';

    // Act
    const result = await updateOrderStatus(orderId, newStatus);

    // Assert
    expect(result).toBe(true);
    // TODO: 验证数据库中的订单状态已更新
  });

  test('Given 不存在的订单ID When 调用updateOrderStatus Then 应抛出错误', async () => {
    // Arrange
    const invalidOrderId = 'invalid-order-id';
    const newStatus = '已退票';

    // Act & Assert
    await expect(updateOrderStatus(invalidOrderId, newStatus)).rejects.toThrow('Order not found');
  });
});

describe('DB-CreateRefundRecord', () => {
  beforeEach(async () => {
    // 清理测试订单
    try {
      await run('DELETE FROM orders WHERE id = ?', ['test-order-refund-id']);
    } catch (err) {
      // 忽略错误
    }
    
    // 插入测试订单（未出行状态，可以退票）
    await run(`
      INSERT INTO orders (id, user_id, order_number, train_number, passenger_name, 
                         booking_date, travel_date, price, status)
      VALUES ('test-order-refund-id', 'test-user-id', 'TEST003', 'G103', '王五',
              '2025-01-01', '2025-01-25', 200.0, '未出行')
    `);
  });

  afterEach(async () => {
    // 清理测试订单
    try {
      await run('DELETE FROM orders WHERE id = ?', ['test-order-refund-id']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 有效的订单ID When 调用createRefundRecord Then 应成功创建退票记录', async () => {
    // Arrange
    const orderId = 'test-order-refund-id';
    const refundData = { refundFee: 20.0 };

    // Act
    const result = await createRefundRecord(orderId, refundData);

    // Assert
    expect(result).toBe(true);
  });

  test('Given 不存在的订单ID When 调用createRefundRecord Then 应抛出错误', async () => {
    // Arrange
    const invalidOrderId = 'invalid-order-id';
    const refundData = { refundFee: 10.0 };

    // Act & Assert
    await expect(createRefundRecord(invalidOrderId, refundData)).rejects.toThrow('Order not found');
  });
});
