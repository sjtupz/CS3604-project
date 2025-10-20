const request = require('supertest');
const app = require('../../src/app');
const database = require('../../src/config/database');
const TestHelper = require('../helpers/testHelper');

describe('Authentication Routes', () => {
  beforeAll(async () => {
    // 连接测试数据库
    await database.connect(true);
  });

  afterAll(async () => {
    // 关闭数据库连接
    await database.close();
  });

  beforeEach(async () => {
    // 清理测试数据
    await TestHelper.clearDatabase();
  });

  describe('POST /api/login', () => {
    // 基于API-POST-Login的acceptanceCriteria编写测试

    it('应该成功登录有效用户并返回JWT令牌', async () => {
      // 准备测试数据
      const testUserData = {
        username: 'testuser',
        password: 'password123',
        realName: '张三',
        idType: '身份证',
        idNumber: '110101199001011234',
        discountType: '成人',
        phoneNumber: '13800138000',
        email: 'test@example.com'
      };

      // 先创建测试用户
      await TestHelper.createTestUser(testUserData);

      const loginData = {
        username: 'testuser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(200);

      // 验证响应结构
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('username', testUserData.username);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('应该拒绝无效的用户名', async () => {
      const invalidLogin = {
        username: 'nonexistentuser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/login')
        .send(invalidLogin)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', '用户名或密码错误');
    });

    it('应该拒绝错误的密码', async () => {
      // 准备测试数据
      const testUserData = {
        username: 'testuser',
        password: 'password123',
        realName: '张三',
        idType: '身份证',
        idNumber: '110101199001011234',
        discountType: '成人',
        phoneNumber: '13800138000',
        email: 'test@example.com'
      };

      // 先创建测试用户
      await TestHelper.createTestUser(testUserData);

      const loginData = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', '用户名或密码错误');
    });

    it('应该验证必需的输入字段', async () => {
      const incompleteLogin = {
        username: 'testuser'
        // 缺少password字段
      };

      const response = await request(app)
        .post('/api/login')
        .send(incompleteLogin)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('应该支持邮箱登录', async () => {
      const emailLogin = {
        username: 'test@example.com',
        password: 'password123'
      };

      // 先创建测试用户
      // TODO: 创建测试用户的逻辑

      const response = await request(app)
        .post('/api/login')
        .send(emailLogin)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
    });

    it('应该支持手机号登录', async () => {
      const phoneLogin = {
        username: '13800138000',
        password: 'password123'
      };

      // 先创建测试用户
      // TODO: 创建测试用户的逻辑

      const response = await request(app)
        .post('/api/login')
        .send(phoneLogin)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('POST /api/register', () => {
    // 基于API-POST-Register的acceptanceCriteria编写测试

    it('应该成功注册新用户', async () => {
      const newUser = {
        username: 'newuser',
        password: 'password123',
        realName: '李四',
        idType: '身份证',
        idNumber: '110101199001011235',
        discountType: '成人',
        phoneNumber: '13800138001',
        email: 'newuser@example.com'
      };

      const response = await request(app)
        .post('/api/register')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', '注册成功');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('username', newUser.username);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('应该拒绝重复的用户名', async () => {
      // 先创建一个用户
      const existingUserData = {
        username: 'existinguser',
        password: 'password123',
        realName: '张三',
        idType: '身份证',
        idNumber: '110101199001011234',
        discountType: '成人',
        phoneNumber: '13800138000',
        email: 'existing@example.com'
      };

      await TestHelper.createTestUser(existingUserData);

      // 尝试用相同用户名注册
      const duplicateUser = {
        username: 'existinguser',
        password: 'password456',
        realName: '李四',
        idType: '身份证',
        idNumber: '110101199001011235',
        discountType: '成人',
        phoneNumber: '13800138001',
        email: 'different@example.com'
      };

      const response = await request(app)
        .post('/api/register')
        .send(duplicateUser)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', '用户名已存在');
    });

    it('应该拒绝重复的手机号', async () => {
      const user1 = {
        username: 'user1',
        password: 'password123',
        realName: '张三',
        idNumber: '110101199001011234',
        phoneNumber: '13800138000'
      };

      // 先注册一个用户
      await request(app).post('/api/register').send(user1);

      // 尝试注册相同手机号的用户
      const user2 = {
        username: 'user2',
        password: 'password123',
        realName: '李四',
        idNumber: '110101199001011235',
        phoneNumber: '13800138000' // 相同手机号
      };

      const response = await request(app)
        .post('/api/register')
        .send(user2)
        .expect(409);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', '手机号已被注册');
    });

    it('应该拒绝重复的证件号码', async () => {
      const user1 = {
        username: 'user1',
        password: 'password123',
        realName: '张三',
        idNumber: '110101199001011234',
        phoneNumber: '13800138000'
      };

      // 先注册一个用户
      await request(app).post('/api/register').send(user1);

      // 尝试注册相同证件号的用户
      const user2 = {
        username: 'user2',
        password: 'password123',
        realName: '李四',
        idNumber: '110101199001011234', // 相同证件号
        phoneNumber: '13800138001'
      };

      const response = await request(app)
        .post('/api/register')
        .send(user2)
        .expect(409);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', '证件号码已被注册');
    });

    it('应该验证必需的输入字段', async () => {
      const incompleteUser = {
        username: 'testuser',
        password: 'password123'
        // 缺少必需字段
      };

      const response = await request(app)
        .post('/api/register')
        .send(incompleteUser)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('应该验证身份证号码格式', async () => {
      const invalidUser = {
        username: 'testuser',
        password: 'password123',
        realName: '张三',
        idNumber: '123456', // 无效的身份证号
        phoneNumber: '13800138000'
      };

      const response = await request(app)
        .post('/api/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('应该验证手机号格式', async () => {
      const invalidUser = {
        username: 'testuser',
        password: 'password123',
        realName: '张三',
        idNumber: '110101199001011234',
        phoneNumber: '123' // 无效的手机号
      };

      const response = await request(app)
        .post('/api/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/user/profile', () => {
    // 基于API-GET-UserProfile的acceptanceCriteria编写测试

    it('应该成功获取用户资料', async () => {
      // 创建测试用户并获取token
      const testUserData = {
        username: 'testuser',
        password: 'password123',
        realName: '张三',
        idType: '身份证',
        idNumber: '110101199001011234',
        discountType: '成人',
        phoneNumber: '13800138000',
        email: 'test@example.com'
      };

      const { user, token } = await TestHelper.createAndGetTestUser(testUserData);

      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('userId', user.id);
      expect(response.body).toHaveProperty('username', testUserData.username);
      expect(response.body).toHaveProperty('realName', testUserData.realName);
      expect(response.body).toHaveProperty('phoneNumber', testUserData.phoneNumber);
      expect(response.body).toHaveProperty('email', testUserData.email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('应该拒绝未认证的请求', async () => {
      const response = await request(app)
        .get('/api/profile')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', '未授权访问');
    });

    it('应该拒绝无效的JWT令牌', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', '无效的令牌');
    });
  });
});