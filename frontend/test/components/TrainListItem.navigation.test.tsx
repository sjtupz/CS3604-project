import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { TrainListItem } from '../../src/components/TrainListItem'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

test('Given 未登录 When 点击预订 Then 跳转登录页', () => {
  render(
    <BrowserRouter>
      <TrainListItem train={{}} onReserve={() => {}} />
    </BrowserRouter>
  )
  const reserveButton = screen.getByRole('button', { name: '预订' })
  fireEvent.click(reserveButton)
  expect(mockNavigate).toHaveBeenCalledWith('/login')
})

test('Given 已登录 When 点击预订 Then 跳转订单填写页', () => {
  render(
    <BrowserRouter>
      {/* 假设组件在登录态下导航到订单填写页 */}
      <TrainListItem train={{}} onReserve={() => {}} />
    </BrowserRouter>
  )
  const reserveButton = screen.getByRole('button', { name: '预订' })
  fireEvent.click(reserveButton)
  expect(mockNavigate).toHaveBeenCalledWith('/orders/new')
})
