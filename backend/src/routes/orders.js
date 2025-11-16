// 实现订单相关路由
const express = require('express');
const router = express.Router();

// 导入控制器
const orderController = require('../controllers/orderController');

// 导入中间件
const auth = require('../middleware/auth');

// GET /api/orders - 获取订单列表
router.get('/', auth, orderController.getOrders);

// POST /api/orders/:orderId/refund - 处理退票申请
router.post('/:orderId/refund', auth, orderController.processRefund);

module.exports = router;
