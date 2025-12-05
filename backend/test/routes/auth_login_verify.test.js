// backend/test/routes/auth_login_verify.test.js
const request = require('supertest');
const app = require('../../src/app');
const { run, get, waitForInit } = require('../../src/db/personal_database');
const userDb = require('../../src/db/userDb');
const bcrypt = require('bcrypt');

describe('API-POST-Login-Verify: /api/auth/login/verify', () => {
  beforeAll(async () => {
    await waitForInit();
  });

  beforeEach(async () => {
    await run('DELETE FROM users');
    await run('DELETE FROM login_codes');
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
    const hashedPassword = await bcrypt.hash('password123', 10);
    await userDb.createUser({
      username: 'user6',
      password: hashedPassword,
      identityType: 'ID_CARD',
      fullName: 'User Six',
      identityNumber: 'IDNUMBER2222',
      passengerType: 'ADULT',
      phoneNumber: '13400134000'
    });
    await run('INSERT INTO login_codes (phone, identifier, code, createdAt, valid) VALUES (?, ?, ?, ?, ?)', 
      ['13400134000', 'user6', '123456', Date.now(), 1]);
      
    const res = await request(app)
      .post('/api/auth/login/verify')
      .send({ identifier: 'user6', idLast4: '2222', code: '123456', password: 'wrongpass' });
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toContain('用户名或密码错误');
  });

  test('Given correct code and correct password When clicking confirm Then returns token and invalidates code', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await userDb.createUser({
      username: 'user7',
      password: hashedPassword,
      identityType: 'ID_CARD',
      fullName: 'User Seven',
      identityNumber: 'IDNUMBER3333',
      passengerType: 'ADULT',
      phoneNumber: '13300133000'
    });
    await run('INSERT INTO login_codes (phone, identifier, code, createdAt, valid) VALUES (?, ?, ?, ?, ?)', 
      ['13300133000', 'user7', '654321', Date.now(), 1]);
      
    const res = await request(app)
      .post('/api/auth/login/verify')
      .send({ identifier: 'user7', idLast4: '3333', code: '654321', password: 'password123' });
    
    if (res.statusCode !== 200) {
        console.error(res.body);
    }
    expect(res.statusCode).toBe(200);
    expect(typeof res.body.userId).toBe('string');
    expect(typeof res.body.token).toBe('string');
    
    const row = await get('SELECT valid FROM login_codes WHERE identifier = ?', ['user7']);
    expect(row && row.valid).toBe(0);
  });
});
