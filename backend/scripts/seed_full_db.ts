
import sqlite3 from 'sqlite3';
import { fakerZH_CN as faker } from '@faker-js/faker';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.join(__dirname, '../data/12306.db');
const db = new sqlite3.Database(DB_PATH);

const run = (sql: string, params: any[] = []) => new Promise<void>((resolve, reject) => {
  db.run(sql, params, (err) => {
    if (err) {
      console.error(`Error running SQL: ${sql}`);
      reject(err);
    } else {
      resolve();
    }
  });
});

const get = (sql: string, params: any[] = []) => new Promise<any>((resolve, reject) => {
  db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
});

function generateChineseID(birthDate?: Date, gender?: 'male' | 'female'): string {
  const provinceCodes = [
    '11', '12', '13', '14', '15', // North
    '21', '22', '23',             // Northeast
    '31', '32', '33', '34', '35', '36', '37', // East
    '41', '42', '43',             // Central
    '44', '45', '46',             // South
    '50', '51', '52', '53', '54', // Southwest
    '61', '62', '63', '64', '65'  // Northwest
  ];
  const addrCode = faker.helpers.arrayElement(provinceCodes) + faker.string.numeric(4);
  const date = birthDate || faker.date.birthdate({ min: 18, max: 70, mode: 'age' });
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const dateCode = year + month + day;
  let seqCode = faker.number.int({ min: 100, max: 999 });
  
  // 17th digit: Odd for Male, Even for Female
  if (gender === 'male' && seqCode % 2 === 0) seqCode++;
  if (gender === 'female' && seqCode % 2 !== 0) seqCode--;
  
  const seqCodeStr = seqCode.toString().padStart(3, '0');
  const body = addrCode + dateCode + seqCodeStr;

  const coefficients = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(body[i]) * coefficients[i];
  }
  const remainder = sum % 11;
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  const checkCode = checkCodes[remainder];

  return body + checkCode;
}

async function seed() {
  console.log('Starting full database seed...');
  
  // 1. Enable Foreign Keys
  await run('PRAGMA foreign_keys = ON');

  // 2. Drop Tables (Clean Slate)
  const tables = [
    'rf_inventories', 'rf_fares', 'rf_timetables', 'rf_trains', 'rf_stations', // Infrastructure (RF prefix for compatibility)
    'orders', 'passengers', 'users', 'login_codes' // Identity & Transaction
  ];
  for (const t of tables) await run(`DROP TABLE IF EXISTS ${t}`);

  console.log('Tables dropped. Creating schema...');

  // 3. Create Infrastructure Tables (rf_ prefix)
  await run(`CREATE TABLE rf_stations (
    station_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    level TEXT,
    latitude REAL,
    longitude REAL
  )`);

  await run(`CREATE TABLE rf_trains (
    train_id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_number TEXT NOT NULL UNIQUE,
    train_type TEXT NOT NULL,
    origin_station_id INTEGER NOT NULL,
    destination_station_id INTEGER NOT NULL,
    distance_km REAL NOT NULL,
    duration_minutes INTEGER NOT NULL,
    stop_count INTEGER NOT NULL,
    FOREIGN KEY(origin_station_id) REFERENCES rf_stations(station_id),
    FOREIGN KEY(destination_station_id) REFERENCES rf_stations(station_id)
  )`);

  await run(`CREATE TABLE rf_timetables (
    schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_id INTEGER NOT NULL,
    station_id INTEGER NOT NULL,
    arrival_time TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    stop_minutes INTEGER NOT NULL,
    stop_order INTEGER NOT NULL,
    FOREIGN KEY(train_id) REFERENCES rf_trains(train_id),
    FOREIGN KEY(station_id) REFERENCES rf_stations(station_id)
  )`);

  await run(`CREATE TABLE rf_fares (
    fare_id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_id INTEGER NOT NULL,
    seat_type TEXT NOT NULL,
    base_price REAL NOT NULL,
    coef REAL NOT NULL,
    FOREIGN KEY(train_id) REFERENCES rf_trains(train_id)
  )`);

  await run(`CREATE TABLE rf_inventories (
    stock_id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_id INTEGER NOT NULL,
    travel_date TEXT NOT NULL,
    from_station_id INTEGER NOT NULL,
    to_station_id INTEGER NOT NULL,
    business_remaining INTEGER,
    first_remaining INTEGER,
    second_remaining INTEGER,
    soft_sleeper_remaining INTEGER,
    hard_sleeper_remaining INTEGER,
    hard_seat_remaining INTEGER,
    no_seat_remaining INTEGER,
    other_remaining INTEGER,
    FOREIGN KEY(train_id) REFERENCES rf_trains(train_id),
    FOREIGN KEY(from_station_id) REFERENCES rf_stations(station_id),
    FOREIGN KEY(to_station_id) REFERENCES rf_stations(station_id)
  )`);

  // 4. Create Identity & Transaction Tables
  await run(`CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT,
    real_name TEXT,
    country TEXT DEFAULT '中国',
    id_type TEXT,
    id_number TEXT,
    verification_status TEXT DEFAULT '未通过',
    phone_number TEXT,
    email TEXT,
    phone_verified INTEGER DEFAULT 0,
    discount_type TEXT DEFAULT '成人',
    gender TEXT DEFAULT 'male',
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE passengers (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    id_type TEXT NOT NULL,
    id_number TEXT NOT NULL,
    phone TEXT,
    verification_status TEXT DEFAULT '未通过',
    discount_type TEXT DEFAULT '成人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, id_number)
  )`);

  await run(`CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    order_number TEXT UNIQUE,
    train_number TEXT,
    passenger_name TEXT,
    booking_date DATE,
    travel_date DATE,
    train_info TEXT,
    passenger_info TEXT,
    seat_info TEXT,
    price REAL,
    status TEXT DEFAULT '未完成',
    refund_fee REAL,
    refund_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  
  await run(`CREATE TABLE login_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT,
    identifier TEXT,
    code TEXT,
    createdAt INTEGER,
    valid INTEGER DEFAULT 1
  )`);

  console.log('Schema created. Seeding data...');

  // Start Transaction
  await run('BEGIN TRANSACTION');

  try {
    // --- A. Infrastructure Data ---
    
    // 1. Stations
  const cities = [
    { name: '北京', province: '北京' }, { name: '上海', province: '上海' }, { name: '天津', province: '天津' }, { name: '重庆', province: '重庆' },
    { name: '广州', province: '广东' }, { name: '深圳', province: '广东' }, { name: '南京', province: '江苏' }, { name: '杭州', province: '浙江' },
    { name: '武汉', province: '湖北' }, { name: '长沙', province: '湖南' }, { name: '成都', province: '四川' }, { name: '西安', province: '陕西' },
    { name: '郑州', province: '河南' }, { name: '济南', province: '山东' }, { name: '沈阳', province: '辽宁' }, { name: '哈尔滨', province: '黑龙江' },
    { name: '福州', province: '福建' }, { name: '厦门', province: '福建' }, { name: '昆明', province: '云南' }, { name: '贵阳', province: '贵州' },
    { name: '兰州', province: '甘肃' }, { name: '南宁', province: '广西' }, { name: '海口', province: '海南' }, { name: '太原', province: '山西' },
    { name: '合肥', province: '安徽' }, { name: '南昌', province: '江西' }, { name: '石家庄', province: '河北' }, { name: '长春', province: '吉林' },
    { name: '呼和浩特', province: '内蒙古' }, { name: '乌鲁木齐', province: '新疆' }
  ];
  
  const stationIds: number[] = [];
  // Keep track of which stations are "HSR capable" (roughly)
  // For simplicity: Stations with '南', '东', '西', '北', '虹桥' are likely HSR.
  const hsrStationIds: number[] = [];

  for (const city of cities) {
    const numStations = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < numStations; i++) {
      const suffix = i === 0 ? '' : faker.helpers.arrayElement(['东', '西', '南', '北']);
      // Ensure specific major stations exist
      let name = city.name + suffix + '站';
      if (city.name === '上海' && i === 1) name = '上海虹桥站';
      if (city.name === '北京' && i === 1) name = '北京南站';

      // Simple pinyin code generation
      const code = faker.string.alpha({ length: 3 }).toUpperCase() + faker.string.numeric(3); 
      
      const isHsr = name.includes('南') || name.includes('东') || name.includes('西') || name.includes('北') || name.includes('虹桥');

      await run(`INSERT INTO rf_stations (name, code, city, province, level, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [name, code, city.name, city.province, '特等', faker.location.latitude(), faker.location.longitude()]);
      
      const row = await get('SELECT last_insert_rowid() as id');
      stationIds.push(row.id);
      if (isHsr) hsrStationIds.push(row.id);
    }
  }
  // Fallback: if no HSR stations detected (unlikely), use all.
  if (hsrStationIds.length === 0) hsrStationIds.push(...stationIds);

  console.log(`Seeded ${stationIds.length} stations.`);

  // 2. Trains
  const generatedTrainNumbers = new Set();
  const allTrainNumbers: string[] = [];
  let trainCount = 0;

  // Generate 500 trains
  for (let i = 0; i < 500; i++) {
    // Weighted train types: G(30%), D(25%), Z(15%), T(15%), K(15%)
    const rand = Math.random();
    let type = 'K';
    if (rand < 0.30) type = 'G';
    else if (rand < 0.55) type = 'D';
    else if (rand < 0.70) type = 'Z';
    else if (rand < 0.85) type = 'T';
    
    let number = type + faker.number.int({ min: 100, max: 9999 });
    while(generatedTrainNumbers.has(number)) {
       number = type + faker.number.int({ min: 100, max: 9999 });
    }
    generatedTrainNumbers.add(number);
    allTrainNumbers.push(number);

    // Origin/Dest Logic
    // If G/D, prefer HSR stations
    const pool = (type === 'G' || type === 'D') ? hsrStationIds : stationIds;
    const origin = faker.helpers.arrayElement(pool);
    let dest = faker.helpers.arrayElement(pool);
    while (dest === origin) dest = faker.helpers.arrayElement(pool);

    const distance = faker.number.int({ min: 100, max: 2500 });
    // Approx speed: G=300, D=200, Z=120, K=80
    let speed = 80;
    if (type === 'G') speed = 300;
    else if (type === 'D') speed = 200;
    else if (type === 'Z') speed = 120;
    else if (type === 'T') speed = 100;
    
    const durationMins = Math.floor((distance / speed) * 60) + faker.number.int({ min: 10, max: 60 }); // Add buffer
    const stopCount = faker.number.int({ min: 2, max: 10 });

    await run(`INSERT INTO rf_trains (train_number, train_type, origin_station_id, destination_station_id, distance_km, duration_minutes, stop_count) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [number, type, origin, dest, distance, durationMins, stopCount]);
    
    const trainRow = await get('SELECT last_insert_rowid() as id');
    const trainId = trainRow.id;
    trainCount++;

    // 3. Timetables
    // 06:00 - 23:00 (Allow late trains for cross-day test)
    const startHour = faker.number.int({ min: 6, max: 23 });
    const startMin = faker.number.int({ min: 0, max: 59 });
    const startTime = `${startHour.toString().padStart(2,'0')}:${startMin.toString().padStart(2,'0')}`;
    
    // Calculate arrival time
    const totalMins = (startHour * 60) + startMin + durationMins;
    const arrHour = Math.floor(totalMins / 60) % 24;
    const arrMin = totalMins % 60;
    const arrTime = `${arrHour.toString().padStart(2,'0')}:${arrMin.toString().padStart(2,'0')}`;
    
    // Note: Cross-day logic is implicit in duration. If totalMins > 24*60, it's next day.
    // The frontend should calculate date diff based on duration or just show time.

    // Insert Origin
    await run(`INSERT INTO rf_timetables (train_id, station_id, arrival_time, departure_time, stop_minutes, stop_order) VALUES (?, ?, ?, ?, ?, ?)`,
      [trainId, origin, startTime, startTime, 0, 1]);
    
    // Insert Dest
    await run(`INSERT INTO rf_timetables (train_id, station_id, arrival_time, departure_time, stop_minutes, stop_order) VALUES (?, ?, ?, ?, ?, ?)`,
      [trainId, dest, arrTime, arrTime, 0, stopCount]);

    // 4. Fares
    const basePrice = distance * (type === 'G' ? 0.46 : 0.3); // Rough estimate
    await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '二等座', basePrice.toFixed(2), 1.0]);
    await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '一等座', (basePrice * 1.6).toFixed(2), 1.6]);
    if (type === 'G' || type === 'D') {
      await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '商务座', (basePrice * 3).toFixed(2), 3.0]);
    } else {
      await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '硬卧', (basePrice * 1.5).toFixed(2), 1.5]);
      await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '软卧', (basePrice * 2).toFixed(2), 2.0]);
    }

    // 5. Inventory (Future 30 days)
    const today = new Date();
    for (let d = 0; d < 30; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      const dateStr = date.toISOString().split('T')[0];

      // Randomly set some to 0 to test "sold out" (waitlist)
      // 5% chance of fully sold out
      const isSoldOut = faker.number.int({ min: 0, max: 20 }) === 0; 
      
      await run(`INSERT INTO rf_inventories (
        train_id, travel_date, from_station_id, to_station_id,
        business_remaining, first_remaining, second_remaining,
        soft_sleeper_remaining, hard_sleeper_remaining, hard_seat_remaining, no_seat_remaining, other_remaining
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        trainId, dateStr, origin, dest,
        isSoldOut ? 0 : faker.number.int({min: 0, max: 20}),
        isSoldOut ? 0 : faker.number.int({min: 0, max: 50}),
        isSoldOut ? 0 : faker.number.int({min: 0, max: 100}),
        isSoldOut ? 0 : faker.number.int({min: 0, max: 30}),
        isSoldOut ? 0 : faker.number.int({min: 0, max: 60}),
        isSoldOut ? 0 : faker.number.int({min: 0, max: 100}),
        isSoldOut ? 0 : faker.number.int({min: 0, max: 50}),
        0
      ]);
    }
  }
  console.log(`Seeded ${trainCount} trains.`);

  // --- B. User & Passenger Data ---
  
  // 1. Admin
  const adminId = uuidv4();
  await run(`INSERT INTO users (id, username, password, real_name, role) VALUES (?, ?, ?, ?, ?)`, 
    [adminId, 'admin', 'admin123', '管理员', 'admin']);

  // 2. Specific User for Duplicate Check
  const duplicatePhoneUser = uuidv4();
  await run(`INSERT INTO users (id, username, password, real_name, phone_number, verification_status, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [duplicatePhoneUser, 'duplicate_tester', '123456', '重复测试', '13800138000', '已通过', 'user']);

  // 3. Normal Users
  const userIds: string[] = [duplicatePhoneUser];
  for (let i = 0; i < 20; i++) {
    const uid = uuidv4();
    const phone = '13' + faker.string.numeric(9);
    const name = faker.person.fullName();
    await run(`INSERT INTO users (id, username, password, real_name, phone_number, verification_status, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uid, `user${i}`, '123456', name, phone, '已通过', 'user']);
    userIds.push(uid);

    // Passengers for this user
    const numPass = faker.number.int({ min: 1, max: 5 });
    const passengersForUser: {name: string, id: string}[] = [];
    
    for (let p = 0; p < numPass; p++) {
      const pid = uuidv4();
      const pname = faker.person.fullName();
      const idNum = generateChineseID(); 
      const pType = faker.helpers.arrayElement(['成人', '学生', '儿童']);
      
      await run(`INSERT INTO passengers (id, user_id, name, id_type, id_number, verification_status, discount_type) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [pid, uid, pname, '身份证', idNum, '已通过', pType]);
      
      passengersForUser.push({name: pname, id: pid});
    }

    // Orders
    // Ensure diverse statuses: 'Pending Payment', 'Paid', 'Completed', 'Cancelled'
    // Map to Chinese: '未完成' (Pending), '已支付' (Paid), '已完成' (Completed), '已取消' (Cancelled)
    const statuses = ['未完成', '已支付', '已完成', '已取消'];
    const numOrders = faker.number.int({ min: 1, max: 4 }); // Ensure at least some orders
    
    for (let o = 0; o < numOrders; o++) {
      const oid = uuidv4();
      const orderNo = 'E' + faker.string.numeric(9);
      const status = faker.helpers.arrayElement(statuses);
      const trainNo = faker.helpers.arrayElement(allTrainNumbers);
      const passenger = faker.helpers.arrayElement(passengersForUser);
      
      // Try to get real price
      let price = 100.0;
      try {
        const trainRow = await get('SELECT train_id FROM rf_trains WHERE train_number = ?', [trainNo]);
        if (trainRow) {
           const fareRow = await get('SELECT base_price FROM rf_fares WHERE train_id = ? ORDER BY base_price ASC LIMIT 1', [trainRow.train_id]);
           if (fareRow) price = fareRow.base_price;
        }
      } catch (e) {
        // ignore
      }

      await run(`INSERT INTO orders (id, user_id, order_number, train_number, passenger_name, price, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [oid, uid, orderNo, trainNo, passenger.name, price, status]);
    }
  }
  console.log(`Seeded ${userIds.length} users and their passengers/orders.`);
    
    await run('COMMIT');
    console.log('Database seeding completed successfully!');
  } catch (error) {
    await run('ROLLBACK');
    throw error;
  }
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
}).finally(() => {
  db.close();
});
