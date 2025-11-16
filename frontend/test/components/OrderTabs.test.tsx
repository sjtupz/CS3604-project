import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderTabs from '../../src/components/OrderTabs';

describe('UI-OrderTabs', () => {
  const mockOnTabChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given 渲染订单标签页 When 初始状态 Then 应显示三个并列标签', () => {
    // Arrange & Act
    render(<OrderTabs onTabChange={mockOnTabChange} />);

    // Assert
    expect(screen.getByText('未完成订单')).toBeInTheDocument();
    expect(screen.getByText('未出行订单')).toBeInTheDocument();
    expect(screen.getByText('历史订单')).toBeInTheDocument();
  });

  test('Given 默认激活标签 When 渲染组件 Then 未完成订单标签应有视觉高亮', () => {
    // Arrange & Act
    render(<OrderTabs onTabChange={mockOnTabChange} />);

    // Assert
    const defaultTab = screen.getByText('未完成订单');
    expect(defaultTab).toHaveStyle({ fontWeight: 'bold' });
  });

  test('Given 点击标签 When 用户点击未出行订单 Then 应触发回调并切换激活状态', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<OrderTabs onTabChange={mockOnTabChange} />);

    // Act
    await user.click(screen.getByText('未出行订单'));

    // Assert
    expect(mockOnTabChange).toHaveBeenCalledWith('未出行订单');
  });

  test('Given 指定activeTab属性 When 渲染组件 Then 对应标签应为激活状态', () => {
    // Arrange & Act
    render(<OrderTabs activeTab="历史订单" onTabChange={mockOnTabChange} />);

    // Assert
    const historyTab = screen.getByText('历史订单');
    expect(historyTab).toHaveStyle({ fontWeight: 'bold' });
  });
});
