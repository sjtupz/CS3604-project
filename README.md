# CS3604 课程项目 - 中国铁路12306网站复制

上海交通大学 CS3604《软件工程与项目管理》课程项目

## 项目概述

本项目旨在使用**AI Agent 测试驱动开发（TDD）框架**复制中国铁路12306网站的核心功能。项目采用严格的测试驱动开发流程，通过多个专门的 AI Agent 协作，实现从需求分析到代码实现的自动化开发。

### 项目目标

- 🎯 复制中国铁路12306网站的核心功能
- 🧪 严格遵循测试驱动开发（TDD）原则
- 🤖 使用 AI Agent 自动化开发流程
- 📋 完整的接口驱动开发
- ✅ 确保代码质量和测试覆盖率

### 核心功能模块

1. **首页** (`01_首页`) - 车票查询入口和导航
2. **登录注册页** (`02_登录注册页`) - 用户认证功能
3. **订单填写页** (`03_订单填写页`) - 订单信息填写
4. **车次列表页** (`04_车次列表页`) - 车次查询和筛选
5. **个人中心页** (`05_个人中心页`) - 用户信息管理和订单管理

## 技术架构

### 技术栈

- **前端**: React 18+, TypeScript, Vitest, React Testing Library
- **后端**: Node.js, Express.js/Fastify, SQLite
- **测试框架**: 
  - 前端: Vitest, React Testing Library
  - 后端: Jest, Supertest
- **接口定义**: YAML 格式（`.artifacts/` 目录）

### 项目结构

```
project/
├── Agent Prompts/              # AI Agent 提示词和框架文档
│   ├── designer.txt           # 系统架构师 Agent
│   ├── test_generator.txt     # 测试生成器 Agent
│   ├── frontend_developer.txt # 前端开发工程师 Agent
│   ├── backend_developer.txt  # 后端开发工程师 Agent
│   └── README.md              # Agent 框架使用文档
├── requirements/               # 需求文档
│   ├── 01_首页/
│   ├── 02_登录注册页/
│   ├── 03_订单填写页/
│   ├── 04_车次列表页/
│   └── 05_个人中心页/
├── .artifacts/                 # 接口定义文件（由 designer 生成）
│   ├── data_interface.yml      # 数据库操作接口
│   ├── api_interface.yml       # 后端 API 接口
│   └── ui_interface.yml        # 前端 UI 接口
├── backend/                    # 后端代码
│   ├── src/                    # 源代码
│   │   ├── routes/             # API 路由
│   │   ├── controllers/        # 控制器层
│   │   ├── services/           # 服务层
│   │   ├── db/                 # 数据库操作
│   │   ├── middleware/         # 中间件
│   │   ├── utils/              # 工具函数
│   │   └── config/             # 配置文件
│   └── test/                   # 测试文件
│       ├── routes/
│       ├── services/
│       └── db/
└── frontend/                   # 前端代码
    ├── src/                    # 源代码
    │   ├── components/         # 可复用组件
    │   ├── pages/              # 页面组件
    │   ├── utils/              # 工具函数
    │   ├── types/              # TypeScript 类型
    │   ├── api/                # API 调用封装
    │   └── store/              # 状态管理
    └── test/                   # 测试文件
        ├── components/
        ├── pages/
        └── utils/
```

## AI Agent 框架

本项目使用基于 TDD 的 AI Agent 协作开发框架，包含以下四个 Agent：

### 1. Designer（系统架构师）
- **职责**: 分析需求文档，设计或更新接口定义
- **输入**: 需求文档
- **输出**: `.artifacts/*.yml` 接口定义文件

### 2. Test Generator（测试生成器）
- **职责**: 根据接口定义生成测试用例和代码骨架
- **输入**: 接口定义文件、需求文档
- **输出**: 测试文件和代码骨架（TDD RED 阶段）

### 3. Frontend Developer（前端开发工程师）
- **职责**: 实现前端功能，确保所有测试通过
- **输入**: 测试文件、UI 接口定义
- **输出**: 前端实现代码（TDD GREEN-REFACTOR 阶段）

### 4. Backend Developer（后端开发工程师）
- **职责**: 实现后端功能和数据库操作，确保所有测试通过
- **输入**: 测试文件、API 和数据库接口定义
- **输出**: 后端实现代码（TDD GREEN-REFACTOR 阶段）

### TDD 工作流程

```
需求文档 → Designer → 接口定义 → Test Generator → 测试用例 + 代码骨架
                                                          ↓
                                    Frontend Developer ←→ Backend Developer
                                                          ↓
                                                      完成实现
```

详细使用说明请参考：[Agent Prompts/README.md](./Agent%20Prompts/README.md)

## 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 yarn
- Git

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **安装依赖**（待实现）
   ```bash
   # 后端依赖
   cd backend
   npm install
   
   # 前端依赖
   cd ../frontend
   npm install
   ```

3. **配置环境**
   - 配置数据库连接（SQLite）
   - 配置测试环境

### 开发流程

1. **准备需求文档**
   - 在 `requirements/` 目录下创建或更新需求文档
   - 需求文档应包含页面布局、交互逻辑、数据库设计等

2. **运行 Designer Agent**
   ```markdown
   请使用 designer agent 分析 requirements/[需求文件].md 并更新接口定义
   ```

3. **运行 Test Generator Agent**
   ```markdown
   请使用 test_generator agent 为 [接口ID] 生成测试用例和代码骨架
   ```

4. **运行 Developer Agents**
   ```markdown
   # 前端
   请使用 frontend_developer agent 实现 [组件名]，确保所有测试通过
   
   # 后端
   请使用 backend_developer agent 实现 [API名称]，确保所有测试通过
   ```

详细开发流程请参考：[Agent Prompts/README.md](./Agent%20Prompts/README.md)

## 需求文档

项目需求文档位于 `requirements/` 目录下，按功能模块组织：

- **01_首页** - 车票查询入口页面
- **02_登录注册页** - 用户登录和注册功能
  - `02_1_登录页.md` - 登录页面需求
  - `02_2_注册页.md` - 注册页面需求
- **03_订单填写页** - 订单信息填写页面
- **04_车次列表页** - 车次查询和筛选页面
- **05_个人中心页** - 用户个人信息和订单管理页面

每个需求文档包含：
- 页面布局说明
- 与其他页面的跳转关系
- 页面内操作（Given-When-Then 场景）
- 数据库设计

## 开发规范

### 代码规范

- **前端**: TypeScript, React Hooks, 函数式组件
- **后端**: Node.js, Express.js/Fastify, MVC 架构
- **测试**: 每个功能必须有对应的测试用例

### 文件命名规范

- **后端文件**: `backend/src/routes/[routeName].js`
- **前端组件**: `frontend/src/components/[ComponentName].tsx`
- **测试文件**: `[fileName].test.js` 或 `[fileName].test.tsx`

### TDD 原则

- ✅ **测试先行**: 先写测试，再写实现
- ✅ **最小实现**: 只实现使测试通过的最小代码
- ✅ **测试隔离**: 每个测试独立，不共享状态
- ❌ **禁止修改测试用例**: 测试用例定义需求，不可修改

## 项目状态

### 已完成

- ✅ AI Agent 框架设计和实现
- ✅ 需求文档编写（5个主要功能模块）
- ✅ TDD 工作流程定义
- ✅ 项目结构规划

### 进行中

- 🔄 接口定义（由 Designer Agent 生成）
- 🔄 测试用例生成（由 Test Generator Agent 生成）
- 🔄 代码实现（由 Developer Agents 实现）

### 待完成

- ⏳ 前端页面实现
- ⏳ 后端 API 实现
- ⏳ 数据库实现
- ⏳ 集成测试
- ⏳ 部署配置

## 文档

- [Agent 框架使用文档](./Agent%20Prompts/README.md) - 详细的 Agent 使用说明
- [TDD 增强说明](./Agent%20Prompts/TDD_ENHANCEMENTS.md) - TDD 原则和约束说明
- [需求文档](./requirements/) - 各功能模块的详细需求

## 贡献指南

### 开发流程

1. 创建或更新需求文档
2. 运行 Designer Agent 更新接口
3. 运行 Test Generator Agent 生成测试
4. 运行 Developer Agents 实现功能
5. 确保所有测试通过
6. 提交代码

### 代码提交规范

- 提交信息应清晰描述变更内容
- 每个功能模块独立提交
- 确保测试通过后再提交

## 常见问题

### Q: 如何添加新功能？

A: 
1. 在 `requirements/` 目录下创建需求文档
2. 运行 Designer Agent 设计接口
3. 运行 Test Generator Agent 生成测试
4. 运行 Developer Agents 实现功能

### Q: 测试失败怎么办？

A: 
- **不要修改测试用例**，测试用例定义了需求
- 修改实现代码使测试通过
- 如果测试本身有错误，检查需求文档和接口定义

### Q: 可以跳过某个 Agent 吗？

A: 不建议。每个 Agent 都有明确的职责，跳过会破坏 TDD 流程。

更多问题请参考：[Agent Prompts/README.md](./Agent%20Prompts/README.md)

## 课程信息

- **课程**: CS3604 软件工程与项目管理
- **学校**: 上海交通大学
- **项目**: 中国铁路12306网站复制

## 许可证

本项目仅用于课程学习和研究目的。

---

**注意**: 本项目严格遵循 TDD 原则，请确保在使用过程中遵守所有开发规范和约束。
