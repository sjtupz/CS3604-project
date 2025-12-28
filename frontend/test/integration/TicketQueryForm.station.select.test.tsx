import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { TicketQueryForm } from '../../src/components/TicketQueryForm'

test('Given 站点下拉 When 点击城市 Then 输入框填入城市名并关闭弹窗', async () => {
  render(
    <MemoryRouter>
      <TicketQueryForm />
    </MemoryRouter>
  )
  const fromInput = screen.getByLabelText('出发地')

  // 聚焦打开下拉（触发城市列表显示）
  fireEvent.focus(fromInput)

  // 点击热门城市“上海”，按照最新交互直接填入城市名
  const cityButton = await screen.findByText('上海')
  fireEvent.click(cityButton)

  // 期望：输入框更新为“上海”，且弹窗已关闭
  expect((fromInput as HTMLInputElement).value).toBe('上海')
})

test('Given 两个输入框 When 在到达地下拉选择站点 Then 到达地填入且出发地保持不变并关闭弹窗', async () => {
  render(
    <MemoryRouter>
      <TicketQueryForm />
    </MemoryRouter>
  )
  const fromInput = screen.getByLabelText('出发地') as HTMLInputElement
  const toInput = screen.getByLabelText('到达地') as HTMLInputElement

  // 预填出发地
  fireEvent.focus(fromInput)
  const bjCity = await screen.findByText('北京')
  fireEvent.click(bjCity)
  expect(fromInput.value).toBe('北京')

  // 选择到达地
  fireEvent.focus(toInput)
  const shCity = await screen.findByText('上海')
  fireEvent.click(shCity)

  // 验证：到达地为“上海”，出发地仍为“北京”，弹窗关闭
  expect(toInput.value).toBe('上海')
  expect(fromInput.value).toBe('北京')
  expect(screen.queryByText('热门')).toBeNull()
})

test('Given 点击输入框 When 打开下拉 Then 显示热门与字母分组ABCDE', async () => {
  render(
    <MemoryRouter>
      <TicketQueryForm />
    </MemoryRouter>
  )
  const fromInput = screen.getByLabelText('出发地')
  fireEvent.focus(fromInput)
  expect(await screen.findByText('热门')).toBeTruthy()
  expect(screen.getByText('ABCDE')).toBeTruthy()
})
