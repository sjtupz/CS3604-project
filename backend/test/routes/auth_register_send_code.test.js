const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');

describe('API-POST-Register-SendCode', () => {
  beforeEach(async () => {
    await new Promise((resolve) => {
      db.run('DELETE FROM login_codes', [], resolve);
    });
  });

  test('Given 用户已填写手机号并进入验证码输入页 When 页面加载 Then 返回获取验证码成功并记录到数据库', async () => {
    const res = await request(app)
      .post('/api/auth/register/send-code')
      .send({ phoneNumber: '13800138000' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('获取手机验证码成功！');
    const row = await new Promise((resolve) => {
      db.get('SELECT * FROM login_codes WHERE phone = ?', ['13800138000'], (err, r) => resolve(r));
    });
    expect(row && row.code && row.valid === 1).toBeTruthy();
  });

  test('Given 倒计时结束 When 用户点击重新发送验证码 Then 返回成功并重置倒计时', async () => {
    const res1 = await request(app)
      .post('/api/auth/register/send-code')
      .send({ phoneNumber: '13800138000' });
    expect(res1.statusCode).toBe(200);
    const res2 = await request(app)
      .post('/api/auth/register/send-code')
      .send({ phoneNumber: '13800138000' });
    expect(res2.statusCode).toBe(200);
  });
});
