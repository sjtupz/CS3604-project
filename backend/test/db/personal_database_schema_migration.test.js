const fs = require('fs');
const os = require('os');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const runSql = (db, sql) => {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const closeDb = (db) => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

describe('DB-SchemaMigration-PersonalDatabase', () => {
  test('Given 旧表结构 When 初始化 Then 应自动补齐缺失字段', async () => {
    const originalDbPath = process.env.SQLITE_DB_PATH;
    const tmpDbPath = path.join(os.tmpdir(), `personal_schema_${Date.now()}_${Math.random().toString(16).slice(2)}.sqlite`);
    process.env.SQLITE_DB_PATH = tmpDbPath;

    try {
      const rawDb = new sqlite3.Database(tmpDbPath);

      await runSql(
        rawDb,
        `CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT,
          real_name TEXT,
          country TEXT DEFAULT '中国',
          id_type TEXT,
          id_number TEXT,
          verification_status TEXT DEFAULT '未通过',
          phone_number TEXT,
          email TEXT,
          phone_verified INTEGER DEFAULT 0,
          discount_type TEXT DEFAULT '成人',
          gender TEXT DEFAULT 'male',
          role TEXT DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
      );

      await runSql(
        rawDb,
        `CREATE TABLE IF NOT EXISTS passengers (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          name TEXT NOT NULL,
          id_type TEXT NOT NULL,
          id_number TEXT NOT NULL,
          phone TEXT,
          verification_status TEXT DEFAULT '未通过',
          discount_type TEXT DEFAULT '成人',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
      );

      await closeDb(rawDb);

      jest.resetModules();
      const personalDb = require('../../src/db/personal_database');
      await personalDb.waitForInit();

      const dbList = await personalDb.all('PRAGMA database_list');
      expect(Array.isArray(dbList)).toBe(true);
      expect(dbList.length).toBeGreaterThan(0);
      expect(String(dbList[0].file || '')).toContain(path.basename(tmpDbPath));

      const usersCols = await personalDb.all('PRAGMA table_info(users)');
      const passengerCols = await personalDb.all('PRAGMA table_info(passengers)');

      const userColNames = new Set(usersCols.map((c) => c.name));
      const passengerColNames = new Set(passengerCols.map((c) => c.name));

      expect(userColNames.has('student_qualification')).toBe(true);
      expect(passengerColNames.has('expiry_date')).toBe(true);
      expect(passengerColNames.has('birth_date')).toBe(true);

      await personalDb.close();
    } finally {
      process.env.SQLITE_DB_PATH = originalDbPath;
      jest.resetModules();
      try {
        fs.unlinkSync(tmpDbPath);
      } catch (_) {}
    }
  });
});

