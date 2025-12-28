const { getDb } = require('../src/db/personal_database');

const CITY_MAP = {
  北京: { stations: ['北京', '北京南', '北京西', '北京丰台', '北京北', '北京朝阳'], province: '北京' },
  上海: { stations: ['上海', '上海南', '上海虹桥', '上海松江', '上海西', '金山北'], province: '上海' },
  广州: { stations: ['广州', '广州南', '广州东', '广州白云'], province: '广东' },
  深圳: { stations: ['深圳', '深圳北', '罗湖', '福田'], province: '广东' },
  杭州: { stations: ['杭州', '杭州东', '杭州南'], province: '浙江' },
  南京: { stations: ['南京', '南京南'], province: '江苏' },
  苏州: { stations: ['苏州', '苏州北', '苏州园区', '苏州新区'], province: '江苏' },
  济南: { stations: ['济南', '济南东', '济南西'], province: '山东' },
  福州: { stations: ['福州', '福州南'], province: '福建' },
  厦门: { stations: ['厦门', '厦门北'], province: '福建' },
  武汉: { stations: ['武汉', '汉口', '武昌'], province: '湖北' },
  长沙: { stations: ['长沙', '长沙南'], province: '湖南' },
  郑州: { stations: ['郑州', '郑州东'], province: '河南' },
  成都: { stations: ['成都', '成都东', '成都南'], province: '四川' },
  重庆: { stations: ['重庆', '重庆北', '重庆西'], province: '重庆' },
  昆明: { stations: ['昆明', '昆明南'], province: '云南' },
  贵阳: { stations: ['贵阳', '贵阳北', '贵阳东'], province: '贵州' },
  西安: { stations: ['西安', '西安北'], province: '陕西' },
  兰州: { stations: ['兰州', '兰州西'], province: '甘肃' },
  乌鲁木齐: { stations: ['乌鲁木齐', '乌鲁木齐南'], province: '新疆' },
  沈阳: { stations: ['沈阳', '沈阳北', '沈阳南'], province: '辽宁' },
  哈尔滨: { stations: ['哈尔滨', '哈尔滨西', '哈尔滨东'], province: '黑龙江' },
  长春: { stations: ['长春', '长春西'], province: '吉林' },
  天津: { stations: ['天津', '天津西', '天津南'], province: '天津' },
  石家庄: { stations: ['石家庄', '石家庄北'], province: '河北' },
  太原: { stations: ['太原', '太原南'], province: '山西' },
  合肥: { stations: ['合肥', '合肥南'], province: '安徽' },
  宁波: { stations: ['宁波', '宁波东'], province: '浙江' },
  南宁: { stations: ['南宁', '南宁东'], province: '广西' },
  海口: { stations: ['海口', '海口东'], province: '海南' },
  青岛: { stations: ['青岛', '青岛北'], province: '山东' },
  大连: { stations: ['大连', '大连北'], province: '辽宁' },
  佛山: { stations: ['佛山', '佛山西'], province: '广东' },
};

async function initStations() {
  const db = getDb();
  
  console.log('Initializing stations...');
  
  // Wait for DB initialization (just in case)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Clear existing stations
      db.run('DELETE FROM stations', (err) => {
        if (err) {
          console.error('Error clearing stations:', err);
          reject(err);
          return;
        }
        
        // 2. Prepare statement
        const stmt = db.prepare("INSERT INTO stations (name, city, province) VALUES (?, ?, ?)");
        
        // 3. Insert data
        let count = 0;
        for (const [city, data] of Object.entries(CITY_MAP)) {
          for (const station of data.stations) {
            stmt.run(station, city, data.province, (err) => {
                if (err) console.error(`Error inserting ${station}:`, err);
            });
            count++;
          }
        }
        
        stmt.finalize((err) => {
          if (err) {
            reject(err);
          } else {
            console.log(`Successfully inserted ${count} stations.`);
            resolve();
          }
        });
      });
    });
  });
}

initStations().catch(console.error);
