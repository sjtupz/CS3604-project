const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../test_data');
const SQL_FILE = path.join(OUTPUT_DIR, 'test_data.sql');
const CSV_DIR = OUTPUT_DIR;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Cities Data (30 Major Cities)
const cities = [
  { id: 1, name: '北京', pinyin: 'beijing', province: '北京', lat: 39.9042, lng: 116.4074 },
  { id: 2, name: '上海', pinyin: 'shanghai', province: '上海', lat: 31.2304, lng: 121.4737 },
  { id: 3, name: '天津', pinyin: 'tianjin', province: '天津', lat: 39.0842, lng: 117.2009 },
  { id: 4, name: '重庆', pinyin: 'chongqing', province: '重庆', lat: 29.5630, lng: 106.5516 },
  { id: 5, name: '石家庄', pinyin: 'shijiazhuang', province: '河北', lat: 38.0428, lng: 114.5149 },
  { id: 6, name: '太原', pinyin: 'taiyuan', province: '山西', lat: 37.8706, lng: 112.5489 },
  { id: 7, name: '沈阳', pinyin: 'shenyang', province: '辽宁', lat: 41.8057, lng: 123.4315 },
  { id: 8, name: '长春', pinyin: 'changchun', province: '吉林', lat: 43.8171, lng: 125.3235 },
  { id: 9, name: '哈尔滨', pinyin: 'haerbin', province: '黑龙江', lat: 45.8038, lng: 126.5349 },
  { id: 10, name: '南京', pinyin: 'nanjing', province: '江苏', lat: 32.0603, lng: 118.7969 },
  { id: 11, name: '杭州', pinyin: 'hangzhou', province: '浙江', lat: 30.2741, lng: 120.1551 },
  { id: 12, name: '合肥', pinyin: 'hefei', province: '安徽', lat: 31.8206, lng: 117.2272 },
  { id: 13, name: '福州', pinyin: 'fuzhou', province: '福建', lat: 26.0745, lng: 119.2965 },
  { id: 14, name: '南昌', pinyin: 'nanchang', province: '江西', lat: 28.6820, lng: 115.8579 },
  { id: 15, name: '济南', pinyin: 'jinan', province: '山东', lat: 36.6512, lng: 117.1201 },
  { id: 16, name: '郑州', pinyin: 'zhengzhou', province: '河南', lat: 34.7466, lng: 113.6253 },
  { id: 17, name: '武汉', pinyin: 'wuhan', province: '湖北', lat: 30.5928, lng: 114.3055 },
  { id: 18, name: '长沙', pinyin: 'changsha', province: '湖南', lat: 28.2282, lng: 112.9388 },
  { id: 19, name: '广州', pinyin: 'guangzhou', province: '广东', lat: 23.1291, lng: 113.2644 },
  { id: 20, name: '南宁', pinyin: 'nanning', province: '广西', lat: 22.8170, lng: 108.3665 },
  { id: 21, name: '海口', pinyin: 'haikou', province: '海南', lat: 20.0174, lng: 110.3492 },
  { id: 22, name: '成都', pinyin: 'chengdu', province: '四川', lat: 30.5728, lng: 104.0668 },
  { id: 23, name: '贵阳', pinyin: 'guiyang', province: '贵州', lat: 26.6470, lng: 106.6302 },
  { id: 24, name: '昆明', pinyin: 'kunming', province: '云南', lat: 24.8801, lng: 102.8329 },
  { id: 25, name: '西安', pinyin: 'xian', province: '陕西', lat: 34.3416, lng: 108.9398 },
  { id: 26, name: '兰州', pinyin: 'lanzhou', province: '甘肃', lat: 36.0611, lng: 103.8343 },
  { id: 27, name: '西宁', pinyin: 'xining', province: '青海', lat: 36.6171, lng: 101.7782 },
  { id: 28, name: '银川', pinyin: 'yinchuan', province: '宁夏', lat: 38.4872, lng: 106.2309 },
  { id: 29, name: '乌鲁木齐', pinyin: 'wulumuqi', province: '新疆', lat: 43.8256, lng: 87.6168 },
  { id: 30, name: '拉萨', pinyin: 'lasa', province: '西藏', lat: 29.6436, lng: 91.1172 }
];

// 2. Stations Data (1-3 stations per city)
let stations = [];
let stationIdCounter = 1;

cities.forEach(city => {
  // Main station (City Name + Station/Center)
  stations.push({
    id: stationIdCounter++,
    name: `${city.name}站`,
    city_id: city.id,
    level: '一等站',
    type: 'rail',
    is_hot: 1
  });

  // High Speed station (City Name + North/South/East/West)
  if (['北京', '上海', '广州', '深圳', '成都', '武汉', '西安', '郑州', '南京', '杭州'].includes(city.name)) {
    stations.push({
      id: stationIdCounter++,
      name: `${city.name}南站`,
      city_id: city.id,
      level: '特等站',
      type: 'rail',
      is_hot: 1
    });
     stations.push({
      id: stationIdCounter++,
      name: `${city.name}东站`,
      city_id: city.id,
      level: '一等站',
      type: 'rail',
      is_hot: 1
    });
  } else if (Math.random() > 0.3) {
    stations.push({
      id: stationIdCounter++,
      name: `${city.name}北站`,
      city_id: city.id,
      level: '二等站',
      type: 'rail',
      is_hot: 0
    });
  }
});

// 3. Trains Data (Generate 1000+ trains)
const trains = [];
const trainTypes = ['G', 'D', 'Z', 'T', 'K'];
let trainIdCounter = 1;

// Helper to get random item
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate routes between cities
for (let i = 0; i < 1200; i++) {
  const startCity = getRandom(cities);
  let endCity = getRandom(cities);
  while (endCity.id === startCity.id) {
    endCity = getRandom(cities);
  }

  const startStation = stations.find(s => s.city_id === startCity.id && s.name.includes(startCity.name));
  const endStation = stations.find(s => s.city_id === endCity.id && s.name.includes(endCity.name));

  if (!startStation || !endStation) continue;

  const type = getRandom(trainTypes);
  const number = `${type}${getRandomInt(100, 9999)}`;
  
  trains.push({
    id: trainIdCounter++,
    train_number: number,
    train_type: type,
    start_station_id: startStation.id,
    end_station_id: endStation.id
  });
}

// 4. Tickets Data
const tickets = [];
let ticketIdCounter = 1;

trains.forEach(train => {
  // Simple logic: direct tickets for now
  // Generate random times
  const startHour = getRandomInt(6, 22);
  const startMinute = getRandomInt(0, 59);
  const durationMinutes = getRandomInt(60, 600); // 1 to 10 hours
  
  const departureTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
  
  const endTotalMinutes = startHour * 60 + startMinute + durationMinutes;
  const endHour = Math.floor(endTotalMinutes / 60) % 24;
  const endMinute = endTotalMinutes % 60;
  const arrivalTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
  
  // Base price calculation based on duration and type
  let basePrice = Math.floor(durationMinutes * (train.train_type === 'G' ? 0.8 : 0.4));
  
  tickets.push({
    id: ticketIdCounter++,
    train_id: train.id,
    from_station_id: train.start_station_id,
    to_station_id: train.end_station_id,
    departure_time: departureTime,
    arrival_time: arrivalTime,
    duration: `${Math.floor(durationMinutes/60)}h${durationMinutes%60}m`,
    // Seats
    swz_num: train.train_type === 'G' ? getRandomInt(0, 10) : 0,
    swz_price: train.train_type === 'G' ? basePrice * 3 : 0,
    yd_num: ['G', 'D'].includes(train.train_type) ? getRandomInt(0, 50) : 0,
    yd_price: ['G', 'D'].includes(train.train_type) ? Math.floor(basePrice * 1.6) : 0,
    ed_num: ['G', 'D'].includes(train.train_type) ? getRandomInt(0, 200) : 0,
    ed_price: ['G', 'D'].includes(train.train_type) ? basePrice : 0,
    rw_num: ['Z', 'T', 'K'].includes(train.train_type) ? getRandomInt(0, 30) : 0,
    rw_price: ['Z', 'T', 'K'].includes(train.train_type) ? Math.floor(basePrice * 1.5) : 0,
    yw_num: ['Z', 'T', 'K'].includes(train.train_type) ? getRandomInt(0, 100) : 0,
    yw_price: ['Z', 'T', 'K'].includes(train.train_type) ? Math.floor(basePrice * 1.2) : 0,
    yz_num: ['Z', 'T', 'K'].includes(train.train_type) ? getRandomInt(0, 200) : 0,
    yz_price: ['Z', 'T', 'K'].includes(train.train_type) ? basePrice : 0,
    wz_num: getRandomInt(0, 50),
    wz_price: basePrice
  });
});

// Output Functions
function writeSQL() {
  let sql = `-- Test Data for 12306 Clone\n-- Generated on ${new Date().toISOString()}\n\n`;

  // Drop tables if exist
  sql += `DROP TABLE IF EXISTS tickets;\n`;
  sql += `DROP TABLE IF EXISTS trains;\n`;
  sql += `DROP TABLE IF EXISTS stations;\n`;
  sql += `DROP TABLE IF EXISTS cities;\n\n`;

  // Create Tables
  sql += `CREATE TABLE cities (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    pinyin TEXT NOT NULL,
    province TEXT NOT NULL,
    lat REAL,
    lng REAL
  );\n\n`;

  sql += `CREATE TABLE stations (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    city_id INTEGER,
    level TEXT,
    type TEXT,
    is_hot BOOLEAN,
    FOREIGN KEY(city_id) REFERENCES cities(id)
  );\n\n`;

  sql += `CREATE TABLE trains (
    id INTEGER PRIMARY KEY,
    train_number TEXT NOT NULL,
    train_type TEXT,
    start_station_id INTEGER,
    end_station_id INTEGER,
    FOREIGN KEY(start_station_id) REFERENCES stations(id),
    FOREIGN KEY(end_station_id) REFERENCES stations(id)
  );\n\n`;

  sql += `CREATE TABLE tickets (
    id INTEGER PRIMARY KEY,
    train_id INTEGER,
    from_station_id INTEGER,
    to_station_id INTEGER,
    departure_time TEXT,
    arrival_time TEXT,
    duration TEXT,
    swz_num INTEGER, swz_price INTEGER,
    yd_num INTEGER, yd_price INTEGER,
    ed_num INTEGER, ed_price INTEGER,
    rw_num INTEGER, rw_price INTEGER,
    yw_num INTEGER, yw_price INTEGER,
    yz_num INTEGER, yz_price INTEGER,
    wz_num INTEGER, wz_price INTEGER,
    FOREIGN KEY(train_id) REFERENCES trains(id)
  );\n\n`;

  // Insert Data
  sql += `-- Cities\n`;
  sql += `INSERT INTO cities (id, name, pinyin, province, lat, lng) VALUES \n`;
  sql += cities.map(c => `(${c.id}, '${c.name}', '${c.pinyin}', '${c.province}', ${c.lat}, ${c.lng})`).join(',\n') + ';\n\n';

  sql += `-- Stations\n`;
  sql += `INSERT INTO stations (id, name, city_id, level, type, is_hot) VALUES \n`;
  sql += stations.map(s => `(${s.id}, '${s.name}', ${s.city_id}, '${s.level}', '${s.type}', ${s.is_hot})`).join(',\n') + ';\n\n';

  sql += `-- Trains (First 100 for brevity in single INSERT, splitting for performance in real SQL usually)\n`;
  // SQLite limit is high, but let's batch if needed. For 1200 rows it's fine.
  const trainBatches = [];
  for(let i=0; i<trains.length; i+=500) {
      trainBatches.push(trains.slice(i, i+500));
  }
  trainBatches.forEach((batch, idx) => {
     sql += `INSERT INTO trains (id, train_number, train_type, start_station_id, end_station_id) VALUES \n`;
     sql += batch.map(t => `(${t.id}, '${t.train_number}', '${t.train_type}', ${t.start_station_id}, ${t.end_station_id})`).join(',\n') + ';\n';
  });
  sql += '\n';

  sql += `-- Tickets\n`;
  const ticketBatches = [];
  for(let i=0; i<tickets.length; i+=200) { // smaller batch for wider rows
      ticketBatches.push(tickets.slice(i, i+200));
  }
  ticketBatches.forEach((batch, idx) => {
      sql += `INSERT INTO tickets (id, train_id, from_station_id, to_station_id, departure_time, arrival_time, duration, swz_num, swz_price, yd_num, yd_price, ed_num, ed_price, rw_num, rw_price, yw_num, yw_price, yz_num, yz_price, wz_num, wz_price) VALUES \n`;
      sql += batch.map(t => `(${t.id}, ${t.train_id}, ${t.from_station_id}, ${t.to_station_id}, '${t.departure_time}', '${t.arrival_time}', '${t.duration}', ${t.swz_num}, ${t.swz_price}, ${t.yd_num}, ${t.yd_price}, ${t.ed_num}, ${t.ed_price}, ${t.rw_num}, ${t.rw_price}, ${t.yw_num}, ${t.yw_price}, ${t.yz_num}, ${t.yz_price}, ${t.wz_num}, ${t.wz_price})`).join(',\n') + ';\n';
  });

  fs.writeFileSync(SQL_FILE, sql);
  console.log(`Generated SQL file at ${SQL_FILE}`);
}

function writeCSVs() {
  const write = (filename, headers, data) => {
    const headerLine = headers.join(',') + '\n';
    const rows = data.map(row => headers.map(h => {
        let val = row[h];
        if (typeof val === 'string') return `"${val}"`;
        return val;
    }).join(',')).join('\n');
    fs.writeFileSync(path.join(CSV_DIR, filename), headerLine + rows);
  };

  write('cities.csv', ['id', 'name', 'pinyin', 'province', 'lat', 'lng'], cities);
  write('stations.csv', ['id', 'name', 'city_id', 'level', 'type', 'is_hot'], stations);
  write('trains.csv', ['id', 'train_number', 'train_type', 'start_station_id', 'end_station_id'], trains);
  write('tickets.csv', ['id', 'train_id', 'from_station_id', 'to_station_id', 'departure_time', 'arrival_time', 'duration', 'swz_num', 'swz_price', 'yd_num', 'yd_price', 'ed_num', 'ed_price', 'rw_num', 'rw_price', 'yw_num', 'yw_price', 'yz_num', 'yz_price', 'wz_num', 'wz_price'], tickets);
  
  console.log(`Generated CSV files at ${CSV_DIR}`);
}

// Execute
writeSQL();
writeCSVs();
