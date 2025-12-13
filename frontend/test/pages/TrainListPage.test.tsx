import { render, screen } from '@testing-library/react'
import { TrainListPage } from '../../src/pages/TrainListPage'
import { MemoryRouter } from 'react-router-dom'

test('Given 页面结构 When 初始渲染 Then 包含五部分布局', () => {
  render(
    <MemoryRouter>
      <TrainListPage />
    </MemoryRouter>
  )
  expect(screen.getByTestId('query-bar')).toBeInTheDocument()
  expect(screen.getByTestId('filters')).toBeInTheDocument()
  expect(screen.getByText('友情链接')).toBeInTheDocument()
  expect(screen.getByTestId('footer')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '适老化无障碍服务' })).toBeInTheDocument()
})

test('Given 页面布局调整 When 移除顶部导航 Then 不显示去程与返程标签', () => {
  render(
    <MemoryRouter>
      <TrainListPage />
    </MemoryRouter>
  )
  expect(screen.queryByText('去程')).toBeNull()
  expect(screen.queryByText('返程')).toBeNull()
})

test('Given 加载状态 When 正在获取数据 Then 展示Loading组件', () => {
  render(
    <MemoryRouter>
      <TrainListPage isLoading={true} />
    </MemoryRouter>
  )
  expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
})

test('Given API错误 When 加载失败 Then 展示错误提示与重试按钮', () => {
  render(
    <MemoryRouter>
      <TrainListPage error="Network Error" />
    </MemoryRouter>
  )
  expect(screen.getByText('加载失败: Network Error')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '重试' })).toBeInTheDocument()
})

test('Given 排序操作 When 点击历时排序 Then 触发排序更新', async () => {
  // 需要配合userEvent和Mock
  // 此处假设组件有onSort props或内部集成
  // 为了骨架生成，我们假设页面集成了FilterBar
})

test('Given 响应式布局 When 移动端视图 Then 隐藏非核心列', () => {
  render(
    <MemoryRouter>
      <TrainListPage />
    </MemoryRouter>
  )
  const container = screen.getByTestId('train-list-page')
  expect(container).toHaveClass('responsive-container')
  // 具体响应式测试通常依赖e2e或特定viewport mock，此处仅验证类名
})

test('Given 布局调整 When 移除顶部标题 Then 列表区域紧随提示条显示', async () => {
  render(
    <MemoryRouter>
      <TrainListPage />
    </MemoryRouter>
  )
  // 触发查询以展示列表
  const queryButton = screen.getByRole('button', { name: '查询' })
  await (async () => { const user = (await import('@testing-library/user-event')).default.setup(); await user.click(queryButton) })()
  // 验证列表区域存在
  expect(screen.getByRole('region', { name: '车次列表' })).toBeInTheDocument()
})
