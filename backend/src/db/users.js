// backend/src/db/users.js
const db = require('../config/database');

async function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

async function findUserByIdentity(identityType, identityNumber) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE identityType = ? AND identityNumber = ?',
      [identityType, identityNumber],
      (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      }
    );
  });
}

async function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

async function findUserByPhone(phoneNumber) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE phoneNumber = ?', [phoneNumber], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

async function createUser(userData) {
  const { username, password, fullName, identityType, identityNumber, passengerType, email, phoneNumber } = userData;
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users (username, password, fullName, identityType, identityNumber, passengerType, email, phoneNumber)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(
      sql,
      [username, password, fullName, identityType, identityNumber, passengerType, email, phoneNumber],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
}

module.exports = {
  findUserByUsername,
  findUserByIdentity,
  findUserByEmail,
  findUserByPhone,
  createUser,
};
