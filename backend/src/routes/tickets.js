const express = require('express');
const router = express.Router();

// POST /api/queryTickets - 查询车票
router.post('/queryTickets', async (req, res) => {
  try {
    const { departure, destination, departureDate, isStudent, isHighSpeed } = req.body;

    // 验证必填参数
    if (!departure || !destination || !departureDate) {
      return res.status(400).json({
        error: "查询参数错误"
      });
    }

    // 验证日期格式
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(departureDate)) {
      return res.status(400).json({
        error: "查询参数错误"
      });
    }

    // 验证日期不能是过去的日期
    const queryDate = new Date(departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (queryDate < today) {
      return res.status(400).json({
        error: "查询参数错误"
      });
    }

    // 模拟车票数据（预留接口，返回空数组）
    const tickets = [];

    // 返回查询结果
    res.status(200).json({
      tickets: tickets
    });

  } catch (error) {
    console.error('Query tickets error:', error);
    res.status(500).json({
      error: "服务器错误"
    });
  }
});

module.exports = router;