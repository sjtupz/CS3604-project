// 实现乘车人数据库操作
const { query, get, run } = require('./database');
const crypto = require('crypto');

// 生成UUID
const generateId = () => {
  return crypto.randomBytes(16).toString('hex');
};

// 获取用户的乘车人列表
const getPassengers = async (userId) => {
  try {
    const sql = `
      SELECT 
        id as passengerId,
        name,
        id_type as idType,
        id_number as idNumber,
        phone,
        verification_status as verificationStatus,
        discount_type as discountType,
        expiry_date as expiryDate,
        birth_date as birthDate
      FROM passengers
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    
    const result = await query(sql, [userId]);
    return result || [];
  } catch (error) {
    console.error('Error in getPassengers:', error);
    throw error;
  }
};

// 根据姓名查询乘车人
const getPassengersByName = async (userId, name) => {
  try {
    const sql = `
      SELECT 
        id as passengerId,
        name,
        id_type as idType,
        id_number as idNumber,
        phone,
        verification_status as verificationStatus,
        discount_type as discountType,
        expiry_date as expiryDate,
        birth_date as birthDate
      FROM passengers
      WHERE user_id = ? AND name LIKE ?
      ORDER BY created_at DESC
    `;
    
    const result = await query(sql, [userId, `%${name}%`]);
    return result || [];
  } catch (error) {
    console.error('Error in getPassengersByName:', error);
    throw error;
  }
};

// 创建乘车人
const createPassenger = async (userId, passengerData) => {
  try {
    const { 
      name, 
      idType, 
      idNumber, 
      phone, 
      discountType, 
      expiryDate, 
      birthDate 
    } = passengerData;
    
    // 检查同一用户下证件号是否已存在
    const existing = await get(
      'SELECT id FROM passengers WHERE user_id = ? AND id_number = ?',
      [userId, idNumber]
    );
    
    if (existing) {
      throw new Error('Passenger with this ID number already exists');
    }
    
    const passengerId = generateId();
    const sql = `
      INSERT INTO passengers (
        id, user_id, name, id_type, id_number, phone, 
        discount_type, expiry_date, birth_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await run(sql, [
      passengerId,
      userId,
      name,
      idType,
      idNumber,
      phone || null,
      discountType || '成人',
      expiryDate || null,
      birthDate || null
    ]);
    
    return {
      passengerId,
      message: 'Passenger created successfully.'
    };
  } catch (error) {
    console.error('Error in createPassenger:', error);
    throw error;
  }
};

// 更新乘车人信息
const updatePassenger = async (passengerId, userId, passengerData) => {
  try {
    // 检查乘车人是否存在且属于当前用户
    const passenger = await get('SELECT id, user_id FROM passengers WHERE id = ? AND user_id = ?', [passengerId, userId]);
    if (!passenger) {
      throw new Error('Passenger not found');
    }
    
    const { 
      name, 
      idType, 
      idNumber, 
      phone, 
      discountType, 
      expiryDate, 
      birthDate 
    } = passengerData;
    
    // 如果更新了证件号，检查是否与其他乘车人冲突
    if (idNumber) {
      const existing = await get(
        'SELECT id FROM passengers WHERE user_id = ? AND id_number = ? AND id != ?',
        [passenger.user_id, idNumber, passengerId]
      );
      
      if (existing) {
        throw new Error('Passenger with this ID number already exists');
      }
    }
    
    const updates = [];
    const params = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (idType !== undefined) {
      updates.push('id_type = ?');
      params.push(idType);
    }
    if (idNumber !== undefined) {
      updates.push('id_number = ?');
      params.push(idNumber);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (discountType !== undefined) {
      updates.push('discount_type = ?');
      params.push(discountType);
    }
    if (expiryDate !== undefined) {
      updates.push('expiry_date = ?');
      params.push(expiryDate);
    }
    if (birthDate !== undefined) {
      updates.push('birth_date = ?');
      params.push(birthDate);
    }
    
    if (updates.length === 0) {
      return false;
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(passengerId);
    
    const sql = `UPDATE passengers SET ${updates.join(', ')} WHERE id = ?`;
    const result = await run(sql, params);
    
    return result.changes > 0;
  } catch (error) {
    console.error('Error in updatePassenger:', error);
    throw error;
  }
};

// 删除单个乘车人
const deletePassenger = async (passengerId, userId) => {
  try {
    // 检查乘车人是否存在且属于当前用户
    const existing = await get('SELECT id FROM passengers WHERE id = ? AND user_id = ?', [passengerId, userId]);
    if (!existing) {
      throw new Error('Passenger not found');
    }
    
    const sql = 'DELETE FROM passengers WHERE id = ? AND user_id = ?';
    const result = await run(sql, [passengerId, userId]);
    return result.changes > 0;
  } catch (error) {
    console.error('Error in deletePassenger:', error);
    throw error;
  }
};

// 批量删除乘车人
const deletePassengers = async (passengerIds, userId) => {
  try {
    if (!Array.isArray(passengerIds) || passengerIds.length === 0) {
      return { deletedCount: 0, message: 'No passenger IDs provided.' };
    }
    
    const placeholders = passengerIds.map(() => '?').join(',');
    const sql = `DELETE FROM passengers WHERE id IN (${placeholders}) AND user_id = ?`;
    const params = [...passengerIds, userId];
    const result = await run(sql, params);
    
    return {
      deletedCount: result.changes,
      message: 'Passengers deleted successfully.'
    };
  } catch (error) {
    console.error('Error in deletePassengers:', error);
    throw error;
  }
};

module.exports = {
  getPassengers,
  getPassengersByName,
  createPassenger,
  updatePassenger,
  deletePassenger,
  deletePassengers
};
