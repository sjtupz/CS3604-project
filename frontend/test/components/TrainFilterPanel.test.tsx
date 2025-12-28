import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TrainFilterPanel } from '../../src/components/TrainFilterPanel'

test('Given 多条件筛选 When 点击任意筛选 Then 立即调用onFiltersChange', async () => {
  const user = userEvent.setup()
  const onFiltersChange = vi.fn()
  render(<TrainFilterPanel onFiltersChange={onFiltersChange} />)
  const typeCheckbox = screen.getByRole('checkbox', { name: 'GC-高铁' })
  await user.click(typeCheckbox)
  expect(onFiltersChange).toHaveBeenCalled()
})

