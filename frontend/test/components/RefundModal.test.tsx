import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RefundModal from '../../src/components/RefundModal';

describe('UI-RefundModal', () => {
  const mockOrder = {
    orderId: 'order-001',
    trainNumber: 'G108'
  };

  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given 弹窗未打开 When 渲染组件 Then 不应显示弹窗内容', () => {
    // Arrange & Act
    render(
      <RefundModal
        isOpen={false}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    // Assert
    expect(screen.queryByText('退票申请')).not.toBeInTheDocument();
  });

  test('Given 弹窗打开且有订单信息 When 渲染弹窗 Then 应显示退票申请界面', () => {
    // Arrange & Act
    render(
      <RefundModal
        order={mockOrder}
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    // Assert
    expect(screen.getByText('退票申请')).toBeInTheDocument();
    expect(screen.getByText('订单号：order-001')).toBeInTheDocument();
    expect(screen.getByText('车次：G108')).toBeInTheDocument();
    expect(screen.getByText('退款手续费用：¥10.5')).toBeInTheDocument();
    expect(screen.getByText('确认')).toBeInTheDocument();
    expect(screen.getByText('取消')).toBeInTheDocument();
  });

  test('Given 弹窗打开 When 显示注意事项 Then 应显示退票注意事项', () => {
    // Arrange & Act
    render(
      <RefundModal
        order={mockOrder}
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    // Assert
    expect(screen.getByText('注意事项：')).toBeInTheDocument();
    expect(screen.getByText('退票后将无法恢复，请确认后再操作')).toBeInTheDocument();
    expect(screen.getByText('退款将在3-7个工作日内退回原支付账户')).toBeInTheDocument();
    expect(screen.getByText('退票手续费将不予退还')).toBeInTheDocument();
  });

  test('Given 点击确认按钮 When 用户点击 Then 应触发确认回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <RefundModal
        order={mockOrder}
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    // Act
    await user.click(screen.getByText('确认'));

    // Assert
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  test('Given 点击取消按钮 When 用户点击 Then 应触发取消回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <RefundModal
        order={mockOrder}
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    // Act
    await user.click(screen.getByText('取消'));

    // Assert
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('Given 点击遮罩层 When 用户点击 Then 应触发取消回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <RefundModal
        order={mockOrder}
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    // Act - 点击遮罩层（modal overlay）
    // 遮罩层是最外层的div，包含整个modal
    const modal = screen.getByText('退票申请').closest('div')?.parentElement;
    if (modal) {
      await user.click(modal);
    }

    // Assert
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
