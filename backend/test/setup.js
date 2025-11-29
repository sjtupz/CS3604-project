// 测试环境设置
process.env.NODE_ENV = 'test';

// 初始化测试数据库
const { getDb, initializeDatabase, close, run } = require('../src/db/database');

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

