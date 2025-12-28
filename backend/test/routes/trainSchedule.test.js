const request = require('supertest');
const app = require('../../src/app');

describe('API-GET-Train-Schedule', () => {
  test('Given 车次存在 When 请求时刻表 Then 返回200 OK与完整站序', async () => {
    const response = await request(app)
      .get('/api/trains/G108/schedule')
      .set('Authorization', 'Bearer test-token');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('stationSchedules');
  });

  test('Given 车次不存在 When 请求时刻表 Then 返回404 车次不存在', async () => {
    const response = await request(app)
      .get('/api/trains/INVALID123/schedule')
      .set('Authorization', 'Bearer test-token');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 40401);
  });

  test('Given 指定日期 When 请求时刻表 Then 返回200 OK与完整站序', async () => {
    const response = await request(app)
      .get('/api/trains/G108/schedule')
      .set('Authorization', 'Bearer test-token')
      .query({ date: '2025-12-25' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('stationSchedules');
  });
});
