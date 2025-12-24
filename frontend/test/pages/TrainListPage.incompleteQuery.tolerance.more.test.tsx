import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { test, expect } from 'vitest'
import { TrainListPage } from '../../src/pages/TrainListPage'

const PathProbe = () => {
  const loc = useLocation()
  return <div data-testid="location">{loc.pathname}{loc.search}</div>
}

const renderOnTrains = () => {
  return render(
    <MemoryRouter initialEntries={["/trains"]}>
      <PathProbe />
      <Routes>
        <Route path="/trains" element={<TrainListPage />} />
      </Routes>
    </MemoryRouter>
  )
}

test('Given 缺少出发地 When 点击查询 Then 不弹出车票、不报错、不刷新URL', async () => {
  const user = userEvent.setup()
  renderOnTrains()
  const queryButton = screen.getByRole('button', { name: '查询' })
  await user.click(queryButton)
  expect(screen.queryByText('❗请输入出发地')).not.toBeInTheDocument()
  expect(screen.queryByText('❗请输入到达地')).not.toBeInTheDocument()
  expect(screen.queryByText('❗请输入出发日期')).not.toBeInTheDocument()
  expect(screen.getByTestId('location').textContent).toBe('/trains')
  expect(screen.getByText('暂无车票')).toBeInTheDocument()
}, 15000)

test('Given 缺少出发日期 When 点击查询 Then 不弹出车票、不报错、不刷新URL', async () => {
  const user = userEvent.setup()
  renderOnTrains()
  const queryButton = screen.getByRole('button', { name: '查询' })
  await user.click(queryButton)
  expect(screen.queryByText('❗请输入出发日期')).not.toBeInTheDocument()
  expect(screen.getByTestId('location').textContent).toBe('/trains')
  expect(screen.getByText('暂无车票')).toBeInTheDocument()
}, 15000)

