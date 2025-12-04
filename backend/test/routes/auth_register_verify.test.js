const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');

describe('API-POST-Register-Verify', () => {
  beforeEach(async () => {
    await new Promise((resolve) => {
      db.run('DELETE FROM login_codes', [], resolve);
    });
  });

  test('Given 未输入验证码 When 点击下一步 Then 返回400和请输入验证码', async () => {
    const res = await request(app)
      .post('/api/auth/register/verify')
      .send({ phoneNumber: '13800138000', code: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('请输入验证码');
  });

  test('Given 输入错误验证码 When 点击下一步 Then 返回401并提示验证码错误', async () => {
    await new Promise((resolve) => {
      db.run('INSERT INTO login_codes (phone, identifier, code, createdAt, valid) VALUES (?, ?, ?, ?, ?)', ['13800138000', '13800138000', '123456', Date.now(), 1], resolve);
    });
    const res = await request(app)
      .post('/api/auth/register/verify')
      .send({ phoneNumber: '13800138000', code: '000000' });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('验证码校验失败');
  });

  test('Given 输入正确验证码 When 点击下一步 Then 返回201并作废验证码', async () => {
    await new Promise((resolve) => {
      db.run('INSERT INTO login_codes (phone, identifier, code, createdAt, valid) VALUES (?, ?, ?, ?, ?)', ['13800138000', '13800138000', '654321', Date.now(), 1], resolve);
    });
    const payload = {
      phoneNumber: '13800138000',
      code: '654321',
      username: 'newuser',
      password: 'hashed',
      identityType: '居民身份证',
      fullName: '张三',
      identityNumber: '110101199001017777',
      passengerType: '成人',
      email: 'new@example.com'
    };
    const res = await request(app)
      .post('/api/auth/register/verify')
      .send(payload);
    expect(res.statusCode).toBe(201);
    const row = await new Promise((resolve) => {
      db.get('SELECT valid FROM login_codes WHERE identifier = ?', ['13800138000'], (err, r) => resolve(r));
    });
    expect(row && row.valid).toBe(0);
  });
});
