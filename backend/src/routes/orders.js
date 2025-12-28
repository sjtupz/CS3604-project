const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// GET /api/orders
// 获取订单列表，支持状态筛选和关键词搜索
router.get('/', auth, orderController.listOrders);

// POST /api/orders
// 提交订单请求，锁定席位并创建订单记录。
router.post('/', auth, orderController.createOrder);

// GET /api/orders/:orderId
// 获取订单详细信息，用于订单确认页展示。
router.get('/:orderId', auth, orderController.getOrderDetails);

// POST /api/orders/:orderId/confirm
// 确认订单并进入支付流程。
router.post('/:orderId/confirm', auth, orderController.confirmOrder);

// POST /api/orders/:orderId/cancel
// 取消订单并释放席位。
router.post('/:orderId/cancel', auth, orderController.cancelOrder);

// GET /api/orders/:orderId/status
router.get('/:orderId/status', auth, orderController.getOrderStatus);

// POST /api/orders/:orderId/pay
router.post('/:orderId/pay', auth, orderController.payOrder);

module.exports = router;
