const sqlite3 = require('sqlite3').verbose();
const dbPath = process.env.DATABASE_URL || './db.sqlite';
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS stations (id INT, name TEXT, pinyin TEXT)", (err) => {
    if (!err) {
      const stmt = db.prepare("INSERT INTO stations (id, name, pinyin) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM stations WHERE id = ?)");
      stmt.run(1, '北京南', 'beijingnan', 1);
      stmt.run(2, '上海虹桥', 'shanghaihongqiao', 2);
      stmt.finalize();
    }
  });

  db.run("CREATE TABLE IF NOT EXISTS trains (id INT, trainNumber TEXT, fromStation TEXT, toStation TEXT, date TEXT, isHighSpeed BOOLEAN)", (err) => {
    if (!err) {
      const stmt = db.prepare("INSERT INTO trains (id, trainNumber, fromStation, toStation, date, isHighSpeed) SELECT ?, ?, ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM trains WHERE id = ?)");
      stmt.run(1, 'G1', '北京南', '上海虹桥', '2025-11-17', 1, 1);
      stmt.finalize((err) => {
        if (!err) {
          db.close();
        }
      });
    }
  });
});