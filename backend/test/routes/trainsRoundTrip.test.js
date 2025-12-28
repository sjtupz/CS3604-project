const request = require('supertest');
const app = require('../../src/app');

describe('API-GET-Trains-RoundTrip', () => {
  test('Given 去程与返程参数 When 请求 Then 返回200 OK与两个集合', async () => {
    const response = await request(app)
      .get('/api/trains/round-trip')
      .set('Authorization', 'Bearer test-token')
      .query({ from: '上海', to: '北京', departDate: '2025-12-25', returnDate: '2025-12-26' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('outbound');
    expect(response.body.data).toHaveProperty('return');
  });

  test('Given 参数缺失 When 请求 Then 返回400 去程/返程参数不合法或缺失', async () => {
    const response = await request(app)
      .get('/api/trains/round-trip')
      .set('Authorization', 'Bearer test-token')
      .query({ from: '上海', to: '北京' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('code', 40003);
  });

  test('Given 未授权 When 请求 Then 返回401 未授权', async () => {
    const response = await request(app)
      .get('/api/trains/round-trip')
      .query({ from: '上海', to: '北京', departDate: '2025-12-25', returnDate: '2025-12-26' });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 40100);
  });

  test('Given 排序与分页 When 请求 Then 返回200 OK与分页元数据', async () => {
    const response = await request(app)
      .get('/api/trains/round-trip')
      .set('Authorization', 'Bearer test-token')
      .query({ from: '上海', to: '北京', departDate: '2025-12-25', returnDate: '2025-12-26', sortBy: 'duration', sortOrder: 'asc', page: '2', pageSize: '20' });
    expect(response.status).toBe(200);
  });

  test('Given 服务异常 When 请求 Then 返回500 双程查询失败', async () => {
    const response = await request(app)
      .get('/api/trains/round-trip')
      .set('Authorization', 'Bearer test-token')
      .query({ from: '上海', to: '北京', departDate: '2025-12-25', returnDate: '2025-12-26', causeError: 'true' });
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('code', 50005);
  });
});
