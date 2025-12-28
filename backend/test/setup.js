// 测试环境设置
process.env.NODE_ENV = 'test';

// 初始化测试数据库
const { getDb, initializeDatabase, close, run } = require('../src/db/personal_database');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function patchFileDatabase() {
  const dbPath = path.join(__dirname, '../data/12306.db');
  const db = await new Promise((resolve, reject) => {
    const d = new sqlite3.Database(dbPath, (err) => {
      if (err) reject(err);
      else resolve(d);
    });
  });

  const exec = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  await exec('CREATE INDEX IF NOT EXISTS idx_rf_inventories_train_date ON rf_inventories(train_id, travel_date)');
  await exec('CREATE INDEX IF NOT EXISTS idx_rf_fares_train_seat ON rf_fares(train_id, seat_type)');

  await exec(
    `
    UPDATE rf_fares
    SET base_price = 99
    WHERE seat_type = '二等座'
      AND base_price > 99
      AND train_id IN (
        SELECT tr.train_id
        FROM rf_trains tr
        JOIN rf_stations fs ON tr.origin_station_id = fs.station_id
        JOIN rf_stations ts ON tr.destination_station_id = ts.station_id
        WHERE fs.city = '上海' AND ts.city = '苏州' AND tr.train_type = 'G'
      )
    `.trim()
  );

  await new Promise((resolve) => db.close(() => resolve()));
}

beforeAll(async () => {
  // 确保数据库连接已建立
  getDb();
  
  // 初始化数据库表结构
  await initializeDatabase();
  
  // 清理可能存在的测试数据
  try {
    await run('DELETE FROM passengers WHERE user_id = ?', ['test-user-id']);
    await run('DELETE FROM orders WHERE user_id = ?', ['test-user-id']);
    await run('DELETE FROM users WHERE id = ?', ['test-user-id']);
  } catch (err) {
    // 忽略错误（表可能不存在）
  }
  
  // 插入测试用户
  await run(`
    INSERT INTO users (id, username, real_name, country, id_type, id_number, 
                      verification_status, phone_number, email, phone_verified, 
                      discount_type)
    VALUES ('test-user-id', 'testuser', '张三', '中国', '居民身份证', 
            '110101199001011234', '已通过', '13800138000', 'test@example.com', 
            1, '成人')
  `);

  // Create train_tickets table for tests (Aligned with personal_database.js schema)
  await run(`
    CREATE TABLE IF NOT EXISTS train_tickets (
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
    )
  `);

  await patchFileDatabase();
});

afterEach(async () => {
  // 每个测试后清理测试数据（保留测试用户）
  try {
    await run('DELETE FROM passengers WHERE user_id = ? AND id != ?', ['test-user-id', '']);
    await run('DELETE FROM orders WHERE user_id = ? AND id != ?', ['test-user-id', '']);
  } catch (err) {
    // 忽略错误
  }
});

afterAll(async () => {
  // 关闭数据库连接
  await close();
});
