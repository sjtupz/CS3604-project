import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonalCenterLayout from '../../src/components/PersonalCenterLayout';

describe('UI-PersonalCenterLayout', () => {
  const mockCurrentUser = {
    realName: '张三',
    username: 'zhangsan'
  };

  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given 用户已登录 When 渲染个人中心布局 Then 应显示左侧导航栏和主内容区域', () => {
    // Arrange & Act
    render(
      <PersonalCenterLayout
        currentUser={mockCurrentUser}
        onNavigate={mockOnNavigate}
      />
    );

    // Assert
    expect(screen.getByText('个人中心')).toBeInTheDocument();
    expect(screen.getByText('订票中心')).toBeInTheDocument();
    expect(screen.getByText('个人信息')).toBeInTheDocument();
    expect(screen.getByText('常用信息管理')).toBeInTheDocument();
  });

  test('Given 左侧导航栏存在 When 点击导航项 Then 应切换主内容区域显示', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <PersonalCenterLayout
        currentUser={mockCurrentUser}
        onNavigate={mockOnNavigate}
      />
    );

    // Act
    await user.click(screen.getByText('个人信息'));

    // Assert
    expect(mockOnNavigate).toHaveBeenCalledWith('个人信息');
  });

  test('Given 订票中心子菜单存在 When 点击火车票订单 Then 应触发导航回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <PersonalCenterLayout
        currentUser={mockCurrentUser}
        onNavigate={mockOnNavigate}
      />
    );

    // Act
    await user.click(screen.getByText('订票中心'));
    await user.click(screen.getByText('火车票订单'));

    // Assert
    expect(mockOnNavigate).toHaveBeenCalledWith('火车票订单');
  });
});
