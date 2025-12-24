// 实现订单控制器
const orderService = require('../services/orderService');

/**
 * 提交订单请求 (API-POST-Orders)
 */
const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ code: 401, message: '请先登录' });
    }

    const orderData = req.body;
    const result = await orderService.createOrder(userId, orderData);

    res.status(201).json({
      code: 201,
      data: {
        orderId: result.id,
        orderNumber: result.orderNumber,
        expireAt: result.expireAt
      }
    });
  } catch (error) {
    console.error('Error in createOrder:', error);
    const statusCode = error.code ? (error.code.toString().startsWith('4') ? 400 : 500) : 500;
    res.status(statusCode).json({
      code: error.code || 50009,
      message: error.message || '网络忙，请稍后再试'
    });
  }
};

/**
 * 获取订单详情 (API-GET-Order-Details)
 */
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderDetails(orderId);
    res.status(200).json({
      code: 200,
      data: order
    });
  } catch (error) {
    console.error('Error in getOrderDetails:', error);
    res.status(error.code || 404).json({
      code: error.code || 404,
      message: error.message || '订单未找到'
    });
  }
};

/**
 * 确认订单 (API-POST-Order-Confirm)
 */
const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    await orderService.confirmOrder(orderId);
    res.status(200).json({
      code: 200,
      message: '订单已确认，请尽快支付'
    });
  } catch (error) {
    console.error('Error in confirmOrder:', error);
    res.status(400).json({
      code: 400,
      message: error.message
    });
  }
};

/**
 * 取消订单 (API-POST-Order-Cancel)
 */
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    await orderService.cancelOrder(orderId);
    res.status(200).json({
      code: 200,
      message: '订单已取消'
    });
  } catch (error) {
    console.error('Error in cancelOrder:', error);
    res.status(400).json({
      code: 400,
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrderDetails,
  confirmOrder,
  cancelOrder
};
