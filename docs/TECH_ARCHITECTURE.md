# 黑马记账 App - 技术架构文档

## 1. 技术选型

### 1.1 总体架构

```
┌─────────────────────────────────────────────┐
│                 黑马记账 H5 App               │
├─────────────────────────────────────────────┤
│  UI 层：React 18 + TypeScript               │
│  组件库：自定义组件 + Ant Design Mobile       │
│  路由：React Router v6                       │
│  状态管理：Zustand                            │
│  图表：ECharts (echarts-for-react)           │
│  样式：TailwindCSS + CSS Modules             │
│  本地存储：Dexie.js (IndexedDB 封装)          │
│  构建工具：Vite 5                             │
│  PWA：vite-plugin-pwa                        │
└─────────────────────────────────────────────┘
```

### 1.2 技术栈详细说明

| 层级 | 技术 | 版本 | 选型理由 |
|------|------|------|---------|
| 语言 | TypeScript | 5.x | 类型安全，减少运行时错误 |
| 框架 | React | 18.x | 生态成熟，社区活跃，学习资源丰富 |
| 构建 | Vite | 5.x | 极速冷启动，HMR 热更新快 |
| 路由 | React Router | 6.x | React 生态标准路由方案 |
| 状态 | Zustand | 4.x | 轻量级，API 简洁，无模板代码 |
| 组件库 | Ant Design Mobile | 5.x | 移动端专用，组件丰富，风格可定制 |
| 样式 | TailwindCSS | 3.x | 原子化 CSS，快速开发，体积可控 |
| 图表 | ECharts | 5.x | 功能强大，移动端友好，中文文档 |
| 存储 | Dexie.js | 3.x | IndexedDB 封装，API 友好，支持复杂查询 |
| PWA | vite-plugin-pwa | 0.x | 一键配置 PWA，离线支持 |
| 日期 | dayjs | 1.x | 轻量级日期处理库 |
| 工具 | lodash-es | 4.x | 常用工具函数（按需引入） |

### 1.3 开发工具链

| 工具 | 用途 |
|------|------|
| ESLint | 代码规范检查 |
| Prettier | 代码格式化 |
| Husky | Git Hooks 管理 |
| lint-staged | 提交前代码检查 |
| vitest | 单元测试 |

---

## 2. 系统架构

### 2.1 分层架构

```
┌──────────────────────────────────────┐
│           视图层 (Views/Pages)        │
│  首页 │ 记账 │ 统计 │ 预算 │ 我的     │
├──────────────────────────────────────┤
│           组件层 (Components)         │
│  通用组件 │ 业务组件 │ 布局组件        │
├──────────────────────────────────────┤
│           状态层 (Stores)             │
│  recordStore │ budgetStore │ bookStore│
├──────────────────────────────────────┤
│           服务层 (Services)           │
│  数据库操作 │ 数据导入导出 │ 工具函数  │
├──────────────────────────────────────┤
│           数据层 (Database)           │
│  Dexie.js → IndexedDB               │
└──────────────────────────────────────┘
```

### 2.2 状态管理设计

使用 Zustand 管理全局状态，按业务模块拆分 Store：

```
stores/
├── useRecordStore.ts    # 收支记录状态
│   ├── records[]        # 记录列表
│   ├── addRecord()      # 新增记录
│   ├── updateRecord()   # 修改记录
│   ├── deleteRecord()   # 删除记录
│   └── getRecordsByDate()  # 按日期查询
│
├── useBudgetStore.ts    # 预算状态
│   ├── budgets[]        # 预算列表
│   ├── setBudget()      # 设置预算
│   └── getBudgetProgress()  # 获取预算进度
│
├── useBookStore.ts      # 账本状态
│   ├── books[]          # 账本列表
│   ├── activeBookId     # 当前账本
│   ├── addBook()        # 新增账本
│   └── switchBook()     # 切换账本
│
├── useCategoryStore.ts  # 分类状态
│   ├── categories[]     # 分类列表
│   └── addCategory()    # 新增自定义分类
│
└── useSettingStore.ts   # 设置状态
    ├── theme            # 主题模式
    ├── currency         # 货币单位
    └── firstDayOfWeek   # 每周起始日
```

### 2.3 数据库设计 (IndexedDB via Dexie.js)

```typescript
// 数据库版本管理
const db = new Dexie('HeimaAccountDB');

db.version(1).stores({
  records: '++id, type, categoryId, bookId, date, createdAt',
  categories: '++id, type, isCustom, sort',
  books: '++id, isArchived, createdAt',
  budgets: '++id, bookId, month'
});
```

**索引设计：**
| 表 | 索引字段 | 用途 |
|----|---------|------|
| records | date | 按日期快速查询 |
| records | bookId | 按账本筛选 |
| records | categoryId | 按分类统计 |
| records | type | 按收支类型筛选 |
| budgets | month | 按月份查询预算 |
| budgets | bookId | 按账本查预算 |

---

## 3. 路由设计

```typescript
const routes = [
  {
    path: '/',
    element: <MainLayout />,       // 带底部导航的布局
    children: [
      { index: true, element: <HomePage /> },
      { path: 'stats', element: <StatsPage /> },
      { path: 'budget', element: <BudgetPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ]
  },
  { path: '/add', element: <AddRecordPage /> },       // 全屏记账页
  { path: '/detail/:id', element: <RecordDetailPage /> },
  { path: '/books', element: <BooksPage /> },
  { path: '/categories', element: <CategoriesPage /> },
  { path: '/import', element: <ImportPage /> },
];
```

---

## 4. 关键模块设计

### 4.1 金额处理

为避免浮点数精度问题，所有金额以**分**为单位存储（整数）：

```typescript
// 用户输入: 12.50 元 → 存储: 1250 (分)
// 显示时:   1250 → 格式化为 "12.50"

const toFen = (yuan: number): number => Math.round(yuan * 100);
const toYuan = (fen: number): string => (fen / 100).toFixed(2);
```

### 4.2 数据统计计算

```typescript
// 核心统计接口
interface StatsResult {
  totalIncome: number;       // 总收入
  totalExpense: number;      // 总支出
  balance: number;           // 结余
  dailyTrend: DailyData[];   // 每日趋势
  categoryRanking: CategoryData[];  // 分类排行
}

// 统计服务
class StatsService {
  // 获取指定时间范围的统计数据
  async getStats(startDate: string, endDate: string, bookId?: string): Promise<StatsResult>;
  
  // 获取分类占比
  async getCategoryDistribution(month: string): Promise<CategoryData[]>;
  
  // 获取每日趋势
  async getDailyTrend(month: string): Promise<DailyData[]>;
}
```

### 4.3 账单导入解析（v1.5）

```typescript
// CSV 解析器接口
interface BillParser {
  platform: 'alipay' | 'wechat';
  parse(csvContent: string): ParsedRecord[];
  matchCategory(description: string): string;  // 智能匹配分类
}
```

### 4.4 PWA 离线策略

```typescript
// Service Worker 缓存策略
{
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/cdn/,
      handler: 'CacheFirst',      // 静态资源优先缓存
    },
    {
      urlPattern: /\/api\//,
      handler: 'NetworkFirst',    // API 请求优先网络
    }
  ]
}
```

---

## 5. 性能优化策略

| 策略 | 措施 | 目标 |
|------|------|------|
| 代码分割 | React.lazy + 路由级懒加载 | 首屏 JS < 150KB |
| 图表懒加载 | 统计页按需加载 ECharts | 减少首屏体积 |
| 虚拟列表 | 流水列表使用虚拟滚动 | 大数据量流畅滚动 |
| 图片优化 | 图标使用 SVG / iconfont | 减少 HTTP 请求 |
| 缓存优化 | Service Worker 缓存策略 | 二次访问秒开 |
| 构建优化 | Tree Shaking + gzip 压缩 | 减小包体积 |

---

## 6. 部署方案

### 6.1 构建产物
```bash
npm run build → dist/
├── index.html
├── assets/
│   ├── js/       # JS chunks
│   ├── css/      # 样式文件
│   └── icons/    # PWA 图标
├── sw.js          # Service Worker
└── manifest.json  # PWA 配置
```

### 6.2 部署选项

| 方案 | 适用场景 | 成本 |
|------|---------|------|
| Vercel | 快速部署，自带 CDN | 免费 |
| Netlify | 静态站点托管 | 免费 |
| 阿里云 OSS + CDN | 国内访问速度快 | 低成本 |
| GitHub Pages | 个人项目 | 免费 |

**推荐方案：** Vercel（零配置部署，自动 HTTPS，全球 CDN）

---

## 7. 项目质量保障

### 7.1 代码规范
- ESLint + Prettier 统一代码风格
- TypeScript 严格模式（strict: true）
- 提交前自动检查（husky + lint-staged）

### 7.2 Git 规范
```
feat: 新功能
fix: 修复 Bug
style: 样式调整
refactor: 代码重构
docs: 文档更新
chore: 工具/配置变更
```

### 7.3 测试策略
| 类型 | 工具 | 覆盖范围 |
|------|------|---------|
| 单元测试 | Vitest | 工具函数、计算逻辑 |
| 组件测试 | React Testing Library | 核心组件交互 |
| E2E 测试 | Playwright (可选) | 关键业务流程 |
