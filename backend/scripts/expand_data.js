const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const SeedRandom = require('../src/utils/seedRandom');

const DB_PATH = path.join(__dirname, '../data/12306.db');
const db = new sqlite3.Database(DB_PATH);
const rng = new SeedRandom(12345); // Fixed seed

// Configuration
const DAYS_TO_GENERATE = 15;
const TRAINS_PER_DAY = 50; 
const START_DATE = new Date();

console.log('Starting data expansion...');

// Promisify DB helpers
const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const exec = (sql) => new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
    });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

async function initSchema() {
  console.log('Initializing RF schema...');
  await exec(`
    DROP TABLE IF EXISTS rf_inventories;
    DROP TABLE IF EXISTS rf_fares;
    DROP TABLE IF EXISTS rf_timetables;
    DROP TABLE IF EXISTS rf_trains;
    DROP TABLE IF EXISTS rf_stations;
    DROP TABLE IF EXISTS rf_cities;

    CREATE TABLE rf_cities (
      city_code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      province TEXT NOT NULL,
      level TEXT,
      pinyin TEXT
    );

    CREATE TABLE rf_stations (
      station_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      pinyin TEXT,
      city_code TEXT NOT NULL,
      city TEXT NOT NULL, -- Denormalized for compatibility
      ad_code TEXT,
      lat REAL,
      lng REAL,
      FOREIGN KEY (city_code) REFERENCES rf_cities(city_code)
    );

    CREATE TABLE rf_trains (
      train_id INTEGER PRIMARY KEY AUTOINCREMENT,
      train_number TEXT NOT NULL,
      train_type TEXT NOT NULL,
      origin_station_id INTEGER NOT NULL,
      destination_station_id INTEGER NOT NULL,
      distance_km REAL,
      duration_minutes INTEGER,
      stop_count INTEGER,
      FOREIGN KEY (origin_station_id) REFERENCES rf_stations(station_id),
      FOREIGN KEY (destination_station_id) REFERENCES rf_stations(station_id)
    );

    CREATE TABLE rf_timetables (
      schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
      train_id INTEGER NOT NULL,
      station_id INTEGER NOT NULL,
      arrival_time TEXT NOT NULL, -- HH:mm
      departure_time TEXT NOT NULL, -- HH:mm
      stop_minutes INTEGER,
      stop_order INTEGER NOT NULL,
      FOREIGN KEY (train_id) REFERENCES rf_trains(train_id),
      FOREIGN KEY (station_id) REFERENCES rf_stations(station_id)
    );

    CREATE TABLE rf_fares (
      fare_id INTEGER PRIMARY KEY AUTOINCREMENT,
      train_id INTEGER NOT NULL,
      seat_type TEXT NOT NULL,
      base_price REAL NOT NULL,
      FOREIGN KEY (train_id) REFERENCES rf_trains(train_id)
    );

    CREATE TABLE rf_inventories (
      stock_id INTEGER PRIMARY KEY AUTOINCREMENT,
      train_id INTEGER NOT NULL,
      travel_date TEXT NOT NULL, -- YYYY-MM-DD
      from_station_id INTEGER NOT NULL,
      to_station_id INTEGER NOT NULL,
      business_remaining INTEGER DEFAULT 0,
      first_remaining INTEGER DEFAULT 0,
      second_remaining INTEGER DEFAULT 0,
      soft_sleeper_remaining INTEGER DEFAULT 0,
      hard_sleeper_remaining INTEGER DEFAULT 0,
      hard_seat_remaining INTEGER DEFAULT 0,
      no_seat_remaining INTEGER DEFAULT 0,
      FOREIGN KEY (train_id) REFERENCES rf_trains(train_id)
    );

    CREATE INDEX IF NOT EXISTS idx_rf_inventories_query ON rf_inventories(train_id, travel_date, from_station_id, to_station_id);
    CREATE INDEX IF NOT EXISTS idx_rf_inventories_train_date ON rf_inventories(train_id, travel_date);
    CREATE INDEX IF NOT EXISTS idx_rf_fares_train_seat ON rf_fares(train_id, seat_type);
    CREATE INDEX IF NOT EXISTS idx_rf_trains_stations ON rf_trains(origin_station_id, destination_station_id);
    CREATE INDEX IF NOT EXISTS idx_rf_stations_city ON rf_stations(city);
    CREATE INDEX IF NOT EXISTS idx_rf_stations_name ON rf_stations(name);
    CREATE INDEX IF NOT EXISTS idx_rf_stations_pinyin ON rf_stations(pinyin);
  `);
}

const PROVINCES = [
  { name: '北京', code: '11', cities: ['北京'] },
  { name: '上海', code: '31', cities: ['上海'] },
  { name: '天津', code: '12', cities: ['天津'] },
  { name: '重庆', code: '50', cities: ['重庆'] },
  { name: '河北', code: '13', cities: ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水'] },
  { name: '山西', code: '14', cities: ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁'] },
  { name: '辽宁', code: '21', cities: ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'] },
  { name: '吉林', code: '22', cities: ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城'] },
  { name: '黑龙江', code: '23', cities: ['哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化'] },
  { name: '江苏', code: '32', cities: ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'] },
  { name: '浙江', code: '33', cities: ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'] },
  { name: '安徽', code: '34', cities: ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '六安', '亳州', '池州', '宣城'] },
  { name: '福建', code: '35', cities: ['福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德'] },
  { name: '江西', code: '36', cities: ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶'] },
  { name: '山东', code: '37', cities: ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽'] },
  { name: '河南', code: '41', cities: ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店'] },
  { name: '湖北', code: '42', cities: ['武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州'] },
  { name: '湖南', code: '43', cities: ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底'] },
  { name: '广东', code: '44', cities: ['广州', '韶关', '深圳', '珠海', '汕头', '佛山', '江门', '湛江', '茂名', '肇庆', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'] },
  { name: '广西', code: '45', cities: ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左'] },
  { name: '海南', code: '46', cities: ['海口', '三亚', '三沙', '儋州'] },
  { name: '四川', code: '51', cities: ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳'] },
  { name: '贵州', code: '52', cities: ['贵阳', '六盘水', '遵义', '安顺', '毕节', '铜仁'] },
  { name: '云南', code: '53', cities: ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧'] },
  { name: '西藏', code: '54', cities: ['拉萨', '日喀则', '昌都', '林芝', '山南', '那曲'] },
  { name: '陕西', code: '61', cities: ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛'] },
  { name: '甘肃', code: '62', cities: ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南'] },
  { name: '青海', code: '63', cities: ['西宁', '海东'] },
  { name: '宁夏', code: '64', cities: ['银川', '石嘴山', '吴忠', '固原', '中卫'] },
  { name: '新疆', code: '65', cities: ['乌鲁木齐', '克拉玛依', '吐鲁番', '哈密'] },
];

async function generateGeoData() {
  const allStations = [];
  let cityCodeCounter = 1000;
  
  await exec('BEGIN TRANSACTION');
  try {
    for (const prov of PROVINCES) {
      for (const cityName of prov.cities) {
        const cityCode = String(cityCodeCounter++);
        const pinyin = 'TODO'; 
        await run('INSERT INTO rf_cities (city_code, name, province, level, pinyin) VALUES (?, ?, ?, ?, ?)', [cityCode, cityName, prov.name, '地级市', pinyin]);

        const isMajor = ['北京', '上海', '广州', '深圳', '成都', '杭州', '武汉', '西安'].includes(cityName);
        const isShSzRequired = ['上海', '苏州'].includes(cityName);
        const isTopTierRequired = ['北京', '上海', '广州', '深圳'].includes(cityName);
        const stationCount = isTopTierRequired
          ? 4
          : isShSzRequired
            ? 4
            : isMajor
              ? rng.range(3, 6)
              : rng.range(1, 2);
        
        const suffixes = ['', '东', '西', '南', '北', '站'];
        const stationNames = new Set();
        
        for (let i = 0; i < stationCount; i++) {
            let suffix = isMajor ? suffixes[i] : (i===0 ? '' : suffixes[i]);
            let sName = cityName + suffix;
            if (stationNames.has(sName)) continue;
            stationNames.add(sName);

            const code = 'S' + cityCode + String(i).padStart(2, '0');
            const lat = 35 + rng.range(-500, 500) / 100.0;
            const lng = 105 + rng.range(-500, 500) / 100.0;
            
            const pinyin = cityName === '北京' ? 'bj' : 'TODO';
            const info = { name: sName, code, pinyin, city_code: cityCode, city: cityName, ad_code: cityCode + '01', lat, lng };
            const res = await run('INSERT INTO rf_stations (name, code, pinyin, city_code, city, ad_code, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
              [info.name, info.code, info.pinyin, info.city_code, info.city, info.ad_code, info.lat, info.lng]);
            allStations.push({ ...info, station_id: res.lastID });
        }
      }
    }
    await exec('COMMIT');
  } catch (err) {
    await exec('ROLLBACK');
    throw err;
  }

  console.log(`Generated ${allStations.length} stations across ${cityCodeCounter - 1000} cities.`);
  return allStations;
}

async function ensureShanghaiSuzhouCoverage(stations) {
  const shStations = stations.filter((s) => s.city === '上海').slice(0, 4);
  const szStations = stations.filter((s) => s.city === '苏州').slice(0, 4);

  if (shStations.length < 1 || szStations.length < 1) {
    throw new Error('Missing Shanghai or Suzhou stations in generated data');
  }

  const origin = shStations[0];
  const dest = szStations[0];

  const fixedTrains = [
    { no: 'G3001', dep: '05:30', dur: 60 },
    { no: 'G3003', dep: '08:10', dur: 45 },
    { no: 'G3005', dep: '13:20', dur: 50 },
    { no: 'G3007', dep: '19:10', dur: 55 }
  ];

  for (const t of fixedTrains) {
    const res = await run(
      'INSERT INTO rf_trains (train_number, train_type, origin_station_id, destination_station_id, distance_km, duration_minutes, stop_count) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [t.no, 'G', origin.station_id, dest.station_id, 80, t.dur, 2]
    );
    const trainId = res.lastID;

    const [dh, dm] = t.dep.split(':').map(Number);
    const depMinutes = dh * 60 + dm;
    const arrMinutes = depMinutes + t.dur;
    const arrH = Math.floor(arrMinutes / 60) % 24;
    const arrM = arrMinutes % 60;
    const arr = `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`;

    await run(
      'INSERT INTO rf_timetables (train_id, station_id, arrival_time, departure_time, stop_minutes, stop_order) VALUES (?, ?, ?, ?, ?, ?)',
      [trainId, origin.station_id, '-', t.dep, 0, 1]
    );
    await run(
      'INSERT INTO rf_timetables (train_id, station_id, arrival_time, departure_time, stop_minutes, stop_order) VALUES (?, ?, ?, ?, ?, ?)',
      [trainId, dest.station_id, arr, '-', 0, 2]
    );

    await run('INSERT INTO rf_fares (train_id, seat_type, base_price) VALUES (?, ?, ?)', [trainId, '二等座', 35]);
    await run('INSERT INTO rf_fares (train_id, seat_type, base_price) VALUES (?, ?, ?)', [trainId, '一等座', 60]);
    await run('INSERT INTO rf_fares (train_id, seat_type, base_price) VALUES (?, ?, ?)', [trainId, '商务座', 120]);
  }

  const trainRows = await all(
    `SELECT train_id FROM rf_trains WHERE train_number IN ('G3001','G3003','G3005','G3007') ORDER BY train_id ASC`
  );

  for (let d = 0; d < DAYS_TO_GENERATE; d++) {
    const date = new Date(START_DATE);
    date.setDate(START_DATE.getDate() + d);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;

    for (const row of trainRows) {
      await run(
        'INSERT INTO rf_inventories (train_id, travel_date, from_station_id, to_station_id, business_remaining, first_remaining, second_remaining, soft_sleeper_remaining, hard_sleeper_remaining, hard_seat_remaining, no_seat_remaining) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [row.train_id, dateStr, origin.station_id, dest.station_id, 5, 20, 100, 0, 0, 0, 0]
      );
    }
  }
}

async function generateRoutes(stations) {
  const trains = [];
  const trainTypes = ['G', 'D', 'Z', 'T', 'K'];

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  await exec('BEGIN TRANSACTION');
  try {
    for (let i = 0; i < TRAINS_PER_DAY; i++) {
      const type = rng.pick(trainTypes);
      const number = type + rng.range(100, 9999);
      
      const origin = rng.pick(stations);
      let dest = rng.pick(stations);
      while (dest.station_id === origin.station_id || dest.city_code === origin.city_code) {
        dest = rng.pick(stations);
      }

      const stopCount = rng.range(0, 5);
      const stops = [origin];
      for(let j=0; j<stopCount; j++) {
          stops.push(rng.pick(stations));
      }
      stops.push(dest);
      const uniqueStops = [...new Set(stops)];
      if (uniqueStops.length < 2) continue;

      const distance = rng.range(200, 2000);
      const speed = type === 'G' ? 300 : (type === 'D' ? 200 : 100);
      const duration = Math.floor((distance / speed) * 60) + (uniqueStops.length * 10);

      const res = await run('INSERT INTO rf_trains (train_number, train_type, origin_station_id, destination_station_id, distance_km, duration_minutes, stop_count) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [number, type, origin.station_id, dest.station_id, distance, duration, uniqueStops.length]);
      const trainId = res.lastID;
      trains.push({ trainId, uniqueStops, duration });

      let currentMinutes = rng.range(360, 1200);
      for (let idx = 0; idx < uniqueStops.length; idx++) {
        const stop = uniqueStops[idx];
        const isFirst = idx === 0;
        const isLast = idx === uniqueStops.length - 1;
        
        const travelTime = isFirst ? 0 : rng.range(30, 120);
        currentMinutes += travelTime;
        
        const arrTime = isFirst ? '-' : formatTime(currentMinutes);
        const stopMin = (isFirst || isLast) ? 0 : rng.range(3, 15);
        if (!isFirst && !isLast) currentMinutes += stopMin;
        const depTime = isLast ? '-' : formatTime(currentMinutes);

        await run('INSERT INTO rf_timetables (train_id, station_id, arrival_time, departure_time, stop_minutes, stop_order) VALUES (?, ?, ?, ?, ?, ?)',
          [trainId, stop.station_id, arrTime, depTime, stopMin, idx + 1]);
      }

      const basePrice = distance * (type === 'G' ? 0.5 : 0.3);
      for (const seat of ['商务座', '一等座', '二等座', '软卧', '硬卧', '硬座', '无座']) {
        if (type === 'G' && ['软卧', '硬卧', '硬座'].includes(seat)) continue;
        if (type !== 'G' && ['商务座', '一等座'].includes(seat)) continue;
        
        let multiplier = 1;
        if (seat === '商务座') multiplier = 3.0;
        if (seat === '一等座') multiplier = 1.6;
        if (seat === '软卧') multiplier = 1.5;
        
        await run('INSERT INTO rf_fares (train_id, seat_type, base_price) VALUES (?, ?, ?)',
          [trainId, seat, basePrice * multiplier]);
      }
    }
    await exec('COMMIT');
  } catch (err) {
    await exec('ROLLBACK');
    throw err;
  }

  console.log(`Generated ${trains.length} base train routes.`);
  
  console.log('Generating inventory...');
  await exec('BEGIN TRANSACTION');
  try {
    for (let d = 0; d < DAYS_TO_GENERATE; d++) {
      const date = new Date(START_DATE);
      date.setDate(START_DATE.getDate() + d);
      const dateStr = formatDate(date);

      for (const t of trains) {
        const origin = t.uniqueStops[0];
        const dest = t.uniqueStops[t.uniqueStops.length - 1];
        
        await run('INSERT INTO rf_inventories (train_id, travel_date, from_station_id, to_station_id, business_remaining, first_remaining, second_remaining, soft_sleeper_remaining, hard_sleeper_remaining, hard_seat_remaining, no_seat_remaining) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [t.trainId, dateStr, origin.station_id, dest.station_id,
          rng.range(0, 20), rng.range(0, 50), rng.range(0, 200),
          rng.range(0, 30), rng.range(0, 50), rng.range(0, 100), rng.range(0, 100)]);

        if (t.uniqueStops.length > 2) {
             const mid = t.uniqueStops[1];
             await run('INSERT INTO rf_inventories (train_id, travel_date, from_station_id, to_station_id, business_remaining, first_remaining, second_remaining, soft_sleeper_remaining, hard_sleeper_remaining, hard_seat_remaining, no_seat_remaining) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [t.trainId, dateStr, origin.station_id, mid.station_id,
                rng.range(0, 10), rng.range(0, 20), rng.range(0, 100),
                0, 0, 0, 0]);
        }
      }
    }
    await exec('COMMIT');
  } catch (err) {
    await exec('ROLLBACK');
    throw err;
  }
  
  console.log(`Generated inventory for ${DAYS_TO_GENERATE} days.`);
}

(async () => {
  try {
    await initSchema();
    const stations = await generateGeoData();
    await generateRoutes(stations);
    await ensureShanghaiSuzhouCoverage(stations);
    await exec('ANALYZE; PRAGMA optimize; VACUUM;');
    console.log('Data expansion complete.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    db.close();
  }
})();
