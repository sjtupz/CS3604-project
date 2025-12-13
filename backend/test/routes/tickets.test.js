const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/tickets (RED)', () => {
  test('returns 200 and list with required fields when querying from/to/date', async () => {
    const date = new Date().toISOString().slice(0,10);
    const res = await request(app).get('/api/tickets')
      .query({ date, from: '北京', to: '上海' });

    expect(res.status).toBe(200); // Expect to fail initially (501/404)
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      const t = res.body[0];
      expect(t).toHaveProperty('train_no');
      expect(t).toHaveProperty('train_type');
      expect(t).toHaveProperty('start_station');
      expect(t).toHaveProperty('end_station');
      expect(t).toHaveProperty('from_city');
      expect(t).toHaveProperty('to_city');
      expect(t).toHaveProperty('start_time');
      expect(t).toHaveProperty('end_time');
      expect(t).toHaveProperty('duration');
      expect(t).toHaveProperty('date');
      expect(t).toHaveProperty('swz');
      expect(t).toHaveProperty('yd');
      expect(t).toHaveProperty('ed');
      expect(t).toHaveProperty('rw');
      expect(t).toHaveProperty('yw');
      expect(t).toHaveProperty('yz');
      expect(t).toHaveProperty('wz');
    }
  });

  test('supports filterType and filterTimeStr', async () => {
    const date = new Date().toISOString().slice(0,10);
    const res = await request(app).get('/api/tickets')
      .query({ date, from: '深圳', to: '郑州', filterType: 'G,D', filterTimeStr: '06:00-12:00' });
    expect(res.status).toBe(200); // Expect to fail initially
    expect(Array.isArray(res.body)).toBe(true);
  });
});

