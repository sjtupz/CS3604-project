// backend/src/db/userDb.js
const { run, get, all } = require('./personal_database');
const { v4: uuidv4 } = require('uuid');

const mapUser = (row) => {
  if (!row) return null;
  return {
    ...row,
    id: row.id,
    userId: row.id,
    username: row.username,
    password: row.password,
    fullName: row.real_name,
    identityType: row.id_type,
    identityNumber: row.id_number,
    passengerType: row.discount_type,
    email: row.email,
    phoneNumber: row.phone_number,
    phoneVerified: row.phone_verified,
    verificationStatus: row.verification_status
  };
};

const findUserByUsername = async (username) => {
  try {
    const row = await get('SELECT * FROM users WHERE username = ?', [username]);
    return mapUser(row);
  } catch (err) {
    throw err;
  }
};

const findUserById = async (id) => {
  try {
    const row = await get('SELECT * FROM users WHERE id = ?', [id]);
    return mapUser(row);
  } catch (err) {
    throw err;
  }
};

const findUserByIdentityNumber = async (identityNumber) => {
  try {
    const row = await get('SELECT * FROM users WHERE id_number = ?', [identityNumber]);
    return mapUser(row);
  } catch (err) {
    throw err;
  }
};

const findUserByEmail = async (email) => {
  try {
    const row = await get('SELECT * FROM users WHERE email = ? COLLATE NOCASE', [email]);
    return mapUser(row);
  } catch (err) {
    throw err;
  }
};

const findUserByPhoneNumber = async (phoneNumber) => {
  try {
    const row = await get('SELECT * FROM users WHERE phone_number = ?', [phoneNumber]);
    return mapUser(row);
  } catch (err) {
    throw err;
  }
};

const findUsersByRealName = async (realName) => {
  try {
    const rows = await all('SELECT * FROM users WHERE real_name = ?', [realName]);
    return rows.map(mapUser);
  } catch (err) {
    throw err;
  }
};

const createUser = async (userData) => {
  const { username, password, identityType, fullName, identityNumber, passengerType } = userData;
  const emailRaw = userData.email;
  const phoneRaw = userData.phoneNumber;
  const email = emailRaw && String(emailRaw).trim() ? String(emailRaw).trim() : null;
  const phoneNumber = phoneRaw && String(phoneRaw).trim() ? String(phoneRaw).trim() : null;
  
  const id = uuidv4();
  
  // Mapping fields to personal_database schema
  // username -> username
  // password -> password
  // fullName -> real_name
  // identityType -> id_type
  // identityNumber -> id_number
  // passengerType -> discount_type
  // email -> email
  // phoneNumber -> phone_number
  
  const sql = `
    INSERT INTO users (
      id, username, password, real_name, id_type, id_number, 
      discount_type, email, phone_number, verification_status, phone_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  // Default values
  const verificationStatus = '已通过'; // Assuming registration implies some verification or default
  const phoneVerified = 1; // Assuming verified if registering via phone
  
  try {
    await run(sql, [
      id, username, password, fullName, identityType, identityNumber, 
      passengerType, email, phoneNumber, verificationStatus, phoneVerified
    ]);
    return { id };
  } catch (err) {
    throw err;
  }
};

const updateUserPasswordByPhone = async (phoneNumber, hashedPassword) => {
  try {
    const sql = 'UPDATE users SET password = ? WHERE phone_number = ?';
    const result = await run(sql, [hashedPassword, phoneNumber]);
    return { changes: result.changes };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  findUserByUsername,
  findUserById,
  findUserByIdentityNumber,
  findUserByEmail,
  findUserByPhoneNumber,
  findUsersByRealName,
  createUser,
  updateUserPasswordByPhone,
};
