// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const passengerDb = require('../db/passenger');
const loginSendCodeService = require('../services/loginSendCode');
const loginVerifyService = require('../services/loginVerify');

// 对应 API-POST-Register
router.post('/register', async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    
    // Create self passenger record automatically
    try {
      const { fullName, identityType, identityNumber, phoneNumber, passengerType } = req.body;
      if (fullName && identityNumber) {
        await passengerDb.createPassenger(result.id, {
          name: fullName,
          idType: identityType || '中国居民身份证',
          idNumber: identityNumber,
          phone: phoneNumber,
          discountType: passengerType || '成人'
        });
      }
    } catch (passErr) {
      console.warn('Failed to auto-create passenger record:', passErr);
      // Non-fatal error, continue
    }

    res.status(201).json({ message: 'Registration successful, please proceed to login.' });
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
});

router.post('/login/send-code', async (req, res) => {
  try {
    const { identifier, idLast4 } = req.body || {};
    const { resolveUserByIdentifier } = loginSendCodeService;
    const user = await resolveUserByIdentifier(identifier);

    if (!user) {
      return res.status(404).json({ error: '请输入正确的用户信息！' });
    }

    const last4 = (user.identityNumber || '').slice(-4);
    if (!idLast4 || last4 !== idLast4) {
      return res.status(422).json({ error: '请输入正确的用户信息！' });
    }
    const { generateSixDigitCode } = require('../utils/validators');
    const code = generateSixDigitCode();
    await loginSendCodeService.handleSendCode({ identifier, idLast4, code });
    console.log(`[DEV] 发送验证码到 ${/^\d{11}$/.test(identifier) ? '+86' : ''} ${identifier}: CODE=${code}`);
    res.status(200).json({ message: '获取手机验证码成功！' });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Internal Server Error' });
  }
});

router.post('/login/verify', async (req, res) => {
  try {
    const result = await loginVerifyService.handleVerify(req.body);
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Internal Server Error' });
  }
});

router.post('/forgot/send-code', async (req, res) => {
  try {
    const { phoneNumber, idLast4, countryCode } = req.body || {};
    if (!/^\d{11}$/.test(phoneNumber || '')) {
      return res.status(422).json({ error: '请输入正确的用户信息！' });
    }
    if (!idLast4 || String(idLast4).length !== 4) {
      return res.status(422).json({ error: '请输入正确的用户信息！' });
    }
    const { generateSixDigitCode } = require('../utils/validators');
    const code = generateSixDigitCode();
    await loginSendCodeService.handleSendCode({ identifier: phoneNumber, idLast4, code });
    console.log(`[DEV] 发送验证码到 ${countryCode || '+86'} ${phoneNumber}: CODE=${code}`);
    res.status(200).json({ message: '获取手机验证码成功！' });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Internal Server Error' });
  }
});

router.post('/forgot/verify', async (req, res) => {
  try {
    const { phoneNumber, code } = req.body || {};
    if (!code) {
      return res.status(400).json({ error: '请输入验证码' });
    }
    const { findLoginCodeRecord } = require('../db/findLoginCodeRecord');
    const { invalidateLoginCodeRecord } = require('../db/invalidateLoginCodeRecord');
    const record = await findLoginCodeRecord({ identifier: phoneNumber });
    if (!record || record.valid === 0 || record.code !== code) {
      return res.status(401).json({ error: '验证码校验失败' });
    }
    await invalidateLoginCodeRecord({ identifier: phoneNumber });
    res.status(200).json({ ok: true });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Internal Server Error' });
  }
});

router.post('/forgot/reset', async (req, res) => {
  try {
    const { phoneNumber, newPassword } = req.body || {};
    const bcrypt = require('bcrypt');
    const userDb = require('../db/userDb');
    const user = await userDb.findUserByPhoneNumber(phoneNumber);
    if (!user) {
      return res.status(404).json({ error: '请输入正确的用户信息！' });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await userDb.updateUserPasswordByPhone(phoneNumber, hashed);
    res.status(200).json({ ok: true });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Internal Server Error' });
  }
});

router.post('/register/send-code', async (req, res) => {
  try {
    const { phoneNumber } = req.body || {};
    const { handleRegisterSendCode } = require('../services/registerSendCode');
    const result = await handleRegisterSendCode({ phoneNumber });
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Internal Server Error' });
  }
});

router.post('/register/verify', async (req, res) => {
  try {
    const { handleRegisterVerify } = require('../services/registerVerify');
    const result = await handleRegisterVerify(req.body);
    res.status(201).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Internal Server Error' });
  }
});

module.exports = router;
