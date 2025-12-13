# 12306 车次列表页 样式对照表（实现 vs 规范）

## 颜色与字体

- 主导航背景 `#4675dc`（实现：`frontend/src/components/QuickAccessMenu.css:1`）
- 选中导航 hover `#2676E3`（实现：`frontend/src/components/QuickAccessMenu.css:18`）
- 搜索/筛选区背景 `#EEF1F8`（实现：`frontend/src/pages/TrainListPage.css:6`、`:134`）
- 查询按钮橙 `#ee8731`（实现：`frontend/src/pages/TrainListPage.css:52`）
- 预订按钮蓝 `#437ff7` 尺寸 72×30、圆角 4px（实现：`frontend/src/pages/TrainListPage.css:112`）
- 选中日期文字 `#3391D0`（实现：`frontend/src/pages/TrainListPage.css:42`）
- 表头背景蓝 `#4a78d1`、文字白 `#fff`（实现：`frontend/src/pages/TrainListPage.css:74`）
- 列表主文字 `#333`（实现：`frontend/src/pages/TrainListPage.css:2`）
- 余票状态“有”绿 `#26A306`（实现：`frontend/src/pages/TrainListPage.css:122`）
- 候补橙 `#faad14`（实现：`frontend/src/pages/TrainListPage.css:118`）
- 无座/无该席别灰 `#999`（实现：`frontend/src/pages/TrainListPage.css:126`）
- 页面字体族：`Tahoma, SimSun`（实现：`frontend/src/pages/TrainListPage.css:2`）

## 间距与尺寸（关键）
- Query 容器宽度约 1200px，外边距 `12px auto`，内边距 `12px 16px`（实现：`frontend/src/pages/TrainListPage.css:6–12`）
- 日期条为条带式按钮（非输入框），间距 8px，选中态白底、文字蓝（实现：`frontend/src/pages/TrainListPage.css:137–148`、`:38–45`）
- 预订按钮 72×30，圆角 4px（实现：`frontend/src/pages/TrainListPage.css:112–120`）
- 表头/行采用栅格列宽：`1.1fr 1.4fr 1.4fr 0.8fr +8席列 +备注 +操作`（实现：`frontend/src/pages/TrainListPage.css:66`、`:90`）
- 行 hover 背景：`#f9fbff`（实现：`frontend/src/pages/TrainListPage.css:100`）

## 交互状态
- 查询按钮 hover/active（实现：`frontend/src/pages/TrainListPage.css:60–61`）
- 预订按钮 hover/active（实现：`frontend/src/pages/TrainListPage.css:120–121`）
- 表头可排序列 hover 下划线（实现：`frontend/src/pages/TrainListPage.css:146`），点击触发排序（实现：`frontend/src/components/TrainList.tsx:55`、`frontend/src/pages/TrainListPage.tsx:131`）

## 功能映射
- 日期 14 天条带（实现：`frontend/src/components/TrainFilterBar.tsx:44`）
- 发车时间下拉（实现：`frontend/src/components/TrainFilterBar.tsx:61`）
- 车次类型复选（实现：`frontend/src/components/TrainFilterBar.tsx:52` 与上行参数传递 `frontend/src/pages/TrainListPage.tsx:121`）
- 排序联动到查询参数（实现：`frontend/src/pages/TrainListPage.tsx:107–110`）
- 分页控件样式与禁用态（实现：`frontend/src/components/Pagination.tsx:10`、`frontend/src/pages/TrainListPage.css:157`）

以上实现点覆盖了文档 `TRAIN_SCHEDULE_UI.md` 中列出的关键视觉与交互规范，并在多处以精确颜色与尺寸对应。若需进一步严苛 1:1，对比参考图并微调列宽与阴影即可达到 98%+ 相似度。
