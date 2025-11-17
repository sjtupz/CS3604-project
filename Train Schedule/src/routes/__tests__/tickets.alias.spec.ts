import request from 'supertest'
import app from '../../app'

describe('Alias endpoint: GET /api/tickets/list', () => {
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  const today = fmt(new Date())

  it('supports filter_type, filter_seat and sort_by=价格', async () => {
    const url = encodeURI(`/api/tickets/list?fromStation=广州&toStation=深圳&date=${today}&filter_type=G,D,K&filter_seat=二等座&sort_by=价格`)
    const r = await request(app).get(url)
    expect(r.status).toBe(200)
    expect(r.body).toHaveProperty('meta')
    expect(r.body).toHaveProperty('data')
    expect(Array.isArray(r.body.data)).toBe(true)
    expect(r.body.meta.totalItems).toBeGreaterThan(0)
    const data = r.body.data as Array<{ trainNo: string; seats: Array<{ type: string; price: number|null }> }>
    expect(data.every(t => t.trainNo[0] === 'G' || t.trainNo[0] === 'D')).toBe(true)
    const findPrice = (t: any) => {
      const seat = (t.seats || []).find((s: any) => s.type === '二等座')
      return seat ? (seat.price || 0) : Number.MAX_SAFE_INTEGER
    }
    if (data.length >= 2) {
      const first = findPrice(data[0])
      const last = findPrice(data[data.length-1])
      expect(first).toBeLessThanOrEqual(last)
    }
  })
})