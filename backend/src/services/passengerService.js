// 实现乘车人服务层
const {
  getPassengers,
  getPassengersByName,
  createPassenger,
  updatePassenger,
  deletePassenger,
  deletePassengers
} = require('../db/passenger');

class PassengerService {
  // 获取用户的乘车人列表
  async getPassengers(userId) {
    try {
      return await getPassengers(userId);
    } catch (error) {
      console.error('Error in getPassengers:', error);
      throw error;
    }
  }

  // 根据姓名筛选乘车人
  async getPassengersByName(userId, name) {
    try {
      return await getPassengersByName(userId, name);
    } catch (error) {
      console.error('Error in getPassengersByName:', error);
      throw error;
    }
  }

  // 创建乘车人
  async createPassenger(userId, passengerData) {
    try {
      // 验证必填字段
      const { name, idType, idNumber } = passengerData;
      if (!name || !idType || !idNumber) {
        throw new Error('Name, ID type and ID number are required');
      }

      // 验证证件号格式
      this.validateIdNumber(idType, idNumber);

      // 验证姓名格式
      this.validateName(idType, name);

      // 创建乘车人
      const result = await createPassenger(userId, passengerData);

      return result;
    } catch (error) {
      console.error('Error in createPassenger:', error);
      throw error;
    }
  }

  // 更新乘车人信息
  async updatePassenger(passengerId, userId, passengerData) {
    try {
      // 如果更新了证件号，验证格式
      if (passengerData.idNumber) {
        this.validateIdNumber(passengerData.idType || '居民身份证', passengerData.idNumber);
      }

      // 如果更新了姓名，验证格式
      if (passengerData.name) {
        this.validateName(passengerData.idType || '居民身份证', passengerData.name);
      }

      const success = await updatePassenger(passengerId, userId, passengerData);
      if (!success) {
        throw new Error('Passenger not found');
      }

      return true;
    } catch (error) {
      console.error('Error in updatePassenger:', error);
      throw error;
    }
  }

  // 删除单个乘车人
  async deletePassenger(passengerId, userId) {
    try {
      await deletePassenger(passengerId, userId);
      return true;
    } catch (error) {
      console.error('Error in deletePassenger:', error);
      throw error;
    }
  }

  // 批量删除乘车人
  async deletePassengers(passengerIds, userId) {
    try {
      if (!Array.isArray(passengerIds) || passengerIds.length === 0) {
        throw new Error('Passenger IDs array is required');
      }

      const result = await deletePassengers(passengerIds, userId);
      return result;
    } catch (error) {
      console.error('Error in deletePassengers:', error);
      throw error;
    }
  }

  // 验证证件号格式
  validateIdNumber(idType, idNumber) {
    if (!idNumber) return;
    
    // 居民身份证：18位数字，最后一位可能是X
    if (idType === '居民身份证') {
      const idRegex = /^\d{17}[\dXx]$/;
      if (!idRegex.test(idNumber)) {
        throw new Error('Invalid ID number format for resident ID');
      }
    }
    // 其他证件类型的验证可以在这里添加
  }

  // 验证姓名格式
  validateName(idType, name) {
    // 居民身份证、港澳居民来往大陆通行证、中国护照：只能包含中文或英文
    if (['居民身份证', '港澳居民来往大陆通行证', '中国护照'].includes(idType)) {
      const nameRegex = /^[\u4e00-\u9fa5a-zA-Z]+$/;
      if (!nameRegex.test(name)) {
        throw new Error('姓名只能包含中文或英文');
      }
    }
    // 外国护照：只能为英文或空格
    else if (idType === '外国护照') {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(name)) {
        throw new Error('姓名只能为英文或空格');
      }
    }
  }
}

module.exports = new PassengerService();
