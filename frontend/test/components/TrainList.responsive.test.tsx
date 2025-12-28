import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import { TrainList } from '../../src/components/TrainList'

test('Given 移动端宽度 When 渲染列表 Then 隐藏备注列', () => {
  // 设置移动端尺寸
  (globalThis as any).window = Object.assign(window, { innerWidth: 375 })
  const items = [{ trainNumber: 'G108', departureStation: '上海虹桥', arrivalStation: '北京南', departureTime: '08:00', arrivalTime: '12:30', duration: '04:30' }]
  render(<TrainList items={items} />)
  expect(screen.queryByText('备注')).not.toBeInTheDocument()
})

