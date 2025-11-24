// backend/test/routes/users.test.js
const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');
const userDb = require('../../src/db/userDb');

describe('API-GET-CheckUsername: /api/users/check-username', () => {
  beforeEach(async () => {
    await new Promise((resolve) => db.run('DELETE FROM users', resolve));
  });

  // 场景 3.3.1 - 用户名合法且未被占用
  test('Given a username is valid and available When user checks it Then API returns isAvailable true', async () => {
    const res = await request(app).get('/api/users/check-username?username=available_user');
    expect(res.statusCode).toBe(200);
    expect(res.body.isAvailable).toBe(true);
  });

  // 场景 3.3.1 - 用户名合法但已被占用
  test('Given a username is already taken When user checks it Then API returns isAvailable false', async () => {
    // Pre-create a user with the username 'taken_user'
    const existingUser = {
      username: 'taken_user',
      password: 'password123',
      identityType: 'ID_CARD',
      fullName: 'Test User',
      identityNumber: '123456789012345678',
      passengerType: 'ADULT',
      email: 'test@example.com',
      phoneNumber: '12345678901'
    };
    await userDb.createUser(existingUser);

    const res = await request(app).get('/api/users/check-username?username=taken_user');
    expect(res.statusCode).toBe(200);
    expect(res.body.isAvailable).toBe(false);
    expect(res.body.message).toBe('该用户名已经占用，请重新选择用户名！');
  });

  // 场景 3.3.1 - 用户名格式不正确
  test('Given a username has invalid format When user checks it Then API returns 400 error', async () => {
    const res = await request(app).get('/api/users/check-username?username=1invalid');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('format');
  });
});