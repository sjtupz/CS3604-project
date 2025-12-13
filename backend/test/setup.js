// 测试环境设置
process.env.NODE_ENV = 'test';

// 初始化测试数据库
const { getDb, initializeDatabase, close, run } = require('../src/db/personal_database');

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
