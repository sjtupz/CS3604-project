// TODO: 实现用户服务层
const { getUserInfo, updateUserContact, updateUserDiscountType } = require('../db/user');

class UserService {
  // 获取用户信息
  async getUserInfo(userId) {
    try {
      return await getUserInfo(userId);
    } catch (error) {
      console.error('Error in getUserInfo:', error);
      throw error;
    }
  }

  // 更新用户联系方式
  async updateUserContact(userId, contactData) {
    try {
      // TODO: 验证输入数据
      if (!contactData.phoneNumber && !contactData.email) {
        throw new Error('At least one contact method must be provided');
      }

      await updateUserContact(userId, contactData);
      return true;
    } catch (error) {
      console.error('Error in updateUserContact:', error);
      throw error;
    }
  }

  // 更新用户优惠类型
  async updateUserDiscountType(userId, discountData) {
    try {
      const { discountType, studentQualification } = discountData;

      // TODO: 验证优惠类型
      const validDiscountTypes = ['成人', '儿童', '学生', '残疾军人'];
      if (!validDiscountTypes.includes(discountType)) {
        throw new Error('Invalid discount type');
      }

      // 如果选择学生类型，必须提供学生资质信息
      if (discountType === '学生' && !studentQualification) {
        throw new Error('Student qualification required for student discount type');
      }

      await updateUserDiscountType(userId, discountData);
      return true;
    } catch (error) {
      console.error('Error in updateUserDiscountType:', error);
      throw error;
    }
  }
}

module.exports = new UserService();
