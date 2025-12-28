import request from 'supertest'
import app from '../src/app'

describe('API-GET-Trains: 到达时间排序', () => {
  const auth = { Authorization: 'Bearer test-token' }

  test('Given sortBy=arrivalTime sortOrder=asc When 请求 Then 到达时间正序排列且至少两条', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({ from: '上海', to: '北京', date: '2025-12-25', sortBy: 'arrivalTime', sortOrder: 'asc' })
    expect(res.status).toBe(200)
    const items = res.body?.data?.items || []
    expect(items.length).toBeGreaterThan(1)
    const toMinutes = (s: string) => {
      const [h, m] = String(s).split(':').map(Number)
      return h * 60 + m
    }
    for (let i = 1; i < items.length; i++) {
      expect(toMinutes(items[i - 1].arrivalTime)).toBeLessThanOrEqual(toMinutes(items[i].arrivalTime))
    }
  })
})
