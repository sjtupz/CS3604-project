import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

// Define paths
const dbPath = path.resolve(__dirname, '../data/database.sqlite');
const seedPath = path.resolve(__dirname, '../seed_tickets.sql');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize a new database connection
// The file will be created if it doesn't exist
const db = new Database(dbPath, { verbose: console.log });

// Read the entire seed SQL file
const seedSql = fs.readFileSync(seedPath, 'utf-8');

// Execute the entire SQL script in one go.
// This is simpler and more robust than parsing each line.
// It handles table creation and all insertions.
db.exec(seedSql);

console.log('Database setup complete. Table created and data seeded.');

// --- Append dynamic data for dates from today onward ---
// This ensures that every day from today has multiple trains available,
// covering G/D/K/Z types and common seat types to support frontend filters.
function pad2(n: number) { return n.toString().padStart(2, '0'); }
function fmtDate(d: Date) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function fmtTime(h: number, m: number) { return `${pad2(h)}:${pad2(m)}`; }

type TrainTemplate = { type: 'G'|'D'|'K'|'Z'; baseHour: number; count: number };
const templates: TrainTemplate[] = [
  { type: 'G', baseHour: 7, count: 4 },
  { type: 'D', baseHour: 9, count: 3 },
  { type: 'K', baseHour: 12, count: 2 },
  { type: 'Z', baseHour: 20, count: 1 },
];

const insert = db.prepare(
  `INSERT INTO temp_ticket_data (train_no, train_type, from_station, to_station, departure_date, departure_time, arrival_time, duration, seats_info)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
);
const insertMany = db.transaction((rows: any[]) => {
  rows.forEach(r => insert.run(r.train_no, r.train_type, r.from_station, r.to_station, r.departure_date, r.departure_time, r.arrival_time, r.duration, r.seats_info));
});

function makeSeatsJSON(trainType: string, idx: number) {
  // Create a mix of seat stocks to produce '-', numeric, and '有' statuses
  const seats: Array<{ type: string; stock: number; price: number|null }> = [];
  if (trainType === 'G' || trainType === 'D') {
    seats.push({ type: '一等座', stock: (idx % 3 === 0) ? 0 : 80 + (idx % 5) * 10, price: 900 + (idx % 7) * 30 });
    seats.push({ type: '二等座', stock: (idx % 4 === 0) ? 12 : 200 + (idx % 6) * 20, price: 600 + (idx % 9) * 25 });
    seats.push({ type: '硬卧', stock: (idx % 5 === 0) ? 5 : 60 + (idx % 8) * 5, price: 800 + (idx % 5) * 40 });
    seats.push({ type: '无座', stock: 0, price: null });
  } else {
    seats.push({ type: '硬座', stock: (idx % 3 === 1) ? 0 : 300 + (idx % 5) * 15, price: 200 + (idx % 7) * 10 });
    seats.push({ type: '软卧', stock: (idx % 4 === 2) ? 8 : 40 + (idx % 6) * 6, price: 500 + (idx % 9) * 20 });
    seats.push({ type: '硬卧', stock: (idx % 5 === 3) ? 0 : 70 + (idx % 8) * 4, price: 400 + (idx % 5) * 15 });
    seats.push({ type: '无座', stock: 0, price: null });
  }
  return JSON.stringify(seats);
}

// Generate data for the next 30 days starting today
const today = new Date();
today.setHours(0, 0, 0, 0);
const daysToGenerate = 30;
const rows: any[] = [];
for (let d = 0; d < daysToGenerate; d++) {
  const date = new Date(today.getTime());
  date.setDate(today.getDate() + d);
  const dateStr = fmtDate(date);

  let idx = 0;
  for (const t of templates) {
    for (let i = 0; i < t.count; i++) {
      const depHour = (t.baseHour + i * 2) % 24;
      const depMin = (i * 7 + d * 3) % 60;
      const depStr = fmtTime(depHour, depMin);

      // Duration between 4–8 hours for G/D, 8–14 hours for K/Z
      const isFast = (t.type === 'G' || t.type === 'D');
      const durHours = isFast ? (4 + (i % 5)) : (8 + (i % 7));
      const durMins = (i * 13 + d * 5) % 60;
      const arrTotalMin = depHour * 60 + depMin + durHours * 60 + durMins;
      const arrHour = Math.floor(arrTotalMin / 60) % 24;
      const arrMin = arrTotalMin % 60;
      const arrStr = fmtTime(arrHour, arrMin);
      const durStr = `${durHours}小时${durMins}分钟`;

      const trainNo = `${t.type}${600 + d * 10 + i}`;
      const seatsJSON = makeSeatsJSON(t.type, idx++);

      rows.push({
        train_no: trainNo,
        train_type: t.type,
        from_station: '北京',
        to_station: '上海',
        departure_date: dateStr,
        departure_time: depStr,
        arrival_time: arrStr,
        duration: durStr,
        seats_info: seatsJSON,
      });
    }
  }
}

insertMany(rows);
console.log(`Appended ${rows.length} rows for dates from ${fmtDate(today)} to ${fmtDate(new Date(today.getTime() + (daysToGenerate-1)*24*60*60*1000))}.`);

// --- Additional multi-city routes for nationwide coverage ---
const extraRoutes: Array<[string,string]> = [
  ['广州','深圳'],
  ['南京','杭州'],
  ['天津','北京'],
  ['成都','重庆'],
  ['武汉','长沙'],
  ['西安','郑州'],
  ['福州','厦门'],
  ['苏州','上海'],
  ['宁波','杭州'],
  ['青岛','济南'],
  ['沈阳','大连'],
  ['南昌','合肥'],
  ['南宁','桂林'],
  ['贵阳','昆明'],
  ['太原','石家庄'],
  ['哈尔滨','长春'],
  ['呼和浩特','包头'],
  ['兰州','西宁'],
  ['银川','西安'],
  ['乌鲁木齐','兰州']
];

function generateRouteRows(from: string, to: string) {
  const rr: any[] = [];
  let idx = 0;
  for (let d = 0; d < daysToGenerate; d++) {
    const date = new Date(today.getTime());
    date.setDate(today.getDate() + d);
    const dateStr = fmtDate(date);
    for (const t of templates) {
      for (let i = 0; i < t.count; i++) {
        const depHour = (t.baseHour + i * 2) % 24;
        const depMin = (i * 7 + d * 3) % 60;
        const depStr = fmtTime(depHour, depMin);
        const isFast = (t.type === 'G' || t.type === 'D');
        const durHours = isFast ? (3 + (i % 6)) : (7 + (i % 7));
        const durMins = (i * 11 + d * 4) % 60;
        const arrTotalMin = depHour * 60 + depMin + durHours * 60 + durMins;
        const arrHour = Math.floor(arrTotalMin / 60) % 24;
        const arrMin = arrTotalMin % 60;
        const arrStr = fmtTime(arrHour, arrMin);
        const durStr = `${durHours}小时${durMins}分钟`;
        const trainNo = `${t.type}${700 + d * 10 + i}`;
        const seatsJSON = makeSeatsJSON(t.type, idx++);
        rr.push({
          train_no: trainNo,
          train_type: t.type,
          from_station: from,
          to_station: to,
          departure_date: dateStr,
          departure_time: depStr,
          arrival_time: arrStr,
          duration: durStr,
          seats_info: seatsJSON,
        });
      }
    }
  }
  return rr;
}

let extraAdded = 0;
for (const [from, to] of extraRoutes) {
  const fwd = generateRouteRows(from, to);
  const bwd = generateRouteRows(to, from);
  insertMany(fwd);
  insertMany(bwd);
  extraAdded += fwd.length + bwd.length;
}
console.log(`Appended additional ${extraAdded} rows for ${extraRoutes.length} bi-directional routes.`);

// Verification samples
const v1 = db.prepare("SELECT COUNT(*) AS c FROM temp_ticket_data WHERE from_station = ? AND to_station = ? AND departure_date = ?").get('广州','深圳', fmtDate(today)) as any;
const v2 = db.prepare("SELECT COUNT(*) AS c FROM temp_ticket_data WHERE from_station = ? AND to_station = ? AND departure_date = ?").get('成都','重庆', fmtDate(today)) as any;
console.log(`Verify 广州→深圳 today count: ${v1.c}, 成都→重庆 today count: ${v2.c}`);

// Cities
db.exec(`
DROP TABLE IF EXISTS cities;
CREATE TABLE cities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  standard_name TEXT NOT NULL,
  pinyin TEXT,
  pinyin_initials TEXT,
  admin_code TEXT,
  area_code TEXT,
  postal_code TEXT,
  lat REAL,
  lng REAL,
  is_hot INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0
);
CREATE INDEX idx_cities_name ON cities(standard_name);
CREATE INDEX idx_cities_pinyin ON cities(pinyin);
CREATE INDEX idx_cities_initials ON cities(pinyin_initials);
CREATE INDEX idx_cities_codes ON cities(admin_code, area_code, postal_code);
CREATE INDEX idx_cities_rank_hot ON cities(rank, is_hot);
`);

type City = { name: string; pinyin: string; initials: string; admin: string; area: string; postal: string; lat: number; lng: number; hot?: boolean; rank?: number };
const base: City[] = [
  { name: '北京', pinyin: 'beijing', initials: 'bj', admin: '110000', area: '010', postal: '100000', lat: 39.9042, lng: 116.4074, hot: true, rank: 100 },
  { name: '上海', pinyin: 'shanghai', initials: 'sh', admin: '310000', area: '021', postal: '200000', lat: 31.2304, lng: 121.4737, hot: true, rank: 100 },
  { name: '广州', pinyin: 'guangzhou', initials: 'gz', admin: '440100', area: '020', postal: '510000', lat: 23.1291, lng: 113.2644, hot: true, rank: 95 },
  { name: '深圳', pinyin: 'shenzhen', initials: 'sz', admin: '440300', area: '0755', postal: '518000', lat: 22.5431, lng: 114.0579, hot: true, rank: 95 },
  { name: '天津', pinyin: 'tianjin', initials: 'tj', admin: '120000', area: '022', postal: '300000', lat: 39.3434, lng: 117.3616, hot: true, rank: 90 },
  { name: '重庆', pinyin: 'chongqing', initials: 'cq', admin: '500000', area: '023', postal: '400000', lat: 29.563, lng: 106.5516, hot: true, rank: 90 },
  { name: '杭州', pinyin: 'hangzhou', initials: 'hz', admin: '330100', area: '0571', postal: '310000', lat: 30.2741, lng: 120.1551, hot: true, rank: 88 },
  { name: '南京', pinyin: 'nanjing', initials: 'nj', admin: '320100', area: '025', postal: '210000', lat: 32.0603, lng: 118.7969, hot: true, rank: 85 },
  { name: '武汉', pinyin: 'wuhan', initials: 'wh', admin: '420100', area: '027', postal: '430000', lat: 30.5928, lng: 114.3055, hot: true, rank: 85 },
  { name: '成都', pinyin: 'chengdu', initials: 'cd', admin: '510100', area: '028', postal: '610000', lat: 30.5728, lng: 104.0668, hot: true, rank: 85 },
  { name: '西安', pinyin: 'xian', initials: 'xa', admin: '610100', area: '029', postal: '710000', lat: 34.3416, lng: 108.9398, hot: true, rank: 80 },
  { name: '沈阳', pinyin: 'shenyang', initials: 'sy', admin: '210100', area: '024', postal: '110000', lat: 41.8057, lng: 123.4328, hot: true, rank: 75 },
  { name: '大连', pinyin: 'dalian', initials: 'dl', admin: '210200', area: '0411', postal: '116000', lat: 38.914, lng: 121.6147, hot: true, rank: 75 },
  { name: '青岛', pinyin: 'qingdao', initials: 'qd', admin: '370200', area: '0532', postal: '266000', lat: 36.0671, lng: 120.3826, hot: true, rank: 75 },
  { name: '济南', pinyin: 'jinan', initials: 'jn', admin: '370100', area: '0531', postal: '250000', lat: 36.6512, lng: 117.1201, hot: true, rank: 70 },
  { name: '宁波', pinyin: 'ningbo', initials: 'nb', admin: '330200', area: '0574', postal: '315000', lat: 29.8683, lng: 121.544, hot: true, rank: 70 },
  { name: '厦门', pinyin: 'xiamen', initials: 'xm', admin: '350200', area: '0592', postal: '361000', lat: 24.4798, lng: 118.0894, hot: true, rank: 70 },
  { name: '福州', pinyin: 'fuzhou', initials: 'fz', admin: '350100', area: '0591', postal: '350000', lat: 26.0745, lng: 119.2965, hot: true, rank: 65 },
  { name: '合肥', pinyin: 'hefei', initials: 'hf', admin: '340100', area: '0551', postal: '230000', lat: 31.8206, lng: 117.2272, hot: true, rank: 65 },
  { name: '石家庄', pinyin: 'shijiazhuang', initials: 'sjz', admin: '130100', area: '0311', postal: '050000', lat: 38.0428, lng: 114.5149, hot: true, rank: 60 },
  { name: '郑州', pinyin: 'zhengzhou', initials: 'zz', admin: '410100', area: '0371', postal: '450000', lat: 34.7473, lng: 113.6249, hot: true, rank: 70 },
  { name: '长沙', pinyin: 'changsha', initials: 'cs', admin: '430100', area: '0731', postal: '410000', lat: 28.2282, lng: 112.9388, hot: true, rank: 65 },
  { name: '南昌', pinyin: 'nanchang', initials: 'nc', admin: '360100', area: '0791', postal: '330000', lat: 28.682, lng: 115.8579, hot: true, rank: 60 },
  { name: '昆明', pinyin: 'kunming', initials: 'km', admin: '530100', area: '0871', postal: '650000', lat: 25.0438, lng: 102.707, hot: true, rank: 60 },
  { name: '南宁', pinyin: 'nanning', initials: 'nn', admin: '450100', area: '0771', postal: '530000', lat: 22.817, lng: 108.3669, hot: true, rank: 55 },
  { name: '海口', pinyin: 'haikou', initials: 'hk', admin: '460100', area: '0898', postal: '570000', lat: 20.044, lng: 110.1999, hot: true, rank: 55 },
  { name: '贵阳', pinyin: 'guiyang', initials: 'gy', admin: '520100', area: '0851', postal: '550000', lat: 26.647, lng: 106.6302, hot: true, rank: 55 },
  { name: '太原', pinyin: 'taiyuan', initials: 'ty', admin: '140100', area: '0351', postal: '030000', lat: 37.8704, lng: 112.5489, hot: true, rank: 55 },
  { name: '呼和浩特', pinyin: 'huhehaote', initials: 'hhht', admin: '150100', area: '0471', postal: '010000', lat: 40.8424, lng: 111.749, hot: true, rank: 50 },
  { name: '兰州', pinyin: 'lanzhou', initials: 'lz', admin: '620100', area: '0931', postal: '730000', lat: 36.0611, lng: 103.8343, hot: true, rank: 50 },
  { name: '银川', pinyin: 'yinchuan', initials: 'yc', admin: '640100', area: '0951', postal: '750000', lat: 38.487, lng: 106.2309, hot: true, rank: 45 },
  { name: '西宁', pinyin: 'xining', initials: 'xn', admin: '630100', area: '0971', postal: '810000', lat: 36.6171, lng: 101.7778, hot: true, rank: 45 },
  { name: '拉萨', pinyin: 'lasa', initials: 'ls', admin: '540100', area: '0891', postal: '850000', lat: 29.6525, lng: 91.1721, hot: true, rank: 40 },
  { name: '乌鲁木齐', pinyin: 'wulumuqi', initials: 'wlmq', admin: '650100', area: '0991', postal: '830000', lat: 43.8254, lng: 87.6169, hot: true, rank: 55 },
  { name: '苏州', pinyin: 'suzhou', initials: 'sz', admin: '320500', area: '0512', postal: '215000', lat: 31.2989, lng: 120.5853, hot: true, rank: 70 },
  { name: '无锡', pinyin: 'wuxi', initials: 'wx', admin: '320200', area: '0510', postal: '214000', lat: 31.491, lng: 120.3119, hot: true, rank: 60 },
  { name: '常州', pinyin: 'changzhou', initials: 'cz', admin: '320400', area: '0519', postal: '213000', lat: 31.8123, lng: 119.968, hot: true, rank: 55 },
  { name: '佛山', pinyin: 'foshan', initials: 'fs', admin: '440600', area: '0757', postal: '528000', lat: 23.0215, lng: 113.1214, hot: true, rank: 60 },
  { name: '东莞', pinyin: 'dongguan', initials: 'dg', admin: '441900', area: '0769', postal: '523000', lat: 23.0205, lng: 113.7518, hot: true, rank: 60 },
  { name: '珠海', pinyin: 'zhuhai', initials: 'zh', admin: '440400', area: '0756', postal: '519000', lat: 22.2713, lng: 113.575, hot: true, rank: 55 },
  { name: '中山', pinyin: 'zhongshan', initials: 'zs', admin: '442000', area: '0760', postal: '528400', lat: 22.517, lng: 113.3926, hot: true, rank: 50 },
  { name: '惠州', pinyin: 'huizhou', initials: 'hz', admin: '441300', area: '0752', postal: '516000', lat: 23.1115, lng: 114.4158, hot: false, rank: 45 },
  { name: '江门', pinyin: 'jiangmen', initials: 'jm', admin: '440700', area: '0750', postal: '529000', lat: 22.5787, lng: 113.0819, hot: false, rank: 45 },
  { name: '泉州', pinyin: 'quanzhou', initials: 'qz', admin: '350500', area: '0595', postal: '362000', lat: 24.8741, lng: 118.6759, hot: false, rank: 45 },
  { name: '绍兴', pinyin: 'shaoxing', initials: 'sx', admin: '330600', area: '0575', postal: '312000', lat: 30.003, lng: 120.5832, hot: false, rank: 45 },
  { name: '嘉兴', pinyin: 'jiaxing', initials: 'jx', admin: '330400', area: '0573', postal: '314000', lat: 30.7539, lng: 120.7586, hot: false, rank: 45 },
  { name: '扬州', pinyin: 'yangzhou', initials: 'yz', admin: '321000', area: '0514', postal: '225000', lat: 32.3936, lng: 119.4127, hot: false, rank: 45 },
  { name: '泰州', pinyin: 'taizhou', initials: 'tz', admin: '321200', area: '0523', postal: '225300', lat: 32.4555, lng: 119.9255, hot: false, rank: 45 },
  { name: '金华', pinyin: 'jinhua', initials: 'jh', admin: '330700', area: '0579', postal: '321000', lat: 29.0791, lng: 119.6474, hot: false, rank: 45 },
  { name: '台州', pinyin: 'taizhou', initials: 'tz', admin: '331000', area: '0576', postal: '318000', lat: 28.661, lng: 121.4208, hot: false, rank: 45 },
  { name: '温州', pinyin: 'wenzhou', initials: 'wz', admin: '330300', area: '0577', postal: '325000', lat: 27.9938, lng: 120.6994, hot: false, rank: 50 },
  { name: '盐城', pinyin: 'yancheng', initials: 'yc', admin: '320900', area: '0515', postal: '224000', lat: 33.3474, lng: 120.163, hot: false, rank: 40 },
  { name: '徐州', pinyin: 'xuzhou', initials: 'xz', admin: '320300', area: '0516', postal: '221000', lat: 34.2044, lng: 117.284, hot: false, rank: 45 },
  { name: '淮安', pinyin: 'huaian', initials: 'ha', admin: '320800', area: '0517', postal: '223200', lat: 33.6101, lng: 119.015, hot: false, rank: 40 },
  { name: '宿迁', pinyin: 'suqian', initials: 'sq', admin: '321300', area: '0527', postal: '223800', lat: 33.961, lng: 118.276, hot: false, rank: 38 },
  { name: '洛阳', pinyin: 'luoyang', initials: 'ly', admin: '410300', area: '0379', postal: '471000', lat: 34.6574, lng: 112.454, hot: false, rank: 45 },
  { name: '开封', pinyin: 'kaifeng', initials: 'kf', admin: '410200', area: '0378', postal: '475000', lat: 34.797, lng: 114.307, hot: false, rank: 40 },
  { name: '襄阳', pinyin: 'xiangyang', initials: 'xy', admin: '420600', area: '0710', postal: '441000', lat: 32.0089, lng: 112.122, hot: false, rank: 40 },
  { name: '宜昌', pinyin: 'yichang', initials: 'yc', admin: '420500', area: '0717', postal: '443000', lat: 30.6922, lng: 111.286, hot: false, rank: 40 },
  { name: '芜湖', pinyin: 'wuhu', initials: 'wh', admin: '340200', area: '0553', postal: '241000', lat: 31.3525, lng: 118.433, hot: false, rank: 40 },
  { name: '马鞍山', pinyin: 'maanshan', initials: 'mas', admin: '340500', area: '0555', postal: '243000', lat: 31.6705, lng: 118.506, hot: false, rank: 35 },
  { name: '包头', pinyin: 'baotou', initials: 'bt', admin: '150200', area: '0472', postal: '014000', lat: 40.6574, lng: 109.843, hot: false, rank: 40 },
  { name: '鞍山', pinyin: 'anshan', initials: 'as', admin: '210300', area: '0412', postal: '114000', lat: 41.1085, lng: 122.994, hot: false, rank: 35 },
  { name: '抚顺', pinyin: 'fushun', initials: 'fs', admin: '210400', area: '0413', postal: '113000', lat: 41.88, lng: 123.957, hot: false, rank: 35 },
  { name: '吉林', pinyin: 'jilin', initials: 'jl', admin: '220200', area: '0432', postal: '132000', lat: 43.8378, lng: 126.549, hot: false, rank: 40 },
  { name: '长春', pinyin: 'changchun', initials: 'cc', admin: '220100', area: '0431', postal: '130000', lat: 43.8171, lng: 125.323, hot: false, rank: 45 },
  { name: '牡丹江', pinyin: 'mudanjiang', initials: 'mdj', admin: '231000', area: '0453', postal: '157000', lat: 44.586, lng: 129.599, hot: false, rank: 30 },
  { name: '哈尔滨', pinyin: 'haerbin', initials: 'heb', admin: '230100', area: '0451', postal: '150000', lat: 45.8038, lng: 126.535, hot: false, rank: 50 },
  { name: '大庆', pinyin: 'daqing', initials: 'dq', admin: '230600', area: '0459', postal: '163000', lat: 46.587, lng: 125.112, hot: false, rank: 35 }
];

const provinces = [
  { name: '河北', cities: ['唐山','秦皇岛','邯郸','邢台','保定','张家口','承德','沧州','廊坊','衡水'] },
  { name: '山西', cities: ['大同','阳泉','长治','晋城','朔州','晋中','运城','忻州','临汾','吕梁'] },
  { name: '内蒙古', cities: ['赤峰','通辽','鄂尔多斯','呼伦贝尔','巴彦淖尔','乌兰察布','兴安盟','锡林郭勒盟','阿拉善盟'] },
  { name: '辽宁', cities: ['锦州','营口','盘锦','本溪','丹东','辽阳','铁岭','朝阳','葫芦岛'] },
  { name: '吉林', cities: ['四平','辽源','松原','白城','延边州','白山'] },
  { name: '黑龙江', cities: ['齐齐哈尔','鸡西','鹤岗','双鸭山','伊春','七台河','佳木斯','黑河','绥化','大兴安岭'] },
  { name: '江苏', cities: ['苏州','无锡','常州','镇江','南通','泰州','扬州','盐城','徐州','连云港','宿迁','淮安'] },
  { name: '浙江', cities: ['宁波','温州','嘉兴','湖州','绍兴','金华','衢州','舟山','台州','丽水'] },
  { name: '安徽', cities: ['芜湖','蚌埠','淮南','马鞍山','淮北','铜陵','安庆','黄山','滁州','阜阳','宿州','六安','亳州','池州','宣城'] },
  { name: '福建', cities: ['厦门','莆田','三明','泉州','漳州','南平','龙岩','宁德'] },
  { name: '江西', cities: ['景德镇','萍乡','九江','新余','鹰潭','赣州','吉安','宜春','抚州','上饶'] },
  { name: '山东', cities: ['青岛','淄博','枣庄','东营','烟台','潍坊','济宁','泰安','威海','日照','滨州','德州','聊城','临沂','菏泽'] },
  { name: '河南', cities: ['开封','洛阳','平顶山','安阳','鹤壁','新乡','焦作','濮阳','许昌','漯河','三门峡','南阳','商丘','信阳','周口','驻马店'] },
  { name: '湖北', cities: ['黄石','十堰','宜昌','襄阳','鄂州','荆门','孝感','荆州','黄冈','咸宁','随州','恩施州','仙桃','潜江','天门'] },
  { name: '湖南', cities: ['株洲','湘潭','衡阳','邵阳','岳阳','张家界','益阳','郴州','永州','怀化','娄底','湘西州'] },
  { name: '广东', cities: ['广州','深圳','珠海','汕头','佛山','韶关','湛江','肇庆','江门','茂名','惠州','梅州','汕尾','河源','阳江','清远','东莞','中山','潮州','揭阳','云浮'] },
  { name: '广西', cities: ['南宁','柳州','桂林','梧州','北海','防城港','钦州','贵港','玉林','百色','贺州','河池','来宾','崇左'] },
  { name: '海南', cities: ['海口','三亚','三沙','儋州'] },
  { name: '四川', cities: ['成都','自贡','攀枝花','泸州','德阳','绵阳','广元','遂宁','内江','乐山','南充','眉山','宜宾','广安','达州','雅安','巴中','资阳','阿坝州','甘孜州','凉山州'] },
  { name: '贵州', cities: ['贵阳','六盘水','遵义','安顺','毕节','铜仁','黔西南州','黔东南州','黔南州'] },
  { name: '云南', cities: ['昆明','曲靖','玉溪','保山','昭通','丽江','普洱','临沧','楚雄州','红河州','文山州','西双版纳州','大理州','德宏州','怒江州','迪庆州'] },
  { name: '西藏', cities: ['拉萨','日喀则','昌都','林芝','山南','那曲','阿里'] },
  { name: '陕西', cities: ['西安','铜川','宝鸡','咸阳','渭南','延安','汉中','榆林','安康','商洛'] },
  { name: '甘肃', cities: ['兰州','嘉峪关','金昌','白银','天水','武威','张掖','平凉','酒泉','庆阳','定西','陇南','临夏州','甘南州'] },
  { name: '宁夏', cities: ['银川','石嘴山','吴忠','固原','中卫'] },
  { name: '青海', cities: ['西宁','海东','海北州','黄南州','海南州','果洛州','玉树州','海西州'] },
  { name: '新疆', cities: ['乌鲁木齐','克拉玛依','吐鲁番','哈密','昌吉州','博尔塔拉州','巴音郭楞州','阿克苏','克孜勒苏州','喀什','和田','伊犁州','塔城','阿勒泰','石河子','阿拉尔','图木舒克','五家渠'] }
];

const cityStmt = db.prepare(`INSERT INTO cities (standard_name, pinyin, pinyin_initials, admin_code, area_code, postal_code, lat, lng, is_hot, rank) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
const cityTx = db.transaction((list: City[]) => {
  for (const c of list) {
    cityStmt.run(c.name, c.pinyin, c.initials, c.admin, c.area, c.postal, c.lat, c.lng, c.hot ? 1 : 0, c.rank || 0);
  }
});
cityTx(base);

let genCount = base.length;
for (const prov of provinces) {
  for (const cname of prov.cities) {
    const initials = cname === '重庆' ? 'cq' : cname === '长沙' ? 'cs' : cname === '长春' ? 'cc' : cname === '珠海' ? 'zh' : cname === '中山' ? 'zs' : cname === '厦门' ? 'xm' : cname === '福州' ? 'fz' : cname === '苏州' ? 'sz' : cname === '无锡' ? 'wx' : cname === '东莞' ? 'dg' : cname === '佛山' ? 'fs' : cname === '宁波' ? 'nb' : cname === '青岛' ? 'qd' : cname === '济南' ? 'jn' : cname === '大连' ? 'dl' : cname === '沈阳' ? 'sy' : cname === '南宁' ? 'nn' : cname === '南昌' ? 'nc' : cname === '昆明' ? 'km' : cname === '合肥' ? 'hf' : cname === '郑州' ? 'zz' : cname === '西安' ? 'xa' : cname === '武汉' ? 'wh' : cname === '天津' ? 'tj' : cname === '北京' ? 'bj' : cname === '上海' ? 'sh' : cname.substring(0,1);
    const pinyin = initials;
    const admin = `${Math.floor(Math.random()*9)+1}${Math.floor(Math.random()*9)}${Math.floor(Math.random()*9)}${Math.floor(Math.random()*9)}00`;
    const area = `${Math.floor(Math.random()*9000)+1000}`;
    const postal = `${Math.floor(Math.random()*900000)+100000}`;
    const lat = 20 + Math.random()*25;
    const lng = 100 + Math.random()*25;
    const hot = ['北京','上海','广州','深圳'].includes(cname);
    const rank = hot ? 80 : 30 + Math.floor(Math.random()*40);
    cityStmt.run(cname, pinyin, initials, admin, area, postal, lat, lng, hot ? 1 : 0, rank);
    genCount++;
  }
}
console.log(`Seeded ${genCount} cities.`);

// Close the database connection
db.close();
console.log('Database connection closed.');