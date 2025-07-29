const nodemailer = require('nodemailer');

/**
 * 测试SMTP连接
 * @param {Object} config - SMTP配置
 * @returns {Promise<Object>} 测试结果
 */
async function testSMTP(config) {
  const { 
    smtpHost, 
    smtpPort, 
    useSSL, 
    requireAuth,
    username, 
    password, 
    fromEmail, 
    toEmail, 
    subject, 
    body 
  } = config;

  // 根据SSL选项配置连接
  const smtpConfig = {
    host: smtpHost,
    port: smtpPort,
    secure: useSSL === 'ssl', // true for 465, false for other ports
    tls: {
      rejectUnauthorized: false // 在测试环境中忽略证书错误
    }
  };

  // 如果需要认证，则添加认证信息
  if (requireAuth) {
    smtpConfig.auth = {
      user: username,
      pass: password
    };
  }

  // 如果使用STARTTLS，在587端口
  if (useSSL === 'tls') {
    smtpConfig.requireTLS = true;
  }

  let transporter;
  try {
    transporter = nodemailer.createTransporter(smtpConfig);
    
    // 验证连接配置
    await transporter.verify();
    
    // 发送测试邮件
    const mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject: subject,
      text: body
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      message: 'SMTP测试成功',
      config: {
        smtpHost,
        smtpPort,
        useSSL,
        requireAuth,
        username: requireAuth ? "***" : "未使用认证",
        fromEmail,
        toEmail,
        subject
      },
      response: {
        messageId: info.messageId,
        response: info.response
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      message: 'SMTP测试失败',
      error: {
        message: error.message,
        code: error.code,
        command: error.command
      },
      config: {
        smtpHost,
        smtpPort,
        useSSL,
        requireAuth,
        username: requireAuth ? "***" : "未使用认证",
        fromEmail,
        toEmail,
        subject
      },
      timestamp: new Date().toISOString()
    };
  } finally {
    if (transporter) {
      transporter.close();
    }
  }
}

module.exports = { testSMTP };