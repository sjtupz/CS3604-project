const request = require('supertest');
const jwt = require('jsonwebtoken');

const app = require('../../src/app');
const { run, waitForInit } = require('../../src/db/personal_database');

describe('API-Passengers: legacy token compatibility', () => {
  beforeAll(async () => {
    await waitForInit();
  });

  beforeEach(async () => {
    await run('DELETE FROM passengers');
    await run('DELETE FROM users');
  });

  test('Given legacy-secret JWT and lowercase bearer When GET /api/passengers Then returns 200', async () => {
    const userId = 'legacy-user-id';
    const username = `legacy_user_${Date.now()}`;

    await run(
      `INSERT INTO users (id, username, real_name, id_type, id_number, verification_status, phone_number, discount_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        username,
        '账号主体',
        '身份证',
        '110101199001011234',
        '已通过',
        '13800138000',
        '成人'
      ]
    );

    const legacySecret = 'super_secret_jwt_key_123456';
    const token = jwt.sign({ id: userId, username }, legacySecret, { expiresIn: '1h' });

    const res = await request(app)
      .get('/api/passengers')
      .set('Authorization', `bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.code).toBe(200);
    expect(Array.isArray(res.body.data.items)).toBe(true);
    expect(res.body.data.items[0]).toHaveProperty('isSelf', true);
  });
});

