const request = require('supertest');
const app = require('../../src/app');

describe('API-GET-Trains-Search', () => {
  test('Given 车次号 When 精确搜索 Then 返回200 OK与单页结果', async () => {
    const response = await request(app)
      .get('/api/trains/search')
      .set('Authorization', 'Bearer test-token')
      .query({ trainNumber: 'G108', page: '1', pageSize: '20' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('items');
    expect(response.body.data).toHaveProperty('pagination');
  });

  test('Given 时间范围非法 When 搜索 Then 返回400 查询条件不合法', async () => {
    const response = await request(app)
      .get('/api/trains/search')
      .set('Authorization', 'Bearer test-token')
      .query({ departureTimeStart: '18:00', departureTimeEnd: '06:00' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('code', 40002);
  });

  test('Given 排序参数 When 精确搜索 Then 返回200 OK与排序结果', async () => {
    const response = await request(app)
      .get('/api/trains/search')
      .set('Authorization', 'Bearer test-token')
      .query({ trainNumber: 'G108', sortBy: 'departureTime', sortOrder: 'asc' });
    expect(response.status).toBe(200);
  });

  test('Given AND组合条件 When 搜索 Then 返回200 OK单页结果', async () => {
    const response = await request(app)
      .get('/api/trains/search')
      .set('Authorization', 'Bearer test-token')
      .query({ trainNumber: 'G108', departureTimeStart: '06:00', departureTimeEnd: '12:00' });
    expect(response.status).toBe(200);
  });

  test('Given 未提供任何条件 When 搜索 Then 返回200 OK分页结果', async () => {
    const response = await request(app)
      .get('/api/trains/search')
      .set('Authorization', 'Bearer test-token')
      .query({ page: '1', pageSize: '20' });
    expect(response.status).toBe(200);
  });
});
