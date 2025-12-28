import request from 'supertest'
import app from '../src/app'

describe('API-GET-Trains: 排序规则', () => {
  const auth = { Authorization: 'Bearer test-token' }

  test('Given sortBy=departureTime sortOrder=asc When 请求 Then 出发时间正序排列且至少两条', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({ from: '上海', to: '北京', date: '2025-12-25', sortBy: 'departureTime', sortOrder: 'asc' })
    expect(res.status).toBe(200)
    const items = res.body?.data?.items || []
    expect(items.length).toBeGreaterThan(1)
    const toMinutes = (s: string) => {
      const [h, m] = String(s).split(':').map(Number)
      return h * 60 + m
    }
    for (let i = 1; i < items.length; i++) {
      expect(toMinutes(items[i - 1].departureTime)).toBeLessThanOrEqual(toMinutes(items[i].departureTime))
    }
  })

  test('Given sortBy=duration sortOrder=desc When 请求 Then 历时倒序排列且至少两条', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({ from: '北京', to: '上海', date: '2025-12-25', sortBy: 'duration', sortOrder: 'desc' })
    expect(res.status).toBe(200)
    const items = res.body?.data?.items || []
    expect(items.length).toBeGreaterThan(1)
    const toMinutes = (s: string) => {
      const m = String(s).match(/(\d+)h(\d+)m/)
      if (!m) return 0
      return Number(m[1]) * 60 + Number(m[2])
    }
    for (let i = 1; i < items.length; i++) {
      expect(toMinutes(items[i - 1].duration)).toBeGreaterThanOrEqual(toMinutes(items[i].duration))
    }
  })

  test('Given sortBy=price sortOrder=asc When 请求 Then 价格正序排列', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({ from: '上海', to: '北京', date: '2025-12-25', sortBy: 'price', sortOrder: 'asc' })
    expect(res.status).toBe(200)
    const items = res.body?.data?.items || []
    expect(items.length).toBeGreaterThan(1)
    for (let i = 1; i < items.length; i++) {
      expect(items[i - 1].price).toBeLessThanOrEqual(items[i].price)
    }
  })

  test('Given sortBy=departureTime,price When 请求 Then 支持多字段组合排序', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({ from: '上海', to: '北京', date: '2025-12-25', sortBy: 'departureTime,price', sortOrder: 'asc' })
    expect(res.status).toBe(200)
    const items = res.body?.data?.items || []
    expect(items.length).toBeGreaterThan(1)
  })
})
