// backend/src/routes/users.js
const express = require('express');
const router = express.Router();
const { isValidUsername } = require('../utils/validators');
const { findUserByUsername, findUserByIdentityNumber, findUserByPhoneNumber } = require('../db/userDb');

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

// Check Identity Number
router.get('/check-identity', async (req, res) => {
  const { identityNumber } = req.query;
  if (!identityNumber) {
    return res.status(400).json({ error: 'Identity number is required.' });
  }

  try {
    const existingUser = await findUserByIdentityNumber(identityNumber);
    if (existingUser) {
      return res.status(200).json({ isAvailable: false, message: '该证件号码已被注册' });
    }
    res.status(200).json({ isAvailable: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Check Phone Number
router.get('/check-phone', async (req, res) => {
  const { phoneNumber } = req.query;
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  try {
    const existingUser = await findUserByPhoneNumber(phoneNumber);
    if (existingUser) {
      return res.status(200).json({ isAvailable: false, message: '您输入的手机号码已被其他注册用户使用' });
    }
    res.status(200).json({ isAvailable: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
