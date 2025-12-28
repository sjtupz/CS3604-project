const { run, query, initializeDatabase, close } = require('../../src/db/personal_database');

describe('DB-FindTrains-SQLite', () => {
  beforeAll(async () => {
    await initializeDatabase();
    // Create railway-full like tables with rf_ prefix to avoid conflicts
    await run(`CREATE TABLE IF NOT EXISTS rf_stations (
      station_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      city TEXT NOT NULL,
      province TEXT NOT NULL
    )`);
    await run(`CREATE TABLE IF NOT EXISTS rf_trains (
      train_id INTEGER PRIMARY KEY,
      train_number TEXT NOT NULL UNIQUE,
      train_type TEXT NOT NULL,
      origin_station_id INTEGER NOT NULL,
      destination_station_id INTEGER NOT NULL,
      distance_km REAL NOT NULL,
      duration_minutes INTEGER NOT NULL,
      stop_count INTEGER NOT NULL
    )`);
    await run(`CREATE TABLE IF NOT EXISTS rf_timetables (
      schedule_id INTEGER PRIMARY KEY,
      train_id INTEGER NOT NULL,
      station_id INTEGER NOT NULL,
      arrival_time TEXT NOT NULL,
      departure_time TEXT NOT NULL,
      stop_minutes INTEGER NOT NULL,
      stop_order INTEGER NOT NULL
    )`);
    await run(`CREATE TABLE IF NOT EXISTS rf_fares (
      fare_id INTEGER PRIMARY KEY,
      train_id INTEGER NOT NULL,
      seat_type TEXT NOT NULL,
      base_price REAL NOT NULL
    )`);
    await run(`CREATE TABLE IF NOT EXISTS rf_inventories (
      stock_id INTEGER PRIMARY KEY,
      train_id INTEGER NOT NULL,
      travel_date TEXT NOT NULL,
      from_station_id INTEGER NOT NULL,
      to_station_id INTEGER NOT NULL,
      business_remaining INTEGER,
      first_remaining INTEGER,
      second_remaining INTEGER,
      soft_sleeper_remaining INTEGER
    )`);

    // Seed minimal Shanghai-Beijing G108
    await run(`INSERT INTO rf_stations (station_id, name, code, city, province) VALUES
      (1, '上海虹桥', 'SHHQ', '上海', '上海'),
      (2, '北京南',   'BJNS', '北京', '北京')`);
    await run(`INSERT INTO rf_trains (train_id, train_number, train_type, origin_station_id, destination_station_id, distance_km, duration_minutes, stop_count)
      VALUES (100, 'G108', 'G', 1, 2, 1318.0, 270, 5)`);
    await run(`INSERT INTO rf_timetables (schedule_id, train_id, station_id, arrival_time, departure_time, stop_minutes, stop_order) VALUES
      (1, 100, 1, '-', '08:00', 0, 1),
      (2, 100, 2, '12:30', '-', 0, 5)`);
    await run(`INSERT INTO rf_fares (fare_id, train_id, seat_type, base_price) VALUES
      (1, 100, '二等', 553.00),
      (2, 100, '一等', 900.00)`);
    await run(`INSERT INTO rf_inventories (stock_id, train_id, travel_date, from_station_id, to_station_id, business_remaining, first_remaining, second_remaining, soft_sleeper_remaining)
      VALUES (1, 100, '2025-12-25', 1, 2, 10, 8, 120, 0)`);

    // Seed another train to enforce filters and sorting
    await run(`INSERT INTO rf_trains (train_id, train_number, train_type, origin_station_id, destination_station_id, distance_km, duration_minutes, stop_count)
      VALUES (101, 'G200', 'G', 1, 2, 1400.0, 275, 5)`);
    await run(`INSERT INTO rf_timetables (schedule_id, train_id, station_id, arrival_time, departure_time, stop_minutes, stop_order) VALUES
      (3, 101, 1, '-', '09:00', 0, 1),
      (4, 101, 2, '13:40', '-', 0, 5)`);
    await run(`INSERT INTO rf_fares (fare_id, train_id, seat_type, base_price) VALUES
      (3, 101, '二等', 650.00)`);
    await run(`INSERT INTO rf_inventories (stock_id, train_id, travel_date, from_station_id, to_station_id, business_remaining, first_remaining, second_remaining, soft_sleeper_remaining)
      VALUES (2, 101, '2025-12-25', 1, 2, 10, 6, 0, 0)`);
  });

  afterAll(async () => {
    // Clean tables
    await run('DROP TABLE IF EXISTS rf_inventories');
    await run('DROP TABLE IF EXISTS rf_fares');
    await run('DROP TABLE IF EXISTS rf_timetables');
    await run('DROP TABLE IF EXISTS rf_trains');
    await run('DROP TABLE IF EXISTS rf_stations');
    await close();
  });

  test('Given 城市与日期 When 查询 Then 返回包含G108并带座位信息', async () => {
    const { findTrainsInDb } = require('../../src/db/train');
    const items = await findTrainsInDb({ from: '上海', to: '北京', date: '2025-12-25', trainTypes: 'GC' });
    expect(Array.isArray(items)).toBe(true);
    const g108 = items.find((it) => it.trainNumber === 'G108');
    expect(g108).toBeTruthy();
    expect(g108.departureStation).toBe('上海虹桥');
    expect(g108.arrivalStation).toBe('北京南');
    expect(g108.departureTime).toBe('08:00');
    expect(g108.arrivalTime).toBe('12:30');
    expect(g108.duration).toBe('4h30m');
    expect(g108.arrivalDayIndicator).toBe('当日到达');
    // seat availability
    expect(g108.seatAvailability?.['二等座']?.remaining).toBe(120);
    // price from fares
    expect(g108.price).toBe(553);
  });

  test('Given 出发时间范围 When 查询 Then 结果按范围过滤', async () => {
    const { findTrainsInDb } = require('../../src/db/train');
    const none = await findTrainsInDb({ from: '上海', to: '北京', date: '2025-12-25', departureTimeStart: '06:00', departureTimeEnd: '07:00' });
    expect(Array.isArray(none)).toBe(true);
    expect(none.find((it) => it.trainNumber === 'G108')).toBeFalsy();
    const ok = await findTrainsInDb({ from: '上海', to: '北京', date: '2025-12-25', departureTimeStart: '06:00', departureTimeEnd: '09:00' });
    expect(ok.find((it) => it.trainNumber === 'G108')).toBeTruthy();
  });

  test('Given 票价区间 When 查询 Then 返回票价在范围内的车次', async () => {
    const { findTrainsInDb } = require('../../src/db/train');
    const items = await findTrainsInDb({ from: '上海', to: '北京', date: '2025-12-25', minPrice: 500, maxPrice: 600 });
    expect(Array.isArray(items)).toBe(true);
    const prices = items.map((it) => it.price).filter((p) => typeof p === 'number');
    prices.forEach((p) => {
      expect(p).toBeGreaterThanOrEqual(500);
      expect(p).toBeLessThanOrEqual(600);
    });
    const g108 = items.find((it) => it.trainNumber === 'G108');
    expect(g108).toBeTruthy();
    expect(g108.price).toBe(553);
  });

  test('Given 指定席别 When 查询 Then 仅返回有余票的车次', async () => {
    const { findTrainsInDb } = require('../../src/db/train');
    const items = await findTrainsInDb({ from: '上海', to: '北京', date: '2025-12-25', seatTypes: '二等座' });
    expect(Array.isArray(items)).toBe(true);
    items.forEach((it) => {
      const remain = it.seatAvailability?.['二等座']?.remaining;
      expect(typeof remain).toBe('number');
      expect(remain).toBeGreaterThan(0);
    });
    const g108 = items.find((it) => it.trainNumber === 'G108');
    expect(g108).toBeTruthy();
    expect(g108.seatAvailability?.['二等座']?.remaining).toBe(120);
  });

  test('Given 按价格排序 When 查询 Then 返回升序价格列表', async () => {
    const { findTrainsInDb } = require('../../src/db/train');
    const items = await findTrainsInDb({ from: '上海', to: '北京', date: '2025-12-25', sortBy: 'price', sortOrder: 'asc' });
    expect(Array.isArray(items)).toBe(true);
    const prices = items.map((it) => it.price).filter((p) => typeof p === 'number');
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  test('Given 非法票价区间 When 查询 Then 返回空数组', async () => {
    const { findTrainsInDb } = require('../../src/db/train');
    const items = await findTrainsInDb({ from: '上海', to: '北京', date: '2025-12-25', minPrice: 700, maxPrice: 600 });
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(0);
  });
});
