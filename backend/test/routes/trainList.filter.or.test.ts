import request from 'supertest'
import app from '../src/app'

describe('API-GET-Trains: OR组合筛选', () => {
  const auth = { Authorization: 'Bearer test-token' }

  test('Given 出发站为[上海南,上海虹桥] OR 到达站为[北京,北京南] When 请求 Then 返回满足OR逻辑的结果', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({ from: '上海', to: '北京', date: '2025-12-25', departureStation: '上海南,上海虹桥', arrivalStation: '北京,北京南', filterLogic: 'OR' })
    expect(res.status).toBe(200)
    const items = res.body?.data?.items || []
    expect(items.length).toBeGreaterThan(0)
  })
})
