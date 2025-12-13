const request = require('supertest');
const app = require('../../src/app');

describe('API-GET-Trains-Cache', () => {
  test('Given 相同查询参数 When 重复请求 Then 第二次命中缓存', async () => {
    const params = { from: '上海', to: '北京', date: '2025-12-25', page: '1', pageSize: '20' };
    const r1 = await request(app).get('/api/trains').set('Authorization', 'Bearer test-token').query(params);
    expect(r1.status).toBe(200);
    const r2 = await request(app).get('/api/trains').set('Authorization', 'Bearer test-token').query(params);
    expect(r2.status).toBe(200);
    expect(r2.headers['x-cache-hit']).toBe('true');
  });
});

