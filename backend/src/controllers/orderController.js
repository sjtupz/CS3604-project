// 实现订单控制器
const orderService = require('../services/orderService');

// 获取订单列表
const getOrders = async (req, res) => {
  try {
    // 从认证中间件获取用户ID
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User not logged in.' });
    }
    
    const queryParams = req.query;
    const orders = await orderService.getOrders(userId, queryParams);

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(400).json({ error: 'Invalid query parameters.' });
  }
};

// 处理退票申请
const processRefund = async (req, res) => {
  try {
    // 从认证中间件获取用户ID
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User not logged in.' });
    }
    
    const { orderId } = req.params;
    const refundData = req.body; // { refundFee }

    const refundResult = await orderService.processRefund(orderId, refundData); 

    res.status(200).json({
      orderId: refundResult.orderId,
      refundFee: refundResult.refundFee || 0,
      refundDate: refundResult.refundDate,
      message: 'Refund processed successfully.'
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    if (error.message === 'Order not found') {
      res.status(404).json({ error: 'Order not found.' });
    } else if (error.message === 'Order cannot be refunded') {
      res.status(400).json({ error: 'Order cannot be refunded.' });
    } else {
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
};

module.exports = {
  getOrders,
  processRefund
};
