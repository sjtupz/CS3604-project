const Database = require('better-sqlite3')
const path = require('path')

module.exports = async () => {
  const dbPath = path.resolve(__dirname, './data/database.sqlite')
  const db = new Database(dbPath)
  db.prepare(`CREATE TABLE IF NOT EXISTS temp_ticket_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_no VARCHAR(10) NOT NULL,
    train_type CHAR(1) NOT NULL,
    from_station VARCHAR(50) NOT NULL,
    to_station VARCHAR(50) NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    duration VARCHAR(50) NOT NULL,
    seats_info TEXT NOT NULL
  )`).run()
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_ticket_search ON temp_ticket_data (from_station, to_station, departure_date)`).run()

  const today = new Date(); today.setHours(0,0,0,0)
  const fmt = (n) => String(n).padStart(2,'0')
  const dateStr = `${today.getFullYear()}-${fmt(today.getMonth()+1)}-${fmt(today.getDate())}`

  const insert = db.prepare(`INSERT INTO temp_ticket_data (train_no, train_type, from_station, to_station, departure_date, departure_time, arrival_time, duration, seats_info) VALUES (?,?,?,?,?,?,?,?,?)`)
  const seatJson = JSON.stringify([
    { type: '一等座', stock: 100, price: 800 },
    { type: '二等座', stock: 200, price: 500 },
    { type: '硬卧', stock: 60, price: 400 }
  ])

  try { db.exec('BEGIN') } catch (_) {}
  const rows = [
    ['G9001','G','广州','深圳',dateStr,'08:00','10:00','2小时00分钟',seatJson],
    ['G9002','G','深圳','广州',dateStr,'11:00','13:30','2小时30分钟',seatJson],
    ['D9003','D','成都','重庆',dateStr,'09:15','11:45','2小时30分钟',seatJson],
    ['D9004','D','重庆','成都',dateStr,'15:20','17:50','2小时30分钟',seatJson],
    ['G9005','G','福州','厦门',dateStr,'07:40','09:50','2小时10分钟',seatJson],
    ['G9006','G','天津','北京',dateStr,'08:30','10:00','1小时30分钟',seatJson],
  ]
  for (const r of rows) insert.run(...r)
  try { db.exec('COMMIT') } catch (_) {}
  db.close()
}