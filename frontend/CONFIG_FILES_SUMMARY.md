# 前端项目配置文件总结

## 创建日期
2025-11-17

## 已创建的配置文件

### 1. package.json ✅
**位置**: `frontend/package.json`

**内容**:
- 项目基本信息
- 依赖管理（React 18+, TypeScript, Vite等）
- 开发依赖（Vitest, React Testing Library等）
- 脚本命令（dev, build, test等）

**关键依赖**:
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `vite`: ^5.0.8
- `vitest`: ^1.0.4
- `@testing-library/react`: ^14.1.2
- `typescript`: ^5.2.2

### 2. vite.config.ts ✅
**位置**: `frontend/vite.config.ts`

**配置内容**:
- React插件配置
- 开发服务器配置（端口3000）
- API代理配置（代理到localhost:3001）

### 3. vitest.config.ts ✅
**位置**: `frontend/vitest.config.ts`

**配置内容**:
- Vitest测试框架配置
- jsdom环境配置
- 测试文件匹配规则
- 测试设置文件路径

### 4. tsconfig.json ✅
**位置**: `frontend/tsconfig.json`

**配置内容**:
- TypeScript编译选项
- 模块解析配置
- JSX配置（react-jsx）
- 路径映射配置
- 严格模式启用

### 5. tsconfig.node.json ✅
**位置**: `frontend/tsconfig.node.json`

**配置内容**:
- Node.js环境TypeScript配置
- 用于vite.config.ts等配置文件

### 6. .eslintrc.cjs ✅
**位置**: `frontend/.eslintrc.cjs`

**配置内容**:
- ESLint规则配置
- TypeScript ESLint插件
- React Hooks规则

### 7. .gitignore ✅
**位置**: `frontend/.gitignore`

**忽略内容**:
- node_modules
- dist构建输出
- 日志文件
- 编辑器配置文件
- 环境变量文件（.env.local等）

### 8. test/setup.ts ✅
**位置**: `frontend/test/setup.ts`

**配置内容**:
- 测试环境设置
- jest-dom匹配器导入
- 测试后清理
- Jest API polyfill（兼容现有测试代码）

### 9. index.html ✅
**位置**: `frontend/index.html`

**内容**:
- HTML模板
- React应用挂载点（#root）
- 入口脚本引用

### 10. src/main.tsx ✅
**位置**: `frontend/src/main.tsx`

**内容**:
- React应用入口
- ReactDOM渲染配置
- StrictMode启用

### 11. src/App.tsx ✅
**位置**: `frontend/src/App.tsx`

**内容**:
- 应用根组件
- PersonalCenter页面集成

### 12. src/index.css ✅
**位置**: `frontend/src/index.css`

**内容**:
- 全局样式重置
- 基础字体配置

### 13. README.md ✅
**位置**: `frontend/README.md`

**内容**:
- 项目说明
- 技术栈介绍
- 项目结构
- 使用说明

### 14. vitest.d.ts ✅
**位置**: `frontend/vitest.d.ts`

**内容**:
- Vitest类型定义
- Jest API类型扩展

## 需要手动创建的文件

### .env ⚠️
**位置**: `frontend/.env`

**原因**: 环境变量文件被gitignore阻止自动创建

**内容**（参考）:
```
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_TITLE=12306个人中心
```

**创建方法**:
```bash
# Windows PowerShell
Copy-Item frontend\.env.example frontend\.env

# Linux/Mac
cp frontend/.env.example frontend/.env
```

## 配置文件说明

### Jest API兼容性
测试文件中使用了`jest.fn()`和`jest.clearAllMocks()`等Jest API，但项目使用Vitest作为测试框架。为了兼容现有测试代码，在`test/setup.ts`中提供了Jest API的polyfill，将Jest API映射到Vitest的对应API。

### API代理配置
开发服务器配置了API代理，所有`/api`开头的请求会被代理到`http://localhost:3001`。这允许前端在开发时直接调用后端API，无需处理CORS问题。

### 测试配置
- 使用jsdom作为测试环境（模拟浏览器环境）
- 测试文件匹配规则：`test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`
- 自动导入`@testing-library/jest-dom`匹配器

## 下一步操作

1. **安装依赖**:
   ```bash
   cd frontend
   npm install
   ```

2. **创建环境变量文件**:
   ```bash
   # 手动创建 .env 文件或复制 .env.example
   ```

3. **运行开发服务器**:
   ```bash
   npm run dev
   ```

4. **运行测试**:
   ```bash
   npm test
   ```

## 注意事项

1. **Jest vs Vitest**: 测试文件使用Jest API，但实际运行在Vitest上。polyfill已配置，但建议后续统一使用Vitest API。

2. **环境变量**: `.env`文件需要手动创建，不会被git跟踪（已在.gitignore中）。

3. **端口配置**: 
   - 前端开发服务器：3000
   - 后端API服务器：3001（需要在后端配置）

4. **TypeScript严格模式**: 已启用TypeScript严格模式，确保类型安全。

5. **测试环境**: 使用jsdom模拟浏览器环境，支持DOM操作测试。

## 验证配置

运行以下命令验证配置是否正确：

```bash
# 检查TypeScript配置
npx tsc --noEmit

# 检查ESLint配置
npm run lint

# 运行测试
npm test
```

