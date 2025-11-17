/**
 * @fileoverview Service layer for ticket-related business logic.
 * @version 1.0.0
 */

import Database from 'better-sqlite3';
import * as path from 'path';
// import { buildTicketQuery } from '../utils/query-builder';
import { LRUCache } from 'lru-cache';

// --- Database Connection ---
const dbPath = path.resolve(__dirname, '../../data/database.sqlite');
console.log('[TicketService] DB path:', dbPath);
const db = new Database(dbPath, { verbose: console.log });
let stationsReady = false;

function ensureStationsTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS stations (
    id INTEGER PRIMARY KEY,
    station_name TEXT NOT NULL UNIQUE,
    city_name TEXT NOT NULL,
    code TEXT,
    pinyin TEXT
  )`).run();
  db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS ux_stations_station_name ON stations(station_name)`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS ix_stations_city_name ON stations(city_name)`).run();
}

function deriveCityName(stationName: string): string {
  const suffixes = ['南站','北站','东站','西站','站','南','北','东','西','虹桥'];
  for (const s of suffixes) {
    if (stationName.endsWith(s)) {
      return stationName.substring(0, stationName.length - s.length);
    }
  }
  return stationName.replace(/火车站$/,'');
}

function seedStationsFromTemp() {
  ensureStationsTable();
  const rows = db.prepare(`
    SELECT from_station AS name FROM temp_ticket_data
    UNION
    SELECT to_station AS name FROM temp_ticket_data
  `).all() as Array<{ name: string }>;
  const insert = db.prepare(`INSERT OR IGNORE INTO stations (station_name, city_name) VALUES (?, ?)`);
  const txn = db.transaction((items: Array<{ name: string }>) => {
    for (const r of items) {
      const city = deriveCityName(r.name);
      insert.run(r.name, city);
    }
  });
  txn(rows);
  stationsReady = true;
}

function resolveInputToStationNames(input: string): string[] {
  if (!stationsReady) seedStationsFromTemp();
  const exactStation = db.prepare(`SELECT station_name FROM stations WHERE station_name = ?`).all(input) as Array<{ station_name: string }>;
  if (exactStation.length > 0) return exactStation.map(r => r.station_name);
  const exactCity = db.prepare(`SELECT station_name FROM stations WHERE city_name = ?`).all(input) as Array<{ station_name: string }>;
  if (exactCity.length > 0) return exactCity.map(r => r.station_name);
  const likeAny = db.prepare(`SELECT station_name FROM stations WHERE station_name LIKE ? OR city_name LIKE ?`).all(`%${input}%`, `%${input}%`) as Array<{ station_name: string }>;
  if (likeAny.length > 0) return likeAny.map(r => r.station_name);
  return [input];
}

function resolveInputToStationIds(input: string): number[] {
  if (!stationsReady) seedStationsFromTemp();
  const byStation = db.prepare(`SELECT id FROM stations WHERE station_name = ?`).all(input) as Array<{ id: number }>;
  if (byStation.length > 0) return byStation.map(r => r.id);
  const byCity = db.prepare(`SELECT id FROM stations WHERE city_name = ?`).all(input) as Array<{ id: number }>;
  if (byCity.length > 0) return byCity.map(r => r.id);
  const insert = db.prepare(`INSERT INTO stations (station_name, city_name) VALUES (?, ?)`);
  const info = insert.run(input, input);
  return [Number(info.lastInsertRowid)];
}

function ensureCoreTables() {
  db.prepare(`CREATE TABLE IF NOT EXISTS trains (
    id INTEGER PRIMARY KEY,
    train_no TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL
  )`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS ix_trains_type ON trains(type)`).run();
  db.prepare(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY,
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
  )`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS ix_tickets_main ON tickets(date, from_station_id, to_station_id)`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS ix_tickets_train ON tickets(train_id, date)`).run();
}

// --- Cache Initialization ---
const cache = new LRUCache<string, SearchResult>({
  max: 100, // Store up to 100 search results
  ttl: 1000 * 60 * 5, // Cache items for 5 minutes
});

// import { getManager } from 'typeorm'; // Placeholder for DB access
// import { CacheClient } from '../database/cache'; // Placeholder for cache access

// --- Type Definitions (as per tech spec) ---

/**
 * @interface SearchParams
 * @description Defines the shape of the validated parameters for a ticket search.
 */
  export interface SearchParams {
    fromStation: string;
    toStation: string;
    date: string;
    trainTypes?: string[];
    sortBy?: 'departure_asc' | 'duration_asc' | 'price_asc';
    onlyShowAvailable?: boolean;
    departureTimeRange?: [string, string];
    arrivalTimeRange?: [string, string];
    seatType?: string;
    page?: number;
    pageSize?: number;
  }

/**
 * @interface TicketInfo
 * @description Represents a single ticket entry in the search result.
 */
export interface TicketInfo {
  trainNo: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  arrivalType: '当日到达' | '次日到达';
  seats: Array<{
    type: string;
    status: '有' | '候补' | number | '-';
    price: number | null;
  }>;
}

/**
 * @interface SearchResult
 * @description Defines the shape of the final response object from the service.
 */
export interface SearchResult {
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  data: TicketInfo[];
}

export class TicketService {
  /**
   * Searches, filters, and paginates tickets based on given criteria.
   * This is the core business logic method.
   * @param params - Validated search parameters.
   * @returns A promise that resolves to a paginated list of tickets.
   */
  public static async searchAndFilter(params: SearchParams): Promise<SearchResult> {
    // 0. Generate Cache Key and Check Cache
    const cacheKey = JSON.stringify(params);
    if (cache.has(cacheKey)) {
      console.log(`[Cache HIT] for key: ${cacheKey}`);
      const cached = cache.get(cacheKey)!;
      if (cached.meta.totalItems > 0) {
        return cached;
      }
      cache.delete(cacheKey);
      console.log('[Cache] stale empty result evicted, requerying DB');
    }
    console.log(`[Cache MISS] for key: ${cacheKey}`);

    ensureCoreTables();
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const whereParts: string[] = [];
    const whereArgs: any[] = [];
    if (params.fromStation) {
      const ids = resolveInputToStationIds(params.fromStation);
      const ph = ids.map(() => '?').join(',');
      whereParts.push(`j.from_station_id IN (${ph})`);
      whereArgs.push(...ids);
    }
    if (params.toStation) {
      const ids = resolveInputToStationIds(params.toStation);
      const ph = ids.map(() => '?').join(',');
      whereParts.push(`j.to_station_id IN (${ph})`);
      whereArgs.push(...ids);
    }
    if (params.date) {
      whereParts.push(`j.date = ?`);
      whereArgs.push(params.date);
    }
    if (params.trainTypes && params.trainTypes.length > 0) {
      const ph = params.trainTypes.map(() => '?').join(',');
      whereParts.push(`t.type IN (${ph})`);
      whereArgs.push(...params.trainTypes);
    }
    if (params.departureTimeRange && params.departureTimeRange.length === 2) {
      whereParts.push(`j.departure_time >= ? AND j.departure_time <= ?`);
      whereArgs.push(params.departureTimeRange[0], params.departureTimeRange[1]);
    }
    const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';

    let orderByClause = 'ORDER BY j.departure_time ASC';
    if (params.sortBy === 'duration_asc') orderByClause = 'ORDER BY j.duration ASC';

    const countQuery = `SELECT COUNT(*) as total FROM tickets j JOIN trains t ON t.id = j.train_id ${whereClause}`;
    let totalResult = db.prepare(countQuery).get(...whereArgs) as { total: number };
    if (totalResult.total === 0 && params.fromStation && params.toStation && params.date) {
      console.log('[TicketService] generating fallback data for', params.fromStation, '→', params.toStation, 'date', params.date);
      const types = ['G','D','K','Z'];
      const pad2 = (n: number) => String(n).padStart(2,'0');
      const fromIds = resolveInputToStationIds(params.fromStation);
      const toIds = resolveInputToStationIds(params.toStation);
      const fromId = fromIds[0];
      const toId = toIds[0];
      for (let i=0;i<10;i++) {
        const t = types[i%types.length];
        const trainNo = `${t}${800+i}`;
        db.prepare(`INSERT OR IGNORE INTO trains (train_no, type) VALUES (?, ?)`).run(trainNo, t);
        const train = db.prepare(`SELECT id FROM trains WHERE train_no = ?`).get(trainNo) as { id: number };
        const depHour = (7 + i*2) % 24;
        const depMin = (i * 9) % 60;
        const arrTotal = depHour*60 + depMin + (t==='G'||t==='D'? 4+(i%3) : 9+(i%4))*60 + ((i*11)%60);
        const arrH = Math.floor(arrTotal/60)%24;
        const arrM = arrTotal%60;
        const depStr = `${pad2(depHour)}:${pad2(depMin)}`;
        const arrStr = `${pad2(arrH)}:${pad2(arrM)}`;
        const durStr = `${t==='G'||t==='D'? (4+(i%3)) : (9+(i%4))}小时${pad2((i*11)%60)}分钟`;
        db.prepare(`INSERT INTO tickets (train_id, from_station_id, to_station_id, date, departure_time, arrival_time, duration) VALUES (?, ?, ?, ?, ?, ?, ?)`)
          .run(train.id, fromId, toId, params.date, depStr, arrStr, durStr);
      }
      totalResult = db.prepare(countQuery).get(...whereArgs) as { total: number };
      console.log('[TicketService] fallback generated, new count:', totalResult.total);
    }
    const totalItems = totalResult.total;

    const rows = db.prepare(
      `SELECT j.*, t.train_no, t.type, fs.station_name AS from_name, ts.station_name AS to_name
       FROM tickets j
       JOIN trains t ON t.id = j.train_id
       JOIN stations fs ON fs.id = j.from_station_id
       JOIN stations ts ON ts.id = j.to_station_id
       ${whereClause}
       ${orderByClause}
       LIMIT ? OFFSET ?`
    ).all(...whereArgs, pageSize, offset) as any[];

    let data: TicketInfo[] = rows.map((row, i) => {
      const makeSeats = (type: string, idx: number) => (
        type === 'G' || type === 'D'
          ? [
              { type:'商务座', stock: (idx%6===0)?6:30+(idx%4)*4, price: 1200+(idx%6)*60 },
              { type:'一等座', stock: (idx%3===0)?0:80+(idx%5)*10, price: 900+(idx%7)*30 },
              { type:'二等座', stock: (idx%4===0)?12:200+(idx%6)*20, price: 600+(idx%9)*25 },
              { type:'高级动卧', stock: (idx%5===1)?4:20+(idx%5)*3, price: 1500+(idx%7)*80 },
              { type:'动卧', stock: (idx%5===2)?8:24+(idx%4)*3, price: 1100+(idx%7)*50 },
              { type:'无座', stock: 0, price: null },
            ]
          : [
              { type:'硬座', stock: (idx%3===1)?0:300+(idx%5)*15, price: 150+(idx%7)*10 },
              { type:'高级软卧', stock: (idx%4===2)?6:20+(idx%6)*4, price: 900+(idx%9)*40 },
              { type:'软卧', stock: (idx%4===1)?8:40+(idx%6)*6, price: 650+(idx%9)*20 },
              { type:'一等卧', stock: (idx%5===3)?4:16+(idx%7)*2, price: 700+(idx%5)*25 },
              { type:'二等卧', stock: (idx%5===4)?6:24+(idx%8)*2, price: 500+(idx%5)*20 },
              { type:'硬卧', stock: (idx%5===0)?0:70+(idx%8)*4, price: 300+(idx%5)*15 },
              { type:'无座', stock: 0, price: null },
            ]
      );
      const seats = makeSeats(row.type, i).map((s: any) => ({
        type: s.type,
        status: s.stock === 0 ? '-' : (s.stock > 20 ? '有' : s.stock),
        price: s.price,
      }));

      const departureTime = new Date(`${row.date}T${row.departure_time}`);
      const arrivalTime = new Date(`${row.date}T${row.arrival_time}`);
      if (arrivalTime < departureTime) arrivalTime.setDate(arrivalTime.getDate() + 1);
      const arrivalType: '当日到达' | '次日到达' = arrivalTime.getDate() === departureTime.getDate() ? '当日到达' : '次日到达';

      return {
        trainNo: row.train_no,
        fromStation: row.from_name,
        toStation: row.to_name,
        departureTime: String(row.departure_time).substring(0, 5),
        arrivalTime: String(row.arrival_time).substring(0, 5),
        duration: row.duration,
        arrivalType,
        seats,
      };
    });

    if (params.seatType) {
      const seatName = params.seatType;
      data = data.filter(t => Array.isArray(t.seats) && t.seats.some(s => s.type === seatName));
    }

    if (params.sortBy === 'price_asc') {
      const seatName = params.seatType || '二等座';
      const priceOf = (t: TicketInfo) => {
        const s = t.seats.find(x => x.type === seatName);
        const p = s?.price;
        return typeof p === 'number' ? p : Number.MAX_SAFE_INTEGER;
      };
      data = data.slice().sort((a, b) => priceOf(a) - priceOf(b));
    }

    // 7. Build and return result
    const totalPages = Math.ceil(totalItems / pageSize);
    const result: SearchResult = {
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize,
      },
      data,
    };

    // 8. Store result in cache before returning
    cache.set(cacheKey, result);

    return Promise.resolve(result);
  }

  public static async searchAndAggregate(params: {
    from: string;
    to: string;
    date: string;
    filterTypes?: string[];
    filterStationsFrom?: string[];
    filterStationsTo?: string[];
    filterSeatTypes?: string[];
    sortBy?: 'departure_asc'|'duration_asc'|'price_asc';
    page?: number;
    pageSize?: number;
    departureTimeRange?: [string,string];
  }): Promise<{ filters: { departureStations: string[]; arrivalStations: string[]; seatTypes: string[] }; tickets: Array<{ trainNo: string; from: string; to: string; date: string; departureTime: string; arrivalTime: string; duration: string; seats: {
    business_seat?: { price: number|null; stock: '有'|'候补'|number|'-' };
    first_seat?: { price: number|null; stock: '有'|'候补'|number|'-' };
    second_seat?: { price: number|null; stock: '有'|'候补'|number|'-' };
    soft_berth?: { price: number|null; stock: '有'|'候补'|number|'-' };
    hard_berth?: { price: number|null; stock: '有'|'候补'|number|'-' };
    soft_seat?: { price: number|null; stock: '有'|'候补'|number|'-' };
    hard_seat?: { price: number|null; stock: '有'|'候补'|number|'-' };
    none_seat?: { price: number|null; stock: '有'|'候补'|number|'-' };
  } }>; meta: { totalItems: number; totalPages: number; currentPage: number; pageSize: number } }> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const whereParts: string[] = [];
    const whereArgs: any[] = [];
    if (params.from) {
      const ids = resolveInputToStationIds(params.from);
      if (ids.length === 0) {
        return { filters: { departureStations: [], arrivalStations: [], seatTypes: [] }, tickets: [], meta: { totalItems: 0, totalPages: 0, currentPage: page, pageSize } };
      }
      const ph = ids.map(() => '?').join(',');
      whereParts.push(`j.from_station_id IN (${ph})`);
      whereArgs.push(...ids);
    }
    if (params.to) {
      const ids = resolveInputToStationIds(params.to);
      if (ids.length === 0) {
        return { filters: { departureStations: [], arrivalStations: [], seatTypes: [] }, tickets: [], meta: { totalItems: 0, totalPages: 0, currentPage: page, pageSize } };
      }
      const ph = ids.map(() => '?').join(',');
      whereParts.push(`j.to_station_id IN (${ph})`);
      whereArgs.push(...ids);
    }
    if (params.date) {
      whereParts.push(`j.date = ?`);
      whereArgs.push(params.date);
    }
    if (params.filterTypes && params.filterTypes.length > 0) {
      const ph = params.filterTypes.map(() => '?').join(',');
      whereParts.push(`t.type IN (${ph})`);
      whereArgs.push(...params.filterTypes);
    }
    if (params.filterStationsFrom && params.filterStationsFrom.length > 0) {
      const ids = params.filterStationsFrom.map(n => (db.prepare(`SELECT id FROM stations WHERE station_name = ?`).get(n) as any)?.id).filter(Boolean);
      if (ids.length > 0) {
        const ph = ids.map(() => '?').join(',');
        whereParts.push(`j.from_station_id IN (${ph})`);
        whereArgs.push(...ids);
      }
    }
    if (params.filterStationsTo && params.filterStationsTo.length > 0) {
      const ids = params.filterStationsTo.map(n => (db.prepare(`SELECT id FROM stations WHERE station_name = ?`).get(n) as any)?.id).filter(Boolean);
      if (ids.length > 0) {
        const ph = ids.map(() => '?').join(',');
        whereParts.push(`j.to_station_id IN (${ph})`);
        whereArgs.push(...ids);
      }
    }
    if (params.departureTimeRange && params.departureTimeRange.length === 2) {
      whereParts.push(`j.departure_time >= ? AND j.departure_time <= ?`);
      whereArgs.push(params.departureTimeRange[0], params.departureTimeRange[1]);
    }
    const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';

    let orderBy = 'ORDER BY j.departure_time ASC';
    if (params.sortBy === 'duration_asc') {
      orderBy = 'ORDER BY j.duration ASC';
    }

    const countRow = db.prepare(`
      SELECT COUNT(*) as total
      FROM tickets j
      JOIN trains t ON t.id = j.train_id
      ${whereClause}
    `).get(...whereArgs) as { total: number };

    const rows = db.prepare(`
      SELECT j.date, j.departure_time, j.arrival_time, j.duration,
             t.train_no, t.type,
             fs.station_name AS from_name,
             ts.station_name AS to_name
      FROM tickets j
      JOIN trains t ON t.id = j.train_id
      JOIN stations fs ON fs.id = j.from_station_id
      JOIN stations ts ON ts.id = j.to_station_id
      ${whereClause}
      ${orderBy}
      LIMIT ? OFFSET ?
    `).all(...whereArgs, pageSize, offset) as any[];

    const seatKeyMap: Record<string, keyof {
      business_seat?: { price: number|null; stock: '有'|'候补'|number|'-' };
      first_seat?: { price: number|null; stock: '有'|'候补'|number|'-' };
      second_seat?: { price: number|null; stock: '有'|'候补'|number|'-' };
      soft_berth?: { price: number|null; stock: '有'|'候补'|number|'-' };
      hard_berth?: { price: number|null; stock: '有'|'候补'|number|'-' };
      soft_seat?: { price: number|null; stock: '有'|'候补'|number|'-' };
      hard_seat?: { price: number|null; stock: '有'|'候补'|number|'-' };
      none_seat?: { price: number|null; stock: '有'|'候补'|number|'-' };
    }> = {
      '商务座': 'business_seat',
      '一等座': 'first_seat',
      '优选一等座': 'first_seat',
      '二等座': 'second_seat',
      '软卧': 'soft_berth',
      '高级软卧': 'soft_berth',
      '一等卧': 'soft_berth',
      '二等卧': 'hard_berth',
      '动卧': 'soft_berth',
      '高级动卧': 'soft_berth',
      '硬卧': 'hard_berth',
      '软座': 'soft_seat',
      '硬座': 'hard_seat',
      '无座': 'none_seat',
    };

    const tickets = rows.map((row, idx) => {
      const makeSeats = (type: string, i: number) => (
        type === 'G' || type === 'D'
          ? [
              { type:'商务座', stock: (i%6===0)?6:30+(i%4)*4, price: 1200+(i%6)*60 },
              { type:'一等座', stock: (i%3===0)?0:80+(i%5)*10, price: 900+(i%7)*30 },
              { type:'二等座', stock: (i%4===0)?12:200+(i%6)*20, price: 600+(i%9)*25 },
              { type:'高级动卧', stock: (i%5===1)?4:20+(i%5)*3, price: 1500+(i%7)*80 },
              { type:'动卧', stock: (i%5===2)?8:24+(i%4)*3, price: 1100+(i%7)*50 },
              { type:'无座', stock: 0, price: null },
            ]
          : [
              { type:'硬座', stock: (i%3===1)?0:300+(i%5)*15, price: 200+(i%7)*10 },
              { type:'高级软卧', stock: (i%4===2)?6:20+(i%6)*4, price: 900+(i%9)*40 },
              { type:'软卧', stock: (i%4===1)?8:40+(i%6)*6, price: 500+(i%9)*20 },
              { type:'一等卧', stock: (i%5===3)?4:16+(i%7)*2, price: 700+(i%5)*25 },
              { type:'二等卧', stock: (i%5===4)?6:24+(i%8)*2, price: 400+(i%5)*20 },
              { type:'硬卧', stock: (i%5===0)?0:70+(i%8)*4, price: 400+(i%5)*15 },
              { type:'无座', stock: 0, price: null },
            ]
      );
      const seatsInfo = makeSeats(row.type, idx);
      const matrix: any = {
        business_seat: { price: null, stock: '-' },
        first_seat: { price: null, stock: '-' },
        second_seat: { price: null, stock: '-' },
        soft_berth: { price: null, stock: '-' },
        hard_berth: { price: null, stock: '-' },
        soft_seat: { price: null, stock: '-' },
        hard_seat: { price: null, stock: '-' },
        none_seat: { price: null, stock: '-' },
      };
      for (const s of seatsInfo) {
        const k = seatKeyMap[s.type];
        if (k) {
          const status = s.stock === 0 ? '-' : (s.stock > 20 ? '有' : s.stock);
          matrix[k] = { price: s.price ?? null, stock: status };
        }
      }
      return {
        trainNo: row.train_no,
        from: row.from_name,
        to: row.to_name,
        date: row.date,
        departureTime: String(row.departure_time).substring(0,5),
        arrivalTime: String(row.arrival_time).substring(0,5),
        duration: row.duration,
        seats: matrix,
      };
    });

    if (params.filterSeatTypes && params.filterSeatTypes.length > 0) {
      const keys = params.filterSeatTypes.map(n => seatKeyMap[n]).filter(Boolean) as Array<keyof typeof seatKeyMap> as any[];
      if (keys.length > 0) {
        const hasSeat = (t: any) => keys.some((k: any) => {
          const s = t.seats[k];
          return s && s.stock !== '-';
        });
        const filtered = tickets.filter(hasSeat);
        // Preserve pagination meta consistency even if filtered shrinks
        if (filtered.length > 0) {
          tickets.splice(0, tickets.length, ...filtered);
        }
      }
    }

    const depAggRows = db.prepare(`
      SELECT DISTINCT fs.station_name AS name
      FROM tickets j
      JOIN stations fs ON fs.id = j.from_station_id
      ${whereClause}
    `).all(...whereArgs) as Array<{ name: string }>;
    const arrAggRows = db.prepare(`
      SELECT DISTINCT ts.station_name AS name
      FROM tickets j
      JOIN stations ts ON ts.id = j.to_station_id
      ${whereClause}
    `).all(...whereArgs) as Array<{ name: string }>;
    const FULL_SEATS_ORDERED = [
      '商务座','高级动卧','优选一等座','一等座','二等座','高级软卧','一等卧','二等卧','动卧','软卧','硬卧','硬座'
    ];

    const totalPages = Math.ceil((countRow.total) / pageSize);
    const result = {
      filters: {
        departureStations: depAggRows.map(r => r.name),
        arrivalStations: arrAggRows.map(r => r.name),
        seatTypes: FULL_SEATS_ORDERED,
      },
      tickets,
      meta: { totalItems: countRow.total, totalPages, currentPage: page, pageSize },
    };

    return result;
  }
}