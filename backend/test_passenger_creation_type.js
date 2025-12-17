const axios = require('axios');

async function testPassengerCreationWithType() {
  try {
    // 创建一个简单的JWT token，匹配 auth_personal.js 的格式
    const jwt = require('jsonwebtoken');
    const payload = { 
      id: 'test-user-123',
      userId: 'test-user-123'
    };
    const secret = 'super_secret_jwt_key_123456'; // 与auth_personal.js中的默认密钥一致
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    
    console.log('使用JWT token:', token);

    // 测试使用前端可能发送的格式（type字段）
    console.log('正在创建乘客（使用type字段）...');
    const passengerData = {
      name: '李四',
      idType: '居民身份证',
      idNumber: '110101199001011235',
      phone: '13800138001',
      type: '成人'  // 使用type字段，就像前端发送的那样
    };

    console.log('发送的数据:', passengerData);

    const response = await axios.post('http://localhost:3000/api/passengers', passengerData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('创建乘客成功:', response.data);
  } catch (error) {
    console.error('错误详情:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('错误消息:', error.response.data);
    } else {
      console.error('网络错误:', error.message);
    }
  }
}

testPassengerCreationWithType();