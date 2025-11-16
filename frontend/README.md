# 12306个人中心前端应用

## 项目简介

这是12306个人中心页面的前端应用，使用React + TypeScript + Vite构建。

## 技术栈

- **React 18+** - UI框架
- **TypeScript** - 类型系统
- **Vite** - 构建工具
- **Vitest** - 测试框架
- **React Testing Library** - 组件测试库

## 项目结构

```
frontend/
├── src/
│   ├── components/      # React组件
│   ├── pages/          # 页面组件
│   ├── api/            # API调用封装
│   ├── utils/          # 工具函数
│   ├── types/          # TypeScript类型定义
│   ├── App.tsx         # 应用入口组件
│   └── main.tsx        # 应用入口文件
├── test/               # 测试文件
│   ├── components/     # 组件测试
│   ├── pages/          # 页面测试
│   └── setup.ts        # 测试配置
├── package.json        # 项目配置
├── vite.config.ts     # Vite配置
├── tsconfig.json      # TypeScript配置
└── vitest.config.ts   # Vitest配置
```

## 安装依赖

```bash
npm install
```

## 开发

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

## 构建

```bash
npm run build
```

## 测试

```bash
# 运行测试
npm test

# 运行测试（UI模式）
npm run test:ui

# 运行测试（覆盖率）
npm run test:coverage
```

## 环境变量

创建 `.env` 文件（参考 `.env.example`）：

```
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_TITLE=12306个人中心
```

## 代码规范

项目使用ESLint进行代码检查：

```bash
npm run lint
```

## 注意事项

1. 测试文件使用Vitest框架，但为了兼容现有测试代码，提供了jest API的polyfill
2. API代理配置在 `vite.config.ts` 中，默认代理到 `http://localhost:3001`
3. 所有组件测试文件位于 `test/components/` 目录
4. 所有页面测试文件位于 `test/pages/` 目录

