const userService = require('../../src/services/userService');
const database = require('../../src/config/database');
const TestHelper = require('../helpers/testHelper');

describe('User Service', () => {
  beforeAll(async () => {
    // 连接测试数据库
    await database.connect(true);
  });

  afterAll(async () => {
    // 关闭数据库连接
    await database.close();
  });

  beforeEach(async () => {
    // 清理测试数据
    await TestHelper.clearDatabase();
  });

  describe('findUserByUsername', () => {
    // 基于DB-FindUserByUsername的acceptanceCriteria编写测试

    it('应该通过用户名找到用户', async () => {
      // 创建测试用户
      const testUserData = {
        username: 'testuser',
        password: 'password123',
        realName: '张三',
        idType: '身份证',
        idNumber: '110101199001011234',
        discountType: '成人',
        phoneNumber: '13800138000',
        email: 'test@example.com'
      };

      await TestHelper.createTestUser(testUserData);

      const user = await userService.findUserByUsername('testuser');
      
      expect(user).toBeTruthy();
      expect(user.username).toBe('testuser');
      expect(user.realName).toBe('张三');
      expect(user.phoneNumber).toBe('13800138000');
      expect(user.email).toBe('test@example.com');
    });

    it('应该通过邮箱找到用户', async () => {
      // 创建测试用户
      const testUserData = {
        username: 'testuser',
        password: 'password123',
        realName: '张三',
        idType: '身份证',
        idNumber: '110101199001011234',
        discountType: '成人',
        phoneNumber: '13800138000',
        email: 'test@example.com'
      };

      await TestHelper.createTestUser(testUserData);

      const user = await userService.findUserByUsername('test@example.com');
      
      expect(user).toBeTruthy();
      expect(user.email).toBe('test@example.com');
      expect(user.username).toBe('testuser');
    });

    it('应该根据手机号找到用户', async () => {
      // 创建测试用户
      const testUserData = {
        username: 'phoneuser',
        password: 'password123',
        realName: '王五',
        idType: '身份证',
        idNumber: '110101199001011236',
        discountType: '成人',
        phoneNumber: '13800138002',
        email: 'phone@example.com'
      };

      await TestHelper.createTestUser(testUserData);

      const result = await userService.findUserByUsername('13800138002');
      
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('phoneNumber', '13800138002');
      expect(result).toHaveProperty('username', 'phoneuser');
    });

    it('应该在用户不存在时返回null', async () => {
      const result = await userService.findUserByUsername('nonexistentuser');
      expect(result).toBeNull();
    });
  });

  describe('validateUserCredentials', () => {
    // 基于DB-ValidateUserCredentials的acceptanceCriteria编写测试

    it('应该验证正确的用户凭据', async () => {
      // 创建测试用户
      const testUserData = {
        username: 'validuser',
        password: 'password123',
        realName: '张三',
        idType: '身份证',
        idNumber: '110101199001011234',
        discountType: '成人',
        phoneNumber: '13800138000',
        email: 'valid@example.com'
      };

      await TestHelper.createTestUser(testUserData);

      const result = await userService.validateUserCredentials('validuser', 'password123');
      
      expect(result).toHaveProperty('isValid', true);
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('username', 'validuser');
      expect(result.user).not.toHaveProperty('password');
    });

    it('应该拒绝错误的密码', async () => {
      // 先创建测试用户
      const testUser = {
        username: 'validuser',
        password: 'password123',
        realName: '张三',
        idNumber: '110101199001011234',
        phoneNumber: '13800138000'
      };
      // TODO: 创建测试用户

      const result = await userService.validateUserCredentials('validuser', 'wrongpassword');
      
      expect(result).toHaveProperty('isValid', false);
      expect(result).toHaveProperty('user', null);
    });

    it('应该拒绝不存在的用户', async () => {
      const result = await userService.validateUserCredentials('nonexistentuser', 'password123');
      
      expect(result).toHaveProperty('isValid', false);
      expect(result).toHaveProperty('user', null);
    });

    it('应该支持邮箱登录验证', async () => {
      // 先创建测试用户
      const testUser = {
        username: 'test@example.com',
        password: 'password123',
        realName: '李四',
        idNumber: '110101199001011235',
        phoneNumber: '13800138001'
      };
      // TODO: 创建测试用户

      const result = await userService.validateUserCredentials('test@example.com', 'password123');
      
      expect(result).toHaveProperty('isValid', true);
      expect(result.user).toHaveProperty('username', 'test@example.com');
    });

    it('应该支持手机号登录验证', async () => {
      // 先创建测试用户
      const testUser = {
        username: 'phoneuser',
        password: 'password123',
        realName: '王五',
        idNumber: '110101199001011236',
        phoneNumber: '13800138002'
      };
      // TODO: 创建测试用户

      const result = await userService.validateUserCredentials('13800138002', 'password123');
      
      expect(result).toHaveProperty('isValid', true);
      expect(result.user).toHaveProperty('phoneNumber', '13800138002');
    });
  });

  describe('createUser', () => {
    // 基于DB-CreateUser的acceptanceCriteria编写测试

    it('应该成功创建新用户并返回用户ID', async () => {
      const newUser = {
        username: 'newuser',
        password: 'password123',
        realName: '新用户',
        idNumber: '110101199001011237',
        phoneNumber: '13800138003'
      };

      const userId = await userService.createUser(newUser);
      
      expect(userId).not.toBeNull();
      expect(typeof userId).toBe('string');
      
      // 验证用户是否真的被创建
      const createdUser = await userService.findUserByUsername('newuser');
      expect(createdUser).not.toBeNull();
      expect(createdUser).toHaveProperty('username', 'newuser');
      expect(createdUser).toHaveProperty('realName', '新用户');
    });

    it('应该对密码进行哈希处理', async () => {
      const newUser = {
        username: 'hashuser',
        password: 'plainpassword',
        realName: '哈希用户',
        idNumber: '110101199001011238',
        phoneNumber: '13800138004'
      };

      await userService.createUser(newUser);
      
      const createdUser = await userService.findUserByUsername('hashuser');
      expect(createdUser.password).not.toBe('plainpassword');
      expect(createdUser.password.length).toBeGreaterThan(20); // 哈希后的密码应该更长
    });

    it('应该设置用户创建时间', async () => {
      const newUser = {
        username: 'timeuser',
        password: 'password123',
        realName: '时间用户',
        idNumber: '110101199001011239',
        phoneNumber: '13800138005'
      };

      await userService.createUser(newUser);
      
      const createdUser = await userService.findUserByUsername('timeuser');
      expect(createdUser).toHaveProperty('createdAt');
      expect(new Date(createdUser.createdAt)).toBeInstanceOf(Date);
    });
  });

  describe('checkUserExists', () => {
    // 基于DB-CheckUserExists的acceptanceCriteria编写测试

    it('应该检测到用户名冲突', async () => {
      // 先创建测试用户
      const existingUser = {
        username: 'existinguser',
        password: 'password123',
        realName: '已存在用户',
        idNumber: '110101199001011240',
        phoneNumber: '13800138006'
      };
      // TODO: 创建测试用户

      const result = await userService.checkUserExists('existinguser', '13800138999', '110101199001019999');
      
      expect(result).toHaveProperty('exists', true);
      expect(result).toHaveProperty('conflicts');
      expect(result.conflicts).toContain('username');
    });

    it('应该检测到手机号冲突', async () => {
      // 先创建测试用户
      const existingUser = {
        username: 'phoneuser',
        password: 'password123',
        realName: '手机用户',
        idNumber: '110101199001011241',
        phoneNumber: '13800138007'
      };
      // TODO: 创建测试用户

      const result = await userService.checkUserExists('newusername', '13800138007', '110101199001019999');
      
      expect(result).toHaveProperty('exists', true);
      expect(result.conflicts).toContain('phoneNumber');
    });

    it('应该检测到证件号码冲突', async () => {
      // 先创建测试用户
      const existingUser = {
        username: 'iduser',
        password: 'password123',
        realName: '证件用户',
        idNumber: '110101199001011242',
        phoneNumber: '13800138008'
      };
      // TODO: 创建测试用户

      const result = await userService.checkUserExists('newusername', '13800138999', '110101199001011242');
      
      expect(result).toHaveProperty('exists', true);
      expect(result.conflicts).toContain('idNumber');
    });

    it('应该检测到多个字段冲突', async () => {
      // 先创建测试用户
      const existingUser = {
        username: 'multiuser',
        password: 'password123',
        realName: '多冲突用户',
        idNumber: '110101199001011243',
        phoneNumber: '13800138009'
      };
      // TODO: 创建测试用户

      const result = await userService.checkUserExists('multiuser', '13800138009', '110101199001019999');
      
      expect(result).toHaveProperty('exists', true);
      expect(result.conflicts).toContain('username');
      expect(result.conflicts).toContain('phoneNumber');
    });

    it('应该在没有冲突时返回false', async () => {
      const result = await userService.checkUserExists('uniqueuser', '13800139999', '110101199001019999');
      
      expect(result).toHaveProperty('exists', false);
      expect(result).toHaveProperty('conflicts', []);
    });
  });

  describe('updateUserLoginStatus', () => {
    // 基于DB-UpdateUserLoginStatus的acceptanceCriteria编写测试

    it('应该更新用户的最后登录时间', async () => {
      // 先创建测试用户
      const testUser = {
        username: 'loginuser',
        password: 'password123',
        realName: '登录用户',
        idNumber: '110101199001011244',
        phoneNumber: '13800138010'
      };
      const userId = await userService.createUser(testUser);

      const result = await userService.updateUserLoginStatus(userId);
      
      expect(result).toBe(true);
      
      // 验证登录时间是否更新
      const updatedUser = await userService.findUserByUsername('loginuser');
      expect(updatedUser).toHaveProperty('lastLoginAt');
      expect(new Date(updatedUser.lastLoginAt)).toBeInstanceOf(Date);
    });

    it('应该更新用户的在线状态', async () => {
      // 先创建测试用户
      const testUser = {
        username: 'onlineuser',
        password: 'password123',
        realName: '在线用户',
        idNumber: '110101199001011245',
        phoneNumber: '13800138011'
      };
      const userId = await userService.createUser(testUser);

      await userService.updateUserLoginStatus(userId);
      
      const updatedUser = await userService.findUserByUsername('onlineuser');
      expect(updatedUser).toHaveProperty('isOnline', true);
    });

    it('应该在用户不存在时返回false', async () => {
      const result = await userService.updateUserLoginStatus('nonexistent-user-id');
      expect(result).toBe(false);
    });
  });
});