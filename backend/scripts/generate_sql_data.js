const fs = require('fs');
const path = require('path');

const CITY_MAP = {
  北京: { stations: ['北京', '北京南', '北京西', '北京丰台'] },
  上海: { stations: ['上海', '上海南', '上海虹桥', '上海松江'] },
  广州: { stations: ['广州', '广州南', '广州东'] },
  深圳: { stations: ['深圳', '深圳北', '罗湖'] },
  杭州: { stations: ['杭州', '杭州东', '杭州南'] },
  南京: { stations: ['南京', '南京南'] },
  苏州: { stations: ['苏州', '苏州北'] },
  济南: { stations: ['济南', '济南东', '济南西'] },
  福州: { stations: ['福州', '福州南'] },
  厦门: { stations: ['厦门', '厦门北'] },
  武汉: { stations: ['武汉', '汉口', '武昌'] },
  长沙: { stations: ['长沙', '长沙南'] },
  郑州: { stations: ['郑州', '郑州东'] },
  成都: { stations: ['成都', '成都东', '成都南'] },
  重庆: { stations: ['重庆', '重庆北', '重庆西'] },
  昆明: { stations: ['昆明', '昆明南'] },
  贵阳: { stations: ['贵阳', '贵阳北'] },
  西安: { stations: ['西安', '西安北'] },
  兰州: { stations: ['兰州', '兰州西'] },
  乌鲁木齐: { stations: ['乌鲁木齐', '乌鲁木齐南'] },
  沈阳: { stations: ['沈阳', '沈阳北'] },
  哈尔滨: { stations: ['哈尔滨', '哈尔滨西'] },
  长春: { stations: ['长春', '长春西'] },
  天津: { stations: ['天津', '天津西'] },
  石家庄: { stations: ['石家庄', '石家庄北'] },
  太原: { stations: ['太原', '太原南'] },
  合肥: { stations: ['合肥', '合肥南'] },
  宁波: { stations: ['宁波', '宁波东'] },
  南宁: { stations: ['南宁', '南宁东'] },
  海口: { stations: ['海口'] },
  青岛: { stations: ['青岛', '青岛北'] },
  大连: { stations: ['大连', '大连北'] },
  佛山: { stations: ['佛山', '佛山西'] },
};

const TRAIN_TYPES = ['G', 'D', 'K', 'Z'];

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }

function generateDate(start, days) {
  const date = new Date(start);
  date.setDate(date.getDate() + randInt(0, days - 1));
  return date.toISOString().split('T')[0];
}

function generateTime() {
  const h = randInt(6, 22);
  const m = randInt(0, 59);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function addTime(time, durationMinutes) {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + durationMinutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
}

function generateSeat() {
  const r = Math.random();
  if (r < 0.1) return 'NULL';
  if (r < 0.2) return "'候补'";
  if (r < 0.3) return "'有'";
  return `'${randInt(0, 20)}'`;
}

function escapeSql(str) {
  return `'${str}'`;
}

const stations = [];
Object.values(CITY_MAP).forEach(c => stations.push(...c.stations));

const startDate = new Date();
const records = [];

for (let i = 0; i < 250; i++) {
  // Pick two different cities
  const cities = Object.keys(CITY_MAP);
  const cityA = pick(cities);
  let cityB = pick(cities);
  while (cityB === cityA) cityB = pick(cities);

  const stationA = pick(CITY_MAP[cityA].stations);
  const stationB = pick(CITY_MAP[cityB].stations);

  const date = generateDate(startDate, 15);
  const type = pick(TRAIN_TYPES);
  const trainNo = `${type}${randInt(1, 9999)}`;
  const startTime = generateTime();
  const duration = randInt(60, 600); // minutes
  const endTime = addTime(startTime, duration);
  const durationStr = `${Math.floor(duration/60)}:${(duration%60).toString().padStart(2, '0')}`;

  // Outbound
  records.push({
    train_no: escapeSql(trainNo),
    train_type: escapeSql(type),
    start_station: escapeSql(stationA),
    end_station: escapeSql(stationB),
    start_time: escapeSql(startTime),
    end_time: escapeSql(endTime),
    duration: escapeSql(durationStr),
    date: escapeSql(date),
    swz_num: generateSeat(),
    yd_num: generateSeat(),
    ed_num: generateSeat(),
    rw_num: generateSeat(),
    yw_num: generateSeat(),
    yz_num: generateSeat(),
    wz_num: generateSeat()
  });

  // Return (create a matching return trip, maybe same day or later)
  const returnDate = generateDate(new Date(date), 3); // within 3 days after outbound
  const returnTrainNo = `${type}${randInt(1, 9999)}`;
  const returnStartTime = generateTime();
  const returnEndTime = addTime(returnStartTime, duration); // assume similar duration
  
  records.push({
    train_no: escapeSql(returnTrainNo),
    train_type: escapeSql(type),
    start_station: escapeSql(stationB),
    end_station: escapeSql(stationA),
    start_time: escapeSql(returnStartTime),
    end_time: escapeSql(returnEndTime),
    duration: escapeSql(durationStr),
    date: escapeSql(returnDate),
    swz_num: generateSeat(),
    yd_num: generateSeat(),
    ed_num: generateSeat(),
    rw_num: generateSeat(),
    yw_num: generateSeat(),
    yz_num: generateSeat(),
    wz_num: generateSeat()
  });
}

const sqlHeader = `
DROP TABLE IF EXISTS train_tickets;
CREATE TABLE train_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  train_no TEXT,
  train_type TEXT,
  start_station TEXT,
  end_station TEXT,
  start_time TEXT,
  end_time TEXT,
  duration TEXT,
  date TEXT,
  swz_num TEXT,
  yd_num TEXT,
  ed_num TEXT,
  rw_num TEXT,
  yw_num TEXT,
  yz_num TEXT,
  wz_num TEXT
);
`;

const sqlInserts = records.map(r => `
INSERT INTO train_tickets (
  train_no, train_type, start_station, end_station,
  start_time, end_time, duration, date,
  swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
) VALUES (
  ${r.train_no}, ${r.train_type}, ${r.start_station}, ${r.end_station},
  ${r.start_time}, ${r.end_time}, ${r.duration}, ${r.date},
  ${r.swz_num}, ${r.yd_num}, ${r.ed_num}, ${r.rw_num}, ${r.yw_num}, ${r.yz_num}, ${r.wz_num}
);
`).join('');

const outputDir = path.join(__dirname, '../sql');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'seed_double_mode.sql'), sqlHeader + sqlInserts);
console.log('SQL script generated at backend/sql/seed_double_mode.sql');
