const { run, get, initializeDatabase, close } = require('../../src/db/personal_database');
const { createIndexesForTrains } = require('../../src/db/createIndexesTrains');

describe('DB-CreateIndexes-Trains', () => {
  beforeAll(async () => {
    await initializeDatabase();
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
  });

  afterAll(async () => {
    await run('DROP TABLE IF EXISTS rf_timetables');
    await run('DROP TABLE IF EXISTS rf_inventories');
    await run('DROP TABLE IF EXISTS rf_trains');
    await close();
  });

  test('Given 基础表 When 创建索引 Then 索引存在', async () => {
    await createIndexesForTrains();
    const idxType = await get("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_rf_trains_type'");
    const idxInvDate = await get("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_rf_inventories_date'");
    const idxInvTrain = await get("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_rf_inventories_train'");
    const idxTimetableTrain = await get("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_rf_timetables_train'");
    const idxTimetableDep = await get("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_rf_timetables_departure_time'");
    const idxTimetableArr = await get("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_rf_timetables_arrival_time'");
    const idxTrainsDur = await get("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_rf_trains_duration_minutes'");
    const idxFaresPrice = await get("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_rf_fares_base_price'");
    expect(idxType?.name).toBe('idx_rf_trains_type');
    expect(idxInvDate?.name).toBe('idx_rf_inventories_date');
    expect(idxInvTrain?.name).toBe('idx_rf_inventories_train');
    expect(idxTimetableTrain?.name).toBe('idx_rf_timetables_train');
    expect(idxTimetableDep?.name).toBe('idx_rf_timetables_departure_time');
    expect(idxTimetableArr?.name).toBe('idx_rf_timetables_arrival_time');
    expect(idxTrainsDur?.name).toBe('idx_rf_trains_duration_minutes');
    expect(idxFaresPrice?.name).toBe('idx_rf_fares_base_price');
  });
});
