const request = require('supertest')
const app = require('../../src/app')

describe('API-GET-Stations-Cities', () => {
  test('返回省市分级的车站数据', async () => {
    const res = await request(app).get('/api/stations/cities')
    expect(res.status).toBe(200)
    expect(res.body && Array.isArray(res.body.data)).toBe(true)
    if ((res.body.data || []).length > 0) {
      const item = res.body.data[0]
      expect(item).toHaveProperty('province')
      expect(Array.isArray(item.cities)).toBe(true)
    }
  })
})

