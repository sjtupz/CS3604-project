// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

// 对应 API-POST-Register
router.post('/register', async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({ message: 'Registration successful, please proceed to login.', userId: result.id });
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
});

module.exports = router;
