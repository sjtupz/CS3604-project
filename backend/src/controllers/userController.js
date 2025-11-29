// TODO: 实现用户控制器
const userService = require('../services/userService');

// 获取用户信息
const getUserInfo = async (req, res) => {
  try {
    // 从认证中间件获取用户ID
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User not logged in.' });
    }

    const userInfo = await userService.getUserInfo(userId);

    if (!userInfo) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error getting user info:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// 更新用户联系方式
const updateUserContact = async (req, res) => {
  try {
    // 从认证中间件获取用户ID
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User not logged in.' });
    }
    const contactData = req.body;

    await userService.updateUserContact(userId, contactData);

    res.status(200).json({ message: 'Contact information updated successfully.' });
  } catch (error) {
    console.error('Error updating user contact:', error);
    res.status(400).json({ error: 'Invalid input format.' });
  }
};

// 更新用户优惠类型
const updateUserDiscountType = async (req, res) => {
  try {
    // 从认证中间件获取用户ID
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User not logged in.' });
    }
    const discountData = req.body;

    await userService.updateUserDiscountType(userId, discountData);

    res.status(200).json({ message: 'Discount type updated successfully.' });
  } catch (error) {
    console.error('Error updating user discount type:', error);
    res.status(400).json({ error: 'Invalid discount type.' });
  }
};

module.exports = {
  getUserInfo,
  updateUserContact,
  updateUserDiscountType
};
