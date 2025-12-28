import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../../src/App'

test('Given 用户进入登录页 When 页面加载 Then 显示左侧12306 logo与欢迎标语', async () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>
  )
  expect(screen.getByText('欢迎登录12306')).toBeInTheDocument()
  expect(screen.getByAltText('12306 Logo')).toBeInTheDocument()
})

test('Given 用户在登录页 When 点击左侧logo Then 跳转到首页', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>
  )
  const logo = screen.getByAltText('12306 Logo')
  await user.click(logo)
  expect(await screen.findByText('首页')).toBeInTheDocument()
})
