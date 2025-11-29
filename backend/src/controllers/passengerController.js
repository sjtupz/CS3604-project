// 实现乘车人控制器
const passengerService = require('../services/passengerService');

// 获取乘车人列表
const getPassengers = async (req, res) => {
  try {
    // 从认证中间件获取用户ID
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User not logged in.' });
    }
    
    const queryParams = req.query;
    const passengers = await passengerService.getPassengers(userId, queryParams);

    res.status(200).json({ passengers });
  } catch (error) {
    console.error('Error getting passengers:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// 创建乘车人
const createPassenger = async (req, res) => {
  try {
    // 从认证中间件获取用户ID
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User not logged in.' });
    }
    
    const passengerData = req.body;
    const result = await passengerService.createPassenger(userId, passengerData);

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating passenger:', error);
    if (error.message.includes('required') || error.message.includes('format') || error.message.includes('请输入')) {
      res.status(400).json({ error: 'Invalid input format or validation failed.' });
    } else if (error.message.includes('exists') || error.message.includes('already')) {
      res.status(409).json({ error: 'Passenger already exists.' });
    } else {
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
};

// 更新乘车人
const updatePassenger = async (req, res) => {
  try {
    // 从认证中间件获取用户ID
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User not logged in.' });
    }
    
    const { passengerId } = req.params;
    const passengerData = req.body;

    await passengerService.updatePassenger(passengerId, userId, passengerData);

    res.status(200).json({ message: 'Passenger updated successfully.' });
  } catch (error) {
    console.error('Error updating passenger:', error);
    if (error.message === 'Passenger not found') {
      res.status(404).json({ error: 'Passenger not found.' });
    } else if (error.message.includes('format') || error.message.includes('请输入')) {
      res.status(400).json({ error: 'Invalid input format or validation failed.' });
    } else if (error.message.includes('exists') || error.message.includes('already')) {
      res.status(409).json({ error: 'Passenger already exists.' });
    } else {
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
};

// 删除单个乘车人
const deletePassenger = async (req, res) => {
  try {
    // 从认证中间件获取用户ID
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User not logged in.' });
    }
    
    const { passengerId } = req.params;

    await passengerService.deletePassenger(passengerId, userId);

    res.status(200).json({ message: 'Passenger deleted successfully.' });
  } catch (error) {
    console.error('Error deleting passenger:', error);
    if (error.message === 'Passenger not found') {
      res.status(404).json({ error: 'Passenger not found.' });
    } else {
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
};

// 批量删除乘车人
const deletePassengers = async (req, res) => {
  try {
    // 从认证中间件获取用户ID
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User not logged in.' });
    }
    
    const { passengerIds } = req.body;

    if (!Array.isArray(passengerIds) || passengerIds.length === 0) {
      return res.status(400).json({ error: 'Passenger IDs array is required.' });
    }

    const result = await passengerService.deletePassengers(passengerIds, userId);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting passengers:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  getPassengers,
  createPassenger,
  updatePassenger,
  deletePassenger,
  deletePassengers
};
