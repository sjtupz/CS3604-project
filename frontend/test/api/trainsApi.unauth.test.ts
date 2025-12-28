import { getTrains, getRoundTrip } from '../../src/api/trains'

test('Given 未授权 When 调用 API-GET-Trains Then 返回401 未授权', async () => {
  window.localStorage.removeItem('authToken')
  const res = await getTrains({ from: '上海', to: '北京', date: '2025-12-25' })
  expect(res.code).toBe(401)
})

test('Given 未授权 When 调用 API-GET-Trains-RoundTrip Then 返回401 未授权', async () => {
  window.localStorage.removeItem('authToken')
  const res = await getRoundTrip({ from: '上海', to: '北京', departDate: '2025-12-25', returnDate: '2025-12-26' })
  expect(res.code).toBe(401)
})
