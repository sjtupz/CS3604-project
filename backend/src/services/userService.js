const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-12306';

class UserService {
  // DB-FindUserByUsername - 根据用户名查找用户记录
  async findUserByUsername(username) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM users 
        WHERE username = ? OR email = ? OR phone_number = ?
      `;
      
      database.db.get(query, [username, username, username], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  // DB-ValidateUserCredentials - 验证用户登录凭据
  async validateUserCredentials(username, password) {
    try {
      const user = await this.findUserByUsername(username);
      if (!user) {
        return { isValid: false, user: null, error: 'USER_NOT_FOUND' };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { isValid: false, user: null, error: 'INVALID_PASSWORD' };
      }

      return { isValid: true, user, error: null };
    } catch (error) {
      return { isValid: false, user: null, error: 'DATABASE_ERROR' };
    }
  }

  // DB-CreateUser - 在数据库中创建新用户记录
  async createUser(userData) {
    return new Promise(async (resolve, reject) => {
      try {
        // 哈希密码
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        const query = `
          INSERT INTO users (
            username, password, real_name, id_type, id_number, 
            discount_type, phone_number, email
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          userData.username,
          hashedPassword,
          userData.realName,
          userData.idType,
          userData.idNumber,
          userData.discountType,
          userData.phoneNumber,
          userData.email || null
        ];

        database.db.run(query, values, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // DB-CheckUserExists - 检查用户是否已存在
  async checkUserExists(username, phoneNumber, idNumber) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT username, phone_number, id_number 
        FROM users 
        WHERE username = ? OR phone_number = ? OR id_number = ?
      `;

      database.db.all(query, [username, phoneNumber, idNumber], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const conflicts = [];
          
          rows.forEach(row => {
            if (row.username === username) conflicts.push('username');
            if (row.phone_number === phoneNumber) conflicts.push('phoneNumber');
            if (row.id_number === idNumber) conflicts.push('idNumber');
          });

          resolve({
            exists: conflicts.length > 0,
            conflicts: [...new Set(conflicts)] // 去重
          });
        }
      });
    });
  }

  // DB-UpdateUserLoginStatus - 更新用户登录状态
  async updateUserLoginStatus(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE users 
        SET updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;

      database.db.run(query, [userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  // 生成JWT令牌
  generateToken(user) {
    const payload = {
      userId: user.id,
      username: user.username
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  }

  // 验证JWT令牌
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // 验证用户名格式
  validateUsername(username) {
    if (!username || username.length < 3 || username.length > 20) {
      return false;
    }
    // 允许字母、数字、下划线
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
  }

  // 验证邮箱格式
  validateEmail(email) {
    if (!email) return true; // 邮箱是可选的
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 验证手机号格式
  validatePhoneNumber(phoneNumber) {
    if (!phoneNumber) return false;
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  }

  // 验证身份证号格式
  validateIdNumber(idNumber) {
    if (!idNumber) return false;
    return idNumber.length === 18;
  }
}

module.exports = new UserService();