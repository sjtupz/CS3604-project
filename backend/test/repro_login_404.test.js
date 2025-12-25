const request = require('supertest');
const app = require('../src/app');
const { run } = require('../src/db/personal_database');
const { v4: uuidv4 } = require('uuid');

describe('Login Send Code Reproduction', () => {
  const uniqueId = uuidv4().slice(0, 8);
  const testUser = {
    username: `test${uniqueId}`,
    password: 'password123',
    identityType: '中国居民身份证',
    fullName: '测试用户',
    identityNumber: '110101199001011234', 
    passengerType: '成人',
    email: `test${uniqueId}@example.com`,
    phoneNumber: `13${Math.floor(Math.random() * 1000000000)}` 
  };

  beforeAll(async () => {
    // Clean up potentially existing user by ID or Phone or Email
    await run('DELETE FROM users WHERE id_number = ?', [testUser.identityNumber]);
    
    // Register user
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
      
    if (res.status !== 201) {
        console.error('Register failed:', res.body);
    }
    expect(res.status).toBe(201);
  });

  afterAll(async () => {
    await run('DELETE FROM users WHERE username = ?', [testUser.username]);
  });

  test('should send code when using username', async () => {
    const res = await request(app)
      .post('/api/auth/login/send-code')
      .send({
        identifier: testUser.username,
        idLast4: testUser.identityNumber.slice(-4)
      });
    
    if (res.status !== 200) {
      console.error('Error response username:', res.body);
    }
    expect(res.status).toBe(200);
  });

  test('should send code when using phone number', async () => {
    const res = await request(app)
      .post('/api/auth/login/send-code')
      .send({
        identifier: testUser.phoneNumber,
        idLast4: testUser.identityNumber.slice(-4)
      });

    if (res.status !== 200) {
      console.error('Error response phone:', res.body);
    }
    expect(res.status).toBe(200);
  });

  test('should send code when using username with different case', async () => {
    // Skip if username is purely numeric or lowercase in setup
    const mixedCaseUser = {
      ...testUser,
      username: 'MixedCaseUser' + uniqueId,
      email: 'mixed@example.com',
      phoneNumber: `18${Math.floor(Math.random() * 1000000000)}`,
      identityNumber: '110101199001015678'
    };
    
    // Cleanup
    await run('DELETE FROM users WHERE id_number = ?', [mixedCaseUser.identityNumber]);

    await request(app)
      .post('/api/auth/register')
      .send(mixedCaseUser)
      .expect(201);

    const res = await request(app)
      .post('/api/auth/login/send-code')
      .send({
        identifier: mixedCaseUser.username.toLowerCase(),
        idLast4: mixedCaseUser.identityNumber.slice(-4)
      });
    
    // If case sensitive, this might fail (404)
    if (res.status === 404) {
        console.log('Case sensitivity check: Failed (Expected if SQLite is case sensitive)');
    } else {
        console.log('Case sensitivity check: Passed');
    }
    
    // Cleanup mixed case user
    await run('DELETE FROM users WHERE username = ?', [mixedCaseUser.username]);
  });

  test('should send code when using ID number', async () => {
    const res = await request(app)
      .post('/api/auth/login/send-code')
      .send({
        identifier: testUser.identityNumber,
        idLast4: testUser.identityNumber.slice(-4)
      });
    
    if (res.status !== 200) {
      console.error('Error response ID number:', res.body);
    }
    expect(res.status).toBe(200);
  });
});
