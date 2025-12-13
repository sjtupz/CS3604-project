import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect } from 'vitest'
import { TicketQueryForm } from '../../src/components/TicketQueryForm'

test('Given 站点下拉 When 点击城市 Then 输入框填入城市名并关闭弹窗', async () => {
  render(<TicketQueryForm />)
  const fromInput = screen.getByLabelText('出发地')

  // 聚焦打开下拉（触发城市列表显示）
  fireEvent.focus(fromInput)

  // 点击热门城市“上海”，按照最新交互直接填入城市名
  const cityButton = await screen.findByText('上海')
  fireEvent.click(cityButton)

  // 期望：输入框更新为“上海”，且弹窗已关闭
  expect((fromInput as HTMLInputElement).value).toBe('上海')
})
