// 实现Express应用入口
const express = require('express');
const cors = require('cors');

// 导入路由
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/orders');
const passengerRoutes = require('./routes/passengers');

const app = express();

// 配置中间件
app.use(cors());
app.use(express.json());

// 注册路由
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/passengers', passengerRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 启动服务器（如果直接运行此文件）
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
