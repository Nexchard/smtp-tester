const express = require('express');
const path = require('path');
const { testSMTP } = require('./smtp-tester');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// 路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// SMTP测试API端点
app.post('/api/test-smtp', async (req, res) => {
  try {
    // 表单验证
    const requiredFields = ['smtpHost', 'smtpPort', 'fromEmail', 'toEmail'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `缺少必填字段: ${missingFields.join(', ')}`
      });
    }
    
    // 如果需要认证，检查用户名和密码
    if (req.body.requireAuth) {
      if (!req.body.username || !req.body.password) {
        return res.status(400).json({
          success: false,
          error: '启用认证时，用户名和密码为必填项'
        });
      }
    }
    
    const result = await testSMTP(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`SMTP测试服务器运行在端口 ${PORT}`);
});

module.exports = app;