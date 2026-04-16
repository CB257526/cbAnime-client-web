# 管理员后台使用指南

## 概述

管理员后台为平台管理员提供了用户反馈管理、推荐动漫设置等功能。系统会自动识别用户身份，管理员登录后会自动跳转到管理后台。

## 登录流程

1. 访问登录页面 (`/login`)
2. 输入管理员账号和密码
3. 系统会自动通过 `/api/user/profile` 获取用户信息
4. 如果用户角色为 `ADMIN`，自动跳转到管理员后台 (`/admin`)
5. 如果用户角色不是 `ADMIN`，跳转到普通首页

## 功能模块

### 1. 仪表盘 (`/admin`)

**功能说明：**
- 显示关键数据统计
  - 总反馈数
  - 待处理反馈数
  - 处理中反馈数
  - 已完成反馈数
  - 推荐动漫数量
- 快捷操作入口
- 系统信息展示

**数据接口：**
- `GET /api/feedback/admin/list` - 获取反馈统计数据
- `GET /api/metadata/recommend/admin` - 获取推荐列表数据

---

### 2. 反馈管理 (`/admin/feedback`)

**功能说明：**
- 查看所有用户提交的反馈记录
- 支持按状态筛选：
  - 全部
  - 待处理 (pending)
  - 处理中 (processing)
  - 已完成 (completed)
  - 已拒绝 (rejected)
- 查看反馈详情
- 删除反馈记录

**操作说明：**
1. **查看列表**：默认显示所有反馈，按创建时间倒序排列
2. **筛选状态**：点击状态标签切换筛选条件
3. **查看详情**：点击"详情"按钮查看完整反馈信息
4. **删除反馈**：点击"删除"按钮删除已处理或不需要的反馈

**数据接口：**
- `GET /api/feedback/admin/list` - 获取反馈列表（支持分页、筛选）
- `GET /api/feedback/admin/detail/{id}` - 获取反馈详情
- `DELETE /api/feedback/admin/{id}` - 删除反馈记录

**反馈状态说明：**
- `pending`：待处理 - 新提交的反馈，等待管理员处理
- `processing`：处理中 - 管理员已开始处理的反馈
- `completed`：已完成 - 已处理完成的反馈
- `rejected`：已拒绝 - 无效或恶意的反馈

---

### 3. 推荐管理 (`/admin/recommend`)

**功能说明：**
- 查看当前推荐的动漫列表
- 设置新的推荐动漫
- 选择推荐位置（首页轮播、热门、新番）

**操作说明：**
1. **查看当前推荐**：左侧面板显示当前已推荐的动漫，包含封面、名称、评分等信息
2. **添加推荐**：
   - 在右侧面板输入推荐位置
   - 输入动漫 ID 列表（用逗号分隔，例如：`2042,1234,5678`）
   - 点击"保存推荐列表"
3. **注意事项**：
   - 新推荐列表会完全覆盖旧的推荐列表
   - 推荐数据有效期为 7 天
   - 动漫 ID 为 Bangumi 平台的 ID

**数据接口：**
- `GET /api/metadata/recommend/admin` - 获取推荐列表
- `POST /api/metadata/admin/recommend` - 设置推荐列表

**推荐位置说明：**
- `home_banner`：首页轮播 - 在首页轮播图位置展示
- `home_hot`：首页热门 - 在首页热门动漫区域展示
- `home_new`：首页新番 - 在首页新番区域展示

---

## 技术细节

### 权限验证

系统通过以下方式确保管理后台安全：

1. **路由守卫**：`AdminRoute` 组件验证用户角色
2. **身份检查**：
   - 首先检查本地存储的用户信息
   - 如果没有，则调用 `/api/auth/me` 获取当前用户
   - 验证 `role === 'ADMIN'`
3. **未授权处理**：非管理员用户会被重定向到首页

### 文件结构

```
src/
├── api/
│   └── admin.ts              # 管理员相关 API 接口
├── components/
│   ├── AdminLayout.tsx       # 管理员后台布局（侧边栏、顶部导航）
│   └── AdminRoute.tsx        # 管理员路由守卫组件
└── pages/
    └── admin/
        ├── AdminDashboardPage.tsx        # 仪表盘页面
        ├── FeedbackManagementPage.tsx    # 反馈管理页面
        └── RecommendationManagementPage.tsx  # 推荐管理页面
```

### 响应式设计

- 侧边栏支持展开/收起
- 表格支持横向滚动
- 所有操作都有加载状态和错误处理
- 模态框用于显示详细信息

---

## 常见问题

### Q: 登录后没有跳转到管理后台？
A: 检查用户账号的 `role` 字段是否为 `ADMIN`。可以通过数据库查看用户角色。

### Q: 访问管理后台提示权限不足？
A: 确保用户已登录且角色为 `ADMIN`。如果已登录但仍然提示权限不足，尝试清除浏览器缓存后重新登录。

### Q: 推荐列表保存后没有立即生效？
A: 推荐数据存入 Redis 缓存，可能需要等待缓存刷新。可以尝试手动刷新页面。

### Q: 如何获取动漫 ID？
A: 动漫 ID 为 Bangumi 平台的 ID，可以在动漫详情页的 URL 中找到。例如：`https://bgm.tv/subject/2042` 中的 `2042`。

---

## 后续更新

根据接口文档，后续可能会添加更多功能：
- 用户管理
- 动漫元数据管理
- 弹幕管理
- 数据统计与分析
- 系统设置

---

## 开发说明

### 添加新的管理页面

1. 在 `src/pages/admin/` 下创建新的页面组件
2. 在 `src/router.tsx` 中添加路由配置
3. 在 `src/components/AdminLayout.tsx` 的 `menuItems` 数组中添加菜单项
4. 如需调用 API，在 `src/api/admin.ts` 中添加接口方法

### 示例代码

**路由配置：**
```typescript
{
  path: '/admin',
  element: (
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  ),
  children: [
    {
      path: 'your-new-page',
      element: <YourNewPage />,
    },
  ],
}
```

**菜单项：**
```typescript
const menuItems = [
  // ... 现有菜单项
  { 
    path: '/admin/your-new-page', 
    label: '新功能名称', 
    icon: 'M...' // SVG path
  },
];
```
