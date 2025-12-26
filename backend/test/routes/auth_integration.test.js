const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/db/personal_database');
const jwt = require('jsonwebtoken');

describe('Bug Reproduction: Login and User Info 401', () => {
  let authToken;
  let userId;
  const username = `repro_user_${Date.now()}`;
  const identityNumber = `11010119900101${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`; // Random ID
  const password = 'real_password_123';
  const phone = `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;

  beforeAll(async () => {
    // Ensure we are using the correct secret
    // Note: In the actual running app, this comes from .env or default.
    // We should rely on what app.js/auth.js uses.
    
    // 1. Register a user
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        username,
        password,
        name: 'Test User',
        idType: '身份证',
        idNumber: identityNumber,
        phone,
        type: '成人'
      });
      
    if (regRes.status !== 201) {
        console.error('Registration failed:', regRes.body);
    }
    expect(regRes.status).toBe(201);
    
    // 2. Login flow
    // 2a. Send code
    const sendCodeRes = await request(app)
      .post('/api/auth/login/send-code')
      .send({
        identifier: identityNumber,
        idLast4: identityNumber.slice(-4)
      });
      
    if (sendCodeRes.status !== 200) {
        console.error('Send code failed:', sendCodeRes.body);
    }
    expect(sendCodeRes.status).toBe(200);
    
    // 2b. Verify code and get token
    // We need to find the code from the DB or just rely on the fact that in test env (if configured), we might be able to cheat?
    // But we want to test the REAL flow.
    // However, loginSendCode generates a random code. We can't know it unless we mock the generator or read DB.
    // Let's read the code from DB.
    const row = await db.get('SELECT code FROM login_codes WHERE identifier = ?', [identityNumber]);
    
    expect(row).toBeDefined();
    const code = row.code;
    
    const verifyRes = await request(app)
      .post('/api/auth/login/verify')
      .send({
        identifier: identityNumber,
        code,
        password
      });

    if (verifyRes.status !== 200) {
        console.error('Verify failed:', verifyRes.body);
    }
    expect(verifyRes.status).toBe(200);
    
    authToken = verifyRes.body.token;
    userId = verifyRes.body.userId;
    console.log('Got token:', authToken);
  });

  test('GET /api/user/info should return 200 with valid token', async () => {
    const res = await request(app)
      .get('/api/user/info')
      .set('Authorization', `Bearer ${authToken}`);

    if (res.status !== 200) {
        console.error('GET /api/user/info failed:', res.body);
    }
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('username', username);
  });
  
  test('GET /api/passengers should return 200 with valid token', async () => {
      const res = await request(app)
        .get('/api/passengers')
        .set('Authorization', `Bearer ${authToken}`);

      if (res.status !== 200) {
          console.error('GET /api/passengers failed:', res.body);
      }
      
      expect(res.status).toBe(200);
  });
});
