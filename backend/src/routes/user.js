// 实现用户相关路由
const express = require('express');
const router = express.Router();

// 导入控制器
const userController = require('../controllers/userController');

// 导入中间件
const auth = require('../middleware/auth');

// GET /api/user/info - 获取用户信息
router.get('/info', auth, userController.getUserInfo);

// PUT /api/user/contact - 更新用户联系方式
router.put('/contact', auth, userController.updateUserContact);

// PUT /api/user/discount-type - 更新用户优惠类型
router.put('/discount-type', auth, userController.updateUserDiscountType);

module.exports = router;
