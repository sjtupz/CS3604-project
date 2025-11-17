import request from 'supertest'
import app from '../../app'

describe('City search endpoints', () => {
  it('should search by Chinese name', async () => {
    const r = await request(app).get('/api/v1/departures?keyword=北京')
    expect(r.status).toBe(200)
    expect(r.body.data.some((c: any) => c.standard_name === '北京')).toBe(true)
  })
  it('should search by pinyin initials', async () => {
    const r = await request(app).get('/api/v1/departures?keyword=bj')
    expect(r.status).toBe(200)
    expect(r.body.data.some((c: any) => c.standard_name === '北京')).toBe(true)
  })
  it('should search by area code', async () => {
    const r = await request(app).get('/api/v1/destinations?keyword=020')
    expect(r.status).toBe(200)
    expect(r.body.data.some((c: any) => c.standard_name === '广州')).toBe(true)
  })
  it('should include required fields', async () => {
    const r = await request(app).get('/api/v1/departures?keyword=sh')
    expect(r.status).toBe(200)
    const c = r.body.data.find((x: any) => x.standard_name === '上海')
    expect(c).toBeDefined()
    expect(c.pinyin).toBeDefined()
    expect(c.pinyin_initials).toBeDefined()
    expect(c.admin_code).toBeDefined()
    expect(c.lat).toBeDefined()
    expect(c.lng).toBeDefined()
    expect(typeof c.is_hot).toBe('number')
  })
})