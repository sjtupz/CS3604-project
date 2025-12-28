import request from 'supertest'
import app from '../src/app'

function percentile(values: number[], p: number) {
  const sorted = [...values].sort((a, b) => a - b)
  const idx = Math.ceil((p / 100) * sorted.length) - 1
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))]
}

describe('API-GET-Trains: 性能与缓存', () => {
  const auth = { Authorization: 'Bearer test-token' }

  test('Given 常规请求 When 请求 Then 响应头包含X-Performance-Trace', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({ from: '上海', to: '北京', date: '2025-12-25' })
    expect(res.status).toBe(200)
    const header = res.headers['x-performance-trace']
    expect(header).toBeTruthy()
    expect(String(header)).toMatch(/db:/)
    expect(String(header)).toMatch(/service:/)
  })

  test('Given 重复相同查询 When 多次请求 Then 命中缓存率≥60%', async () => {
    const latencies: number[] = []
    const cacheHits: number[] = []
    for (let i = 0; i < 30; i++) {
      const start = performance.now()
      const res = await request(app)
        .get('/api/trains')
        .set(auth)
        .query({ from: '上海', to: '北京', date: '2025-12-25', page: 1, pageSize: 20 })
      const end = performance.now()
      latencies.push(end - start)
      const cacheHeader = res.headers['x-cache-hit']
      cacheHits.push(String(cacheHeader) === 'true' ? 1 : 0)
      expect(res.status).toBe(200)
    }
    const hitRate = cacheHits.reduce((a, b) => a + b, 0) / cacheHits.length
    expect(hitRate).toBeGreaterThanOrEqual(0.6)
    const p99 = percentile(latencies, 99)
    expect(p99).toBeLessThanOrEqual(500)
  })
})
