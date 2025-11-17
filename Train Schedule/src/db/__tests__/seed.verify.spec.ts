import Database from 'better-sqlite3'
import * as path from 'path'

const dbPath = path.resolve(__dirname, '../../../data/database.sqlite')
const db = new Database(dbPath)

const pad = (n: number) => String(n).padStart(2, '0')
const today = new Date(); today.setHours(0,0,0,0)
const dateStr = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`

describe('seed data coverage for multi-city routes', () => {
  it('has rows for 广州→深圳 at today', () => {
    const row = db.prepare("SELECT COUNT(*) AS c FROM temp_ticket_data WHERE from_station = ? AND to_station = ? AND departure_date = ?").get('广州','深圳',dateStr) as any
    expect(row.c).toBeGreaterThan(0)
  })
  it('has rows for 成都→重庆 at today', () => {
    const row = db.prepare("SELECT COUNT(*) AS c FROM temp_ticket_data WHERE from_station = ? AND to_station = ? AND departure_date = ?").get('成都','重庆',dateStr) as any
    expect(row.c).toBeGreaterThan(0)
  })
  it('has rows for 福州→厦门 at today', () => {
    const row = db.prepare("SELECT COUNT(*) AS c FROM temp_ticket_data WHERE from_station = ? AND to_station = ? AND departure_date = ?").get('福州','厦门',dateStr) as any
    expect(row.c).toBeGreaterThan(0)
  })
  it('has rows for 天津→北京 at today', () => {
    const row = db.prepare("SELECT COUNT(*) AS c FROM temp_ticket_data WHERE from_station = ? AND to_station = ? AND departure_date = ?").get('天津','北京',dateStr) as any
    expect(row.c).toBeGreaterThan(0)
  })
})