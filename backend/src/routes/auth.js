const express = require('express');
const userService = require('../services/userService');
const router = express.Router();

// JWT中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: '未授权访问' 
    });
  }

  const decoded = userService.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ 
      success: false,
      error: '无效的令牌' 
    });
  }

  req.user = decoded;
  next();
};

// POST /api/login - 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证输入参数
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "请输入用户名和密码"
      });
    }

    // 验证用户名格式
    if (!userService.validateUsername(username) && 
        !userService.validateEmail(username) && 
        !userService.validatePhoneNumber(username)) {
      return res.status(400).json({
        success: false,
        error: "格式错误！"
      });
    }

    // 验证用户凭据
    const validation = await userService.validateUserCredentials(username, password);
    
    if (!validation.isValid) {
      if (validation.error === 'USER_NOT_FOUND') {
        return res.status(401).json({
          success: false,
          error: "用户名或密码错误"
        });
      } else if (validation.error === 'INVALID_PASSWORD') {
        return res.status(401).json({
          success: false,
          error: "用户名或密码错误"
        });
      } else {
        return res.status(500).json({
          success: false,
          error: "服务器错误"
        });
      }
    }

    // 生成JWT令牌
    const token = userService.generateToken(validation.user);
    
    // 更新登录状态
    await userService.updateUserLoginStatus(validation.user.id);

    // 返回成功响应
    res.status(200).json({
      success: true,
      token: token,
      user: {
        id: validation.user.id,
        username: validation.user.username,
        realName: validation.user.real_name,
        phoneNumber: validation.user.phone_number,
        email: validation.user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: "服务器错误"
    });
  }
});

// POST /api/register - 用户注册
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      password,
      confirmPassword,
      idType,
      realName,
      idNumber,
      discountType,
      phoneNumber,
      email,
      agreeTerms
    } = req.body;

    // 验证必填字段
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: "请输入手机号"
      });
    }

    const requiredFields = {
      username: "用户名",
      password: "密码",
      realName: "姓名",
      idType: "证件类型",
      idNumber: "证件号码",
      discountType: "优惠类型"
    };

    for (const [field, displayName] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          error: `❌请输入${displayName}`
        });
      }
    }

    // 验证密码确认
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "两次输入的密码不一致"
      });
    }

    // 验证格式
    if (!userService.validateUsername(username)) {
      return res.status(400).json({
        success: false,
        error: "格式错误！"
      });
    }

    if (email && !userService.validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "请输入有效的电子邮箱地址！"
      });
    }

    if (!userService.validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        error: "格式错误！"
      });
    }

    if (!userService.validateIdNumber(idNumber)) {
      return res.status(400).json({
        success: false,
        error: "请正确输入18位的证件号码！"
      });
    }

    // 检查用户是否已存在
    const existsCheck = await userService.checkUserExists(username, phoneNumber, idNumber);
    if (existsCheck.exists) {
      if (existsCheck.conflicts.includes('idNumber')) {
        return res.status(409).json({
          success: false,
          error: "证件号码已被注册"
        });
      } else if (existsCheck.conflicts.includes('username')) {
        return res.status(409).json({
          success: false,
          error: "用户名已存在"
        });
      } else if (existsCheck.conflicts.includes('phoneNumber')) {
        return res.status(409).json({
          success: false,
          error: "手机号已被注册"
        });
      }
    }

    // 创建用户
    const userData = {
      username,
      password,
      realName,
      idType,
      idNumber,
      discountType,
      phoneNumber,
      email
    };

    const userId = await userService.createUser(userData);

    // 返回成功响应
    res.status(201).json({
      success: true,
      user: {
        id: userId,
        username: userData.username,
        realName: userData.realName,
        phoneNumber: userData.phoneNumber,
        email: userData.email
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: "服务器错误"
    });
  }
});

// GET /api/profile - 获取用户资料
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await userService.findUserByUsername(req.user.username);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "用户不存在"
      });
    }

    // 返回用户信息（不包含敏感信息）
    res.status(200).json({
      success: true,
      userId: user.id,
      username: user.username,
      realName: user.real_name,
      phoneNumber: user.phone_number,
      email: user.email
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      error: "服务器错误"
    });
  }
});

module.exports = router;