const passengerService = require('../../src/services/passengerService');
const { run } = require('../../src/db/database');

describe('Passenger Service', () => {
  beforeEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id = ?', ['test-passenger-id']);
    } catch (err) {
      // 忽略错误
    }
  });

  afterEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id = ?', ['test-passenger-id']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 有效的用户ID When 调用getPassengers Then 应返回用户的乘车人列表', async () => {
    // Arrange
    const userId = 'test-user-id';

    // Act
    const result = await passengerService.getPassengers(userId);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    // TODO: 验证返回的乘车人属于指定用户
  });

  test('Given 有效的用户ID和姓名 When 调用getPassengersByName Then 应返回筛选后的乘车人列表', async () => {
    // Arrange
    const userId = 'test-user-id';
    const name = '张三';

    // Act
    const result = await passengerService.getPassengersByName(userId, name);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    // TODO: 验证返回的乘车人姓名包含指定关键词
  });

  test('Given 有效的乘车人数据 When 调用createPassenger Then 应成功创建乘车人', async () => {
    // Arrange
    const userId = 'test-user-id';
    // 使用唯一的身份证号，避免冲突
    const passengerData = {
      name: '张三',
      idType: '居民身份证',
      idNumber: '110101199001011250', // 使用唯一的身份证号
      phone: '13800138000',
      discountType: '成人'
    };

    // Act
    const result = await passengerService.createPassenger(userId, passengerData);
    
    // 清理
    try {
      await run('DELETE FROM passengers WHERE id_number = ?', [passengerData.idNumber]);
    } catch (err) {
      // 忽略错误
    }

    // Assert
    expect(result).toHaveProperty('passengerId');
    // TODO: 验证数据库中已创建乘车人记录
  });

  test('Given 无效的证件号 When 调用createPassenger Then 应抛出验证错误', async () => {
    // Arrange
    const userId = 'test-user-id';
    const invalidPassengerData = {
      name: '张三',
      idType: '居民身份证',
      idNumber: '12345', // 无效的身份证号（太短）
      phone: '13800138000',
      discountType: '成人'
    };

    // Act & Assert
    await expect(passengerService.createPassenger(userId, invalidPassengerData))
      .rejects.toThrow();
  });

  test('Given 有效的乘车人ID和更新数据 When 调用updatePassenger Then 应成功更新', async () => {
    // Arrange
    const userId = 'test-user-id';
    const passengerId = 'test-passenger-update-service-id';
    
    // 清理并插入测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id = ?', [passengerId]);
    } catch (err) {
      // 忽略错误
    }
    
    await run(`
      INSERT INTO passengers (id, user_id, name, id_type, id_number, phone, discount_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [passengerId, userId, '张三', '居民身份证', '110101199001011236', '13800138000', '成人']);
    
    const updateData = {
      name: '李四',
      phone: '13800138001'
    };

    // Act
    const result = await passengerService.updatePassenger(passengerId, userId, updateData);
    
    // 清理
    try {
      await run('DELETE FROM passengers WHERE id = ?', [passengerId]);
    } catch (err) {
      // 忽略错误
    }

    // Assert
    expect(result).toBe(true);
    // TODO: 验证数据库中的乘车人信息已更新
  });

  test('Given 有效的乘车人ID When 调用deletePassenger Then 应成功删除', async () => {
    // Arrange
    const userId = 'test-user-id';
    const passengerId = 'test-passenger-delete-service-id';
    
    // 清理并插入测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id = ?', [passengerId]);
    } catch (err) {
      // 忽略错误
    }
    
    await run(`
      INSERT INTO passengers (id, user_id, name, id_type, id_number, phone, discount_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [passengerId, userId, '张三', '居民身份证', '110101199001011237', '13800138000', '成人']);

    // Act
    const result = await passengerService.deletePassenger(passengerId, userId);

    // Assert
    expect(result).toBe(true);
  });

  test('Given 有效的乘车人ID列表 When 调用deletePassengers Then 应成功批量删除', async () => {
    // Arrange
    const userId = 'test-user-id';
    const passengerIds = ['passenger-service-1', 'passenger-service-2'];
    
    // 清理并插入测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id IN (?, ?)', passengerIds);
    } catch (err) {
      // 忽略错误
    }
    
    await run(`
      INSERT INTO passengers (id, user_id, name, id_type, id_number, phone, discount_type)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?)
    `, [
      'passenger-service-1', userId, '张三', '居民身份证', '110101199001011238', '13800138000', '成人',
      'passenger-service-2', userId, '李四', '居民身份证', '110101199001011239', '13800138001', '成人'
    ]);

    // Act
    const result = await passengerService.deletePassengers(passengerIds, userId);       

    // Assert
    expect(result).toHaveProperty('deletedCount');
    expect(result.deletedCount).toBe(2);
    
    // 清理
    try {
      await run('DELETE FROM passengers WHERE id IN (?, ?)', passengerIds);
    } catch (err) {
      // 忽略错误
    }
  });
});
