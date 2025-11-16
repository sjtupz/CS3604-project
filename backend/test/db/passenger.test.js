const {
  getPassengers,
  getPassengersByName,
  createPassenger,
  updatePassenger,
  deletePassenger,
  deletePassengers
} = require('../../src/db/passenger');
const { run } = require('../../src/db/database');

describe('DB-GetPassengers', () => {
  beforeEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id = ?', ['test-passenger-get-id']);
    } catch (err) {
      // 忽略错误
    }
    
    // 插入测试乘车人
    await run(`
      INSERT INTO passengers (id, user_id, name, id_type, id_number, phone, discount_type)
      VALUES ('test-passenger-get-id', 'test-user-id', '张三', '居民身份证', '110101199001011234', '13800138000', '成人')
    `);
  });

  afterEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id = ?', ['test-passenger-get-id']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 有效的用户ID When 调用getPassengers Then 应返回用户的乘车人列表', async () => {
    // Arrange
    const userId = 'test-user-id';

    // Act
    const result = await getPassengers(userId);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty('passengerId');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('idType');
      expect(result[0]).toHaveProperty('idNumber');
    }
  });

  test('Given 不存在的用户ID When 调用getPassengers Then 应返回空数组', async () => {
    // Arrange
    const invalidUserId = 'invalid-user-id';

    // Act
    const result = await getPassengers(invalidUserId);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});

describe('DB-GetPassengersByName', () => {
  beforeEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id = ?', ['test-passenger-name-id']);
    } catch (err) {
      // 忽略错误
    }
    
    // 插入测试乘车人
    await run(`
      INSERT INTO passengers (id, user_id, name, id_type, id_number, phone, discount_type)
      VALUES ('test-passenger-name-id', 'test-user-id', '张三', '居民身份证', '110101199001011234', '13800138000', '成人')
    `);
  });

  afterEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id = ?', ['test-passenger-name-id']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 有效的用户ID和姓名 When 调用getPassengersByName Then 应返回筛选后的乘车人列表', async () => {
    // Arrange
    const userId = 'test-user-id';
    const name = '张三';

    // Act
    const result = await getPassengersByName(userId, name);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    // TODO: 验证返回的乘车人姓名包含指定关键词
  });
});

describe('DB-CreatePassenger', () => {
  beforeEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id_number = ?', ['110101199001011234']);
    } catch (err) {
      // 忽略错误
    }
  });

  afterEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id_number = ?', ['110101199001011234']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 有效的用户ID和乘车人数据 When 调用createPassenger Then 应成功创建乘车人', async () => {
    // Arrange
    const userId = 'test-user-id';
    const passengerData = {
      name: '张三',
      idType: '居民身份证',
      idNumber: '110101199001011234',
      phone: '13800138000',
      discountType: '成人'
    };

    // Act
    const result = await createPassenger(userId, passengerData);

    // Assert
    expect(result).toHaveProperty('passengerId');
    // TODO: 验证数据库中已创建乘车人记录
  });

  test('Given 重复的证件号 When 调用createPassenger Then 应抛出唯一性约束错误', async () => {
    // Arrange
    const userId = 'test-user-id';
    
    // 先创建一个乘车人
    const firstPassengerData = {
      name: '张三',
      idType: '居民身份证',
      idNumber: '110101199001011234',
      phone: '13800138000',
      discountType: '成人'
    };
    await createPassenger(userId, firstPassengerData);
    
    // 尝试创建重复证件号的乘车人
    const duplicatePassengerData = {
      name: '李四',
      idType: '居民身份证',
      idNumber: '110101199001011234', // 重复的证件号
      phone: '13800138001',
      discountType: '成人'
    };

    // Act & Assert
    await expect(createPassenger(userId, duplicatePassengerData))
      .rejects.toThrow();
  });
});

describe('DB-UpdatePassenger', () => {
  beforeEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id = ?', ['test-passenger-update-id']);
    } catch (err) {
      // 忽略错误
    }
    
    // 插入测试乘车人
    await run(`
      INSERT INTO passengers (id, user_id, name, id_type, id_number, phone, discount_type)
      VALUES ('test-passenger-update-id', 'test-user-id', '张三', '居民身份证', '110101199001011234', '13800138000', '成人')
    `);
  });

  afterEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id = ?', ['test-passenger-update-id']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 有效的乘车人ID和更新数据 When 调用updatePassenger Then 应成功更新', async () => {
    // Arrange
    const userId = 'test-user-id';
    const passengerId = 'test-passenger-update-id';
    const updateData = {
      name: '李四',
      phone: '13800138001'
    };

    // Act
    const result = await updatePassenger(passengerId, userId, updateData);

    // Assert
    expect(result).toBe(true);
    // TODO: 验证数据库中的乘车人信息已更新
  });

  test('Given 不存在的乘车人ID When 调用updatePassenger Then 应抛出错误', async () => {
    // Arrange
    const userId = 'test-user-id';
    const invalidPassengerId = 'invalid-passenger-id';
    const updateData = {
      name: '李四'
    };

    // Act & Assert
    await expect(updatePassenger(invalidPassengerId, userId, updateData)).rejects.toThrow('Passenger not found');
  });
});

describe('DB-DeletePassenger', () => {
  beforeEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id = ?', ['test-passenger-delete-id']);
    } catch (err) {
      // 忽略错误
    }
    
    // 插入测试乘车人
    await run(`
      INSERT INTO passengers (id, user_id, name, id_type, id_number, phone, discount_type)
      VALUES ('test-passenger-delete-id', 'test-user-id', '张三', '居民身份证', '110101199001011234', '13800138000', '成人')
    `);
  });

  afterEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id = ?', ['test-passenger-delete-id']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 有效的乘车人ID When 调用deletePassenger Then 应成功删除', async () => {
    // Arrange
    const userId = 'test-user-id';
    const passengerId = 'test-passenger-delete-id';

    // Act
    const result = await deletePassenger(passengerId, userId);

    // Assert
    expect(result).toBe(true);
  });

  test('Given 不存在的乘车人ID When 调用deletePassenger Then 应抛出错误', async () => {
    // Arrange
    const userId = 'test-user-id';
    const invalidPassengerId = 'invalid-passenger-id';

    // Act & Assert
    await expect(deletePassenger(invalidPassengerId, userId)).rejects.toThrow('Passenger not found');
  });
});

describe('DB-DeletePassengers', () => {
  beforeEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id IN (?, ?)', ['passenger-batch-1', 'passenger-batch-2']);
    } catch (err) {
      // 忽略错误
    }
    
    // 插入测试乘车人
    await run(`
      INSERT INTO passengers (id, user_id, name, id_type, id_number, phone, discount_type)
      VALUES 
        ('passenger-batch-1', 'test-user-id', '张三', '居民身份证', '110101199001011234', '13800138000', '成人'),
        ('passenger-batch-2', 'test-user-id', '李四', '居民身份证', '110101199001011235', '13800138001', '成人')
    `);
  });

  afterEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id IN (?, ?)', ['passenger-batch-1', 'passenger-batch-2']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 有效的乘车人ID列表 When 调用deletePassengers Then 应成功批量删除', async () => {
    // Arrange
    const userId = 'test-user-id';
    const passengerIds = ['passenger-batch-1', 'passenger-batch-2'];

    // Act
    const result = await deletePassengers(passengerIds, userId);

    // Assert
    expect(result).toHaveProperty('deletedCount');
    expect(result.deletedCount).toBe(2);
  });

  test('Given 包含不存在ID的列表 When 调用deletePassengers Then 应删除存在的记录并返回成功删除数量', async () => {
    // Arrange
    const userId = 'test-user-id';
    const passengerIds = ['passenger-batch-1', 'invalid-id', 'passenger-batch-2'];

    // Act
    const result = await deletePassengers(passengerIds, userId);

    // Assert
    expect(result).toHaveProperty('deletedCount');
    expect(result.deletedCount).toBe(2); // 只删除存在的记录
  });
});
