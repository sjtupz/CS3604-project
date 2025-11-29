// backend/src/db/userDb.js
const db = require('../config/database');

const findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const findUserByIdentityNumber = (identityNumber) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE identityNumber = ?', [identityNumber], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const findUserByPhoneNumber = (phoneNumber) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE phoneNumber = ?', [phoneNumber], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const createUser = (userData) => {
  const { username, password, identityType, fullName, identityNumber, passengerType, email, phoneNumber } = userData;
  return new Promise((resolve, reject) => {
    // 注册时将 passengers 和 tickets 初始化为空字符串或 null (这里使用 DEFAULT NULL，无需显式插入)
    const sql = 'INSERT INTO users (username, password, identityType, fullName, identityNumber, passengerType, email, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [username, password, identityType, fullName, identityNumber, passengerType, email, phoneNumber], function(err) {
      if (err) reject(err);
      resolve({ id: this.lastID });
    });
  });
};

module.exports = {
  findUserByUsername,
  findUserByIdentityNumber,
  findUserByEmail,
  findUserByPhoneNumber,
  createUser,
};
