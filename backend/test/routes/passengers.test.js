const request = require('supertest');
const app = require('../../src/app');
const { run } = require('../../src/db/database');

describe('API-GET-Passengers', () => {
  beforeEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE user_id = ?', ['test-user-id']);
    } catch (err) {
      // 忽略错误
    }
  });

  afterEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE user_id = ?', ['test-user-id']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 用户已登录 When 请求获取乘车人列表 Then 应返回200 OK和乘车人列表', async () => {
    // Arrange
    const userToken = 'test-token';

    // Act
    const response = await request(app)
      .get('/api/passengers')
      .set('Authorization', userToken);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('passengers');
    expect(Array.isArray(response.body.passengers)).toBe(true);
  });

  test('Given 用户已登录且提供姓名查询条件 When 请求获取筛选后的乘车人列表 Then 应返回200 OK和筛选后的列表', async () => {
    // Arrange
    const userToken = 'test-token';
    const queryParams = {
      name: '张三'
    };

    // Act
    const response = await request(app)
      .get('/api/passengers')
      .set('Authorization', userToken)
      .query(queryParams);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('passengers');
    // TODO: 验证乘车人列表根据姓名筛选
  });
});

describe('API-POST-Passenger', () => {
  beforeEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE user_id = ?', ['test-user-id']);
    } catch (err) {
      // 忽略错误
    }
  });

  afterEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE user_id = ?', ['test-user-id']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 用户已登录且提供有效乘车人数据 When 请求创建乘车人 Then 应返回201 Created', async () => {
    // Arrange
    const userToken = 'test-token';
    // 使用唯一的身份证号，避免与beforeEach中的数据冲突
    const passengerData = {
      name: '张三',
      idType: '居民身份证',
      idNumber: '110101199001011240', // 使用不同的身份证号
      phone: '13800138000',
      discountType: '成人'
    };

    // Act
    const response = await request(app)
      .post('/api/passengers')
      .set('Authorization', userToken)
      .send(passengerData);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('passengerId');
    expect(response.body).toHaveProperty('message');
  });

  test('Given 用户已登录但证件号格式错误 When 请求创建乘车人 Then 应返回400 Bad Request', async () => {
    // Arrange
    const userToken = 'test-token';
    const invalidPassengerData = {
      name: '张三',
      idType: '居民身份证',
      idNumber: '12345', // 无效的身份证号（太短）
      phone: '13800138000',
      discountType: '成人'
    };

    // Act
    const response = await request(app)
      .post('/api/passengers')
      .set('Authorization', userToken)
      .send(invalidPassengerData);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid input format or validation failed.');
  });
});

describe('API-PUT-Passenger', () => {
  beforeEach(async () => {
    // 清理并插入测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id = ?', ['test-passenger-id']);
      await run(`
        INSERT INTO passengers (id, user_id, name, id_type, id_number, phone, discount_type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, ['test-passenger-id', 'test-user-id', '张三', '居民身份证', '110101199001011234', '13800138000', '成人']);
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

  test('Given 用户已登录且乘车人存在 When 请求更新乘车人信息 Then 应返回200 OK', async () => {
    // Arrange
    const userToken = 'test-token';
    const passengerId = 'test-passenger-id';
    const updateData = {
      name: '李四',
      phone: '13800138001'
    };

    // Act
    const response = await request(app)
      .put(`/api/passengers/${passengerId}`)
      .set('Authorization', userToken)
      .send(updateData);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Passenger updated successfully.');
  });
});

describe('API-DELETE-Passenger', () => {
  beforeEach(async () => {
    // 清理并插入测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id = ?', ['test-passenger-id']);
      await run(`
        INSERT INTO passengers (id, user_id, name, id_type, id_number, phone, discount_type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, ['test-passenger-id', 'test-user-id', '张三', '居民身份证', '110101199001011234', '13800138000', '成人']);
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

  test('Given 用户已登录且乘车人存在 When 请求删除乘车人 Then 应返回200 OK', async () => {
    // Arrange
    const userToken = 'test-token';
    const passengerId = 'test-passenger-id';

    // Act
    const response = await request(app)
      .delete(`/api/passengers/${passengerId}`)
      .set('Authorization', userToken);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Passenger deleted successfully.');
  });
});

describe('API-DELETE-Passengers', () => {
  beforeEach(async () => {
    // 清理并插入测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id IN (?, ?)', ['passenger-1', 'passenger-2']);
      await run(`
        INSERT INTO passengers (id, user_id, name, id_type, id_number, phone, discount_type)
        VALUES 
          (?, ?, ?, ?, ?, ?, ?),
          (?, ?, ?, ?, ?, ?, ?)
      `, [
        'passenger-1', 'test-user-id', '张三', '居民身份证', '110101199001011234', '13800138000', '成人',
        'passenger-2', 'test-user-id', '李四', '居民身份证', '110101199001011235', '13800138001', '成人'
      ]);
    } catch (err) {
      // 忽略错误
    }
  });

  afterEach(async () => {
    // 清理测试乘车人
    try {
      await run('DELETE FROM passengers WHERE id IN (?, ?)', ['passenger-1', 'passenger-2']);
    } catch (err) {
      // 忽略错误
    }
  });

  test('Given 用户已登录且提供有效的乘车人ID列表 When 请求批量删除乘车人 Then 应返回200 OK', async () => {
    // Arrange
    const userToken = 'test-token';
    const passengerIds = ['passenger-1', 'passenger-2'];

    // Act
    const response = await request(app)
      .delete('/api/passengers')
      .set('Authorization', userToken)
      .send({ passengerIds });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('deletedCount');
    expect(response.body).toHaveProperty('message');
  });
});
