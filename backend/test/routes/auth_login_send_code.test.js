const request = require('supertest');
const app = require('../../src/app');
const { run, get, waitForInit } = require('../../src/db/personal_database');
const userDb = require('../../src/db/userDb');

describe('API-POST-Login-SendCode: /api/auth/login/send-code', () => {
  beforeAll(async () => {
    await waitForInit();
  });

  beforeEach(async () => {
    await run('DELETE FROM users');
    await run('DELETE FROM login_codes');
  });

  test('Given identifier is 11-digit number When user clicks get code Then system treats identifier as phone and sends code', async () => {
    await userDb.createUser({
      username: 'user1',
      password: 'hashed',
      identityType: 'ID_CARD',
      fullName: 'User One',
      identityNumber: 'IDNUMBER5678',
      passengerType: 'ADULT',
      phoneNumber: '13800138000'
    });
    const res = await request(app)
      .post('/api/auth/login/send-code')
      .send({ identifier: '13800138000', idLast4: '5678' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('获取手机验证码成功');
  });

  test('Given identifier contains @ and domain When user clicks get code Then system treats identifier as email and sends code', async () => {
    await userDb.createUser({
      username: 'user2',
      password: 'hashed',
      identityType: 'ID_CARD',
      fullName: 'User Two',
      identityNumber: 'IDNUMBER9999',
      passengerType: 'ADULT',
      email: 'user2@example.com',
      phoneNumber: '13900139000'
    });
    const res = await request(app)
      .post('/api/auth/login/send-code')
      .send({ identifier: 'user2@example.com', idLast4: '9999' });
    if (res.statusCode !== 200) console.error(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('获取手机验证码成功');
  });

  test('Given identifier is username When user clicks get code Then system treats identifier as username and sends code', async () => {
    await userDb.createUser({
      username: 'user3',
      password: 'hashed',
      identityType: 'ID_CARD',
      fullName: 'User Three',
      identityNumber: 'IDNUMBER1234',
      passengerType: 'ADULT',
      phoneNumber: '13700137000'
    });
    const res = await request(app)
      .post('/api/auth/login/send-code')
      .send({ identifier: 'user3', idLast4: '1234' });
    if (res.statusCode !== 200) console.error(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('获取手机验证码成功');
  });

  test('Given user does not exist When clicking get code Then returns 404 with correct error message', async () => {
    const res = await request(app)
      .post('/api/auth/login/send-code')
      .send({ identifier: 'missing@example.com', idLast4: '0000' });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toContain('请输入正确的用户信息');
  });

  test('Given idLast4 mismatches user record When clicking get code Then returns 422 with correct error message', async () => {
    await userDb.createUser({
      username: 'user4',
      password: 'hashed',
      identityType: 'ID_CARD',
      fullName: 'User Four',
      identityNumber: 'IDNUMBER8888',
      passengerType: 'ADULT',
      phoneNumber: '13600136000'
    });
    const res = await request(app)
      .post('/api/auth/login/send-code')
      .send({ identifier: '13600136000', idLast4: '1234' });
    expect(res.statusCode).toBe(422);
    expect(res.body.error).toContain('请输入正确的用户信息');
  });

  test('Given sent code When record should be stored Then database contains login code record', async () => {
    await userDb.createUser({
      username: 'user5',
      password: 'hashed',
      identityType: 'ID_CARD',
      fullName: 'User Five',
      identityNumber: 'IDNUMBER0001',
      passengerType: 'ADULT',
      phoneNumber: '13500135000'
    });
    const res = await request(app)
      .post('/api/auth/login/send-code')
      .send({ identifier: '13500135000', idLast4: '0001' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('获取手机验证码成功');
    const row = await get('SELECT COUNT(1) AS cnt FROM login_codes');
    const recordCount = row ? row.cnt : 0;
    expect(recordCount).toBeGreaterThan(0);
  });
});
