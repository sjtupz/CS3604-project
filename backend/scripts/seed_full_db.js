const sqlite3 = require('sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '../data/12306.db');
const db = new sqlite3.Database(DB_PATH);

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) {
      console.error(`Error running SQL: ${sql}`);
      reject(err);
    } else {
      resolve(this);
    }
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
});

// --- Helpers ---
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function generateChineseID(gender = 'male') {
    // Simplified ID generation
    const prefix = '110101';
    const year = randInt(1970, 2000);
    const month = String(randInt(1, 12)).padStart(2, '0');
    const day = String(randInt(1, 28)).padStart(2, '0');
    const seq = String(randInt(100, 999));
    // 17th digit parity
    let seqNum = parseInt(seq);
    if (gender === 'male' && seqNum % 2 === 0) seqNum++;
    if (gender === 'female' && seqNum % 2 !== 0) seqNum--;
    const seqStr = String(seqNum).padStart(3, '0');
    
    const body = prefix + year + month + day + seqStr;
    const check = 'X'; // Simplified check bit
    return body + check;
}

// --- Main Seed ---
async function seed() {
  console.log('Starting full database seed...');
  
  // 1. Enable Foreign Keys
  await run('PRAGMA foreign_keys = ON');

  // 2. Drop Tables
  const tables = [
    'rf_inventories', 'rf_fares', 'rf_timetables', 'rf_trains', 'rf_stations',
    'orders', 'passengers', 'users', 'login_codes'
  ];
  for (const t of tables) await run(`DROP TABLE IF EXISTS ${t}`);

  console.log('Tables dropped. Creating schema...');

  // 3. Create Tables
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
    FOREIGN KEY(train_id) REFERENCES rf_trains(train_id),
    FOREIGN KEY(from_station_id) REFERENCES rf_stations(station_id),
    FOREIGN KEY(to_station_id) REFERENCES rf_stations(station_id)
  )`);

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
    
    const stationIds = [];
    const hsrStationIds = [];

    for (const city of cities) {
      const numStations = randInt(1, 3);
      for (let i = 0; i < numStations; i++) {
        const suffix = i === 0 ? '' : pick(['东', '西', '南', '北']);
        let name = city.name + suffix + '站';
        if (city.name === '上海' && i === 1) name = '上海虹桥站';
        if (city.name === '北京' && i === 1) name = '北京南站';

        const code = 'S' + randInt(10000, 99999);
        const isHsr = name.includes('南') || name.includes('东') || name.includes('西') || name.includes('北') || name.includes('虹桥');

        await run(`INSERT INTO rf_stations (name, code, city, province, level, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
          [name, code, city.name, city.province, '特等', 30 + Math.random()*10, 100 + Math.random()*20]);
        
        const row = await get('SELECT last_insert_rowid() as id');
        stationIds.push(row.id);
        if (isHsr) hsrStationIds.push(row.id);
      }
    }
    if (hsrStationIds.length === 0) hsrStationIds.push(...stationIds);
    console.log(`Seeded ${stationIds.length} stations.`);

    // 2. Trains
    const generatedTrainNumbers = new Set();
    let trainCount = 0;

    for (let i = 0; i < 500; i++) {
      const rand = Math.random();
      let type = 'K';
      if (rand < 0.30) type = 'G';
      else if (rand < 0.55) type = 'D';
      else if (rand < 0.70) type = 'Z';
      else if (rand < 0.85) type = 'T';
      
      let number = type + randInt(100, 9999);
      while(generatedTrainNumbers.has(number)) {
         number = type + randInt(100, 9999);
      }
      generatedTrainNumbers.add(number);

      const pool = (type === 'G' || type === 'D') ? hsrStationIds : stationIds;
      const origin = pick(pool);
      let dest = pick(pool);
      while (dest === origin) dest = pick(pool);

      const distance = randInt(100, 2500);
      let speed = 80;
      if (type === 'G') speed = 300;
      else if (type === 'D') speed = 200;
      else if (type === 'Z') speed = 120;
      else if (type === 'T') speed = 100;
      
      const durationMins = Math.floor((distance / speed) * 60) + randInt(10, 60);
      const stopCount = randInt(2, 10);

      await run(`INSERT INTO rf_trains (train_number, train_type, origin_station_id, destination_station_id, distance_km, duration_minutes, stop_count) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [number, type, origin, dest, distance, durationMins, stopCount]);
      
      const trainRow = await get('SELECT last_insert_rowid() as id');
      const trainId = trainRow.id;
      trainCount++;

      // Timetables
      const startHour = randInt(6, 23);
      const startMin = randInt(0, 59);
      const startTime = `${String(startHour).padStart(2,'0')}:${String(startMin).padStart(2,'0')}`;
      
      const totalMins = (startHour * 60) + startMin + durationMins;
      const arrHour = Math.floor(totalMins / 60) % 24;
      const arrMin = totalMins % 60;
      const arrTime = `${String(arrHour).padStart(2,'0')}:${String(arrMin).padStart(2,'0')}`;

      await run(`INSERT INTO rf_timetables (train_id, station_id, arrival_time, departure_time, stop_minutes, stop_order) VALUES (?, ?, ?, ?, ?, ?)`,
        [trainId, origin, startTime, startTime, 0, 1]);
      
      await run(`INSERT INTO rf_timetables (train_id, station_id, arrival_time, departure_time, stop_minutes, stop_order) VALUES (?, ?, ?, ?, ?, ?)`,
        [trainId, dest, arrTime, arrTime, 0, stopCount]);

      // Fares
      const basePrice = distance * (type === 'G' ? 0.46 : 0.3);
      await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '二等座', basePrice.toFixed(2), 1.0]);
      await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '一等座', (basePrice * 1.6).toFixed(2), 1.6]);
      if (type === 'G' || type === 'D') {
        await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '商务座', (basePrice * 3).toFixed(2), 3.0]);
      } else {
        await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '硬卧', (basePrice * 1.5).toFixed(2), 1.5]);
        await run(`INSERT INTO rf_fares (train_id, seat_type, base_price, coef) VALUES (?, ?, ?, ?)`, [trainId, '软卧', (basePrice * 2).toFixed(2), 2.0]);
      }

      // Inventory
      const today = new Date();
      for (let d = 0; d < 30; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() + d);
        const dateStr = date.toISOString().split('T')[0];
        const isSoldOut = randInt(0, 20) === 0; 
        
        await run(`INSERT INTO rf_inventories (
          train_id, travel_date, from_station_id, to_station_id,
          business_remaining, first_remaining, second_remaining,
          soft_sleeper_remaining, hard_sleeper_remaining, hard_seat_remaining, no_seat_remaining
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
          trainId, dateStr, origin, dest,
          isSoldOut ? 0 : randInt(0, 20),
          isSoldOut ? 0 : randInt(0, 50),
          isSoldOut ? 0 : randInt(0, 100),
          isSoldOut ? 0 : randInt(0, 30),
          isSoldOut ? 0 : randInt(0, 60),
          isSoldOut ? 0 : randInt(0, 100),
          isSoldOut ? 0 : randInt(0, 50)
        ]);
      }
    }
    console.log(`Seeded ${trainCount} trains.`);

    // --- B. User Data ---
    const adminId = uuidv4();
    await run(`INSERT INTO users (id, username, password, real_name, role) VALUES (?, ?, ?, ?, ?)`, 
      [adminId, 'admin', 'admin123', '管理员', 'admin']);

    const duplicatePhoneUser = uuidv4();
    await run(`INSERT INTO users (id, username, password, real_name, phone_number, verification_status, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [duplicatePhoneUser, 'duplicate_tester', '123456', '重复测试', '13800138000', '已通过', 'user']);

    for (let i = 0; i < 20; i++) {
      const uid = uuidv4();
      const phone = '13' + randInt(100000000, 999999999);
      const name = `User${i}`;
      await run(`INSERT INTO users (id, username, password, real_name, phone_number, verification_status, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [uid, `user${i}`, '123456', name, phone, '已通过', 'user']);
    }

    await run('COMMIT');
    console.log('Seed completed successfully.');
  } catch (err) {
    await run('ROLLBACK');
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    db.close();
  }
}

seed();
