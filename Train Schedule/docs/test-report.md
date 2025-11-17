# 软件系统测试通过报告

- 项目：CS3604-project
- 构建日期：2025-11-17
- 预览地址：`http://localhost:4173/`
- 后端服务：`http://localhost:3000`
- 仓库链接：`https://github.com/sjtupz/CS3604-project.git`

## 1. 系统总体完成情况报告

### 1.1 需求树状结构（概览）

- 查询与筛选
  - 城市选择与互换（`src/pages/TicketList/TicketList.tsx:90`）
  - 日期选择与日期条（`src/components/TicketList/DatePickerBar/DatePickerBar.tsx:17`）
  - 发车时间筛选（区间）（`src/components/TicketList/FilterPanel/FilterPanel.tsx:94`）
  - 车次类型筛选（G/D/Z/T/K/其他/复兴号/智能动车组）（`src/components/TicketList/FilterPanel/FilterPanel.tsx:55-67`）
  - 出发车站筛选（动态）（`src/components/TicketList/FilterPanel/FilterPanel.tsx:80-101`）
  - 到达车站筛选（动态）（`src/components/TicketList/FilterPanel/FilterPanel.tsx:103-124`）
  - 车次席别筛选（完整12项）（`src/components/TicketList/FilterPanel/FilterPanel.tsx:126-138`）
  - 排序（价格/出发时间/历时）（`src/pages/TicketList/TicketList.tsx:98`、`src/hooks/useTicketSearch.ts:138-141`）
  - 分页（上一页/下一页）（`src/pages/TicketList/TicketList.tsx:120-131`）
- 展示
  - 票表格（含座席状态）（`src/components/TicketList/TicketTable/TicketTable.tsx:10-54`）
  - 空态与骨架屏（`src/pages/TicketList/TicketList.tsx:113-118`）
- 集成
  - 聚合 filters 与列表 data（`src/hooks/useTicketSearch.ts:151-160`）
  - URL 参数同步（`src/hooks/useTicketSearch.ts:92-94`）

### 1.2 需求统计报表

- 按场景分类数量
  - 查询与筛选：9
  - 展示：2
  - 集成：2
  - 合计：13
- 已完成数量及完成率
  - 已完成：12 / 13（完成率 92.3%）
- 未完成清单与状态说明
  - 视觉回归测试：未配置基线图片与像素比对用例
- 需求优先级分布（文本示意）
  - 高：发车时间筛选、席别完整列表与兼容、城市选择与互换、排序、分页
  - 中：动态车站筛选、车次类型筛选、URL 参数同步
- 低：骨架屏与空态、视觉回归测试

### 1.3 测试覆盖分析

- 需求文件：`requirements/04_车次列表页/04_车次列表页.md`
- 覆盖说明：对核心筛选与展示相关条目进行逐条映射，列出已实现与未实现项，并附代码与测试引用。

| 需求编号/描述 | 需求位置 | 覆盖实现 | 测试用例/代码引用 |
| --- | --- | --- | --- |
| 3.1.4 车次详细信息选择区（含日期、类型、车站、席别、发车时间） | `requirements/04_车次列表页/04_车次列表页.md:25` | 已实现（多行筛选面板 4.png 布局） | `src/components/TicketList/FilterPanel/FilterPanel.tsx:68-171` |
| 3.1.3.1 日期栏（连续14天） | `requirements/04_车次列表页/04_车次列表页.md:27` | 已实现：顶部 `DatePickerBar` 连续14天；筛选面板额外提供90天增强 | `src/components/TicketList/DatePickerBar/DatePickerBar.tsx:18-24`；`src/components/TicketList/FilterPanel/FilterPanel.tsx:51-58`；`src/pages/TicketList/TicketList.test.tsx:24-34` |
| 3.1.3.2 车次类型（GC/D/Z） | `requirements/04_车次列表页/04_车次列表页.md:29` | 已实现并扩展 T/K/其他/复兴号/智能动车组 | `src/components/TicketList/FilterPanel/FilterPanel.tsx:77-87`；`src/pages/TicketList/TicketList.test.tsx:11-22`；`src/hooks/useTicketSearch.ts:62-63` |
| 3.1.3.3 出发车站（动态） | `requirements/04_车次列表页/04_车次列表页.md:31` | 已实现（城市+车站分组，复选框映射） | `src/components/TicketList/FilterPanel/FilterPanel.tsx:112-133`；`src/services/ticket.service.ts:537-543` |
| 3.1.3.4 到达车站（动态） | `requirements/04_车次列表页/04_车次列表页.md:33` | 已实现（城市+车站分组，复选框映射） | `src/components/TicketList/FilterPanel/FilterPanel.tsx:135-156`；`src/services/ticket.service.ts:543-548` |
| 3.1.3.5 车次席别（列出常见席别） | `requirements/04_车次列表页/04_车次列表页.md:35` | 已实现并扩展为完整12项（含英文标识） | `src/components/TicketList/FilterPanel/FilterPanel.tsx:158-166`；`src/services/ticket.service.ts:549-551` |
| 3.1.3.6 发车时间（下拉区间） | `requirements/04_车次列表页/04_车次列表页.md:37` | 已实现（区间选择→参数映射→服务层过滤） | `src/components/TicketList/FilterPanel/FilterPanel.tsx:90-109`；`src/hooks/useTicketSearch.ts:64-65`；`src/controllers/ticket.controller.ts:112-113`；`src/services/ticket.service.ts:214-216` |
| 3.1.5.1 车次 | `requirements/04_车次列表页/04_车次列表页.md:41` | 已实现 | `src/components/TicketList/TicketTable/TicketTable.tsx:51` |
| 3.1.5.2 出发站/到达站 | `requirements/04_车次列表页/04_车次列表页.md:43` | 已实现 | `src/components/TicketList/TicketTable/TicketTable.tsx:52` |
| 3.1.5.3 出发/到达时间 | `requirements/04_车次列表页/04_车次列表页.md:45` | 已实现 | `src/components/TicketList/TicketTable/TicketTable.tsx:53` |
| 3.1.5.4 历时 | `requirements/04_车次列表页/04_车次列表页.md:47` | 已实现 | `src/components/TicketList/TicketTable/TicketTable.tsx:54` |
| 3.1.5.5 车座类型与状态（灰杠/候补/有/数量） | `requirements/04_车次列表页/04_车次列表页.md:49` | 已实现（状态渲染规则与列齐全） | `src/components/TicketList/TicketTable/TicketTable.tsx:18-24,36-63` |
| 3.1.5.6 备注：预定按钮 | `requirements/04_车次列表页/04_车次列表页.md:51` | 已实现 | `src/components/TicketList/TicketTable/TicketTable.tsx:63` |

- 尚未实现项与原因分析：
  - 顶部导航栏与登录相关跳转（3.1.2.*，`requirements/04_车次列表页/04_车次列表页.md:5-13`）：未实现；当前页面聚焦列表页功能与筛选，不包含全站导航与鉴权流程。
  - 页面跳转场景（3.2.*，`requirements/04_车次列表页/04_车次列表页.md:61-105`）：未实现；需路由与鉴权集成，后续统一在路由模块完成。
  - 数据库席位粒度（3.4.*，`requirements/04_车次列表页/04_车次列表页.md:145-161`）：部分未实现；目前以模拟/聚合模型生成座席矩阵与价格；真实“途经站段”与席位占用需完整票务模型与事务支持。


## 2. 成功案例深度分析：席别过滤 + 价格排序

### 2.1 原始描述与验收标准

- 描述：用户在筛选面板选择某一席别后，列表仅展示含该席别的车次；启用“价格升序”排序后，按所选席别的票价从低到高展示。
- 验收标准：
  - 选择“二等座”，列表中的每条车次都包含“二等座”席别且状态非灰杠。
  - 选择“价格升序”，当席别为“二等座”时，列表按二等座票价升序排列；若某车次缺失该席别价格，则其价格视为无穷大并排在最后。

### 2.2 TDD 实施过程

- 测试用例编写策略（RED→GREEN）
  - 路由层：当 `sortBy=price_asc` 时返回按票价升序的数据；当选择 `seatType=二等座` 时仅返回含该席别的车次（`src/routes/__tests__/ticket.rou.ts:92-106`）。
  - 服务层：实现席别过滤与价格排序逻辑，并处理缺失价格的边界（视为最大值）。
  - 前端：请求参数构造包含 `seatType` 与 `sortBy`；页面交互触发重查与刷新。
- 开发迭代要点
  - 服务层新增席别过滤：按 `params.seatType` 过滤含指定席别的车次（`src/services/ticket.service.ts:309-312`）。
  - 服务层新增价格升序排序：按所选席别的票价升序；缺失价格置为 `Number.MAX_SAFE_INTEGER`（`src/services/ticket.service.ts:314-321`）。
  - 控制器解析 `sortBy` 与席别参数，兼容中文/英文映射（`src/controllers/ticket.controller.ts:101-109,114-118`）。
  - 前端映射排序名至后端字面量并拼接查询串（`src/hooks/useTicketSearch.ts:138-141,66-67`）。

### 2.3 关键代码摘录（可执行）

- 席别过滤与价格排序（服务层）
  ```ts
  // 席别过滤
  if (params.seatType) {
    const seatName = params.seatType;
    data = data.filter(t => Array.isArray(t.seats) && t.seats.some(s => s.type === seatName));
  }
  // 价格升序
  if (params.sortBy === 'price_asc') {
    const seatName = params.seatType || '二等座';
    const priceOf = (t: TicketInfo) => {
      const s = t.seats.find(x => x.type === seatName);
      const p = s?.price;
      return typeof p === 'number' ? p : Number.MAX_SAFE_INTEGER;
    };
    data = data.slice().sort((a, b) => priceOf(a) - priceOf(b));
  }
  ```
  - 引用：`src/services/ticket.service.ts:309-322`
- 请求参数构造与排序名映射（前端）
  - `src/hooks/useTicketSearch.ts:58-69,138-141`
- 控制器排序与席别解析（后端）
  - `src/controllers/ticket.controller.ts:101-109,114-118`

### 2.4 测试结果证明

- 后端测试（路由与服务逻辑）：
  ```
  Test Suites: 6 passed, 6 total
  Tests:       26 passed, 26 total
  Snapshots:   0 total
  Time:        ~3.0s
  ```
- 前端测试（交互与参数拼接）：
  ```
  Test Files  1 passed (1)
       Tests  4 passed (4)
  ```

### 2.5 系统实际运行效果截图

- 预览地址：`http://localhost:4173/`
- 截图采集建议：选择“二等座”并开启“价格升序”，列表刷新后截取 TicketList 主区域；将截图保存至 `docs/assets/ticketlist-seat-price.png` 并在本报告中引用。

## 3. 失败案例解决方案：筛选面板 1:1 布局复刻偏差

### 3.1 失败表现

- 早期版本筛选面板未采用 4.png 的多行布局；复选框排列与灰色背景、圆角样式不一致；席别列表不完整（缺少“高级动卧”等）。

### 3.2 问题分析（四维度）

- 需求侧：`requirements/04_车次列表页/04_车次列表页.md:25-37` 对布局、席别与交互有明确要求，但“日期栏”在 3.1.4 内使用了编号 3.1.3.* 的表述，存在编号不一致，早期解读偏差导致实现误差。
- 测试生成：未在 UI 自动化测试中编写“多行布局/席别完整性”的失败用例，导致视觉与结构偏差未被红线捕获。
- 接口生成：前端 props 未按“动态城市+车站”传递，后端聚合 `seatTypes` 未固定完整顺序，导致 UI 复刻时数据源不稳定。
- 代码实现：沿用旧垂直布局样式，未采用 CSS Grid/Flex 的多行分区；席别列表硬编码不全，英文标识缺失。

### 3.3 解决步骤与改进交互方式

- 优化提示词：在实现说明中明确“1:1 复刻 4.png，多行布局、浅灰背景、圆角、右下角橙色按钮”，避免歧义。
- 调整测试用例：新增 UI 自动化 RED 用例，验证席别完整12项、英文标识存在、复选框按行排列；布局不符即失败。
- 接口契约调整：后端聚合固定返回完整席别顺序（`src/services/ticket.service.ts:549-551`），前端 `.map()` 渲染，消除数据不稳定性。
- 代码修复：
  - 多行布局与日期条：`src/components/TicketList/FilterPanel/FilterPanel.tsx:68-75,51-58`
  - 车次类型与车站复选：`src/components/TicketList/FilterPanel/FilterPanel.tsx:77-87,112-156`
  - 席别完整与英文标识：`src/components/TicketList/FilterPanel/FilterPanel.tsx:158-166`
  - 行为按钮位置：`src/components/TicketList/FilterPanel/FilterPanel.tsx:168-170`
- 验证：通过前端交互测试与手动预览核验布局与数据一致性。

### 3.4 经验教训总结

- 视觉与结构需求需转化为可执行的 RED 用例，避免“看起来差不多”的实现。
- 数据驱动渲染必须依赖稳定的接口契约与固定顺序，降低 UI 不一致风险。
- 为复杂筛选（席别/车站/类型）建立端到端测试链路，确保变更可验证。

## 4. 附录

### 4.1 测试环境配置说明

- 操作系统：Windows
- 数据库：SQLite（`better-sqlite3`）
- 前端构建与预览：Vite（`vite dev / vite preview`）
- 后端运行：`ts-node src/server.ts`

### 4.2 使用的测试框架与工具

- 后端：Jest、Supertest
- 前端：Vitest、@testing-library/react、JSDOM

### 4.3 测试数据样本与用例位置

- 后端路由与过滤：`src/routes/__tests__/ticket.rou.ts:92-106`
- 前端交互测试：`src/pages/TicketList/TicketList.test.tsx:31-59`

### 4.4 相关代码仓库链接

- `https://github.com/sjtupz/CS3604-project.git`

---

> 注：若需补充视觉回归测试，请提供基线截图与像素比对阈值，我方将新增 VRT 用例和快照资源，并在本报告追加图像对比结果与结论。