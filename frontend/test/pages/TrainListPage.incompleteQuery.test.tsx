import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { TrainListPage } from '../../src/pages/TrainListPage'

test('Given 出行信息不全 When 点击查询 Then 页面不展示车票且不报错', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <TrainListPage />
    </MemoryRouter>
  )
  const queryButton = screen.getByRole('button', { name: '查询' })
  await user.click(queryButton)
  expect(screen.queryByText('车票列表')).not.toBeInTheDocument()
  expect(screen.queryByText('❗请输入用户名！')).not.toBeInTheDocument()
  expect(screen.queryByText('❗请输入出发日期')).not.toBeInTheDocument()
})

