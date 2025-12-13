import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StationGroupSelector } from '../../src/components/StationGroupSelector'

test('Given 热门与字母分组 When 点击站点 Then 触发onSelectStation', async () => {
  const user = userEvent.setup()
  const onSelect = vi.fn()
  render(<StationGroupSelector onSelectStation={onSelect} groups={[{ name: '热门', stations: ['上海虹桥'] }]} />)
  const stationButton = screen.getByRole('button', { name: '上海虹桥' })
  await user.click(stationButton)
  expect(onSelect).toHaveBeenCalledWith('上海虹桥')
})

test('Given 搜索词无匹配 When 过滤 Then 展示空状态', () => {
  render(<StationGroupSelector onSelectStation={() => {}} groups={[{ name: '热门', stations: [] }]} />)
  expect(screen.getByText('无法匹配任何站点')).toBeInTheDocument()
})

