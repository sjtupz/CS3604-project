import request from 'supertest'
import app from '../src/app'

describe('API-GET-Trains: 分页逻辑', () => {
  const auth = { Authorization: 'Bearer test-token' }

  test('Given pageSize=30 page=4 When 请求 Then 末页数据不足为10条', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({ from: '上海', to: '北京', date: '2025-12-25', page: 4, pageSize: 30 })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('code', 200)
    const items = res.body?.data?.items || []
    expect(items.length).toBe(10)
    expect(res.body?.data?.pagination?.total).toBe(100)
    expect(res.body?.data?.pagination?.currentPage).toBe(4)
    expect(res.body?.data?.pagination?.perPage).toBe(30)
    expect(res.body?.data?.pagination?.totalPages).toBe(4)
  })

  test('Given pageSize=25 page=5 When 请求 Then 末页数据不足为0条', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({ from: '上海', to: '北京', date: '2025-12-25', page: 5, pageSize: 25 })
    expect(res.status).toBe(200)
    const items = res.body?.data?.items || []
    expect(items.length).toBe(0)
    expect(res.body?.data?.pagination?.total).toBe(100)
    expect(res.body?.data?.pagination?.totalPages).toBe(4)
  })

  test('Given page 超出总页数 When 请求 Then 返回空items', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({ from: '上海', to: '北京', date: '2025-12-25', page: 999, pageSize: 20 })
    expect(res.status).toBe(200)
    expect((res.body?.data?.items || []).length).toBe(0)
  })
})
