import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { test, expect } from 'vitest'
import { TrainListPage } from '../../src/pages/TrainListPage'

const renderOnTrains = () => {
  return render(
    <MemoryRouter initialEntries={["/trains"]}>
      <Routes>
        <Route path="/trains" element={<TrainListPage />} />
      </Routes>
    </MemoryRouter>
  )
}

test('Given 出行信息完整 When 点击查询 Then 不展示分页控件', async () => {
  const user = userEvent.setup()
  renderOnTrains()
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
  expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
}, 15000)

test('Given 查询完成 When 页面无分页控件 Then 上一页/下一页按钮不存在', async () => {
  const user = userEvent.setup()
  renderOnTrains()
  const queryButton = screen.getByRole('button', { name: '查询' })
  await user.click(queryButton)
  expect(screen.queryByRole('button', { name: '上一页' })).toBeNull()
  expect(screen.queryByRole('button', { name: '下一页' })).toBeNull()
}, 15000)
