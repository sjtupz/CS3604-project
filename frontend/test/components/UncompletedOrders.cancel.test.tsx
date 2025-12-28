import { describe, expect, test, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UncompletedOrders from '../../src/components/UncompletedOrders'

describe('未完成订单取消订单', () => {
  test('Given 未完成订单存在 When 点击取消订单 Then 弹出限制提示弹窗', async () => {
    const onCancelOrder = vi.fn()
    render(
      <UncompletedOrders
        orders={[{ orderId: 'o1', trainNumber: 'G1', fromStation: '上海', toStation: '北京' }]}
        onCancelOrder={onCancelOrder}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: '取消订单' }))
    expect(
      screen.getByText(
        '在一天内3次申请车票成功后取消订单（包含无座票时取消5次计为取消1次），当日将不能在12306继续购票。'
      )
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: '取消' }))
    expect(
      screen.queryByText(
        '在一天内3次申请车票成功后取消订单（包含无座票时取消5次计为取消1次），当日将不能在12306继续购票。'
      )
    ).not.toBeInTheDocument()
  })

  test('Given 取消弹窗已弹出 When 点击确定 Then 触发取消回调', async () => {
    const onCancelOrder = vi.fn()
    render(
      <UncompletedOrders
        orders={[{ orderId: 'o1', trainNumber: 'G1', fromStation: '上海', toStation: '北京' }]}
        onCancelOrder={onCancelOrder}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: '取消订单' }))
    await userEvent.click(screen.getByRole('button', { name: '确定' }))
    expect(onCancelOrder).toHaveBeenCalledWith('o1')
  })

  test('Given 未完成订单存在 When 渲染 Then “去支付”为橙底白字', async () => {
    render(
      <UncompletedOrders
        orders={[{ orderId: 'o1', trainNumber: 'G1', fromStation: '上海', toStation: '北京' }]}
      />
    )

    expect(screen.getByRole('button', { name: '去支付' })).toHaveStyle('background-color: rgb(255, 102, 0)')
    expect(screen.getByRole('button', { name: '去支付' })).toHaveStyle('color: rgb(255, 255, 255)')
  })

  test('Given 未完成订单存在 When 确认取消订单 Then 订单行从列表消失', async () => {
    const onCancelOrder = vi.fn(async () => undefined)
    render(
      <UncompletedOrders
        orders={[{ orderId: 'o1', trainNumber: 'G1', fromStation: '上海', toStation: '北京' }]}
        onCancelOrder={onCancelOrder}
      />
    )

    expect(screen.getByText('上海 → 北京 G1')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: '取消订单' }))
    await userEvent.click(screen.getByRole('button', { name: '确定' }))

    expect(screen.queryByText('上海 → 北京 G1')).not.toBeInTheDocument()
  })
})
