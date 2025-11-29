# AI Agent TDD 开发框架

## 概述

这是一个基于**测试驱动开发（Test-Driven Development, TDD）**原则的 AI Agent 协作开发框架。框架通过多个专门的 AI Agent 协作，实现从需求到代码的自动化开发流程，确保代码质量和测试覆盖率。

## 核心特性

- ✅ **严格的 TDD 流程**：遵循 RED-GREEN-REFACTOR 循环
- ✅ **职责分离**：每个 Agent 专注于特定任务
- ✅ **接口驱动**：基于 YAML 接口定义进行开发
- ✅ **测试先行**：所有功能都有对应的测试用例
- ✅ **一致性保证**：统一的代码结构和命名规范

## 技术栈

- **前端**: React 18+, TypeScript, Vitest, React Testing Library
- **后端**: Node.js, Express.js/Fastify, SQLite, Jest, Supertest
- **接口定义**: YAML 格式（`.artifacts/` 目录）

## 项目结构

```
project/
├── .artifacts/              # 接口定义文件（由 designer 生成）
│   ├── data_interface.yml   # 数据库操作接口
│   ├── api_interface.yml    # 后端 API 接口
│   └── ui_interface.yml     # 前端 UI 接口
├── backend/                 # 后端代码
│   ├── src/                 # 源代码
│   │   ├── routes/          # API 路由
│   │   ├── controllers/     # 控制器层
│   │   ├── services/        # 服务层
│   │   ├── db/              # 数据库操作
│   │   ├── middleware/      # 中间件
│   │   ├── utils/          # 工具函数
│   │   └── config/         # 配置文件
│   └── test/                # 测试文件
│       ├── routes/
│       ├── services/
│       └── db/
└── frontend/                # 前端代码
    ├── src/                 # 源代码
    │   ├── components/      # 可复用组件
    │   ├── pages/           # 页面组件
    │   ├── utils/          # 工具函数
    │   ├── types/           # TypeScript 类型
    │   ├── api/             # API 调用封装
    │   └── store/           # 状态管理
    └── test/                # 测试文件
        ├── components/
        ├── pages/
        └── utils/
```

## Agent 角色说明

### 1. Designer（系统架构师）

**角色**: 高级系统架构师，负责管理项目的技术接口设计库。

**核心职责**:
- 分析需求文档，设计或更新接口定义
- 智能复用和修改现有接口，避免重复
- 生成和维护 `.artifacts/` 目录下的接口 YAML 文件

**工作流程**:
1. **加载与查询**: 读取现有接口库（`data_interface.yml`, `api_interface.yml`, `ui_interface.yml`）
2. **决策**: 决定复用、修改或创建新接口
3. **执行**: 更新接口定义
4. **输出**: 将更新后的接口写回 YAML 文件

**如何使用**:

```markdown
请使用 designer agent 分析以下需求并更新接口定义：

[粘贴需求文档内容或需求变更描述]

需求文档位置: requirements/[需求文件名].md
```

**输入要求**:
- 需求文档（自然语言描述）
- 或需求变更描述

**输出**:
- 更新后的 `.artifacts/data_interface.yml`
- 更新后的 `.artifacts/api_interface.yml`
- 更新后的 `.artifacts/ui_interface.yml`

**示例命令**:
```
请 designer agent 根据 requirements/01_首页.md 设计接口
```

---

### 2. Test Generator（测试生成器）

**角色**: 测试自动化工程师，负责编写测试用例和代码骨架。

**核心职责**:
- 根据接口定义和需求文档生成测试用例
- 创建最小化的代码骨架（非功能性）
- 确保所有测试用例在代码骨架上失败（TDD RED 阶段）

**工作流程**:
1. **分析变更**: 识别需求变更和接口变更
2. **确保环境可测**: 配置测试环境
3. **生成代码骨架**: 创建最小化的非功能性代码
4. **生成测试用例**: 根据 `acceptanceCriteria` 和 `Given-When-Then` 场景生成测试

**如何使用**:

```markdown
请使用 test_generator agent 为以下接口生成测试用例和代码骨架：

接口文件: .artifacts/[接口文件名].yml
需求文档: requirements/[需求文件名].md
```

**输入要求**:
- 需求文档或需求变更
- `.artifacts/` 目录下的接口 YAML 文件

**输出**:
- `backend/test/` 目录下的后端测试文件
- `frontend/test/` 目录下的前端测试文件
- `backend/src/` 目录下的代码骨架（非功能性）
- `frontend/src/` 目录下的代码骨架（非功能性）

**重要**: 生成的测试用例必须失败，这是 TDD RED 阶段的正常状态。

**示例命令**:
```
请 test_generator agent 为 UI-RegisterForm 接口生成测试用例和代码骨架
```

---

### 3. Frontend Developer（前端开发工程师）

**角色**: 前端开发工程师，遵循 TDD 原则实现前端功能。

**核心职责**:
- 执行前端测试用例（验证 RED 阶段）
- 实现最小代码使测试通过（GREEN 阶段）
- 重构代码（REFACTOR 阶段）

**工作流程**:
1. **RED 阶段验证**: 运行测试，确认所有测试失败
2. **GREEN 阶段**: 逐个修复失败的测试，实现最小代码
3. **REFACTOR 阶段**: 在所有测试通过后重构代码

**如何使用**:

```markdown
请使用 frontend_developer agent 实现前端功能：

测试文件: frontend/test/[测试文件路径]
接口定义: .artifacts/ui_interface.yml
```

**输入要求**:
- `frontend/test/` 目录下的测试文件
- `.artifacts/ui_interface.yml` 接口定义

**输出**:
- `frontend/src/` 目录下的实现代码
- 所有测试用例通过

**TDD 约束**:
- ✅ 必须确保所有测试通过
- ✅ 一次只修复一个测试用例
- ✅ 只实现测试要求的功能
- ❌ 禁止修改测试用例
- ❌ 禁止跳过失败的测试

**示例命令**:
```
请 frontend_developer agent 实现 RegisterForm 组件，确保所有测试通过
```

---

### 4. Backend Developer（后端开发工程师）

**角色**: 后端开发工程师，遵循 TDD 原则实现后端功能。

**核心职责**:
- 执行后端测试用例（验证 RED 阶段）
- 实现最小代码使测试通过（GREEN 阶段）
- 重构代码（REFACTOR 阶段）
- 实现数据库操作

**工作流程**:
1. **RED 阶段验证**: 运行测试，确认所有测试失败
2. **GREEN 阶段**: 逐个修复失败的测试，实现最小代码
3. **数据库操作**: 实现测试要求的数据库操作
4. **REFACTOR 阶段**: 在所有测试通过后重构代码

**如何使用**:

```markdown
请使用 backend_developer agent 实现后端功能：

测试文件: backend/test/[测试文件路径]
接口定义: .artifacts/api_interface.yml, .artifacts/data_interface.yml
```

**输入要求**:
- `backend/test/` 目录下的测试文件
- `.artifacts/api_interface.yml` 接口定义
- `.artifacts/data_interface.yml` 数据库接口定义

**输出**:
- `backend/src/` 目录下的实现代码
- 所有测试用例通过

**TDD 约束**:
- ✅ 必须确保所有测试通过
- ✅ 一次只修复一个测试用例
- ✅ 测试使用独立的数据库连接
- ❌ 禁止修改测试用例
- ❌ 禁止跳过失败的测试
- ❌ 禁止在测试之间共享数据库状态

**示例命令**:
```
请 backend_developer agent 实现用户注册 API，确保所有测试通过
```

## 完整工作流程

### 标准 TDD 开发流程

```
1. 需求分析
   ↓
2. Designer Agent
   ├── 分析需求
   ├── 设计/更新接口定义
   └── 输出: .artifacts/*.yml
   ↓
3. Test Generator Agent
   ├── 读取接口定义
   ├── 生成代码骨架（非功能性）
   ├── 生成测试用例（必须失败）
   └── 输出: backend/test/, frontend/test/, 代码骨架
   ↓
4. Frontend Developer Agent (并行)
   ├── RED: 验证测试失败
   ├── GREEN: 实现代码使测试通过
   └── REFACTOR: 重构代码
   ↓
5. Backend Developer Agent (并行)
   ├── RED: 验证测试失败
   ├── GREEN: 实现代码使测试通过
   └── REFACTOR: 重构代码
   ↓
6. 完成
   └── 所有测试通过，代码重构完成
```

### 详细步骤说明

#### 步骤 1: 准备需求文档

创建或更新需求文档，格式建议：

```markdown
# 需求名称

## 页面布局
[详细描述]

## 与其他页面跳转关系
[Given-When-Then 场景]

## 页面内操作
[Given-When-Then 场景]

## 数据库设计
[数据库结构说明]
```

#### 步骤 2: 运行 Designer Agent

**命令格式**:
```
请使用 designer agent 分析 requirements/[需求文件].md 并更新接口定义
```

**Agent 将**:
- 读取现有接口库
- 分析需求文档
- 决定复用/修改/创建接口
- 更新 `.artifacts/*.yml` 文件

#### 步骤 3: 运行 Test Generator Agent

**命令格式**:
```
请使用 test_generator agent 为 [接口ID] 生成测试用例和代码骨架
```

**Agent 将**:
- 分析需求变更和接口变更
- 生成代码骨架（非功能性）
- 生成测试用例（必须失败）
- 确保测试覆盖所有 `Given-When-Then` 场景

#### 步骤 4: 运行 Frontend Developer Agent

**命令格式**:
```
请使用 frontend_developer agent 实现 [组件名]，确保所有测试通过
```

**Agent 将**:
1. 运行测试，验证 RED 阶段（所有测试失败）
2. 逐个修复测试，实现最小代码（GREEN 阶段）
3. 重构代码，确保测试依然通过（REFACTOR 阶段）

#### 步骤 5: 运行 Backend Developer Agent

**命令格式**:
```
请使用 backend_developer agent 实现 [API名称]，确保所有测试通过
```

**Agent 将**:
1. 运行测试，验证 RED 阶段（所有测试失败）
2. 逐个修复测试，实现最小代码（GREEN 阶段）
3. 实现数据库操作
4. 重构代码，确保测试依然通过（REFACTOR 阶段）

## TDD 原则

### RED-GREEN-REFACTOR 循环

1. **RED（红）**: 编写失败的测试
   - Test Generator 生成失败的测试用例
   - Developer 验证测试失败

2. **GREEN（绿）**: 实现最小代码使测试通过
   - Developer 实现最小功能
   - 确保测试通过

3. **REFACTOR（重构）**: 优化代码
   - Developer 重构代码
   - 确保测试依然通过

### 核心约束

- ✅ **测试用例神圣性**: 绝对不修改测试用例
- ✅ **最小实现**: 只实现使测试通过的最小代码
- ✅ **增量开发**: 一次只实现一个功能点
- ✅ **快速反馈**: 频繁运行测试
- ✅ **测试隔离**: 每个测试独立，不共享状态

### 禁止事项

- ❌ 禁止在没有测试的情况下编写代码
- ❌ 禁止跳过失败的测试继续开发
- ❌ 禁止在测试失败时修改测试用例使其通过
- ❌ 禁止在重构阶段添加新功能
- ❌ 禁止一次修复多个测试用例（除非测试同一功能点）

## 使用示例

### 示例 1: 开发用户注册功能

```markdown
# 步骤 1: 设计接口
请使用 designer agent 分析 requirements/02_2_注册页.md 并更新接口定义

# 步骤 2: 生成测试
请使用 test_generator agent 为 UI-RegisterForm 和 API-POST-Register 生成测试用例

# 步骤 3: 实现前端
请使用 frontend_developer agent 实现 RegisterForm 组件

# 步骤 4: 实现后端
请使用 backend_developer agent 实现用户注册 API
```

### 示例 2: 添加新功能到现有页面

```markdown
# 步骤 1: 更新接口
请使用 designer agent 分析需求变更并更新相关接口

# 步骤 2: 生成新测试
请使用 test_generator agent 为新接口生成测试用例

# 步骤 3: 实现功能
请使用 frontend_developer 和 backend_developer agent 实现新功能
```

## 文件命名规范

### 源代码文件
- **后端**: `backend/src/routes/[routeName].js`
- **前端组件**: `frontend/src/components/[ComponentName].tsx`
- **前端工具**: `frontend/src/utils/[utilName].ts`

### 测试文件
- **后端测试**: `backend/test/routes/[routeName].test.js`
- **前端组件测试**: `frontend/test/components/[ComponentName].test.tsx`
- **前端工具测试**: `frontend/test/utils/[utilName].test.ts`

### 接口文件
- **数据库接口**: `.artifacts/data_interface.yml`
- **API 接口**: `.artifacts/api_interface.yml`
- **UI 接口**: `.artifacts/ui_interface.yml`

## 常见问题

### Q: 如果测试意外通过了怎么办？

**A**: 如果测试意外通过，说明代码骨架中包含了不应该存在的实现。需要：
1. 检查代码骨架，移除业务逻辑实现
2. 确保代码骨架只包含函数签名和 `// TODO` 注释
3. 重新运行测试，确保测试失败

### Q: 可以跳过某个 Agent 吗？

**A**: 不建议。每个 Agent 都有明确的职责：
- **Designer**: 必须运行，确保接口定义正确
- **Test Generator**: 必须运行，生成测试用例
- **Developer**: 必须运行，实现功能

跳过任何 Agent 都会破坏 TDD 流程。

### Q: 如何添加新的需求？

**A**: 
1. 更新或创建需求文档
2. 运行 Designer Agent 更新接口
3. 运行 Test Generator Agent 生成测试
4. 运行 Developer Agents 实现功能

### Q: 测试失败时应该修改测试还是实现代码？

**A**: **绝对不要修改测试用例**。测试用例定义了需求，是开发的目标。应该修改实现代码使测试通过。

### Q: 可以在 GREEN 阶段进行优化吗？

**A**: 不可以。GREEN 阶段只实现最小代码使测试通过。优化应该在 REFACTOR 阶段进行，且必须确保测试依然通过。

## 最佳实践

1. **按顺序执行**: 严格按照 Designer → Test Generator → Developer 的顺序执行
2. **验证每个阶段**: 在每个阶段完成后验证是否符合 TDD 要求
3. **保持测试运行**: 始终保持测试处于可运行状态
4. **遵循约束**: 严格遵守所有 TDD 约束和禁止事项
5. **频繁提交**: 在每个阶段完成后提交代码，便于回退

## 相关文档

- `designer.txt` - Designer Agent 详细说明
- `test_generator.txt` - Test Generator Agent 详细说明
- `frontend_developer.txt` - Frontend Developer Agent 详细说明
- `backend_developer.txt` - Backend Developer Agent 详细说明
- `TDD_ENHANCEMENTS.md` - TDD 增强说明

## 贡献指南

在添加新功能或修改 Agent 行为时，请确保：
1. 保持 TDD 原则的一致性
2. 更新相关文档
3. 确保所有 Agent 的接口定义一致
4. 遵循项目结构和命名规范

## 许可证

[根据项目实际情况填写]

---

**注意**: 本框架严格遵循 TDD 原则，请确保在使用过程中遵守所有约束和最佳实践。

