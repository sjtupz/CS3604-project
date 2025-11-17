import request from 'supertest'
import app from '../../app'

const today = new Date(); today.setHours(0,0,0,0)
const pad = (n: number) => String(n).padStart(2, '0')
const dateStr = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`

describe('Tickets for non-first-tier city combinations', () => {
  it('Guangzhou ↔ Shenzhen returns results', async () => {
    const r1 = await request(app).get(encodeURI(`/api/v1/tickets?fromStation=广州&toStation=深圳&date=${dateStr}`))
    expect(r1.status).toBe(200)
    expect(r1.body.meta.totalItems).toBeGreaterThan(0)
    const r2 = await request(app).get(encodeURI(`/api/v1/tickets?fromStation=深圳&toStation=广州&date=${dateStr}`))
    expect(r2.status).toBe(200)
    expect(r2.body.meta.totalItems).toBeGreaterThan(0)
  })

  it('Chengdu ↔ Chongqing returns results', async () => {
    const r1 = await request(app).get(encodeURI(`/api/v1/tickets?fromStation=成都&toStation=重庆&date=${dateStr}`))
    expect(r1.status).toBe(200)
    expect(r1.body.meta.totalItems).toBeGreaterThan(0)
    const r2 = await request(app).get(encodeURI(`/api/v1/tickets?fromStation=重庆&toStation=成都&date=${dateStr}`))
    expect(r2.status).toBe(200)
    expect(r2.body.meta.totalItems).toBeGreaterThan(0)
  })

  it('Xi’an ↔ Zhengzhou returns results', async () => {
    const r1 = await request(app).get(encodeURI(`/api/v1/tickets?fromStation=西安&toStation=郑州&date=${dateStr}`))
    expect(r1.status).toBe(200)
    expect(r1.body.meta.totalItems).toBeGreaterThan(0)
  })

  it('Fuzhou ↔ Xiamen returns results', async () => {
    const r1 = await request(app).get(encodeURI(`/api/v1/tickets?fromStation=福州&toStation=厦门&date=${dateStr}`))
    expect(r1.status).toBe(200)
    expect(r1.body.meta.totalItems).toBeGreaterThan(0)
  })

  it('Tianjin ↔ Beijing returns results for direct-controlled municipality', async () => {
    const r1 = await request(app).get(encodeURI(`/api/v1/tickets?fromStation=天津&toStation=北京&date=${dateStr}`))
    expect(r1.status).toBe(200)
    expect(r1.body.meta.totalItems).toBeGreaterThan(0)
  })
})