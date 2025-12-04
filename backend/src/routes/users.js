// backend/src/routes/users.js
const express = require('express');
const router = express.Router();
const { isValidUsername } = require('../utils/validators');
const { findUserByUsername } = require('../db/userDb');

// 对应 API-GET-CheckUsername
router.get('/check-username', async (req, res) => {
  const { username } = req.query;
  if (!isValidUsername(username)) {
    return res.status(400).json({ error: 'Invalid username format.' });
  }

  try {
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(200).json({ isAvailable: false, message: '该用户名已经占用，请重新选择用户名！' });
    }
    res.status(200).json({ isAvailable: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
