const express = require('express')
const auth = require('../middleware/auth_personal')
const passengerService = require('../services/passengerService')
const router = express.Router()

// GET /api/passengers
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId
    const { name, page = 1, pageSize = 20 } = req.query
    
    const allPassengers = await passengerService.getPassengers(userId, { name })
    
    // Simple pagination (in-memory for now since we merge sources)
    const total = allPassengers.length
    const startIndex = (Number(page) - 1) * Number(pageSize)
    const endIndex = startIndex + Number(pageSize)
    const items = allPassengers.slice(startIndex, endIndex)

    res.status(200).json({
      code: 200,
      data: {
        items,
        pagination: {
          total,
          currentPage: Number(page),
          perPage: Number(pageSize),
          totalPages: Math.ceil(total / Number(pageSize))
        }
      }
    })
  } catch (error) {
    console.error('Get passengers error:', error)
    res.status(500).json({ code: 50006, message: '获取乘车人列表失败' })
  }
})

// POST /api/passengers
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId
    const result = await passengerService.createPassenger(userId, req.body)
    res.status(201).json({
      code: 201,
      message: '添加成功',
      data: { id: result.passengerId }
    })
  } catch (error) {
    console.error('Create passenger error:', error)
    if (error.message.includes('请输入') || error.message.includes('不合法') || error.message.includes('身份信息不一致') || error.message.includes('证件号码')) {
       return res.status(400).json({ error: error.message, code: 40004, message: error.message })
    }
    if (error.message.includes('exists')) {
       return res.status(409).json({ error: '乘车人已存在', code: 40901, message: '乘车人已存在' })
    }
    res.status(500).json({ error: '添加乘车人失败', code: 50007, message: '添加乘车人失败' })
  }
})

// PUT /api/passengers/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId
    const { id } = req.params
    
    // Check if trying to update self via this API
    // (Assuming user ID is UUID and matches 'id' param)
    if (id === userId) {
        // Requirement 5.1.8.6 implies Self is not editable in this list context via standard Edit button?
        // But 5.1.9 says we can edit Contact/Additional info.
        // If frontend calls this for Self, we should probably allow updating user fields (phone/discountType).
        // However, userDb doesn't support updating these easily yet. 
        // For now, let's assume we update "passenger" table.
        // If the ID is the user ID, it won't be in passengers table, so updatePassenger will fail or return false.
        
        // Let's see if we should implement user update here.
        // For TDD RED phase, let's just try to update passenger.
    }

    const success = await passengerService.updatePassenger(id, userId, req.body)
    if (!success) {
      // If not found in passengers table, maybe it's the user?
      if (id === userId) {
         // TODO: Implement user update logic if required.
         // For now, return 403 or 404?
         // Requirement says "Self row... Operation column has NO buttons".
         // So frontend shouldn't be calling this for Self.
         return res.status(403).json({ code: 40301, message: '无权修改该乘车人' })
      }
      return res.status(404).json({ code: 40402, message: '乘车人不存在' })
    }
    
    res.status(200).json({ code: 200, message: '修改成功' })
  } catch (error) {
    console.error('Update passenger error:', error)
    if (error.message === 'Passenger not found') {
      return res.status(404).json({ code: 40402, message: '乘车人不存在' })
    }
    res.status(500).json({ code: 500, message: '修改失败' })
  }
})

// DELETE /api/passengers
router.delete('/', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId
    const { ids } = req.body
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ code: 400, message: '参数错误' })
    }

    // Check if Self is in the list
    if (ids.includes(userId)) {
      return res.status(400).json({ code: 40005, message: '无法删除本人' })
    }

    const result = await passengerService.deletePassengers(ids, userId)
    res.status(200).json({
      code: 200,
      message: '删除成功',
      deletedCount: result.deletedCount
    })
  } catch (error) {
    console.error('Delete passengers error:', error)
    res.status(500).json({ code: 50008, message: '删除失败' })
  }
})

module.exports = router
