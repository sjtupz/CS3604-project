const express = require('express')
const request = require('supertest')
const router = require('../../src/routes/passengers')
const { waitForInit } = require('../../src/db/personal_database')

beforeAll(async () => {
  await waitForInit()
})

function makeApp() {
  const app = express()
  app.use(express.json())
  app.use(router)
  return app
}

describe('乘车人路由', () => {
  test('Given 已登录 When GET /api/passengers/:id Then 返回详细信息', async () => {
    const app = makeApp()
    const res = await request(app)
      .get('/api/passengers/123')
      .set('Authorization', 'Bearer token')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('name')
    expect(res.body).toHaveProperty('idType')
    expect(res.body).toHaveProperty('idNumber')
    expect(res.body).toHaveProperty('country')
    expect(res.body).toHaveProperty('verificationStatus')
    expect(res.body).toHaveProperty('phone')
    expect(res.body).toHaveProperty('discountType')
  })

  test('Given 已登录且目标为本人乘车人 When PUT /api/passengers/:id Then 403', async () => {
    const app = makeApp()
    const res = await request(app)
      .put('/api/passengers/self')
      .set('Authorization', 'Bearer token')
      .send({ name: '本人' })
    expect(res.status).toBe(403)
    expect(res.body).toHaveProperty('error', 'Forbidden to modify self passenger.')
  })

  test('Given 已登录且选择多个乘车人 When DELETE /api/passengers Then 200 并返回删除数量', async () => {
    const app = makeApp()
    const res = await request(app)
      .delete('/api/passengers')
      .set('Authorization', 'Bearer token')
      .send({ passengerIds: ['p1', 'p2'] })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('deletedCount')
  })
})
