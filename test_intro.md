# 测试简介（后端 / 前端 / Link）

## 后端测试（backend）

- **作用**：验证后端 API 路由、服务层业务逻辑、数据库读写与错误处理，确保接口行为与返回数据符合预期。
- **位置**：`backend/test/`
- **技术栈**：Jest + Supertest
- **统计（在 `backend` 目录执行 `npm test` 的输出口径）**
  - 测试文件（Test Suites）：51 个
  - 测试用例（Tests）：202 条

## 前端测试（frontend）

- **作用**：验证 React 组件渲染与交互、页面逻辑、路由相关行为、API 调用封装等，保障 UI 行为符合需求。
- **位置**：`frontend/test/`（主要包括 `components/`、`pages/`、`api/`、`integration/` 等）
- **技术栈**：Vitest + React Testing Library + jsdom
- **统计（不含 Link 测试）**
  - 全量前端测试（在 `frontend` 目录执行 `npm test -- --run --maxWorkers=1`）：88 个测试文件，264 条测试
  - Link 测试（见下一节）：3 个测试文件，13 条测试
  - 因此前端测试（不含 Link）：85 个测试文件，251 条测试

## Link 测试（跨页连接 / 流程测试）

- **作用**：验证关键用户流程的跨页跳转、路由参数/状态传递、页面间联动是否正确（例如注册流程、个人中心流程等）。
- **位置**：`frontend/test/cross-page/`
- **技术栈**：Vitest + React Testing Library + MemoryRouter
- **统计（在 `frontend` 目录执行 `npm test -- --run --maxWorkers=1 test/cross-page` 的输出口径）**
  - 测试文件（Test Files）：3 个
  - 测试用例（Tests）：13 条

