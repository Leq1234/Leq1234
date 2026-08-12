# 黑马记账 App - 项目目录结构

## 项目根目录

```
heimaAPP/
├── docs/                          # 📚 产品文档
│   ├── PRD.md                     # 产品需求文档
│   ├── TECH_ARCHITECTURE.md       # 技术架构文档
│   ├── PROJECT_STRUCTURE.md       # 项目目录结构（本文件）
│   └── UI_DESIGN_SPEC.md          # UI 设计规范
│
├── public/                        # 🌐 静态资源（不经过构建）
│   ├── favicon.ico                # 网站图标
│   ├── logo-192.png               # PWA 图标 192x192
│   ├── logo-512.png               # PWA 图标 512x512
│   └── manifest.json              # PWA 配置清单
│
├── src/                           # 📦 源代码
│   ├── main.tsx                   # 应用入口
│   ├── App.tsx                    # 根组件（路由配置）
│   ├── index.css                  # 全局样式 + Tailwind 引入
│   ├── vite-env.d.ts              # Vite 类型声明
│   │
│   ├── assets/                    # 🎨 静态资源（经过构建处理）
│   │   ├── icons/                 # 分类图标 SVG
│   │   │   ├── expense/           # 支出分类图标
│   │   │   │   ├── food.svg
│   │   │   │   ├── transport.svg
│   │   │   │   ├── shopping.svg
│   │   │   │   └── ...
│   │   │   └── income/            # 收入分类图标
│   │   │       ├── salary.svg
│   │   │       ├── bonus.svg
│   │   │       └── ...
│   │   └── images/                # 其他图片
│   │       ├── empty-state.svg    # 空状态插画
│   │       └── logo.svg           # App Logo
│   │
│   ├── components/                # 🧩 通用组件
│   │   ├── ui/                    # 基础 UI 组件
│   │   │   ├── AmountDisplay.tsx  # 金额显示组件
│   │   │   ├── AmountInput.tsx    # 金额输入键盘
│   │   │   ├── CategoryIcon.tsx   # 分类图标组件
│   │   │   ├── DatePicker.tsx     # 日期选择器
│   │   │   ├── EmptyState.tsx     # 空状态占位
│   │   │   ├── ProgressBar.tsx    # 进度条
│   │   │   └── index.ts           # 统一导出
│   │   │
│   │   ├── business/              # 业务组件
│   │   │   ├── RecordItem.tsx     # 单条记录项
│   │   │   ├── RecordList.tsx     # 记录列表
│   │   │   ├── CategoryGrid.tsx   # 分类选择网格
│   │   │   ├── BudgetCard.tsx     # 预算卡片
│   │   │   ├── StatsCard.tsx      # 统计概览卡片
│   │   │   ├── BookSelector.tsx   # 账本选择器
│   │   │   └── index.ts
│   │   │
│   │   └── layout/                # 布局组件
│   │       ├── MainLayout.tsx     # 主布局（含底部导航）
│   │       ├── TabBar.tsx         # 底部导航栏
│   │       ├── Header.tsx         # 页面头部
│   │       └── index.ts
│   │
│   ├── pages/                     # 📄 页面组件
│   │   ├── home/                  # 首页
│   │   │   ├── HomePage.tsx       # 首页主组件
│   │   │   ├── DailySummary.tsx   # 今日概览
│   │   │   ├── MonthOverview.tsx  # 月度概览
│   │   │   └── RecentRecords.tsx  # 最近记录
│   │   │
│   │   ├── add/                   # 记账页
│   │   │   ├── AddRecordPage.tsx  # 记账页主组件
│   │   │   ├── NumberKeyboard.tsx # 数字键盘
│   │   │   └── TypeSwitch.tsx     # 收入/支出切换
│   │   │
│   │   ├── stats/                 # 统计页
│   │   │   ├── StatsPage.tsx      # 统计页主组件
│   │   │   ├── TrendChart.tsx     # 趋势图表
│   │   │   ├── CategoryPie.tsx    # 分类饼图
│   │   │   └── RankingList.tsx    # 排行榜
│   │   │
│   │   ├── budget/                # 预算页
│   │   │   ├── BudgetPage.tsx     # 预算页主组件
│   │   │   ├── BudgetForm.tsx     # 预算设置表单
│   │   │   └── BudgetProgress.tsx # 预算进度展示
│   │   │
│   │   ├── profile/               # 个人中心
│   │   │   └── ProfilePage.tsx    # 个人中心主组件
│   │   │
│   │   ├── books/                 # 账本管理
│   │   │   ├── BooksPage.tsx      # 账本列表
│   │   │   └── BookForm.tsx       # 新建/编辑账本
│   │   │
│   │   ├── categories/            # 分类管理
│   │   │   └── CategoriesPage.tsx
│   │   │
│   │   ├── detail/                # 记录详情
│   │   │   └── RecordDetailPage.tsx
│   │   │
│   │   └── import/                # 账单导入 (v1.5)
│   │       ├── ImportPage.tsx
│   │       └── PreviewTable.tsx   # 导入预览表格
│   │
│   ├── stores/                    # 🗄️ 状态管理 (Zustand)
│   │   ├── useRecordStore.ts      # 收支记录
│   │   ├── useBudgetStore.ts      # 预算管理
│   │   ├── useBookStore.ts        # 账本管理
│   │   ├── useCategoryStore.ts    # 分类管理
│   │   └── useSettingStore.ts     # 全局设置
│   │
│   ├── services/                  # 🔧 服务层
│   │   ├── db.ts                  # Dexie 数据库初始化
│   │   ├── recordService.ts       # 记录 CRUD 操作
│   │   ├── statsService.ts        # 统计计算逻辑
│   │   ├── budgetService.ts       # 预算计算逻辑
│   │   ├── importService.ts       # 账单导入解析
│   │   └── exportService.ts       # 数据导出
│   │
│   ├── hooks/                     # 🪝 自定义 Hooks
│   │   ├── useRecords.ts          # 记录查询 Hook
│   │   ├── useStats.ts            # 统计数据 Hook
│   │   ├── useBudget.ts           # 预算数据 Hook
│   │   └── useDebounce.ts         # 防抖 Hook
│   │
│   ├── utils/                     # 🛠️ 工具函数
│   │   ├── amount.ts              # 金额格式化（分/元转换）
│   │   ├── date.ts                # 日期工具函数
│   │   ├── storage.ts             # 本地存储工具
│   │   └── constants.ts           # 常量定义
│   │
│   ├── types/                     # 📝 TypeScript 类型定义
│   │   ├── record.ts              # 记录相关类型
│   │   ├── category.ts            # 分类相关类型
│   │   ├── book.ts                # 账本相关类型
│   │   ├── budget.ts              # 预算相关类型
│   │   └── stats.ts               # 统计相关类型
│   │
│   └── data/                      # 📋 预设数据
│       ├── defaultCategories.ts   # 默认分类列表
│       └── defaultBooks.ts        # 默认账本
│
├── .eslintrc.cjs                  # ESLint 配置
├── .prettierrc                    # Prettier 配置
├── .gitignore                     # Git 忽略配置
├── index.html                     # HTML 入口
├── package.json                   # 依赖管理
├── tsconfig.json                  # TypeScript 配置
├── tsconfig.node.json             # Node 环境 TS 配置
├── tailwind.config.js             # TailwindCSS 配置
├── postcss.config.js              # PostCSS 配置
└── vite.config.ts                 # Vite 构建配置
```

---

## 核心文件说明

### 入口文件

| 文件 | 职责 |
|------|------|
| `index.html` | HTML 模板，挂载点 `<div id="root">` |
| `src/main.tsx` | React 应用入口，挂载 App 组件 |
| `src/App.tsx` | 根组件，配置路由 |
| `src/index.css` | 全局样式，引入 Tailwind 基础样式 |

### 页面文件

| 页面 | 路由 | 主文件 |
|------|------|--------|
| 首页 | `/` | `src/pages/home/HomePage.tsx` |
| 记账 | `/add` | `src/pages/add/AddRecordPage.tsx` |
| 统计 | `/stats` | `src/pages/stats/StatsPage.tsx` |
| 预算 | `/budget` | `src/pages/budget/BudgetPage.tsx` |
| 我的 | `/profile` | `src/pages/profile/ProfilePage.tsx` |
| 账本 | `/books` | `src/pages/books/BooksPage.tsx` |
| 详情 | `/detail/:id` | `src/pages/detail/RecordDetailPage.tsx` |

### 状态管理

| Store | 管理内容 |
|-------|---------|
| `useRecordStore` | 收支记录的增删改查 |
| `useBudgetStore` | 预算设置与进度计算 |
| `useBookStore` | 账本管理与切换 |
| `useCategoryStore` | 收支分类管理 |
| `useSettingStore` | 用户偏好设置 |

### 服务层

| 服务 | 职责 |
|------|------|
| `db.ts` | 数据库初始化与版本管理 |
| `recordService.ts` | 记录数据的持久化操作 |
| `statsService.ts` | 统计数据聚合计算 |
| `budgetService.ts` | 预算相关逻辑 |
| `importService.ts` | 外部账单解析导入 |
| `exportService.ts` | 数据导出为 Excel/CSV |

---

## 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 页面组件 | PascalCase + Page 后缀 | `HomePage.tsx` |
| 业务组件 | PascalCase | `RecordItem.tsx` |
| Hooks | camelCase + use 前缀 | `useRecords.ts` |
| Store | camelCase + use 前缀 + Store 后缀 | `useRecordStore.ts` |
| 服务 | camelCase + Service 后缀 | `recordService.ts` |
| 工具函数 | camelCase | `amount.ts` |
| 类型文件 | camelCase | `record.ts` |
| CSS Modules | camelCase | `homePage.module.css` |
| 常量 | UPPER_SNAKE_CASE | `MAX_NOTE_LENGTH` |
