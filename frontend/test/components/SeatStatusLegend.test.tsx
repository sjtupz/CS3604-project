import { render, screen } from '@testing-library/react'
import { SeatStatusLegend } from '../../src/components/SeatStatusLegend'

test('Given 图例规则 When 渲染 Then 展示灰横杠/橙色候补/绿色有/黑色数字说明', () => {
  render(<SeatStatusLegend />)
  expect(screen.getByText('灰色横杠=无此席别')).toBeInTheDocument()
  expect(screen.getByText('橙色候补=无票')).toBeInTheDocument()
  expect(screen.getByText('绿色有=余票>20')).toBeInTheDocument()
  expect(screen.getByText('黑色数字=余票<20')).toBeInTheDocument()
})

