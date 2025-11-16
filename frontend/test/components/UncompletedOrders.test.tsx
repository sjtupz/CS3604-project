import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UncompletedOrders from '../../src/components/UncompletedOrders';

describe('UI-UncompletedOrders', () => {
  const mockOrders = [
    {
      orderId: 'order-001',
      orderNumber: '1234567890',
      trainNumber: 'G108',
      passengerName: '张三',
      trainInfo: '北京南-上海虹桥',
      passengerInfo: '张三(成人)',
      seatInfo: '02车厢 08A号',
      price: 553.0
    }
  ];

  const mockOnNavigateToPayment = jest.fn();
  const mockOnNavigateToBooking = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given 订单列表不为空 When 渲染未完成订单 Then 应显示订单表格', () => {
    // Arrange & Act
    render(
      <UncompletedOrders
        orders={mockOrders}
        onNavigateToPayment={mockOnNavigateToPayment}
        onNavigateToBooking={mockOnNavigateToBooking}
      />
    );

    // Assert
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('G108')).toBeInTheDocument();
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('02车厢 08A号')).toBeInTheDocument();
    expect(screen.getByText('¥553')).toBeInTheDocument();
    expect(screen.getByText('跳转支付')).toBeInTheDocument();
  });

  test('Given 订单列表为空 When 渲染未完成订单 Then 应显示前往车票预定接口', () => {
    // Arrange & Act
    render(
      <UncompletedOrders
        orders={[]}
        onNavigateToPayment={mockOnNavigateToPayment}
        onNavigateToBooking={mockOnNavigateToBooking}
      />
    );

    // Assert
    expect(screen.getByText('您没有未完成的订单哦～')).toBeInTheDocument();
    expect(screen.getByText(/您可以通过/)).toBeInTheDocument();
    expect(screen.getByText('车票预定')).toBeInTheDocument();
  });

  test('Given 点击跳转支付按钮 When 用户点击 Then 应触发导航回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <UncompletedOrders
        orders={mockOrders}
        onNavigateToPayment={mockOnNavigateToPayment}
        onNavigateToBooking={mockOnNavigateToBooking}
      />
    );

    // Act
    await user.click(screen.getByText('跳转支付'));

    // Assert
    expect(mockOnNavigateToPayment).toHaveBeenCalledWith('order-001');
  });

  test('Given 订单列表为空 When 点击前往车票预定 Then 应触发导航回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <UncompletedOrders
        orders={[]}
        onNavigateToPayment={mockOnNavigateToPayment}
        onNavigateToBooking={mockOnNavigateToBooking}
      />
    );

    // Act
    await user.click(screen.getByText('车票预定'));

    // Assert
    expect(mockOnNavigateToBooking).toHaveBeenCalled();
  });
});
