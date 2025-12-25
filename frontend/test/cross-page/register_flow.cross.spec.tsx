import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, test, expect, vi } from 'vitest'
import App from '../../src/App'

vi.mock('../../src/api/user', () => {
  return {
    registerUser: vi.fn(async () => ({ message: 'ok' })),
    checkUsername: vi.fn(async () => ({ isAvailable: true })),
    checkIdentityNumber: vi.fn(async () => ({ isAvailable: true })),
    checkPhoneNumber: vi.fn(async () => ({ isAvailable: true })),
    checkEmail: vi.fn(async () => ({ isAvailable: true })),
  }
})

vi.mock('../../src/api/register', () => {
  return {
    sendRegisterCode: vi.fn(async () => ({ message: '获取手机验证码成功！' })),
    verifyRegister: vi.fn(async () => ({ message: 'Registration successful, please proceed to login.' })),
  }
})

const PathProbe = () => {
  const loc = useLocation()
  return <div data-testid="location">{loc.pathname}</div>
}

const SearchProbe = () => {
  const loc = useLocation()
  return <div data-testid="search">{loc.search}</div>
}

const renderWithRouter = (initialEntries: string[]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <PathProbe />
      <SearchProbe />
      <App />
    </MemoryRouter>
  )
}

describe('E2E Scenario: 用户注册跨页流程', () => {
  test('Step 1: 提交注册表单 -> 跳转至验证码页，携带手机号参数', async () => {
    const user = userEvent.setup()
    renderWithRouter(['/register'])

    await user.type(screen.getByLabelText('用户名'), 'validUser')
    await user.type(screen.getByLabelText('登录密码'), 'Pass_w1')
    await user.type(screen.getByLabelText('确认密码'), 'Pass_w1')
    await user.type(screen.getByLabelText('姓名'), '张三')
    await user.type(screen.getByLabelText('证件号码'), '110101199003074477')
    await user.type(screen.getByLabelText('手机号码'), '13800138001')
    await user.click(screen.getByRole('checkbox', { name: /我已同意/ }))

    await user.click(screen.getByRole('button', { name: '下一步' }))

    const { registerUser } = await import('../../src/api/user')
    await waitFor(() => expect(registerUser).toHaveBeenCalledTimes(1))

    expect(screen.getByTestId('location').textContent).toBe('/register/verify')
    expect(screen.getByTestId('search').textContent).toContain('phone=13800138001')
    expect(screen.getByTestId('search').textContent).toContain('username=validUser')
  }, 15000)

  test('Step 2: 在验证码页输入正确验证码 -> 跳转至注册成功页', async () => {
    const user = userEvent.setup()
    renderWithRouter(['/register/verify?phone=13800138001&username=validUser'])

    const codeInput = await screen.findByPlaceholderText('请输入短信验证码')
    await user.type(codeInput, '123456')
    await user.click(screen.getByRole('button', { name: '下一步' }))

    const { verifyRegister } = await import('../../src/api/register')
    await waitFor(() => expect(verifyRegister).toHaveBeenCalledTimes(1))
    expect(screen.getByTestId('location').textContent).toBe('/register/success')
  }, 15000)

  test('Step 3: 在注册成功页点击“登录” -> 跳转至登录页', async () => {
    const user = userEvent.setup()
    renderWithRouter(['/register/success'])

    await user.click(screen.getByRole('button', { name: '登录' }))
    expect(screen.getByTestId('location').textContent).toBe('/login')
    expect(screen.getByTestId('search').textContent).toBe('')
  })

  test('Step 4: 点击“《中国铁路客户服务中心网站服务条款》”链接 -> 打开服务条款页', async () => {
    const user = userEvent.setup()
    renderWithRouter(['/register'])

    await user.click(screen.getByText('《中国铁路客户服务中心网站服务条款》'))
    expect(screen.getByTestId('location').textContent).toBe('/terms')
  })

  test('Step 5: 点击“《隐私权政策》”链接 -> 打开隐私权政策页', async () => {
    const user = userEvent.setup()
    renderWithRouter(['/register'])

    await user.click(screen.getByText('《隐私权政策》'))
    expect(screen.getByTestId('location').textContent).toBe('/privacy')
  })
})

