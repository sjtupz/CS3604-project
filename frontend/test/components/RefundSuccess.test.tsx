import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RefundSuccess from '../../src/components/RefundSuccess';

describe('UI-RefundSuccess', () => {
  const mockRefundInfo = {
    orderId: 'order-001',
    trainNumber: 'G108',
    refundFee: 10.5
  };

  const mockOnContinueBooking = jest.fn();
  const mockOnViewOrderDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given 退票成功信息存在 When 渲染组件 Then 应显示车次信息和退票手续费等内容', () => {
    // Arrange & Act
    render(
      <RefundSuccess
        orderId={mockRefundInfo.orderId}
        trainNumber={mockRefundInfo.trainNumber}
        refundFee={mockRefundInfo.refundFee}
        onContinueBooking={mockOnContinueBooking}
        onViewOrderDetails={mockOnViewOrderDetails}
      />
    );

    // Assert
    expect(screen.getByText(/退票成功/i)).toBeInTheDocument();
    expect(screen.getByText(/订单号/i)).toBeInTheDocument();
    expect(screen.getByText('order-001')).toBeInTheDocument();
    // 使用更精确的查询，查找包含"车次："的文本
    expect(screen.getByText(/车次：/i)).toBeInTheDocument();
    expect(screen.getByText('G108')).toBeInTheDocument();
    // 组件中显示的是"退款手续费"，不是"退票手续费"
    expect(screen.getByText(/退款手续费/i)).toBeInTheDocument();
    expect(screen.getByText(/10.5/i)).toBeInTheDocument();
  });

  test('Given 退票成功信息存在（无车次） When 渲染组件 Then 应显示订单号和退票手续费', () => {
    // Arrange & Act
    render(
      <RefundSuccess
        orderId={mockRefundInfo.orderId}
        refundFee={mockRefundInfo.refundFee}
        onContinueBooking={mockOnContinueBooking}
        onViewOrderDetails={mockOnViewOrderDetails}
      />
    );

    // Assert
    expect(screen.getByText(/退票成功/i)).toBeInTheDocument();
    expect(screen.getByText('order-001')).toBeInTheDocument();
    expect(screen.getByText(/10.5/i)).toBeInTheDocument();
    // 检查不包含"车次："的文本（但可能包含在提示信息中）
    const trainNumberElements = screen.queryAllByText(/车次：/i);
    expect(trainNumberElements.length).toBe(0);
  });

  test('Given 退票成功信息存在 When 渲染组件 Then 应提供"继续购票"和"查看订单详情"两个按钮', () => {
    // Arrange & Act
    render(
      <RefundSuccess
        orderId={mockRefundInfo.orderId}
        trainNumber={mockRefundInfo.trainNumber}
        refundFee={mockRefundInfo.refundFee}
        onContinueBooking={mockOnContinueBooking}
        onViewOrderDetails={mockOnViewOrderDetails}
      />
    );

    // Assert
    expect(screen.getByText(/继续购票/i)).toBeInTheDocument();
    expect(screen.getByText(/查看订单详情/i)).toBeInTheDocument();
  });

  test('Given 退票成功界面显示 When 点击"继续购票"按钮 Then 应调用onContinueBooking回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <RefundSuccess
        orderId={mockRefundInfo.orderId}
        trainNumber={mockRefundInfo.trainNumber}
        refundFee={mockRefundInfo.refundFee}
        onContinueBooking={mockOnContinueBooking}
        onViewOrderDetails={mockOnViewOrderDetails}
      />
    );

    // Act
    const continueBookingButton = screen.getByText(/继续购票/i);
    await user.click(continueBookingButton);

    // Assert
    expect(mockOnContinueBooking).toHaveBeenCalledTimes(1);
  });

  test('Given 退票成功界面显示 When 点击"查看订单详情"按钮 Then 应调用onViewOrderDetails回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <RefundSuccess
        orderId={mockRefundInfo.orderId}
        trainNumber={mockRefundInfo.trainNumber}
        refundFee={mockRefundInfo.refundFee}
        onContinueBooking={mockOnContinueBooking}
        onViewOrderDetails={mockOnViewOrderDetails}
      />
    );

    // Act
    const viewOrderDetailsButton = screen.getByText(/查看订单详情/i);
    await user.click(viewOrderDetailsButton);

    // Assert
    expect(mockOnViewOrderDetails).toHaveBeenCalledTimes(1);
  });

  test('Given 退票成功信息存在（无退票手续费） When 渲染组件 Then 应显示订单号但不显示退票手续费', () => {
    // Arrange & Act
    render(
      <RefundSuccess
        orderId={mockRefundInfo.orderId}
        trainNumber={mockRefundInfo.trainNumber}
        onContinueBooking={mockOnContinueBooking}
        onViewOrderDetails={mockOnViewOrderDetails}
      />
    );

    // Assert
    expect(screen.getByText(/退票成功/i)).toBeInTheDocument();
    expect(screen.getByText('order-001')).toBeInTheDocument();
    // 组件中显示的是"退款手续费"，不是"退票手续费"
    expect(screen.queryByText(/退款手续费/i)).not.toBeInTheDocument();
  });

  test('Given 退票成功界面显示 When 渲染组件 Then 应显示退票后的说明信息', () => {
    // Arrange & Act
    render(
      <RefundSuccess
        orderId={mockRefundInfo.orderId}
        trainNumber={mockRefundInfo.trainNumber}
        refundFee={mockRefundInfo.refundFee}
        onContinueBooking={mockOnContinueBooking}
        onViewOrderDetails={mockOnViewOrderDetails}
      />
    );

    // Assert
    expect(screen.getByText(/退票后的车票信息现在仍处于"未出行订单"区域/i)).toBeInTheDocument();
  });
});

