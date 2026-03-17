# Atrium (雅庭旅宿)

## 在线演示地址

[Atrium在线演示](https://atrium-admin-panel.vercel.app/) (需要科学上网环境, 已配备测试账密与测试数据)

## 简介

雅庭旅宿 - 现代化在线民宿管理系统，具有房间管理、预订调度、入住/退房登记、营收可视化、用户注册与账号管理等功能。

## 技术栈

- **核心框架**: React + Vite
- **类型安全**: TypeScript
- **状态管理**:
  - **服务端状态**: TanStack Query (React Query)
  - **客户端状态**: React Context API
- **路由**: React Router
- **样式方案**: Styled Components
- **表单处理**: React Hook Form
- **后端服务**: Supabase
- **工具库**:
  - date-fns: 日期处理
  - recharts: 图表绘制
  - react-icons: 图标库

## 核心功能

- **仪表盘**：
  - 概览：展示今日入住/离店活动，便于用户快速处理。
  - 数据可视化：支持总销售额、客人入住天数分布的可视化查看，支持按日期范围筛选（7/30/90天）。
- **客房管理**：
  - 支持新建、编辑、删除客房，以及客房数据的筛选查看。
- **预订与入住**：
  - 覆盖从“未确认”到“已入住”及“已退房”的完整订单生命周期。
  - 支持入住现场开启/关闭早餐服务，并自动重计订单总价。
  - 支持订单分页查看与筛选查看。
- **系统设置 & 用户账号**：
  - 支持用户注册、登录及密码修改。
  - 全局应用设置（如最小预订天数、最大客人数）。
- **用户体验**：
  - 支持亮色、暗色主题切换，支持消息通知。

## 项目结构

```
src/
├── context/            # 全局状态上下文 (主题切换)
├── data/               # 初始/模拟数据
├── features/           # 核心业务模块
│   ├── authentication/ # 用户认证、注册、个人信息修改
│   ├── bookings/       # 预订列表、详情及删除管理
│   ├── cabins/         # 客房管理
│   ├── check-in-out/   # 入住、退房业务流及今日活动
│   ├── dashboard/      # 仪表盘统计数据及可视化图表
│   └── settings/       # 全局系统设置
├── hooks/              # 全局通用自定义 Hooks
├── pages/              # 路由页面组件
├── services/           # API 接口层 (Supabase 客户端及各模块的 CRUD 请求)
├── styles/             # 全局样式定义
├── types/              # TypeScript 类型定义文件
├── ui/                 # 自定义基础 UI 组件
└── utils/              # 通用工具函数

```

## 开发指南

### 1. 安装依赖

```bash
npm install
```

### 2. 环境变量设置

在项目根目录创建 `.env.local` 文件并填写以下配置：

```env
VITE_SUPABASE_URL="your-supabase-url"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 3.运行项目

```bash
npm run dev
```

### 4. 生产构建

```bash
npm run build
npm run preview
```
