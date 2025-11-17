import Database from 'better-sqlite3'
import * as path from 'path'

const dbPath = path.resolve(__dirname, '../data/database.sqlite')
const db = new Database(dbPath)

const args = process.argv.slice(2)
const from = args[0] || '广州'
const to = args[1] || '深圳'
const date = args[2] || new Date().toISOString().slice(0,10)

const row = db.prepare("SELECT COUNT(*) AS c FROM temp_ticket_data WHERE from_station = ? AND to_station = ? AND departure_date = ?").get(from, to, date) as any
console.log(`count=${row.c} from=${from} to=${to} date=${date}`)