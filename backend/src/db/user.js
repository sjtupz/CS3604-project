// 实现用户数据库操作
const { get, run } = require('./database');

// 获取用户信息
const getUserInfo = async (userId) => {
  try {
    const sql = `
      SELECT
        id as userId,
        username,
        real_name as realName,
        country,
        id_type as idType,
        id_number as idNumber,
        verification_status as verificationStatus,
        phone_number as phoneNumber,
        email,
        phone_verified as phoneVerified,
        discount_type as discountType,
        student_qualification as studentQualification,
        gender
      FROM users
      WHERE id = ?
    `;
    
    const result = await get(sql, [userId]);
    
    if (!result) {
      return null;
    }

    // 转换phoneVerified为布尔值
    return {
      ...result,
      phoneVerified: Boolean(result.phoneVerified)
    };
  } catch (error) {
    console.error('Error in getUserInfo:', error);
    throw error;
  }
};

// 更新用户联系方式
const updateUserContact = async (userId, contactData) => {
  try {
    const { phoneNumber, email } = contactData;
    
    // 检查用户是否存在
    const user = await getUserInfo(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 构建更新字段
    const updates = [];
    const params = [];
    
    if (phoneNumber !== undefined) {
      updates.push('phone_number = ?');
      params.push(phoneNumber);
    }
    
    if (email !== undefined) {
      updates.push('email = ?');
      params.push(email);
    }

    if (updates.length === 0) {
      return false;
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(userId);

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    const result = await run(sql, params);

    return result.changes > 0;
  } catch (error) {
    console.error('Error in updateUserContact:', error);
    throw error;
  }
};

// 更新用户优惠类型
const updateUserDiscountType = async (userId, discountData) => {
  try {
    const { discountType, studentQualification } = discountData;
    
    // 检查用户是否存在
    const user = await getUserInfo(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const sql = `
      UPDATE users 
      SET discount_type = ?, 
          student_qualification = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const qualificationJson = studentQualification 
      ? JSON.stringify(studentQualification) 
      : null;
    
    const result = await run(sql, [discountType, qualificationJson, userId]);

    return result.changes > 0;
  } catch (error) {
    console.error('Error in updateUserDiscountType:', error);
    throw error;
  }
};

module.exports = {
  getUserInfo,
  updateUserContact,
  updateUserDiscountType
};
