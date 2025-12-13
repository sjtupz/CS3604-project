const { insertMany } = require('../db/tickets');
const { formatDuration, minutesToHM, addHM } = require('../utils/time');

// ≥30 cities with typical stations
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
  厦门: { stations: ['厦门', '厦门北'] },
  宁波: { stations: ['宁波', '宁波东'] },
  南宁: { stations: ['南宁', '南宁东'] },
  海口: { stations: ['海口'] },
  青岛: { stations: ['青岛', '青岛北'] },
  大连: { stations: ['大连', '大连北'] },
  佛山: { stations: ['佛山', '佛山西'] },
  深圳: { stations: ['深圳', '深圳北'] },
};

const TOP_CITIES = ['北京','上海','广州','深圳','杭州','南京','成都','重庆','武汉','西安'];

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }

function makeTrainNo(type) {
  if (type === 'G') return `G${randInt(100, 9999)}`;
  if (type === 'C') return `C${randInt(100, 2999)}`;
  if (type === 'D') return `D${randInt(300, 3999)}`;
  if (type === 'Z') return `Z${randInt(1, 999)}`;
  if (type === 'T') return `T${randInt(1, 999)}`;
  return `K${randInt(1, 999)}`;
}

function seatStatusBias(type) {
  const pool = ['有', '无', '候补'];
  const num = String(randInt(1, 10));
  // G/D 二等座更可能候补
  function pickStatus(baseBias) {
    const r = Math.random();
    if (r < baseBias) return '有';
    if (r < baseBias + 0.2) return '无';
    if (r < baseBias + 0.4) return '候补';
    return num;
  }
  return {
    swz: type === 'G' || type === 'C' ? pickStatus(0.5) : '--',
    yd: (type === 'G' || type === 'C' || type === 'D') ? pickStatus(0.5) : '--',
    ed: (type === 'G' || type === 'C' || type === 'D') ? pickStatus(type === 'G' ? 0.3 : 0.5) : '--',
    rw: (type === 'Z' || type === 'T' || type === 'K' || type === 'D') ? pickStatus(0.4) : '--',
    yw: (type === 'Z' || type === 'T' || type === 'K') ? pickStatus(0.5) : '--',
    yz: (type === 'Z' || type === 'T' || type === 'K') ? pickStatus(0.5) : '--',
    wz: pickStatus(0.6)
  };
}

function pickStationsForType(city, type) {
  const sts = CITY_MAP[city].stations;
  const orient = sts.filter(s => /北|南|东|西|虹桥/.test(s));
  const legacy = sts.filter(s => !/北|南|东|西|虹桥/.test(s));
  if (type === 'G' || type === 'C') return orient.length ? pick(orient) : pick(sts);
  if (type === 'K' || type === 'Z' || type === 'T') return legacy.length ? pick(legacy) : pick(sts);
  // D动车随意但偏向方位
  return orient.length ? pick(orient) : pick(sts);
}

function speedFor(type) {
  if (type === 'G' || type === 'C') return 300;
  if (type === 'D') return 200;
  return 120; // Z/T/K
}

function typesForPair(from, to) {
  const set = ['G','D','Z','K'];
  // Big cities pairs more G/D
  const high = (TOP_CITIES.includes(from) && TOP_CITIES.includes(to));
  if (high) return ['G','D','D','Z','K'];
  return set;
}

function trainsCountForPair(from, to) {
  const high = (TOP_CITIES.includes(from) && TOP_CITIES.includes(to));
  if (high) return randInt(20, 40);
  const provincial = (
    (TOP_CITIES.includes(from) && !TOP_CITIES.includes(to)) ||
    (!TOP_CITIES.includes(from) && TOP_CITIES.includes(to))
  );
  if (provincial) return randInt(10, 15);
  return randInt(3, 5);
}

function randomDistance() { return randInt(500, 2500); }
function randomStartHM() { return `${String(randInt(5, 21)).padStart(2,'0')}:${String(randInt(0,59)).padStart(2,'0')}`; }

function generateForDate(dateStr) {
  const cities = Object.keys(CITY_MAP);
  const records = [];
  for (let i = 0; i < cities.length; i++) {
    for (let j = i + 1; j < cities.length; j++) {
      const from = cities[i];
      const to = cities[j];
      const count = trainsCountForPair(from, to);
      const types = typesForPair(from, to);
      for (let k = 0; k < count; k++) {
        const type = pick(types);
        const speed = speedFor(type);
        const dist = randomDistance();
        const durationMin = Math.max(60, Math.round((dist / speed) * 60));
        const startHM = randomStartHM();
        const endHM = addHM(startHM, durationMin);
        const seats = seatStatusBias(type);
        const start_station = pickStationsForType(from, type);
        const end_station = pickStationsForType(to, type);
        const train_no = makeTrainNo(type);
        records.push({
          train_no,
          train_type: type,
          start_station,
          end_station,
          from_city: from,
          to_city: to,
          start_time: startHM,
          end_time: endHM,
          duration: formatDuration(durationMin),
          date: dateStr,
          swz: seats.swz,
          yd: seats.yd,
          ed: seats.ed,
          rw: seats.rw,
          yw: seats.yw,
          yz: seats.yz,
          wz: seats.wz,
        });
        // also reverse direction for more coverage
        records.push({
          train_no: makeTrainNo(type),
          train_type: type,
          start_station: pickStationsForType(to, type),
          end_station: pickStationsForType(from, type),
          from_city: to,
          to_city: from,
          start_time: startHM,
          end_time: endHM,
          duration: formatDuration(durationMin),
          date: dateStr,
          swz: seats.swz,
          yd: seats.yd,
          ed: seats.ed,
          rw: seats.rw,
          yw: seats.yw,
          yz: seats.yz,
          wz: seats.wz,
        });
      }
    }
  }
  return records;
}

function generateMockData(days = 14) {
  const today = new Date();
  let total = 0;
  for (let d = 0; d < days; d++) {
    const dateStr = new Date(today.getTime() + d * 86400000).toISOString().slice(0,10);
    const rows = generateForDate(dateStr);
    insertMany(rows);
    total += rows.length;
  }
  return total;
}

module.exports = { CITY_MAP, generateMockData };

