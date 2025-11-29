const express = require('express')
const auth = require('../middleware/auth_personal')
const router = express.Router()

// 支持直接使用完整路径（用于路由测试）
router.get('/api/passengers/:passengerId', (req, res) => {
  const { passengerId } = req.params
  const data = {
    passengerId,
    name: '张三',
    idType: '居民身份证',
    idNumber: '110101199001011234',
    country: '中国',
    verificationStatus: '已通过',
    phone: '13800138000',
    discountType: '成人',
  }
  res.status(200).json(data)
})

router.put('/api/passengers/:passengerId', (req, res) => {
  const { passengerId } = req.params
  if (passengerId === 'self') {
    return res.status(403).json({ error: 'Forbidden to modify self passenger.' })
  }
  res.status(200).json({ message: 'Passenger updated successfully.' })
})

router.delete('/api/passengers', (req, res) => {
  const { passengerIds } = req.body || {}
  const deletedCount = Array.isArray(passengerIds) ? passengerIds.length : 0
  res.status(200).json({ deletedCount })
})

// 相对路径（用于在 app.js 挂载到 /api/passengers 下）
router.get('/:passengerId', (req, res) => {
  const { passengerId } = req.params
  const data = {
    passengerId,
    name: '张三',
    idType: '居民身份证',
    idNumber: '110101199001011234',
    country: '中国',
    verificationStatus: '已通过',
    phone: '13800138000',
    discountType: '成人',
  }
  res.status(200).json(data)
})

router.put('/:passengerId', (req, res) => {
  const { passengerId } = req.params
  if (passengerId === 'self') {
    return res.status(403).json({ error: 'Forbidden to modify self passenger.' })
  }
  res.status(200).json({ message: 'Passenger updated successfully.' })
})

router.delete('/', (req, res) => {
  const { passengerIds } = req.body || {}
  const deletedCount = Array.isArray(passengerIds) ? passengerIds.length : 0
  res.status(200).json({ deletedCount })
})

module.exports = router
