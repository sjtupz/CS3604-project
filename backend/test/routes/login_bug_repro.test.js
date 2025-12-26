const request = require('supertest');
const app = require('../../src/app');
const userDb = require('../../src/db/userDb');
const dbModule = require('../../src/db/personal_database');
const { v4: uuidv4 } = require('uuid');

describe('Login Send Code Bug Reproduction', () => {
  const testUser = {
    username: 'testloginuser_' + Date.now(),
    password: 'password123',
    real_name: '测试用户',
    id_type: '中国居民身份证',
    id_number: '110101199001011234',
    phone_number: '13812345678',
    email: 'test@example.com',
    discount_type: '成人'
  };

  beforeAll(async () => {
    // Wait for DB init
    await dbModule.waitForInit();
    // Manually insert user to ensure data exists
    await userDb.createUser({
      username: testUser.username,
      password: testUser.password,
      fullName: testUser.real_name,
      identityType: testUser.id_type,
      identityNumber: testUser.id_number,
      phoneNumber: testUser.phone_number,
      email: testUser.email,
      passengerType: testUser.discount_type
    });
  });

  test('Should successfully send code with correct username and id last 4', async () => {
    const res = await request(app)
      .post('/api/auth/login/send-code')
      .send({
        identifier: testUser.username,
        idLast4: '1234'
      });
    
    if (res.status !== 200) {
      console.error('Error response:', res.body);
    }
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('获取手机验证码成功！');
  });

  test('Should successfully send code with phone number and id last 4', async () => {
    const res = await request(app)
      .post('/api/auth/login/send-code')
      .send({
        identifier: testUser.phone_number,
        idLast4: '1234'
      });
    
    expect(res.status).toBe(200);
  });

  test('Should fail with incorrect id last 4', async () => {
    const res = await request(app)
      .post('/api/auth/login/send-code')
      .send({
        identifier: testUser.username,
        idLast4: '0000'
      });
    
    expect(res.status).toBe(422);
  });

  test('Should fail with non-existent user', async () => {
    const res = await request(app)
      .post('/api/auth/login/send-code')
      .send({
        identifier: 'nonexistent_user',
        idLast4: '1234'
      });
    
    expect(res.status).toBe(404);
  });
});
