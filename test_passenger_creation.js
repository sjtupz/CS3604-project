const jwt = require('jsonwebtoken');
const axios = require('axios');

async function testPassengerCreation() {
  try {
    // 创建一个有效的JWT token
    const payload = { 
      id: 'test-user-123',
      username: 'testuser'
    };
    const secret = 'dev-secret';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    
    console.log('使用JWT token:', token);

    // 测试创建乘客
    console.log('正在创建乘客...');
    const passengerData = {
      name: '张三',
      idType: '居民身份证',
      idNumber: '110101199001011234',
      phone: '13800138000',
      discountType: '成人'
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

testPassengerCreation();