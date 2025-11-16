import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonalCenterHome from '../../src/components/PersonalCenterHome';

describe('UI-PersonalCenterHome', () => {
  const mockUserInfo = {
    realName: '张三',
    username: 'zhangsan'
  };

  const mockOnNavigateToService = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given 用户信息存在 When 渲染个人中心主页 Then 应显示用户真实姓名和欢迎语', () => {
    // Arrange & Act
    render(
      <PersonalCenterHome
        userInfo={mockUserInfo}
        onNavigateToService={mockOnNavigateToService}
      />
    );

    // Assert
    // 问候语被拆分成两部分：名字（加粗）和其他（不加粗）
    expect(screen.getByText('张三')).toBeInTheDocument();
    // 检查问候语容器是否包含完整的问候语
    const container = screen.getByText('张三').closest('p');
    const fullText = container?.textContent || '';
    expect(fullText).toMatch(/张三\s+(先生|女士)，(上午|下午|晚上)好！/);
  });

  test('Given 浅蓝色提示框存在 When 渲染个人中心主页 Then 应显示提示框内容', () => {
    // Arrange & Act
    render(
      <PersonalCenterHome
        userInfo={mockUserInfo}
        onNavigateToService={mockOnNavigateToService}
      />
    );

    // Assert
    expect(screen.getByText('欢迎您登录中国铁路客户服务中心网站。')).toBeInTheDocument();
    expect(screen.getByText('如果您的密码在其他网站也使用，建议您修改本网站密码。')).toBeInTheDocument();
    expect(screen.getByText('成为会员')).toBeInTheDocument();
    expect(screen.getByText('车票预订')).toBeInTheDocument();
  });

  test('Given 微信和支付宝二维码区域存在 When 渲染个人中心主页 Then 应显示二维码设置区域', () => {
    // Arrange & Act
    render(
      <PersonalCenterHome
        userInfo={mockUserInfo}
        onNavigateToService={mockOnNavigateToService}
      />
    );

    // Assert
    expect(screen.getByText(/使用微信扫一扫，可通过/)).toBeInTheDocument();
    expect(screen.getByText(/微信公众号接收12306行程通知/)).toBeInTheDocument();
    expect(screen.getByText(/使用支付宝扫一扫，可通过/)).toBeInTheDocument();
    expect(screen.getByText(/支付宝通知提醒接收12306行程通知/)).toBeInTheDocument();
  });

  test('Given 温馨提示栏存在 When 渲染个人中心主页 Then 应显示黄色边框的温馨提示', () => {
    // Arrange & Act
    render(
      <PersonalCenterHome
        userInfo={mockUserInfo}
        onNavigateToService={mockOnNavigateToService}
      />
    );

    // Assert
    expect(screen.getByText('温馨提示')).toBeInTheDocument();
    expect(screen.getByText(/消息通知方式进行相关调整/)).toBeInTheDocument();
    expect(screen.getByText(/您可通过"账号安全"中的"通知设置"修改/)).toBeInTheDocument();
  });

  test('Given 点击成为会员 When 用户点击 Then 应触发导航回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <PersonalCenterHome
        userInfo={mockUserInfo}
        onNavigateToService={mockOnNavigateToService}
      />
    );

    // Act
    await user.click(screen.getByText('成为会员'));

    // Assert
    expect(mockOnNavigateToService).toHaveBeenCalledWith('会员服务');
  });

  test('Given 点击车票预订 When 用户点击 Then 应触发导航回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <PersonalCenterHome
        userInfo={mockUserInfo}
        onNavigateToService={mockOnNavigateToService}
      />
    );

    // Act
    await user.click(screen.getByText('车票预订'));

    // Assert
    expect(mockOnNavigateToService).toHaveBeenCalledWith('车票服务');
  });
});
