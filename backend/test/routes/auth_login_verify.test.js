const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');
const userDb = require('../../src/db/userDb');

describe('API-POST-Login-Verify: /api/auth/login/verify', () => {
  beforeEach(async () => {
    await new Promise((resolve) => db.run('DELETE FROM users', resolve));
    await new Promise((resolve) => db.run('DELETE FROM login_codes', resolve));
  });

  test('Given no code is provided When clicking confirm Then returns 400 with error', async () => {
    const res = await request(app)
      .post('/api/auth/login/verify')
      .send({ identifier: 'user@example.com', idLast4: '0000', password: 'password123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('请输入验证码');
  });

  test('Given wrong code or no code sent When clicking confirm Then returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login/verify')
      .send({ identifier: '13800138000', idLast4: '0000', code: '999999', password: 'password123' });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toContain('验证码校验失败');
  });

  test('Given correct code but wrong password When clicking confirm Then returns 403', async () => {
    await userDb.createUser({
      username: 'user6',
      password: 'hashed',
      identityType: 'ID_CARD',
      fullName: 'User Six',
      identityNumber: 'IDNUMBER2222',
      passengerType: 'ADULT',
      phoneNumber: '13400134000'
    });
    await new Promise((resolve) => {
      db.run('INSERT INTO login_codes (phone, identifier, code, createdAt, valid) VALUES (?, ?, ?, ?, ?)', ['13400134000', 'user6', '123456', Date.now(), 1], resolve);
    });
    const res = await request(app)
      .post('/api/auth/login/verify')
      .send({ identifier: 'user6', idLast4: '2222', code: '123456', password: 'wrongpass' });
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toContain('用户名或密码错误');
  });

  test('Given correct code and correct password When clicking confirm Then returns token and invalidates code', async () => {
    await userDb.createUser({
      username: 'user7',
      password: 'hashed',
      identityType: 'ID_CARD',
      fullName: 'User Seven',
      identityNumber: 'IDNUMBER3333',
      passengerType: 'ADULT',
      phoneNumber: '13300133000'
    });
    await new Promise((resolve) => {
      db.run('INSERT INTO login_codes (phone, identifier, code, createdAt, valid) VALUES (?, ?, ?, ?, ?)', ['13300133000', 'user7', '654321', Date.now(), 1], resolve);
    });
    const res = await request(app)
      .post('/api/auth/login/verify')
      .send({ identifier: 'user7', idLast4: '3333', code: '654321', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(typeof res.body.userId).toBe('string');
    expect(typeof res.body.token).toBe('string');
    const row = await new Promise((resolve) => {
      db.get('SELECT valid FROM login_codes WHERE identifier = ?', ['user7'], (err, r) => resolve(r));
    });
    expect(row && row.valid).toBe(0);
  });
});
