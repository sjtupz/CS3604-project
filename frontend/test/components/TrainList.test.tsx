import { render, screen } from '@testing-library/react'
import { TrainList } from '../../src/components/TrainList'

test('Given 车次数据 When 渲染 Then 展示车次/站点/时间/历时/备注及席别列', () => {
  render(<TrainList items={[{ trainNumber: 'G108' }]} />)
  expect(screen.getByText('车次')).toBeInTheDocument()
  expect(screen.getByText('出发站/到达站')).toBeInTheDocument()
  expect(screen.getByText('出发时间/到达时间')).toBeInTheDocument()
  expect(screen.getByText('历时')).toBeInTheDocument()
  expect(screen.getByText('备注')).toBeInTheDocument()
  expect(screen.getByText('商务座')).toBeInTheDocument()
  expect(screen.getByText('特等座')).toBeInTheDocument()
  // 备注列承载预订按钮
  expect(screen.getByRole('button', { name: '预订' })).toBeInTheDocument()
})
