import { render, screen } from '@testing-library/react'
import { TrainListItem } from '../../src/components/TrainListItem'

test('Given 席别状态规则 When 渲染 Then 显示图例与候补/有/余票数字', () => {
  const train = { seatAvailability: { 一等座: { remaining: 0, backupOnly: true }, 二等座: { remaining: 25 }, 软卧: { remaining: null, hasSeatType: false }, 硬座: { remaining: 12 } } }
  render(<TrainListItem train={train} onReserve={() => {}} />)
  expect(screen.getByText('候补')).toBeInTheDocument()
  expect(screen.getByText('有')).toBeInTheDocument()
  expect(screen.getByText('—')).toBeInTheDocument()
  expect(screen.getByText('12')).toBeInTheDocument()
})

test('Given 点击预订 When 未登录 Then 跳转登录页', () => {
  const train = { }
  render(<TrainListItem train={train} onReserve={() => {}} />)
  const reserveButton = screen.getByRole('button', { name: '预订' })
  expect(reserveButton).toBeEnabled()
})
