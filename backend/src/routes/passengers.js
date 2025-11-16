// 实现乘车人相关路由
const express = require('express');
const router = express.Router();

// 导入控制器
const passengerController = require('../controllers/passengerController');

// 导入中间件
const auth = require('../middleware/auth');

// GET /api/passengers - 获取乘车人列表
router.get('/', auth, passengerController.getPassengers);

// POST /api/passengers - 创建乘车人
router.post('/', auth, passengerController.createPassenger);

// PUT /api/passengers/:passengerId - 更新乘车人
router.put('/:passengerId', auth, passengerController.updatePassenger);

// DELETE /api/passengers/:passengerId - 删除单个乘车人
router.delete('/:passengerId', auth, passengerController.deletePassenger);

// DELETE /api/passengers - 批量删除乘车人
router.delete('/', auth, passengerController.deletePassengers);

module.exports = router;
