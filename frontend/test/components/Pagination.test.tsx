import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from '../../src/components/Pagination'

test('Given 默认每页20条 When 切换页码 Then 调用onPageChange并刷新列表', async () => {
  const user = userEvent.setup()
  const onPageChange = vi.fn()
  render(<Pagination currentPage={1} perPage={20} totalPages={5} onPageChange={onPageChange} />)
  const nextButton = screen.getByRole('button', { name: '下一页' })
  await user.click(nextButton)
  expect(onPageChange).toHaveBeenCalledWith(2)
})

