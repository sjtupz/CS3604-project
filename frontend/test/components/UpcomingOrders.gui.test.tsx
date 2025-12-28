import React from 'react'
import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UpcomingOrders from '../../src/components/UpcomingOrders'

describe('未出行订单 列表展示', () => {
  test('Given 未出行订单存在 When 渲染 Then 展示5列表头与两行信息布局', async () => {
    const t = new Date()
    const today = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
    const onRefund = vi.fn()
    render(
      <UpcomingOrders
        orders={[
          {
            orderId: 'o1',
            trainNumber: 'G108',
            passengerName: '张三',
            passengerIdTypes: '身份证',
            seatInfo: '二等座 01车厢 02A',
            price: 500,
            status: '已支付',
            bookingDate: today,
            travelDate: today,
            fromStation: '上海',
            toStation: '北京',
            departureTime: '07:21',
            ticketType: '成人票',
          },
        ]}
        onRefund={onRefund}
      />
    )

    expect(screen.getByText('车次信息')).toBeInTheDocument()
    expect(screen.getByText('旅客信息')).toBeInTheDocument()
    expect(screen.getByText('席位信息')).toBeInTheDocument()
    expect(screen.getByText('票价')).toBeInTheDocument()
    expect(screen.getByText('车票状态')).toBeInTheDocument()

    expect(screen.queryByText('订票日期')).not.toBeInTheDocument()
    expect(screen.queryByText('操作')).not.toBeInTheDocument()
    expect(screen.queryByText('改签')).not.toBeInTheDocument()

    expect(screen.getByText('上海→北京 G108')).toBeInTheDocument()
    expect(screen.getByText(today)).toBeInTheDocument()
    expect(screen.getByText(/07:21[\s\u00A0]*开/)).toBeInTheDocument()

    expect(screen.getByText('张三')).toBeInTheDocument()
    expect(screen.getByText('身份证')).toBeInTheDocument()

    expect(screen.getByText('成人票')).toBeInTheDocument()
    expect(screen.getByText('500元')).toBeInTheDocument()

    expect(screen.getByText('已支付')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '退票' }))
    expect(onRefund).toHaveBeenCalledWith('o1')
  })
})
