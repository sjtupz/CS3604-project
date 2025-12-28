import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { TrainListPage } from '../../src/pages/TrainListPage'

test('Given 出行信息完整 When 点击查询 Then 展示当日两地间车票', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <TrainListPage />
    </MemoryRouter>
  )
  const fromInput = screen.getByLabelText('出发地')
  const toInput = screen.getByLabelText('目的地')
  const dateInput = screen.getByLabelText('出发日')
  await user.clear(fromInput)
  await user.type(fromInput, '上海')
  await user.clear(toInput)
  await user.type(toInput, '北京')
  await user.clear(dateInput)
  await user.type(dateInput, '2025-12-25')
  const queryButton = screen.getByRole('button', { name: '查询' })
  await user.click(queryButton)
  expect(screen.getByText('车次')).toBeInTheDocument()
}, 15000)
