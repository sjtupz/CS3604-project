import Database from 'better-sqlite3'
import * as path from 'path'

const dbPath = path.resolve(__dirname, '../data/database.sqlite')
const db = new Database(dbPath)

function exec(sql: string, params: any[] = []) { db.prepare(sql).run(...params) }
function all<T = any>(sql: string, params: any[] = []) { return db.prepare(sql).all(...params) as T[] }
function get<T = any>(sql: string, params: any[] = []) { return db.prepare(sql).get(...params) as T }

function ensureTables() {
  exec(`CREATE TABLE IF NOT EXISTS stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_name TEXT NOT NULL UNIQUE,
    city_name TEXT NOT NULL,
    code TEXT,
    pinyin TEXT
  )`)
  exec(`CREATE UNIQUE INDEX IF NOT EXISTS ux_stations_station_name ON stations(station_name)`) 
  exec(`CREATE INDEX IF NOT EXISTS ix_stations_city_name ON stations(city_name)`) 

  exec(`CREATE TABLE IF NOT EXISTS trains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_no TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL
  )`)
  exec(`CREATE INDEX IF NOT EXISTS ix_trains_type ON trains(type)`) 

  exec(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_id INTEGER NOT NULL,
    from_station_id INTEGER NOT NULL,
    to_station_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    duration TEXT NOT NULL,
    FOREIGN KEY(train_id) REFERENCES trains(id),
    FOREIGN KEY(from_station_id) REFERENCES stations(id),
    FOREIGN KEY(to_station_id) REFERENCES stations(id)
  )`)
  exec(`CREATE INDEX IF NOT EXISTS ix_tickets_main ON tickets(date, from_station_id, to_station_id)`) 
  exec(`CREATE INDEX IF NOT EXISTS ix_tickets_train ON tickets(train_id, date)`) 
}

function clearLegacy() {
  try { db.prepare(`SELECT 1 FROM temp_ticket_data LIMIT 1`).get() } catch (_) { return }
}

function seedStations() {
  const stations: Array<[string,string]> = [
    ['上海虹桥','上海'],['上海南','上海'],['上海站','上海'],
    ['北京南','北京'],['北京西','北京'],['北京站','北京'],
    ['杭州东','杭州'],['杭州南','杭州'],['杭州站','杭州'],
    ['南京南','南京'],['南京站','南京'],
    ['天津站','天津'],['天津西','天津'],
    ['广州南','广州'],['广州站','广州'],
    ['深圳北','深圳'],['深圳站','深圳']
  ]
  const insert = db.prepare(`INSERT OR IGNORE INTO stations (station_name, city_name) VALUES (?, ?)`) 
  const tx = db.transaction((rows: Array<[string,string]>) => { rows.forEach(r => insert.run(r[0], r[1])) })
  tx(stations)
  const count = get<{ c:number }>(`SELECT COUNT(*) AS c FROM stations`)
  console.log(`Seeded stations: ${count.c}`)
}

function seedTrains() {
  const trains: Array<[string,string]> = [
    ['G108','G'],['G27','G'],['G65','G'],
    ['D2287','D'],['D305','D'],
    ['K8535','K'],['K335','K'],
    ['Z175','Z'],['Z803','Z']
  ]
  const insert = db.prepare(`INSERT OR IGNORE INTO trains (train_no, type) VALUES (?, ?)`) 
  const tx = db.transaction((rows: Array<[string,string]>) => { rows.forEach(r => insert.run(r[0], r[1])) })
  tx(trains)
  const count = get<{ c:number }>(`SELECT COUNT(*) AS c FROM trains`)
  console.log(`Seeded trains: ${count.c}`)
}

function idByStation(name: string) { const r = get<{ id:number }>(`SELECT id FROM stations WHERE station_name = ?`, [name]); return r?.id }
function idByTrain(no: string) { const r = get<{ id:number }>(`SELECT id FROM trains WHERE train_no = ?`, [no]); return r?.id }

function fmt(n: number) { return String(n).padStart(2,'0') }

function durationStr(depH: number, depM: number, arrH: number, arrM: number) {
  let dh = depH, dm = depM, ah = arrH, am = arrM
  let depTotal = dh*60+dm, arrTotal = ah*60+am
  if (arrTotal < depTotal) arrTotal += 24*60
  const dur = arrTotal - depTotal
  return `${Math.floor(dur/60)}小时${fmt(dur%60)}分钟`
}

function seedTickets() {
  const routes: Array<{ no:string; from:string; to:string; base:number; hours:number }>= [
    { no:'G108', from:'上海虹桥', to:'杭州东', base:8, hours:1 },
    { no:'G27',  from:'北京南',   to:'南京南', base:9, hours:4 },
    { no:'G65',  from:'北京南',   to:'上海虹桥', base:7, hours:5 },
    { no:'D2287',from:'北京南',   to:'上海虹桥', base:6, hours:6 },
    { no:'D305', from:'北京南',   to:'上海虹桥', base:11, hours:6 },
    { no:'K8535',from:'北京站',   to:'上海站',   base:18, hours:12 },
    { no:'K335', from:'杭州站',   to:'上海站',   base:14, hours:3 },
    { no:'Z175', from:'北京西',   to:'上海站',   base:20, hours:12 },
    { no:'Z803', from:'南京站',   to:'上海站',   base:10, hours:5 }
  ]

  const insert = db.prepare(`INSERT INTO tickets (train_id, from_station_id, to_station_id, date, departure_time, arrival_time, duration) VALUES (?, ?, ?, ?, ?, ?, ?)`)
  const tx = db.transaction((rows: any[]) => { rows.forEach(r => insert.run(r.train_id, r.from_id, r.to_id, r.date, r.dep, r.arr, r.dur)) })
  const batch: any[] = []

  const today = new Date('2025-11-17')
  for (let d=0; d<30; d++) {
    const date = new Date(today.getTime()); date.setDate(today.getDate()+d)
    const ds = `${date.getFullYear()}-${fmt(date.getMonth()+1)}-${fmt(date.getDate())}`
    routes.forEach((r, i) => {
      const train_id = idByTrain(r.no)
      const from_id = idByStation(r.from)
      const to_id = idByStation(r.to)
      if (!train_id || !from_id || !to_id) return
      const depH = (r.base + (i*2 + d)%24) % 24
      const depM = (i*11 + d*3) % 60
      const arrH = (depH + r.hours + Math.floor((depM + ((i*13 + d*5)%60))/60)) % 24
      const arrM = (depM + ((i*13 + d*5)%60)) % 60
      const dep = `${fmt(depH)}:${fmt(depM)}`
      const arr = `${fmt(arrH)}:${fmt(arrM)}`
      const dur = durationStr(depH, depM, arrH, arrM)
      batch.push({ train_id, from_id, to_id, date: ds, dep, arr, dur })
    })
  }

  tx(batch)
  const count = get<{ c:number }>(`SELECT COUNT(*) AS c FROM tickets`)
  console.log(`Seeded tickets: ${count.c}`)
}

function main() {
  db.exec('BEGIN')
  ensureTables()
  clearLegacy()
  seedStations()
  seedTrains()
  seedTickets()
  db.exec('COMMIT')
  const s = get<{ c:number }>(`SELECT COUNT(*) AS c FROM stations`)
  const t = get<{ c:number }>(`SELECT COUNT(*) AS c FROM trains`)
  const k = get<{ c:number }>(`SELECT COUNT(*) AS c FROM tickets`)
  console.log(`Successfully seeded ${s.c} stations, ${t.c} trains, ${k.c} tickets`)
}

main()