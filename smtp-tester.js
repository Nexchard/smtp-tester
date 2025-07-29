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
    fromName,
    toEmail, 
    debugLevel,
    subject, 
    body 
  } = config;

  // 存储调试信息
  let debugLog = [];
  
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

  // 添加调试支持
  if (debugLevel > 0) {
    smtpConfig.logger = {
      debug: function(...args) {
        if (debugLevel >= 3) {
          debugLog.push("[DEBUG] " + args.join(" "));
        }
      },
      info: function(...args) {
        if (debugLevel >= 2) {
          debugLog.push("[INFO] " + args.join(" "));
        }
      },
      warn: function(...args) {
        if (debugLevel >= 1) {
          debugLog.push("[WARN] " + args.join(" "));
        }
      },
      error: function(...args) {
        if (debugLevel >= 1) {
          debugLog.push("[ERROR] " + args.join(" "));
        }
      }
    };
    
    smtpConfig.debug = true;
    smtpConfig.transactionLog = true;
  }

  let transporter;
  
  try {
    // 正确使用nodemailer创建transporter
    transporter = nodemailer.createTransport(smtpConfig);
    
    // 验证连接配置
    await transporter.verify();
    
    // 发送测试邮件
    const mailOptions = {
      from: fromName ? `"${fromName}" <${fromEmail}>` : fromEmail,
      to: toEmail,
      subject: subject,
      text: body,
      html: `<p>${body.replace(/\n/g, '</p><p>')}</p>`
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
        username: requireAuth ? username : "未使用认证",  // 不再隐藏用户名
        fromEmail,
        fromName: fromName || "未指定",
        toEmail,
        debugLevel,
        subject
      },
      response: {
        messageId: info.messageId,
        response: info.response
      },
      debug: debugLevel > 0 ? debugLog : undefined,
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
        username: requireAuth ? username : "未使用认证",  // 不再隐藏用户名
        fromEmail,
        fromName: fromName || "未指定",
        toEmail,
        debugLevel,
        subject
      },
      debug: debugLevel > 0 ? debugLog : undefined,
      timestamp: new Date().toISOString()
    };
  } finally {
    if (transporter) {
      transporter.close();
    }
  }
}

module.exports = { testSMTP };