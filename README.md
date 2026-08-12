# 记账app

一款面向个人用户的轻量级 H5 记账应用，帮助用户轻松记录日常收支、管理预算、分析消费习惯。采用活泼可爱的设计风格，让记账不再枯燥。

## 功能特性

- **收支记录**：快速记录每日收入/支出，支持分类、备注、日期、账本选择
- **数据统计**：周报/月报/年报图表，分类占比饼图，趋势折线图，消费排行
- **预算管理**：月度总预算 + 分类预算，进度可视化，超支提醒
- **多账本**：创建多个独立账本，支持切换和归档
- **账单导入**：解析支付宝/微信 CSV 账单文件，智能匹配分类
- **数据导出**：一键导出为 CSV 文件
- **PWA 支持**：可安装到桌面/主屏，离线可用

## 技术栈

| 层级 | 技术 |
|------|------|
| 语言 | TypeScript |
| 框架 | React 18 |
| 构建 | Vite 5 |
| 路由 | React Router 6 |
| 状态管理 | Zustand |
| 组件库 | Ant Design Mobile |
| 样式 | TailwindCSS |
| 图表 | ECharts (echarts-for-react) |
| 本地存储 | Dexie.js (IndexedDB) |
| 日期处理 | dayjs |
| 测试 | Vitest + React Testing Library |

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式（默认端口 5173）
npm run dev

# 构建生产版本
npm run build

# 预览构建产物
npm run preview

# 运行测试
npm run test
```

## 项目结构

```
heimaAPP/
├── docs/               # 产品文档（PRD、技术架构、目录结构、UI 规范）
├── public/             # 静态资源
├── src/
│   ├── components/     # 通用组件（ui / business / layout）
│   ├── pages/          # 页面组件
│   ├── stores/         # Zustand 状态管理
│   ├── services/       # 服务层（数据库、统计、导入导出）
│   ├── hooks/          # 自定义 Hooks
│   ├── utils/          # 工具函数
│   ├── types/          # TypeScript 类型定义
│   └── data/           # 预设数据
├── docs/               # 详细文档
├── AGENTS.md           # AI 编码助手项目指南
└── index.html          # HTML 入口
```

## 页面路由

| 页面 | 路由 |
|------|------|
| 首页 | `/` |
| 记账页 | `/add` |
| 统计页 | `/stats` |
| 预算页 | `/budget` |
| 个人中心 | `/profile` |
| 账本管理 | `/books` |
| 记录详情 | `/detail/:id` |
| 分类管理 | `/categories` |
| 账单导入 | `/import` |

## 数据存储

所有数据存储在本地浏览器数据库（IndexedDB）中，无需后端服务器。数据仅保存在本机浏览器中，**换浏览器或清理浏览器数据会导致数据丢失**。

## 版本规划

- **v1.0**：收支记录、数据统计、预算管理、多账本、数据导出、账单导入
- **v1.5**：账单导入增强、数据导出增强、自定义分类、周报/年报
- **v2.0**：云同步（注册登录）、暗黑模式、记账提醒、AI 消费分析

## 文档

- [产品需求文档 (PRD)](docs/PRD.md)
- [技术架构文档](docs/TECH_ARCHITECTURE.md)
- [项目目录结构](docs/PROJECT_STRUCTURE.md)
- [UI 设计规范](docs/UI_DESIGN_SPEC.md)

## 许可证

本项目仅供学习交流使用。