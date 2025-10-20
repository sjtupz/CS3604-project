import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NavigationBar from '../../src/components/NavigationBar';

describe('NavigationBar Component', () => {
  // 基于UI-NavigationBar的acceptanceCriteria编写测试

  describe('Logo and Branding', () => {
    it('应该显示12306标志', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      expect(screen.getByText('12306')).toBeInTheDocument();
    });

    it('应该显示中国铁路客户服务中心标题', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      expect(screen.getByText('中国铁路客户服务中心')).toBeInTheDocument();
    });

    it('应该有正确的logo样式类', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      const logoElement = screen.getByText('12306');
      expect(logoElement).toHaveClass('logo');
    });
  });

  describe('User Authentication State - Not Logged In', () => {
    it('应该在未登录时显示登录按钮', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
    });

    it('应该在未登录时显示注册按钮', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      expect(screen.getByRole('button', { name: '注册' })).toBeInTheDocument();
    });

    it('应该在未登录时不显示用户名', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      expect(screen.queryByText(/欢迎/)).not.toBeInTheDocument();
    });

    it('应该在未登录时不显示退出登录按钮', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      expect(screen.queryByRole('button', { name: '退出登录' })).not.toBeInTheDocument();
    });

    it('应该在未登录时不显示我的12306按钮', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      expect(screen.queryByRole('button', { name: '我的12306' })).not.toBeInTheDocument();
    });
  });

  describe('User Authentication State - Logged In', () => {
    it('应该在已登录时显示欢迎信息和用户名', () => {
      render(<NavigationBar isLoggedIn={true} username="testuser" />);
      
      expect(screen.getByText('欢迎您，testuser')).toBeInTheDocument();
    });

    it('应该在已登录时显示我的12306按钮', () => {
      render(<NavigationBar isLoggedIn={true} username="testuser" />);
      
      expect(screen.getByRole('button', { name: '我的12306' })).toBeInTheDocument();
    });

    it('应该在已登录时显示退出登录按钮', () => {
      render(<NavigationBar isLoggedIn={true} username="testuser" />);
      
      expect(screen.getByRole('button', { name: '退出登录' })).toBeInTheDocument();
    });

    it('应该在已登录时不显示登录按钮', () => {
      render(<NavigationBar isLoggedIn={true} username="testuser" />);
      
      expect(screen.queryByRole('button', { name: '登录' })).not.toBeInTheDocument();
    });

    it('应该在已登录时不显示注册按钮', () => {
      render(<NavigationBar isLoggedIn={true} username="testuser" />);
      
      expect(screen.queryByRole('button', { name: '注册' })).not.toBeInTheDocument();
    });

    it('应该处理没有用户名的已登录状态', () => {
      render(<NavigationBar isLoggedIn={true} />);
      
      expect(screen.getByText('欢迎您，')).toBeInTheDocument();
    });
  });

  describe('Button Click Handlers', () => {
    it('应该在点击登录按钮时调用登录处理函数', () => {
      const mockOnLogin = vi.fn();
      render(<NavigationBar isLoggedIn={false} onLogin={mockOnLogin} />);
      
      const loginButton = screen.getByRole('button', { name: '登录' });
      fireEvent.click(loginButton);
      
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    it('应该在点击注册按钮时调用注册处理函数', () => {
      const mockOnRegister = vi.fn();
      render(<NavigationBar isLoggedIn={false} onRegister={mockOnRegister} />);
      
      const registerButton = screen.getByRole('button', { name: '注册' });
      fireEvent.click(registerButton);
      
      expect(mockOnRegister).toHaveBeenCalledTimes(1);
    });

    it('应该在点击退出登录按钮时调用退出处理函数', () => {
      const mockOnLogout = vi.fn();
      render(<NavigationBar isLoggedIn={true} username="testuser" onLogout={mockOnLogout} />);
      
      const logoutButton = screen.getByRole('button', { name: '退出登录' });
      fireEvent.click(logoutButton);
      
      expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });

    it('应该在点击我的12306按钮时调用账户管理处理函数', () => {
      const mockOnAccountManagement = vi.fn();
      render(<NavigationBar isLoggedIn={true} username="testuser" onAccountManagement={mockOnAccountManagement} />);
      
      const accountButton = screen.getByRole('button', { name: '我的12306' });
      fireEvent.click(accountButton);
      
      expect(mockOnAccountManagement).toHaveBeenCalledTimes(1);
    });
  });

  describe('Component Props Handling', () => {
    it('应该使用默认的空函数当没有提供处理函数时', () => {
      expect(() => render(<NavigationBar isLoggedIn={false} />)).not.toThrow();
      
      // 点击按钮不应该抛出错误
      const loginButton = screen.getByRole('button', { name: '登录' });
      expect(() => fireEvent.click(loginButton)).not.toThrow();
    });

    it('应该正确处理所有可选的props', () => {
      const mockHandlers = {
        onLogin: vi.fn(),
        onRegister: vi.fn(),
        onLogout: vi.fn(),
        onAccountManagement: vi.fn()
      };
      
      expect(() => 
        render(
          <NavigationBar 
            isLoggedIn={true}
            username="testuser"
            {...mockHandlers}
          />
        )
      ).not.toThrow();
    });

    it('应该正确处理isLoggedIn属性的变化', () => {
      const { rerender } = render(<NavigationBar isLoggedIn={false} />);
      
      expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
      
      rerender(<NavigationBar isLoggedIn={true} username="testuser" />);
      
      expect(screen.queryByRole('button', { name: '登录' })).not.toBeInTheDocument();
      expect(screen.getByText('欢迎您，testuser')).toBeInTheDocument();
    });

    it('应该正确处理username属性的变化', () => {
      const { rerender } = render(<NavigationBar isLoggedIn={true} username="user1" />);
      
      expect(screen.getByText('欢迎您，user1')).toBeInTheDocument();
      
      rerender(<NavigationBar isLoggedIn={true} username="user2" />);
      
      expect(screen.getByText('欢迎您，user2')).toBeInTheDocument();
      expect(screen.queryByText('欢迎您，user1')).not.toBeInTheDocument();
    });
  });

  describe('Navigation Bar Layout', () => {
    it('应该有正确的导航栏结构', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      const navbar = screen.getByRole('navigation');
      expect(navbar).toBeInTheDocument();
      expect(navbar).toHaveClass('navbar');
    });

    it('应该正确排列左侧品牌元素', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      const brandSection = screen.getByText('12306').closest('.navbar-brand');
      expect(brandSection).toBeInTheDocument();
    });

    it('应该正确排列右侧用户操作元素', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      const userSection = screen.getByRole('button', { name: '登录' }).closest('.navbar-user');
      expect(userSection).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('应该在小屏幕上正确显示', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      // 在实际实现中，应该测试响应式行为
      // 例如：移动端菜单折叠等
      const navbar = screen.getByRole('navigation');
      expect(navbar).toHaveClass('navbar');
    });

    it('应该在大屏幕上正确显示', () => {
      render(<NavigationBar isLoggedIn={true} username="testuser" />);
      
      // 在实际实现中，应该测试桌面端完整显示
      const navbar = screen.getByRole('navigation');
      expect(navbar).toHaveClass('navbar');
    });
  });

  describe('Accessibility', () => {
    it('应该有正确的语义化标签', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('应该支持键盘导航', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      const loginButton = screen.getByRole('button', { name: '登录' });
      loginButton.focus();
      expect(document.activeElement).toBe(loginButton);
    });

    it('应该有正确的按钮角色', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '注册' })).toBeInTheDocument();
    });

    it('应该在已登录状态下有正确的按钮角色', () => {
      render(<NavigationBar isLoggedIn={true} username="testuser" />);
      
      expect(screen.getByRole('button', { name: '我的12306' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '退出登录' })).toBeInTheDocument();
    });
  });

  describe('Visual States', () => {
    it('应该有正确的按钮样式类', () => {
      render(<NavigationBar isLoggedIn={false} />);
      
      const loginButton = screen.getByRole('button', { name: '登录' });
      const registerButton = screen.getByRole('button', { name: '注册' });
      
      expect(loginButton).toHaveClass('btn', 'btn-primary');
      expect(registerButton).toHaveClass('btn', 'btn-secondary');
    });

    it('应该在已登录状态下有正确的按钮样式类', () => {
      render(<NavigationBar isLoggedIn={true} username="testuser" />);
      
      const accountButton = screen.getByRole('button', { name: '我的12306' });
      const logoutButton = screen.getByRole('button', { name: '退出登录' });
      
      expect(accountButton).toHaveClass('btn', 'btn-outline');
      expect(logoutButton).toHaveClass('btn', 'btn-outline');
    });

    it('应该有正确的用户欢迎信息样式', () => {
      render(<NavigationBar isLoggedIn={true} username="testuser" />);
      
      const welcomeText = screen.getByText('欢迎您，testuser');
      expect(welcomeText).toHaveClass('welcome-text');
    });
  });

  describe('Error Handling', () => {
    it('应该处理空的用户名', () => {
      render(<NavigationBar isLoggedIn={true} username="" />);
      
      expect(screen.getByText('欢迎您，')).toBeInTheDocument();
    });

    it('应该处理undefined的用户名', () => {
      render(<NavigationBar isLoggedIn={true} username={undefined} />);
      
      expect(screen.getByText('欢迎您，')).toBeInTheDocument();
    });

    it('应该处理null的用户名', () => {
      render(<NavigationBar isLoggedIn={true} username={null} />);
      
      expect(screen.getByText('欢迎您，')).toBeInTheDocument();
    });
  });

  describe('Multiple Click Handling', () => {
    it('应该处理登录按钮的多次点击', () => {
      const mockOnLogin = vi.fn();
      render(<NavigationBar isLoggedIn={false} onLogin={mockOnLogin} />);
      
      const loginButton = screen.getByRole('button', { name: '登录' });
      fireEvent.click(loginButton);
      fireEvent.click(loginButton);
      fireEvent.click(loginButton);
      
      expect(mockOnLogin).toHaveBeenCalledTimes(3);
    });

    it('应该处理退出登录按钮的多次点击', () => {
      const mockOnLogout = vi.fn();
      render(<NavigationBar isLoggedIn={true} username="testuser" onLogout={mockOnLogout} />);
      
      const logoutButton = screen.getByRole('button', { name: '退出登录' });
      fireEvent.click(logoutButton);
      fireEvent.click(logoutButton);
      
      expect(mockOnLogout).toHaveBeenCalledTimes(2);
    });
  });
});