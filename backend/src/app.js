const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const database = require('./config/database');

// 导入路由
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 连接数据库
database.connect(process.env.NODE_ENV === 'test');

// 路由
app.use('/api', authRoutes);
app.use('/api', ticketRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: '12306 Backend Service is running' });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 启动服务器
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;