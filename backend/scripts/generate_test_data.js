const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.resolve(__dirname, '../data/12306.db');
const db = new sqlite3.Database(DB_PATH);

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

const TRAIN_TYPES = ['G', 'D', 'Z', 'T', 'K'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function pad(num) {
  return num.toString().padStart(2, '0');
}

function generateTimeInSlot(slot) {
  // slot: 0 (0-6), 1 (6-12), 2 (12-18), 3 (18-24)
  const hour = getRandomInt(slot * 6, (slot + 1) * 6);
  const minute = getRandomInt(0, 60);
  return `${pad(hour)}:${pad(minute)}`;
}

function addTime(timeStr, durationMinutes) {
  const [h, m] = timeStr.split(':').map(Number);
  const totalMinutes = h * 60 + m + durationMinutes;
  const newH = Math.floor(totalMinutes / 60) % 24;
  const newM = totalMinutes % 60;
  return `${pad(newH)}:${pad(newM)}`;
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${pad(m)}`;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}`;
}

const generate = async () => {
  const today = new Date();
  const records = [];

  console.log('Generating test data...');

  // Flatten stations with city info
  const allStations = [];
  Object.keys(CITY_MAP).forEach(city => {
    CITY_MAP[city].stations.forEach(station => {
      allStations.push({ city, name: station });
    });
  });

  // Generate for 15 days
  for (let i = 0; i < 15; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = formatDate(date);
    console.log(`Processing date: ${dateStr}`);

    // For each station, pick random destinations
    // To avoid O(N^2), we'll pick a subset of routes.
    // Ensure every station is a start station at least once per day?
    // User asked for "Each city-station combination at least 10 records".
    // We will generate ~4 trains * 2 destinations per station per day = 8 records per station per day.
    // 8 * 15 = 120 records per station. This satisfies the requirement.

    for (const startStation of allStations) {
      // Pick 2 random end stations in DIFFERENT cities
      const targets = [];
      while (targets.length < 2) {
        const rand = allStations[getRandomInt(0, allStations.length)];
        if (rand.city !== startStation.city && !targets.includes(rand)) {
          targets.push(rand);
        }
      }

      for (const endStation of targets) {
        // Generate 4 trains (one per time slot)
        for (let slot = 0; slot < 4; slot++) {
          const type = TRAIN_TYPES[getRandomInt(0, TRAIN_TYPES.length)];
          const trainNo = `${type}${getRandomInt(1000, 9999)}`;
          const startTime = generateTimeInSlot(slot);
          const duration = getRandomInt(30, 600); // 30 mins to 10 hours
          const endTime = addTime(startTime, duration);

          records.push({
            train_no: trainNo,
            train_type: type,
            start_station: startStation.name,
            end_station: endStation.name,
            start_time: startTime,
            end_time: endTime,
            duration: formatDuration(duration),
            date: dateStr,
            swz_num: getRandomInt(0, 20),
            yd_num: getRandomInt(0, 50),
            ed_num: getRandomInt(0, 100),
            rw_num: getRandomInt(0, 30),
            yw_num: getRandomInt(0, 50),
            yz_num: getRandomInt(0, 100),
            wz_num: getRandomInt(0, 50),
          });
        }
      }
    }
  }

  console.log(`Total records generated: ${records.length}`);
  console.log('Inserting into database...');

  // Insert in batches
  const BATCH_SIZE = 500;
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    const stmt = db.prepare(`INSERT INTO train_tickets (
      train_no, train_type, start_station, end_station,
      start_time, end_time, duration, date,
      swz_num, yd_num, ed_num, rw_num, yw_num, yz_num, wz_num
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    let count = 0;
    for (const r of records) {
      stmt.run([
        r.train_no, r.train_type, r.start_station, r.end_station,
        r.start_time, r.end_time, r.duration, r.date,
        r.swz_num, r.yd_num, r.ed_num, r.rw_num, r.yw_num, r.yz_num, r.wz_num
      ]);
      count++;
      if (count % 1000 === 0) process.stdout.write('.');
    }
    stmt.finalize();
    db.run('COMMIT', () => {
      console.log('\nData insertion complete.');
      db.close();
    });
  });
};

generate().catch(console.error);
