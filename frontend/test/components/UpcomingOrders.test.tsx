import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UpcomingOrders from '../../src/components/UpcomingOrders';

describe('UI-UpcomingOrders', () => {
  const mockOrders = [
    {
      orderId: 'order-001',
      orderNumber: '1234567890',
      trainNumber: 'G108',
      passengerName: '张三',
      bookingDate: '2025-01-15',
      travelDate: '2025-01-16',
      trainInfo: '北京南-上海虹桥',
      passengerInfo: '张三(成人)',
      seatInfo: '02车厢 08A号',
      price: 553.0,
      status: '未出行'
    }
  ];

  const mockOnRefund = jest.fn();
  const mockOnModify = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given 渲染未出行订单 When 显示查询功能 Then 应显示按订票日期和按乘车日期选项', () => {
    // Arrange & Act
    render(
      <UpcomingOrders
        orders={mockOrders}
        onRefund={mockOnRefund}
        onModify={mockOnModify}
      />
    );

    // Assert
    expect(screen.getByDisplayValue('按订票日期')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('订单号/车次/姓名')).toBeInTheDocument();
  });

  test('Given 订单列表存在 When 渲染表格 Then 应显示完整的订单信息', () => {
    // Arrange & Act
    render(
      <UpcomingOrders
        orders={mockOrders}
        onRefund={mockOnRefund}
        onModify={mockOnModify}
      />
    );

    // Assert
    expect(screen.getByText('G108')).toBeInTheDocument();
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('02车厢 08A号')).toBeInTheDocument();
    expect(screen.getByText('¥553')).toBeInTheDocument();
    expect(screen.getByText('未出行')).toBeInTheDocument();
    expect(screen.getByText('退票')).toBeInTheDocument();
    expect(screen.getByText('改签')).toBeInTheDocument();
  });

  test('Given 查询条件设置 When 点击查询按钮 Then 应触发查询逻辑', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <UpcomingOrders
        orders={mockOrders}
        onRefund={mockOnRefund}
        onModify={mockOnModify}
      />
    );

    // Act
    await user.click(screen.getByText('查询'));

    // Assert
    // TODO: 验证查询逻辑被调用
  });

  test('Given 点击退票按钮 When 用户点击 Then 应触发退票回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <UpcomingOrders
        orders={mockOrders}
        onRefund={mockOnRefund}
        onModify={mockOnModify}
      />
    );

    // Act
    await user.click(screen.getByText('退票'));

    // Assert
    expect(mockOnRefund).toHaveBeenCalledWith('order-001');
  });

  test('Given 点击改签按钮 When 用户点击 Then 应触发改签回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <UpcomingOrders
        orders={mockOrders}
        onRefund={mockOnRefund}
        onModify={mockOnModify}
      />
    );

    // Act
    await user.click(screen.getByText('改签'));

    // Assert
    expect(mockOnModify).toHaveBeenCalledWith('order-001');
  });

  test('Given 提示信息存在 When 渲染组件 Then 应显示只保留三十天信息', () => {
    // Arrange & Act
    render(
      <UpcomingOrders
        orders={mockOrders}
        onRefund={mockOnRefund}
        onModify={mockOnModify}
      />
    );

    // Assert
    expect(screen.getByText('提示：只保留三十天信息')).toBeInTheDocument();
  });
});
