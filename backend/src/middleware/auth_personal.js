// 简单的认证中间件（用于测试）
// 在生产环境中应该使用JWT或其他认证机制

const auth = (req, res, next) => {
  // 从请求头获取token
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. User not logged in.' });
  }

  // 简单的token验证（测试用）
  // 在实际应用中，应该验证JWT token并解析用户信息
  if (token === 'test-token') {
    // 设置测试用户ID
    req.user = { userId: 'test-user-id' };
    next();
  } else {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
};

module.exports = auth;

