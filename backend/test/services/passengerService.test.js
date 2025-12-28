const passengerService = require('../../src/services/passengerService');
const { run, waitForInit } = require('../../src/db/personal_database');

beforeAll(async () => {
  await waitForInit();
});

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

  test('Given 有效的乘车人数据(非注册用户) When 调用createPassenger Then 应成功创建乘车人', async () => {
    // Arrange
    const userId = 'test-user-id';
    // 使用唯一的身份证号，避免冲突
    const passengerData = {
      name: '王五', // 使用非注册用户的姓名
      idType: '居民身份证',
      idNumber: '110101199001011253', // 使用有效的身份证号 (Checksum verified)
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
  });

  test('Given 已存在的用户姓名和正确的证件号 When 调用createPassenger Then 应成功创建乘车人', async () => {
    // Arrange
    const userId = 'test-user-id';
    const passengerData = {
      name: '张三', // 已存在的注册用户
      idType: '居民身份证',
      idNumber: '110101199001011234', // 正确的身份证号
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
  });

  test('Given 已存在的用户姓名但错误的证件号(格式错误) When 调用createPassenger Then 应抛出格式错误', async () => {
    // Arrange
    const userId = 'test-user-id';
    const passengerData = {
      name: '张三', // 已存在的注册用户
      idType: '居民身份证',
      idNumber: '110101199001011250', // 错误的身份证号（不匹配注册信息且格式无效）
      phone: '13800138000',
      discountType: '成人'
    };

    // Act & Assert
    await expect(passengerService.createPassenger(userId, passengerData))
      .rejects.toThrow('请正确输入18位的证件号码！');
  });

  test('Given 已存在的用户证件号但姓名不一致 When 调用createPassenger Then 应抛出身份信息不一致错误', async () => {
    // Arrange
    const userId = 'test-user-id';
    // 假设 '110101199001011234' 是 '张三' 的ID (在 createLoginCodeRecord.test.js 或其他地方建立的，或者在此测试套件初始化时建立)
    // 根据 setup.js, 可能没有预置用户? 
    // Wait, createLoginCodeRecord.test.js is not relevant. 
    // setup.js or beforeAll might create users. 
    // The previous test "Given 已存在的用户姓名..." assumes '张三' exists.
    // Let's rely on that.
    
    // We need to know what ID '张三' has.
    // In "Given 已存在的用户姓名和正确的证件号" test, it uses '110101199001011234'.
    // So '110101199001011234' belongs to '张三'.

    const passengerData = {
      name: '李四', // 名字不匹配
      idType: '居民身份证',
      idNumber: '110101199001011234', // '张三' 的ID
      phone: '13800138000',
      discountType: '成人'
    };

    // Act & Assert
    await expect(passengerService.createPassenger(userId, passengerData))
      .rejects.toThrow('身份信息不一致！');
  });

  test('Given 无效的证件号(非注册用户) When 调用createPassenger Then 应抛出验证错误', async () => {
    // Arrange
    const userId = 'test-user-id';
    const invalidPassengerData = {
      name: '赵六', // 非注册用户
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
