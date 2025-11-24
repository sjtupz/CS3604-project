// backend/test/routes/auth.test.js
const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');
const userDb = require('../../src/db/userDb');

describe('API-POST-Register: /api/auth/register', () => {

  beforeEach(async () => {
    // 清理数据库
    await new Promise((resolve) => db.run('DELETE FROM users', resolve));
  });

  // 场景 3.3.11 - 用户已完成所有必填信息的规范填写
  test('Given all information is filled correctly When user clicks next Then registration succeeds', async () => {
    const validUserData = {
      username: 'testuser',
      password: 'password123',
      identityType: 'ID_CARD',
      fullName: 'Test User',
      identityNumber: '123456789012345678',
      passengerType: 'ADULT',
    };
    const res = await request(app).post('/api/auth/register').send(validUserData);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toContain('successful');
  });

  // 场景 3.3.11 - 输入已注册的证件号码点击下一步
  test('Given the identity number is already registered When user submits Then returns 409 conflict error', async () => {
    // 先在数据库中创建一个用户
    const existingUser = {
      username: 'existinguser',
      password: 'password123',
      identityType: 'ID_CARD',
      fullName: 'Existing User',
      identityNumber: '123456789012345678', // 这个身份证号已经被注册
      passengerType: 'ADULT',
    };
    await userDb.createUser(existingUser);

    const conflictingUserData = {
      username: 'newuser',
      password: 'password123',
      identityType: 'ID_CARD',
      fullName: 'New User',
      identityNumber: '123456789012345678', // 尝试使用已存在的身份证号注册
      passengerType: 'ADULT',
    };
    const res = await request(app).post('/api/auth/register').send(conflictingUserData);
    expect(res.statusCode).toBe(409);
    expect(res.body.error).toContain('证件号码');
  });

  // 场景 3.3.11 - 输入已注册的邮箱点击下一步
  test('Given the email is already registered When user submits Then returns 409 conflict error', async () => {
    const existingUser = {
      username: 'existinguser2',
      password: 'password123',
      identityType: 'ID_CARD',
      fullName: 'Existing User 2',
      identityNumber: 'UNIQUE_ID_123',
      passengerType: 'ADULT',
      email: 'conflict@example.com',
    };
    await userDb.createUser(existingUser);

    const conflictingUserData = {
      username: 'newuser2',
      password: 'password123',
      identityType: 'ID_CARD',
      fullName: 'New User 2',
      identityNumber: 'UNIQUE_ID_456',
      passengerType: 'ADULT',
      email: 'conflict@example.com',
    };
    const res = await request(app).post('/api/auth/register').send(conflictingUserData);
    expect(res.statusCode).toBe(409);
    expect(res.body.error).toContain('邮箱');
  });

  // 场景 3.3.11 - 输入已注册的手机号码点击下一步
  test('Given the phone number is already registered When user submits Then returns 409 conflict error', async () => {
    const existingUser = {
      username: 'existinguser3',
      password: 'password123',
      identityType: 'ID_CARD',
      fullName: 'Existing User 3',
      identityNumber: 'UNIQUE_ID_789',
      passengerType: 'ADULT',
      phoneNumber: '13800138000',
    };
    await userDb.createUser(existingUser);

    const conflictingUserData = {
      username: 'newuser3',
      password: 'password123',
      identityType: 'ID_CARD',
      fullName: 'New User 3',
      identityNumber: 'UNIQUE_ID_012',
      passengerType: 'ADULT',
      phoneNumber: '13800138000',
    };
    const res = await request(app).post('/api/auth/register').send(conflictingUserData);
    expect(res.statusCode).toBe(409);
    expect(res.body.error).toContain('手机号码');
  });

  // 场景 3.3.1 - 用户名合法但已被占用 (在提交时再次验证)
  test('Given the username is already taken When user submits Then returns 409 conflict error', async () => {
    const existingUser = {
      username: 'taken_user',
      password: 'password123',
      identityType: 'ID_CARD',
      fullName: 'Taken User',
      identityNumber: 'UNIQUE_ID_ABC',
      passengerType: 'ADULT',
    };
    await userDb.createUser(existingUser);

    const conflictingUserData = {
      username: 'taken_user',
      password: 'password123',
      identityType: 'ID_CARD',
      fullName: 'New User 4',
      identityNumber: 'UNIQUE_ID_DEF',
      passengerType: 'ADULT',
    };
    const res = await request(app).post('/api/auth/register').send(conflictingUserData);
    expect(res.statusCode).toBe(409);
    expect(res.body.error).toContain('用户名');
  });
});
