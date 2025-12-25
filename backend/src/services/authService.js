// backend/src/services/authService.js
const userDb = require('../db/userDb');
const bcrypt = require('bcrypt');
const { isValidIdentityNumber } = require('../utils/validators');

const registerUser = async (userData) => {
  const { username, password, identityNumber, identityType } = userData;
  const emailRaw = userData.email;
  const phoneRaw = userData.phoneNumber;
  const email = emailRaw && String(emailRaw).trim() ? String(emailRaw).trim() : null;
  const phoneNumber = phoneRaw && String(phoneRaw).trim() ? String(phoneRaw).trim() : null;

  // 校验身份证号码合法性
  if (identityType === 'ID_CARD' || identityType === '居民身份证') {
    if (!isValidIdentityNumber(identityNumber)) {
      throw new Error('身份证号码不合法');
    }
  }

  // 检查用户名是否已存在
  const existingUserByUsername = await userDb.findUserByUsername(username);
  if (existingUserByUsername) {
    throw new Error('该用户名已被注册');
  }

  // 检查身份证号是否已存在
  const existingUserByIdentity = await userDb.findUserByIdentityNumber(identityNumber);
  if (existingUserByIdentity) {
    throw new Error('该证件号码已被注册');
  }

  // 检查邮箱是否已存在
  if (email) {
    const existingUserByEmail = await userDb.findUserByEmail(email);
    if (existingUserByEmail) {
      throw new Error('该邮箱已被注册');
    }
  }

  // 检查手机号是否已存在
  if (phoneNumber) {
    const existingUserByPhone = await userDb.findUserByPhoneNumber(phoneNumber);
    if (existingUserByPhone) {
      throw new Error('该手机号码已被注册');
    }
  }

  // 对密码进行哈希处理
  const hashedPassword = await bcrypt.hash(password, 10);

  // 创建用户
  const newUser = { ...userData, email, phoneNumber, password: hashedPassword };
  const result = await userDb.createUser(newUser);

  return result;
};

module.exports = {
  registerUser,
};
