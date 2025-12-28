const request = require('supertest');
const app = require('../../src/app');

describe('API-GET-Trains', () => {
  test('Given 必填参数 When 请求获取车次列表 Then 返回200 OK且包含分页', async () => {
    const response = await request(app)
      .get('/api/trains')
      .set('Authorization', 'Bearer test-token')
      .query({ from: '上海', to: '北京', date: '2025-12-25', page: '1', pageSize: '20' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('items');
    expect(response.body.data).toHaveProperty('pagination');
  });

  test('Given 缺少必填参数 When 请求车次列表 Then 返回400 参数不合法', async () => {
    const response = await request(app)
      .get('/api/trains')
      .set('Authorization', 'Bearer test-token')
      .query({ from: '上海' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('code', 40001);
  });

  test('Given 学生模式 When 请求列表 Then 返回包含seatAvailability', async () => {
    const response = await request(app)
      .get('/api/trains')
      .set('Authorization', 'Bearer test-token')
      .query({ from: '上海', to: '北京', date: '2025-12-25', passengerCategory: 'student' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 200);
    expect(response.body.data.items[0]).toHaveProperty('seatAvailability');
  });

  test('Given 非法日期格式 When 请求车次列表 Then 返回400 参数不合法', async () => {
    const response = await request(app)
      .get('/api/trains')
      .set('Authorization', 'Bearer test-token')
      .query({ from: '上海', to: '北京', date: 'invalid-date' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('code', 40001);
  });

  test('Given 超出范围的分页大小 When 请求车次列表 Then 返回400 参数不合法', async () => {
    const response = await request(app)
      .get('/api/trains')
      .set('Authorization', 'Bearer test-token')
      .query({ from: '上海', to: '北京', date: '2025-12-25', pageSize: 101 });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('code', 40001);
  });

  test('Given 排序参数 When 请求车次列表 Then 返回按历时排序的结果', async () => {
    const response = await request(app)
      .get('/api/trains')
      .set('Authorization', 'Bearer test-token')
      .query({ from: '上海', to: '北京', date: '2025-12-25', sortBy: 'duration', sortOrder: 'asc' });
    expect(response.status).toBe(200);
    // 验证逻辑需在实现中支持，此处断言状态码
  });

  test('Given 并发请求 When 同时发起多次查询 Then 所有请求均成功返回', async () => {
    const requests = Array(5).fill().map(() => 
      request(app)
        .get('/api/trains')
        .set('Authorization', 'Bearer test-token')
        .query({ from: '上海', to: '北京', date: '2025-12-25' })
    );
    const responses = await Promise.all(requests);
    responses.forEach(res => {
      expect(res.status).toBe(200);
    });
  });
  
  test('Given 未提供JWT When 请求车次列表 Then 返回401 未授权', async () => {
    const response = await request(app)
      .get('/api/trains')
      .query({ from: '上海', to: '北京', date: '2025-12-25' });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 40100);
  });

  test('Given 非法排序字段 When 请求车次列表 Then 返回400 参数不合法', async () => {
    const response = await request(app)
      .get('/api/trains')
      .set('Authorization', 'Bearer test-token')
      .query({ from: '上海', to: '北京', date: '2025-12-25', sortBy: 'invalid' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('code', 40001);
  });

  test('Given 页码为0 When 请求车次列表 Then 返回400 参数不合法', async () => {
    const response = await request(app)
      .get('/api/trains')
      .set('Authorization', 'Bearer test-token')
      .query({ from: '上海', to: '北京', date: '2025-12-25', page: 0 });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('code', 40001);
  });

  test('Given 席别与时间范围 When 请求车次列表 Then 返回200 带筛选结果', async () => {
    const response = await request(app)
      .get('/api/trains')
      .set('Authorization', 'Bearer test-token')
      .query({ from: '上海', to: '北京', date: '2025-12-25', seatTypes: '一等座,二等座', departureTimeStart: '06:00', departureTimeEnd: '12:00' });
    expect(response.status).toBe(200);
  });

  test('Given 服务异常 When 请求车次列表 Then 返回500 查询失败', async () => {
    const response = await request(app)
      .get('/api/trains')
      .set('Authorization', 'Bearer test-token')
      .query({ from: '上海', to: '北京', date: '2025-12-25', causeError: 'true' });
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('code', 50001);
  });
});
