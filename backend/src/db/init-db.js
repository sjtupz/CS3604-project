const sqlite3 = require('sqlite3').verbose();
const dbPath = process.env.DATABASE_URL || './db.sqlite';
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

const insertStation = (id, name, pinyin) => {
  const query = "INSERT INTO stations (id, name, pinyin) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM stations WHERE id = ?)";
  return runQuery(query, [id, name, pinyin, id]);
};

const insertTrain = (id, trainNumber, fromStation, toStation, date, isHighSpeed) => {
  const query = "INSERT INTO trains (id, trainNumber, fromStation, toStation, date, isHighSpeed) SELECT ?, ?, ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM trains WHERE id = ?)";
  return runQuery(query, [id, trainNumber, fromStation, toStation, date, isHighSpeed, id]);
};

const initDb = async () => {
  try {
    await runQuery("CREATE TABLE IF NOT EXISTS stations (id INT, name TEXT, pinyin TEXT)");
    await insertStation(1, '北京南', 'beijingnan');
    await insertStation(2, '上海虹桥', 'shanghaihongqiao');
    await insertStation(3, '北京', 'beijing');
    await insertStation(4, '北京西', 'beijingxi');
    await insertStation(5, '北京东', 'beijingdong');
    await insertStation(6, '上海南', 'shanghainan');
    await insertStation(7, '平阳', 'pingyang');

    await runQuery("CREATE TABLE IF NOT EXISTS trains (id INT, trainNumber TEXT, fromStation TEXT, toStation TEXT, date TEXT, isHighSpeed BOOLEAN)");
    await insertTrain(1, 'G1', '北京南', '上海虹桥', '2025-11-17', 1);

  } catch (err) {
    console.error(err.message);
  } finally {
    db.close();
  }
};

initDb();
