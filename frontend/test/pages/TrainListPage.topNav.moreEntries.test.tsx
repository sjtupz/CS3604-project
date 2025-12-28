import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { test, expect } from 'vitest'
import { TrainListPage } from '../../src/pages/TrainListPage'
import HomePage from '../../src/pages/HomePage'
import LoginPage from '../../src/pages/LoginPage'
import { RegisterPage } from '../../src/pages/RegisterPage'

const PathProbe = () => {
  const loc = useLocation()
  return <div data-testid="location">{loc.pathname}</div>
}

const renderWithRoutes = (initialPath: string) => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}> 
      <PathProbe />
      <Routes>
        <Route path="/trains" element={<TrainListPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </MemoryRouter>
  )
}

test('Given 未登录用户在车次列表页 When 点击我的12306 Then 跳转登录页并显示欢迎登录12306', async () => {
  const user = userEvent.setup()
  renderWithRoutes('/trains')
  await user.click(screen.getByText('我的12306'))
  expect(screen.getByTestId('location').textContent).toBe('/login')
  expect(screen.getByText('欢迎登录12306')).toBeInTheDocument()
})

test('Given 未登录用户在车次列表页 When 点击注册 Then 跳转注册页并显示“用户注册”标题居中', async () => {
  const user = userEvent.setup()
  renderWithRoutes('/trains')
  await user.click(screen.getByText('注册'))
  expect(screen.getByTestId('location').textContent).toBe('/register')
  const heading = screen.getByRole('heading', { name: '用户注册' })
  expect(heading).toHaveStyle({ textAlign: 'center' })
})

test('Given 用户在车次列表页 When 点击首页 Then 跳转查询页且默认出发日期为今天', async () => {
  const user = userEvent.setup()
  renderWithRoutes('/trains')
  await user.click(screen.getByText('首页'))
  expect(screen.getByTestId('location').textContent).toBe('/')
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  const dateInput = screen.getByTestId('date-picker-input')
  expect(dateInput).toHaveValue(`${y}-${m}-${d}`)
})

