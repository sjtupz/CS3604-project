const { db } = require('../src/db/operations');

const setupTestDB = () => {
  return new Promise((resolve) => {
    db.serialize(() => {
      db.run("DROP TABLE IF EXISTS stations");
      db.run("DROP TABLE IF EXISTS trains");
      db.run("CREATE TABLE stations (id INT, name TEXT, pinyin TEXT)");
      db.run("CREATE TABLE trains (id INT, trainNumber TEXT, fromStation TEXT, toStation TEXT, date TEXT, isHighSpeed BOOLEAN)");
      const stationStmt = db.prepare("INSERT INTO stations VALUES (?, ?, ?)");
      stationStmt.run(1, '北京南', 'beijingnan');
      stationStmt.run(2, '上海虹桥', 'shanghaihongqiao');
      stationStmt.finalize();

      const trainStmt = db.prepare("INSERT INTO trains VALUES (?, ?, ?, ?, ?, ?)");
      trainStmt.run(1, 'G1', '北京南', '上海虹桥', '2025-11-17', 1);
      trainStmt.finalize(resolve);
    });
  });
};

const teardownTestDB = () => {
  return new Promise((resolve) => {
    db.close(resolve);
  });
};

module.exports = { setupTestDB, teardownTestDB };