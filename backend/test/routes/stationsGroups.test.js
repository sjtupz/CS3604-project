const request = require('supertest');
const app = require('../../src/app');

describe('API-GET-Stations-Groups', () => {
  test('Given 请求站点分组 When 调用API Then 返回200且groups包含热门与字母分组', async () => {
    const response = await request(app)
      .get('/api/stations/groups');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.groups)).toBe(true);
    const names = (response.body.groups || []).map((g) => g.name);
    expect(names.includes('热门')).toBe(true);
    expect(names.some((n) => ['ABCDE', 'FGHIJ', 'KLMNO', 'PQRST', 'UVWXYZ'].includes(n))).toBe(true);
  });

  test('Given 返回分组数据 When 检查结构 Then 每个分组含stations数组字段', async () => {
    const response = await request(app)
      .get('/api/stations/groups');
    expect(response.status).toBe(200);
    const groups = response.body.groups || [];
    groups.forEach((g) => {
      expect(Array.isArray(g.stations)).toBe(true);
    });
  });
});
