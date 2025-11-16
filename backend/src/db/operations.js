const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(process.env.DATABASE_URL || './db.sqlite');

const findAllStations = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM stations", [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

const findTrains = (from, to, date, isHighSpeed) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM trains
      WHERE fromStation = ? AND toStation = ? AND date = ? AND isHighSpeed = ?
    `;
    const highSpeedInt = isHighSpeed ? 1 : 0;
    db.all(query, [from, to, date, highSpeedInt], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

module.exports = { findAllStations, findTrains, db };