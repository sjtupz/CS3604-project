// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const loginSendCodeService = require('../services/loginSendCode');
const loginVerifyService = require('../services/loginVerify');

// 对应 API-POST-Register
router.post('/register', async (req, res) => {
  try {
    await authService.registerUser(req.body);
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

    await loginSendCodeService.handleSendCode({ identifier, idLast4 });
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
module.exports = router;
