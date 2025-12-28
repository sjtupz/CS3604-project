import request from 'supertest'
import app from '../src/app'

describe('API-GET-Trains: 过滤条件矩阵', () => {
  const auth = { Authorization: 'Bearer test-token' }

  test('Given trainTypes=GC When 请求 Then 仅返回高铁/城际类型', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({ from: '上海', to: '北京', date: '2025-12-25', trainTypes: 'GC' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('code', 200)
    expect(res.body.data.items.length).toBeGreaterThan(0)
    res.body.data.items.forEach((t: any) => {
      expect(/^G|^C/.test(String(t.trainNumber))).toBe(true)
    })
  })

  test('Given departureStation/arrivalStation When 请求 Then 返回匹配站点', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({ from: '上海', to: '北京', date: '2025-12-25', departureStation: '上海虹桥', arrivalStation: '北京南' })
    expect(res.status).toBe(200)
    expect(res.body.data.items.length).toBeGreaterThan(0)
    res.body.data.items.forEach((t: any) => {
      expect(t.departureStation).toBe('上海虹桥')
      expect(t.arrivalStation).toBe('北京南')
    })
  })

  test('Given seatTypes 一等座 When 请求 Then 返回包含席别', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({ from: '上海', to: '北京', date: '2025-12-25', seatTypes: '一等座' })
    expect(res.status).toBe(200)
    expect(res.body.data.items.length).toBeGreaterThan(0)
    res.body.data.items.forEach((t: any) => {
      expect(t.seatAvailability['一等座']).toBeTruthy()
    })
  })

  test('Given 发车时间范围 When 请求 Then 结果的发车时间位于区间', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({ from: '上海', to: '北京', date: '2025-12-25', departureTimeStart: '06:00', departureTimeEnd: '12:00' })
    expect(res.status).toBe(200)
    const toMinutes = (s: string) => {
      const [h, m] = s.split(':').map(Number)
      return h * 60 + m
    }
    res.body.data.items.forEach((t: any) => {
      const v = toMinutes(t.departureTime)
      expect(v).toBeGreaterThanOrEqual(toMinutes('06:00'))
      expect(v).toBeLessThanOrEqual(toMinutes('12:00'))
    })
  })

  test('Given 组合筛选Z型+上海南到北京丰台+硬座+18:00-24:00 When 请求 Then 返回满足AND逻辑的结果', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({
        from: '上海',
        to: '北京',
        date: '2025-12-25',
        trainTypes: 'Z',
        departureStation: '上海南',
        arrivalStation: '北京丰台',
        seatTypes: '硬座',
        departureTimeStart: '18:00',
        departureTimeEnd: '24:00',
      })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('code', 200)
    const items = res.body?.data?.items || []
    expect(items.length).toBeGreaterThan(0)
    items.forEach((t: any) => {
      expect(/^Z/.test(String(t.trainNumber))).toBe(true)
      expect(t.departureStation).toBe('上海南')
      expect(t.arrivalStation).toBe('北京丰台')
      expect(t.seatAvailability['硬座']).toBeTruthy()
      const toMinutes = (s: string) => {
        const [h, m] = String(s).split(':').map(Number)
        return h * 60 + m
      }
      const v = toMinutes(t.departureTime)
      expect(v).toBeGreaterThanOrEqual(toMinutes('18:00'))
      expect(v).toBeLessThanOrEqual(toMinutes('24:00'))
    })
  })

  test('Given 席别状态映射 When 请求 Then 一等座=有 二等座=候补 软卧=灰杠', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({ from: '上海', to: '北京', date: '2025-12-25' })
    expect(res.status).toBe(200)
    const items = res.body?.data?.items || []
    expect(items.length).toBeGreaterThan(0)
    items.forEach((t: any) => {
      expect(t.seatAvailability['一等座']?.state).toBe('有')
      expect(t.seatAvailability['二等座']?.state).toBe('候补')
      expect(t.seatAvailability['软卧']?.state).toBe('灰杠')
    })
  })

  test('Given 跨0点车次 When 请求 Then 到达日标识为次日到达', async () => {
    const res = await request(app)
      .get('/api/trains')
      .set(auth)
      .query({
        from: '上海',
        to: '北京',
        date: '2025-12-25',
        departureTimeStart: '23:00',
        departureTimeEnd: '23:59',
      })
    expect(res.status).toBe(200)
    const items = res.body?.data?.items || []
    expect(items.length).toBeGreaterThan(0)
    items.forEach((t: any) => {
      expect(t.arrivalDayIndicator).toBe('次日到达')
    })
  })
})

