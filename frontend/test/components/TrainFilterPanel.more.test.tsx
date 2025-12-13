import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TrainFilterPanel } from '../../src/components/TrainFilterPanel'

test('Given 席别选择 When 点击一等座 Then 立即调用onFiltersChange带seatTypes', async () => {
  const user = userEvent.setup()
  const onFiltersChange = vi.fn()
  render(<TrainFilterPanel onFiltersChange={onFiltersChange} />)
  const seatCheckbox = screen.getByRole('checkbox', { name: '一等座' })
  await user.click(seatCheckbox)
  expect(onFiltersChange).toHaveBeenCalled()
})

test('Given 出发车站选择 When 选择上海虹桥 Then 立即调用onFiltersChange', async () => {
  const user = userEvent.setup()
  const onFiltersChange = vi.fn()
  render(<TrainFilterPanel onFiltersChange={onFiltersChange} />)
  const departSelect = screen.getByLabelText('出发车站')
  await user.selectOptions(departSelect, '上海虹桥')
  expect(onFiltersChange).toHaveBeenCalled()
})

test('Given 到达车站选择 When 选择北京南 Then 立即调用onFiltersChange', async () => {
  const user = userEvent.setup()
  const onFiltersChange = vi.fn()
  render(<TrainFilterPanel onFiltersChange={onFiltersChange} />)
  const arrivalSelect = screen.getByLabelText('到达车站')
  await user.selectOptions(arrivalSelect, '北京南')
  expect(onFiltersChange).toHaveBeenCalled()
})

