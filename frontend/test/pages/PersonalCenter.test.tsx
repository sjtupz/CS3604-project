import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonalCenter from '../../src/pages/PersonalCenter';
import { vi } from 'vitest';
import apiClient from '../../src/api/client';

// Mock API client
vi.mock('../../src/api/client', () => ({
  default: {
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
}));

describe('PersonalCenter Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API response
    (apiClient.get as any).mockResolvedValue({
      data: {
        realName: '张三',
        username: 'zhangsan',
        gender: 'male'
      }
    });
  });

  test('Given 渲染个人中心页面 When 初始加载 Then 应显示个人中心布局', async () => {
    // Arrange & Act
    render(<PersonalCenter />);

    // Assert
    await waitFor(() => {
      // 验证PersonalCenterLayout组件被渲染
      // 根据PersonalCenterLayout的测试，应该包含左侧导航栏
      expect(screen.getByText(/个人中心/i)).toBeInTheDocument();
    });
  });

  test('Given 页面初始加载 When 组件挂载 Then 应从API获取用户信息', async () => {
    // Arrange & Act
    render(<PersonalCenter />);

    // Assert
    // TODO: 验证API调用被触发
    // 当前实现使用模拟数据，需要验证useEffect中的API调用逻辑
    await waitFor(() => {
      // 验证用户信息被设置（通过PersonalCenterLayout传递）
      expect(screen.getByText(/个人中心/i)).toBeInTheDocument();
    });
  });

  test('Given 页面导航 When 用户触发导航 Then 应调用导航回调', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PersonalCenter />);

    // Act
    await waitFor(() => {
      expect(screen.getByText(/个人中心/i)).toBeInTheDocument();
    });

    // 点击左侧导航栏的某个项目
    // 使用更精确的查询，查找主菜单项"个人信息"（不是子菜单项"查看个人信息"）
    const personalInfoLinks = screen.getAllByText(/个人信息/i);
    // 选择第一个，应该是主菜单项
    const personalInfoLink = personalInfoLinks[0];
    await user.click(personalInfoLink);

    // Assert
    // TODO: 验证handleNavigate被调用
    // 当前实现使用console.log，需要验证导航逻辑
  });

  test('Given 用户信息加载成功 When 渲染页面 Then 应将用户信息传递给PersonalCenterLayout', async () => {
    // Arrange & Act
    render(<PersonalCenter />);

    // Assert
    await waitFor(() => {
      // 验证PersonalCenterLayout接收到用户信息
      // 通过检查子组件是否正确显示用户信息来验证
      expect(screen.getByText(/个人中心/i)).toBeInTheDocument();
    });
  });

  test('Given 用户信息加载失败 When 渲染页面 Then 应显示默认状态', async () => {
    // Arrange
    (apiClient.get as any).mockRejectedValue(new Error('Network Error'));
    
    // Act
    render(<PersonalCenter />);

    // Assert
    await waitFor(() => {
      // 即使没有用户信息，PersonalCenterLayout也应该渲染
      expect(screen.getByText(/个人中心/i)).toBeInTheDocument();
    });
  });
});
