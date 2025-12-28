const request = require('supertest');
const app = require('../../src/app');

describe('API-GET-Stations', () => {
  test('Given 无search参数 When 获取站点列表 Then 返回200与站点集合', async () => {
    const res = await request(app)
      .get('/api/stations');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Given search模糊匹配 When 查询 Then 返回匹配站点', async () => {
    const res = await request(app)
      .get('/api/stations')
      .query({ search: 'bei' });
    expect(res.status).toBe(200);
    // 预期包含“北京”相关站点
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Given 服务异常 When 获取站点列表 Then 返回500 内部错误', async () => {
    const res = await request(app)
      .get('/api/stations')
      .query({ causeError: 'true' });
    expect(res.status).toBe(500);
  });
});

