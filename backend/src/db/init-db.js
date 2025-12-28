const sqlite3 = require('sqlite3').verbose();
const path = require('path');
// Use the same path as personal_database.js
const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../../data/12306.db');
const db = new sqlite3.Database(dbPath);

const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};

const insertStation = (id, name, pinyin, city, city_pinyin, province, code, type = 'rail', district = '', aliases = '', is_hot = 0, is_hub = 0, status = 'active') => {
  const abbr = (s) => (String(s || '')
    .replace(/(sh|ch|zh)/g, (m) => m[0])
    .match(/[a-zA-Z]/g) || [])
    .join('')
    .toLowerCase();
  const pinyin_abbr = abbr(pinyin);
  const city_pinyin_abbr = abbr(city_pinyin);
  const query = "INSERT INTO stations (id, name, pinyin, pinyin_abbr, city, city_pinyin, city_pinyin_abbr, province, code, type, district, aliases, is_hot, is_hub, status) SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM stations WHERE id = ?)";
  return runQuery(query, [id, name, pinyin, pinyin_abbr, city, city_pinyin, city_pinyin_abbr, province, code, type, district, aliases, is_hot, is_hub, status, id]);
};

const insertTrain = (id, trainNumber, fromStation, toStation, date, isHighSpeed) => {
  const query = "INSERT INTO trains (id, trainNumber, fromStation, toStation, date, isHighSpeed) SELECT ?, ?, ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM trains WHERE id = ?)";
  return runQuery(query, [id, trainNumber, fromStation, toStation, date, isHighSpeed, id]);
};

const initDb = async () => {
  try {
    // Check if columns exist, if not drop table to recreate (simplest for dev)
    // Or just try to create with new schema. 
    // For safety in this environment, I'll DROP TABLE IF EXISTS stations first to ensure schema matches
    
    await runQuery("DROP TABLE IF EXISTS stations");
    await runQuery(`
      CREATE TABLE IF NOT EXISTS stations (
        id INT PRIMARY KEY,
        name TEXT,
        pinyin TEXT,
        pinyin_abbr TEXT,
        city TEXT,
        city_pinyin TEXT,
        city_pinyin_abbr TEXT,
        province TEXT,
        code TEXT,
        type TEXT,
        district TEXT,
        aliases TEXT,
        is_hot INTEGER,
        is_hub INTEGER,
        status TEXT,
        closest_station_id INT
      )
    `);

    // --- 北京 (Beijing) ---
    await insertStation(1, '北京南', 'beijingnan', '北京', 'beijing', '北京', 'VNP', 'highspeed', '丰台区', '', 1, 1, 'active');
    await insertStation(3, '北京', 'beijing', '北京', 'beijing', '北京', 'BJP', 'normal', '东城区', '', 1, 1, 'active');
    await insertStation(4, '北京西', 'beijingxi', '北京', 'beijing', '北京', 'BXP', 'normal', '石景山区', '', 0, 1, 'active');
    await insertStation(5, '北京东', 'beijingdong', '北京', 'beijing', '北京', 'BOP', 'normal', '朝阳区', '', 0, 0, 'active');
    await insertStation(8, '北京北', 'beijingbei', '北京', 'beijing', '北京', 'VAP', 'normal', '海淀区', '', 0, 0, 'active');

    // --- 上海 (Shanghai) ---
    await insertStation(2, '上海虹桥', 'shanghaihongqiao', '上海', 'shanghai', '上海', 'AOH', 'highspeed', '闵行区', '', 1, 1, 'active');
    await insertStation(6, '上海南', 'shanghainan', '上海', 'shanghai', '上海', 'SNH', 'normal', '徐汇区', '', 0, 0, 'active');
    await insertStation(9, '上海', 'shanghai', '上海', 'shanghai', '上海', 'SHH', 'normal', '静安区', '', 1, 1, 'active');
    await insertStation(10, '上海西', 'shanghaixi', '上海', 'shanghai', '上海', 'SXH', 'normal', '普陀区', '', 0, 0, 'retired');

    // --- 广东 (Guangdong) ---
    await insertStation(11, '广州南', 'guangzhounan', '广州', 'guangzhou', '广东', 'IZQ', 'highspeed', '番禺区', '', 1, 1, 'active');
    await insertStation(12, '广州', 'guangzhou', '广州', 'guangzhou', '广东', 'GZQ', 'normal', '越秀区', '', 1, 1, 'active');
    await insertStation(13, '广州东', 'guangzhoudong', '广州', 'guangzhou', '广东', 'GGQ', 'normal', '天河区', '', 0, 1, 'active');
    await insertStation(14, '深圳北', 'shenzhenbei', '深圳', 'shenzhen', '广东', 'IOQ', 'highspeed', '龙华区', '', 1, 1, 'active');
    await insertStation(15, '深圳', 'shenzhen', '深圳', 'shenzhen', '广东', 'SZQ', 'normal', '罗湖区', '', 1, 1, 'active');

    // --- 浙江 (Zhejiang) ---
    await insertStation(7, '平阳', 'pingyang', '温州', 'wenzhou', '浙江', 'ARH', 'normal', '平阳县', '', 0, 0, 'active');
    await insertStation(16, '杭州东', 'hangzhoudong', '杭州', 'hangzhou', '浙江', 'HGH', 'highspeed', '江干区', '', 1, 1, 'active');
    await insertStation(17, '杭州', 'hangzhou', '杭州', 'hangzhou', '浙江', 'HZH', 'normal', '上城区', '', 1, 1, 'active');
    await insertStation(18, '宁波', 'ningbo', '宁波', 'ningbo', '浙江', 'NGH', 'normal', '海曙区', '', 0, 1, 'active');
    await insertStation(19, '温州南', 'wenzhounan', '温州', 'wenzhou', '浙江', 'VRH', 'highspeed', '龙湾区', '', 0, 0, 'active');

    // --- 江苏 (Jiangsu) ---
    await insertStation(20, '南京南', 'nanjingnan', '南京', 'nanjing', '江苏', 'NKH', 'highspeed', '雨花台区', '', 1, 1, 'active');
    await insertStation(21, '南京', 'nanjing', '南京', 'nanjing', '江苏', 'NJH', 'normal', '玄武区', '', 1, 1, 'active');
    await insertStation(22, '苏州', 'suzhou', '苏州', 'suzhou', '江苏', 'SZH', 'normal', '姑苏区', '', 1, 1, 'active');
    await insertStation(23, '苏州北', 'suzhoubei', '苏州', 'suzhou', '江苏', 'OHH', 'highspeed', '相城区', '', 0, 1, 'active');

    // --- 四川 (Sichuan) ---
    await insertStation(24, '成都东', 'chengdudong', '成都', 'chengdu', '四川', 'ICW', 'highspeed', '成华区', '', 1, 1, 'active');
    await insertStation(25, '成都', 'chengdu', '成都', 'chengdu', '四川', 'CDW', 'normal', '青羊区', '', 1, 1, 'active');

    // --- 湖北 (Hubei) ---
    await insertStation(26, '武汉', 'wuhan', '武汉', 'wuhan', '湖北', 'WHN', 'normal', '武昌区', '', 1, 1, 'active');
    await insertStation(27, '汉口', 'hankou', '武汉', 'wuhan', '湖北', 'HKN', 'normal', '江汉区', '', 0, 1, 'active');

    // --- 陕西 (Shaanxi) ---
    await insertStation(28, '西安北', 'xianbei', '西安', 'xian', '陕西', 'EAY', 'highspeed', '未央区', '', 1, 1, 'active');
    await insertStation(29, '西安', 'xian', '西安', 'xian', '陕西', 'XAY', 'normal', '碑林区', '', 1, 1, 'active');

    // --- 河南 (Henan) - NEW ---
    await insertStation(30, '郑州东', 'zhengzhoudong', '郑州', 'zhengzhou', '河南', 'ZAF', 'highspeed', '管城回族区', '', 1, 1, 'active');
    await insertStation(31, '郑州', 'zhengzhou', '郑州', 'zhengzhou', '河南', 'ZZF', 'normal', '二七区', '', 1, 1, 'active');
    
    // --- 福建 (Fujian) - NEW ---
    await insertStation(32, '厦门', 'xiamen', '厦门', 'xiamen', '福建', 'XMS', 'normal', '思明区', '', 1, 1, 'active');
    await insertStation(33, '厦门北', 'xiamenbei', '厦门', 'xiamen', '福建', 'XKS', 'highspeed', '集美区', '', 0, 1, 'active');
    await insertStation(34, '福州', 'fuzhou', '福州', 'fuzhou', '福建', 'FZS', 'normal', '鼓楼区', '榕城', 1, 1, 'active');
    await insertStation(35, '福州南', 'fuzhounan', '福州', 'fuzhou', '福建', 'FYS', 'highspeed', '仓山区', '', 0, 0, 'active');

    await insertStation(36, '福州汽车北站', 'fuzhouqichebeizhan', '福州', 'fuzhou', '福建', 'FZB', 'bus', '晋安区', '', 0, 0, 'active');
    await insertStation(37, '福州地铁达道站', 'fuzhouditiedadaozhan', '福州', 'fuzhou', '福建', 'FZD', 'metro', '台江区', '', 0, 0, 'active');
    await insertStation(38, '莆田汽车站', 'putianqichezhan', '莆田', 'putian', '福建', 'PTB', 'bus', '城厢区', '', 0, 0, 'active');
    await runQuery("UPDATE stations SET closest_station_id = ? WHERE id = ?", [35, 38]);

    // Initialize Trains and Tickets
    await initTrainsAndTickets();
    
    console.log('Database initialized with stations, trains, and tickets.');
  } catch (err) {
    console.error('Database initialization failed:', err.message);
  } finally {
    db.close();
  }
};

const initTrainsAndTickets = async () => {
  await runQuery("DROP TABLE IF EXISTS tickets");
  await runQuery("DROP TABLE IF EXISTS trains_new"); // avoid conflict with legacy 'trains' table if schema differs? 
  // actually let's just use 'trains' but make sure it has the columns we need.
  // The legacy 'trains' table had: id, trainNumber, fromStation, toStation, date, isHighSpeed
  // We want to move to a normalized schema.
  // Let's drop the old 'trains' table and recreate it with new schema.
  await runQuery("DROP TABLE IF EXISTS trains");
  
  await runQuery(`
    CREATE TABLE trains (
      id INTEGER PRIMARY KEY,
      train_number TEXT NOT NULL,
      train_type TEXT,
      start_station_id INTEGER,
      end_station_id INTEGER
    )
  `);

  await runQuery(`
    CREATE TABLE tickets (
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
    )
  `);

  // Generate mock trains and tickets for existing stations
  // We have stations 1,2 (Beijing Nan, Shanghai Hongqiao), 3,9 (Beijing, Shanghai), etc.
  const routes = [
    { from: 1, to: 2, prefix: 'G', startNum: 101, count: 20, basePrice: 553, durationBase: 270 }, // Beijing Nan -> Shanghai Hongqiao (Highspeed)
    { from: 2, to: 1, prefix: 'G', startNum: 102, count: 20, basePrice: 553, durationBase: 270 }, // Shanghai Hongqiao -> Beijing Nan
    { from: 3, to: 9, prefix: 'T', startNum: 109, count: 5, basePrice: 177, durationBase: 900 },  // Beijing -> Shanghai (Normal)
    { from: 9, to: 3, prefix: 'T', startNum: 110, count: 5, basePrice: 177, durationBase: 900 },
    { from: 20, to: 2, prefix: 'G', startNum: 7001, count: 10, basePrice: 135, durationBase: 60 }, // Nanjing Nan -> Shanghai Hongqiao
    { from: 2, to: 20, prefix: 'G', startNum: 7002, count: 10, basePrice: 135, durationBase: 60 },
    { from: 11, to: 14, prefix: 'G', startNum: 6001, count: 15, basePrice: 74, durationBase: 30 }, // Guangzhou Nan -> Shenzhen Bei
    { from: 14, to: 11, prefix: 'G', startNum: 6002, count: 15, basePrice: 74, durationBase: 30 },
    { from: 16, to: 2, prefix: 'G', startNum: 7501, count: 10, basePrice: 73, durationBase: 45 }, // Hangzhou Dong -> Shanghai Hongqiao
    { from: 2, to: 16, prefix: 'G', startNum: 7502, count: 10, basePrice: 73, durationBase: 45 }
  ];

  let trainId = 1;
  let ticketId = 1;

  for (const route of routes) {
    for (let i = 0; i < route.count; i++) {
      const trainNum = `${route.prefix}${route.startNum + i * 2}`; // G101, G103...
      
      // Insert Train
      await runQuery(`INSERT INTO trains (id, train_number, train_type, start_station_id, end_station_id) VALUES (?, ?, ?, ?, ?)`, 
        [trainId, trainNum, route.prefix, route.from, route.to]);

      // Generate times
      const startHour = 6 + Math.floor(i * (16 / route.count)); // Spread between 6am and 10pm
      const startMin = Math.floor(Math.random() * 60);
      const durMin = route.durationBase + Math.floor(Math.random() * 20 - 10);
      const endTotal = startHour * 60 + startMin + durMin;
      const endHour = Math.floor(endTotal / 60) % 24;
      const endMin = endTotal % 60;

      const depTime = `${String(startHour).padStart(2,'0')}:${String(startMin).padStart(2,'0')}`;
      const arrTime = `${String(endHour).padStart(2,'0')}:${String(endMin).padStart(2,'0')}`;
      const duration = `${Math.floor(durMin/60)}h${durMin%60}m`;

      // Insert Ticket (Snapshot)
      const isG = route.prefix === 'G' || route.prefix === 'D';
      await runQuery(`INSERT INTO tickets (
        id, train_id, from_station_id, to_station_id, departure_time, arrival_time, duration,
        swz_num, swz_price, yd_num, yd_price, ed_num, ed_price,
        rw_num, rw_price, yw_num, yw_price, yz_num, yz_price, wz_num, wz_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        ticketId, trainId, route.from, route.to, depTime, arrTime, duration,
        isG ? 10 : 0, isG ? route.basePrice * 3 : 0,
        isG ? 50 : 0, isG ? Math.floor(route.basePrice * 1.6) : 0,
        isG ? 200 : 0, route.basePrice,
        !isG ? 20 : 0, !isG ? Math.floor(route.basePrice * 1.5) : 0,
        !isG ? 100 : 0, !isG ? Math.floor(route.basePrice * 1.2) : 0,
        !isG ? 200 : 0, !isG ? route.basePrice : 0,
        50, route.basePrice
      ]);

      trainId++;
      ticketId++;
    }
  }
};

initDb();
