# AGENTS.md - 黑马记账 App 项目指南

本文件为 AI 编码助手提供项目上下文，确保开发过程中的一致性和准确性。

---

## 项目概述

- **项目名称**: 黑马记账 App
- **产品定位**: 面向个人用户的轻量级 H5 记账应用
- **目标平台**: H5 网页应用（移动端优先，兼容桌面端浏览器）
- **设计风格**: 活泼可爱，圆润多彩
- **存储方案**: 纯本地存储（IndexedDB），无后端服务器

---

## 产品文档索引

开发前必须阅读以下文档，所有实现必须与文档保持一致：

| 文档 | 路径 | 内容说明 |
|------|------|---------|
| 产品需求文档 (PRD) | `docs/PRD.md` | 产品定位、目标用户、功能模块详细说明、页面结构、数据模型、版本规划 |
| 技术架构文档 | `docs/TECH_ARCHITECTURE.md` | 技术选型、分层架构、状态管理设计、数据库设计、路由设计、性能优化、部署方案 |
| 项目目录结构 | `docs/PROJECT_STRUCTURE.md` | 完整的源码目录树、核心文件说明、命名规范 |
| UI 设计规范 | `docs/UI_DESIGN_SPEC.md` | 色彩系统、字体规范、间距系统、核心组件规范、动画规范、响应式适配 |

---

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 语言 | TypeScript | 5.x |
| 框架 | React | 18.x |
| 构建 | Vite | 5.x |
| 路由 | React Router | 6.x |
| 状态管理 | Zustand | 4.x |
| 组件库 | Ant Design Mobile | 5.x |
| 样式 | TailwindCSS | 3.x |
| 图表 | ECharts (echarts-for-react) | 5.x |
| 本地存储 | Dexie.js (IndexedDB) | 3.x |
| 日期处理 | dayjs | 1.x |
| PWA | vite-plugin-pwa | 0.x |
| 测试 | Vitest + React Testing Library | - |

---

## 核心功能模块（v1.0）

1. **收支记录** (P0) - 快速记录每日收入/支出，支持分类、备注、日期、账本选择
2. **数据统计** (P0) - 周报/月报/年报图表，分类占比饼图，趋势折线图，消费排行
3. **预算管理** (P1) - 月度总预算 + 分类预算，进度可视化，超支提醒
4. **多账本** (P1) - 创建多个独立账本（日常、旅行、家庭等），支持切换和归档
5. **账单导入** (P2, v1.5) - 解析支付宝/微信 CSV 账单文件，智能匹配分类

---

## 页面路由

| 页面 | 路由 | 主文件 |
|------|------|--------|
| 首页 | `/` | `src/pages/home/HomePage.tsx` |
| 记账页 | `/add` | `src/pages/add/AddRecordPage.tsx` |
| 统计页 | `/stats` | `src/pages/stats/StatsPage.tsx` |
| 预算页 | `/budget` | `src/pages/budget/BudgetPage.tsx` |
| 个人中心 | `/profile` | `src/pages/profile/ProfilePage.tsx` |
| 账本管理 | `/books` | `src/pages/books/BooksPage.tsx` |
| 记录详情 | `/detail/:id` | `src/pages/detail/RecordDetailPage.tsx` |
| 分类管理 | `/categories` | `src/pages/categories/CategoriesPage.tsx` |
| 账单导入 | `/import` | `src/pages/import/ImportPage.tsx` |

---

## 数据模型

### 账单记录 (Record)
```typescript
{
  id: string;
  type: "income" | "expense";
  amount: number;          // 以"分"为单位存储，避免浮点精度问题
  categoryId: string;
  bookId: string;
  date: string;            // YYYY-MM-DD
  note: string;
  createdAt: number;
  updatedAt: number;
}
```

### 分类 (Category)
```typescript
{
  id: string;
  name: string;
  icon: string;
  type: "income" | "expense";
  isCustom: boolean;
  sort: number;
}
```

### 账本 (Book)
```typescript
{
  id: string;
  name: string;
  icon: string;
  color: string;
  isArchived: boolean;
  createdAt: number;
}
```

### 预算 (Budget)
```typescript
{
  id: string;
  bookId: string;
  month: string;           // YYYY-MM
  totalAmount: number;
  categoryBudgets: Array<{ categoryId: string; amount: number }>;
}
```

---

## 状态管理 (Zustand Stores)

| Store 文件 | 管理内容 |
|-----------|---------|
| `src/stores/useRecordStore.ts` | 收支记录增删改查 |
| `src/stores/useBudgetStore.ts` | 预算设置与进度 |
| `src/stores/useBookStore.ts` | 账本管理与切换 |
| `src/stores/useCategoryStore.ts` | 收支分类管理 |
| `src/stores/useSettingStore.ts` | 用户偏好设置（主题、货币等） |

---

## 设计规范速查

### 主色调
- 主色（珊瑚橘）: `#FF6B6B`
- 收入色（薄荷绿）: `#4ECDC4`
- 支出色（珊瑚橘）: `#FF6B6B`
- 背景色: `#F8F9FA`
- 标题文字: `#2D3436`
- 正文文字: `#636E72`
- 辅助文字: `#B2BEC3`

### 圆角
- 小元素: 8px
- 卡片/输入框: 12px
- 大卡片/弹窗: 16px
- 圆形按钮: 9999px

### 关键尺寸
- 底部导航高度: 56px
- 页面左右边距: 16px
- 卡片内边距: 16px
- 分类图标: 40px 圆形
- "+"浮出按钮: 48px 圆形

---

## 开发约定

### 金额处理
所有金额以**分（整数）**存储，显示时转换为元：
```typescript
const toFen = (yuan: number): number => Math.round(yuan * 100);
const toYuan = (fen: number): string => (fen / 100).toFixed(2);
```

### 命名规范
| 类型 | 格式 | 示例 |
|------|------|------|
| 页面组件 | PascalCase + Page | `HomePage.tsx` |
| 业务组件 | PascalCase | `RecordItem.tsx` |
| Hooks | use 前缀 | `useRecords.ts` |
| Store | use 前缀 + Store 后缀 | `useRecordStore.ts` |
| 服务 | camelCase + Service | `recordService.ts` |
| 常量 | UPPER_SNAKE_CASE | `MAX_NOTE_LENGTH` |

### Git 提交规范
```
feat: 新功能        fix: 修复 Bug
style: 样式调整      refactor: 代码重构
docs: 文档更新       chore: 工具/配置变更
```

---

## 构建与部署

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建产物
npm run preview

# 代码检查
npm run lint

# 运行测试
npm run test
```

**推荐部署平台**: Vercel（零配置、自动 HTTPS、全球 CDN、免费）

---

## 版本规划

- **v1.0 (MVP)**: 收支记录、数据统计、预算管理、多账本、本地存储
- **v1.5**: 账单导入（支付宝/微信）、数据导出（Excel）、自定义分类、周报/年报
- **v2.0**: 云同步（注册登录）、暗黑模式、记账提醒、AI 消费分析
