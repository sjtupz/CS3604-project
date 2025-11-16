const request = require('supertest');
const app = require('../../src/app');

const { setupTestDB, teardownTestDB } = require('../test-db');

describe('API Routes', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });
  test('Given a request to /api/stations, When the API is called, Then it should return a list of stations', async () => {
    const response = await request(app).get('/api/stations');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test('Given valid query parameters for trains, When the API is called, Then it should return a list of trains', async () => {
    // TODO: 此测试目前会失败，因为 API 未实现
    const response = await request(app).get('/api/trains?from=北京南&to=上海虹桥&date=2025-11-17&isHighSpeed=true');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        trainNumber: 'G1',
        fromStation: '北京南',
        toStation: '上海虹桥',
        date: '2025-11-17',
        isHighSpeed: 1,
      }),
    ]));
  });
});