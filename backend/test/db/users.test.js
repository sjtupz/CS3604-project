const db = require('../../src/config/database');
const users = require('../../src/db/users');

describe('DB-CreateUser', () => {
  beforeEach(async () => {
    await new Promise((resolve) => {
      db.run('DELETE FROM users', [], resolve);
    });
  });

  test('Given 完整注册数据 When 调用createUser Then 成功写入基础信息并新增记录', async () => {
    const userData = {
      username: 'new_user',
      password: 'hashed_password',
      fullName: '张三',
      identityType: '居民身份证',
      identityNumber: '110101199001011234',
      passengerType: '成人',
      email: 'zs@example.com',
      phoneNumber: '13800138000'
    };
    await users.createUser(userData);
    const row = await new Promise((resolve) => {
      db.get('SELECT username, fullName, identityType, identityNumber, passengerType, email, phoneNumber FROM users WHERE username = ?', ['new_user'], (err, r) => resolve(r));
    });
    expect(row && row.username).toBe('new_user');
    expect(row && row.email).toBe('zs@example.com');
  });

  test('Given 用户名或证件或邮箱或手机号已存在 When 调用createUser Then 抛出唯一性约束错误', async () => {
    const a = {
      username: 'dup_user',
      password: 'hashed_password',
      fullName: '李四',
      identityType: '居民身份证',
      identityNumber: '110101199001019999',
      passengerType: '成人',
      email: 'ls@example.com',
      phoneNumber: '13900139000'
    };
    const b = {
      username: 'dup_user',
      password: 'hashed_password2',
      fullName: '王五',
      identityType: '居民身份证',
      identityNumber: '110101199001019999',
      passengerType: '成人',
      email: 'ls@example.com',
      phoneNumber: '13900139000'
    };
    await users.createUser(a);
    await expect(users.createUser(b)).rejects.toThrow();
  });
});
