const request = require('supertest');
const app = require('../../src/app');

describe('API-GET-UserInfo', () => {
  beforeEach(() => {
    // TODO: 设置测试环境
  });

  test('Given 用户已登录 When 请求获取用户信息 Then 应返回200 OK和用户信息', async () => {
    // Arrange
    const userToken = 'test-token';

    // Act
    const response = await request(app)
      .get('/api/user/info')
      .set('Authorization', userToken);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('realName');
    // TODO: 验证返回的用户信息格式
  });

  test('Given 用户未登录 When 请求获取用户信息 Then 应返回401 Unauthorized', async () => {
    // Arrange & Act
    const response = await request(app)
      .get('/api/user/info');

    // Assert
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Unauthorized. User not logged in.');
  });
});

describe('API-PUT-UserContact', () => {
  beforeEach(() => {
    // TODO: 设置测试环境
  });

  test('Given 用户已登录且提供有效的联系方式数据 When 请求更新联系方式 Then 应返回200 OK', async () => {
    // Arrange
    const userToken = 'test-token';
    const contactData = {
      phoneNumber: '13800138000',
      email: 'test@example.com'
    };

    // Act
    const response = await request(app)
      .put('/api/user/contact')
      .set('Authorization', userToken)
      .send(contactData);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Contact information updated successfully.');
  });
});

describe('API-PUT-UserDiscountType', () => {
  beforeEach(() => {
    // TODO: 设置测试环境
  });

  test('Given 用户已登录且选择学生类型 When 请求更新优惠类型 Then 应返回200 OK', async () => {
    // Arrange
    const userToken = 'test-token';
    const discountData = {
      discountType: '学生',
      studentQualification: {
        school: '北京大学',
        studentId: '20250001'
      }
    };

    // Act
    const response = await request(app)
      .put('/api/user/discount-type')
      .set('Authorization', userToken)
      .send(discountData);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Discount type updated successfully.');
  });
});
