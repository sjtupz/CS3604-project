import { getTrains, getRoundTrip } from '../../src/api/trains'
import mockData from '../../src/mocks/train_list_mock.json'

// 为 API 测试默认设置授权令牌，匹配 getTrains/getRoundTrip 的测试态授权校验
beforeEach(() => {
  try {
    window.localStorage.setItem('authToken', 'test-token')
  } catch {}
})

test('Given 必填参数 When 调用 API-GET-Trains Then 返回200 envelope与分页', async () => {
  // Pick a valid entry from mock data
  const validEntry = mockData[0]
  const from = validEntry.from_station
  const to = validEntry.to_station
  const date = validEntry.date

  const res = await getTrains({ from, to, date, page: 1, pageSize: 20 })
  expect(res.code).toBe(200)
  expect(res.data.items.length).toBeGreaterThan(0)
  expect(res.data.pagination.total).toBeGreaterThan(0)
  
  // Verify data consistency
  const firstItem = res.data.items[0]
  expect(firstItem.departureStation).toBe(from)
  expect(firstItem.arrivalStation).toBe(to)
})

test('Given 去程返程参数 When 调用 API-GET-Trains-RoundTrip Then 返回去程与返程集合', async () => {
  // For round trip, we just need to ensure the API handles it. 
  // With mock data, we might not have a perfect return trip match, 
  // but the function should still return a structure.
  
  const validEntry = mockData[0]
  const from = validEntry.from_station
  const to = validEntry.to_station
  const departDate = validEntry.date
  
  // Just pick next day for return
  const returnDate = new Date(departDate)
  returnDate.setDate(returnDate.getDate() + 1)
  const returnDateStr = returnDate.toISOString().split('T')[0]

  const res = await getRoundTrip({ from, to, departDate, returnDate: returnDateStr })
  expect(res.code).toBe(200)
  expect(Array.isArray(res.data.outbound)).toBe(true)
  expect(Array.isArray(res.data.return)).toBe(true)
  
  // Outbound should have items because we picked valid params
  expect(res.data.outbound.length).toBeGreaterThan(0)
})
