const database = require('../../src/config/database');
const userService = require('../../src/services/userService');

class TestHelper {
  // 清理测试数据库
  static async clearDatabase() {
    return new Promise((resolve, reject) => {
      database.db.run('DELETE FROM users', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // 创建测试用户
  static async createTestUser(userData) {
    try {
      const userId = await userService.createUser(userData);
      return userId;
    } catch (error) {
      throw error;
    }
  }

  // 创建测试用户并返回用户信息和token
  static async createAndGetTestUser(userData) {
    try {
      const userId = await this.createTestUser(userData);
      const user = await userService.findUserByUsername(userData.username);
      const token = this.generateTestToken(user);
      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  // 生成测试JWT令牌
  static generateTestToken(user) {
    return userService.generateToken(user);
  }
}

module.exports = TestHelper;