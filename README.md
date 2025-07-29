# SMTP 测试工具

一个基于Node.js的SMTP服务器测试工具，可一键部署到Vercel。

## 功能特性

- 测试SMTP服务器连接
- 验证SMTP认证信息
- 发送测试邮件以验证SMTP功能
- 支持SSL/TLS配置
- 提供详细的调试信息

## 部署到Vercel

### 先决条件

1. Vercel账户
2. GitHub账户
3. 已配置的SMTP服务器信息

### 部署步骤

1. Fork此仓库到你的GitHub账户
2. 登录到Vercel仪表板
3. 点击"New Project"
4. 选择你Fork的仓库
5. 保持默认的构建设置
6. 点击"Deploy"

Vercel会自动检测这是一个Node.js项目并正确配置。

## 本地开发

安装依赖:
```bash
npm install
```

运行开发服务器:
```bash
npm run dev
```

服务器将在 `http://localhost:3000` 上运行。