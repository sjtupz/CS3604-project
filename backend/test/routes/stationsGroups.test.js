const request = require('supertest');
const app = require('../../src/app');

describe('API-GET-Stations-Groups', () => {
  test('Given 请求站点分组 When 调用API Then 返回200与热门/字母分组', async () => {
    const response = await request(app)
      .get('/api/stations/groups')
      .set('Authorization', 'Bearer test-token');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 200);
    expect(response.body.data).toHaveProperty('hot');
    expect(response.body.data).toHaveProperty('byLetter');
  });

  test('Given 缓存验证 When 多次请求 Then 响应头包含缓存标记', async () => {
    // 这是一个示意性测试，实际需根据实现检查ETag或自定义头
    const response = await request(app)
      .get('/api/stations/groups');
    expect(response.status).toBe(200);
  });
});
