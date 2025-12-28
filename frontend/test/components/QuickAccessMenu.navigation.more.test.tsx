import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { QuickAccessMenu } from '../../src/components/QuickAccessMenu'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

test('Given 快捷入口 When 点击首页 Then 跳转到首页', () => {
  render(
    <BrowserRouter>
      <QuickAccessMenu />
    </BrowserRouter>
  )
  fireEvent.click(screen.getByText('首页'))
  expect(mockNavigate).toHaveBeenCalledWith('/')
})

test('Given 快捷入口 When 点击车票 Then 跳转到车次列表页', () => {
  render(
    <BrowserRouter>
      <QuickAccessMenu />
    </BrowserRouter>
  )
  fireEvent.click(screen.getByText('车票'))
  expect(mockNavigate).toHaveBeenCalledWith('/tickets')
})

