import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TrainListPage } from '../../src/pages/TrainListPage'

test('Given 用户进入页面 When 不执行任何操作 Then 默认单程/普通且不显示车票', () => {
  render(
    <MemoryRouter>
      <TrainListPage />
    </MemoryRouter>
  )
  expect(screen.getByLabelText('单程')).toBeChecked()
  expect(screen.getByLabelText('普通')).toBeChecked()
  expect(screen.queryByText('车票列表')).not.toBeInTheDocument()
})

test('Given 用户进入页面 When 不执行任何操作 Then 随机填充出发地与目的地且日期为今天', () => {
  render(
    <MemoryRouter>
      <TrainListPage />
    </MemoryRouter>
  )
  const fromInput = screen.getByLabelText('出发地')
  const toInput = screen.getByLabelText('目的地')
  expect(fromInput).toHaveValue(expect.stringMatching(/.+/))
  expect(toInput).toHaveValue(expect.stringMatching(/.+/))
  const departDateInput = screen.getByLabelText('出发日')
  expect(departDateInput).toHaveValue(expect.stringMatching(/\d{4}-\d{2}-\d{2}/))
})

