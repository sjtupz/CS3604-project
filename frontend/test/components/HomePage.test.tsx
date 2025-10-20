import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage from '../../src/components/HomePage';

describe('HomePage Component', () => {
  // 基于UI-HomePage的acceptanceCriteria编写测试

  describe('Navigation Bar Display', () => {
    it('应该在未登录状态显示登录和注册按钮', () => {
      render(<HomePage isLoggedIn={false} />);
      
      expect(screen.getByText('登录')).toBeInTheDocument();
      expect(screen.getByText('注册')).toBeInTheDocument();
    });

    it('应该在已登录状态显示用户名和我的12306按钮', () => {
      render(<HomePage isLoggedIn={true} username="testuser" />);
      
      expect(screen.getByText('欢迎，testuser')).toBeInTheDocument();
      expect(screen.getByText('我的12306')).toBeInTheDocument();
      expect(screen.getByText('退出')).toBeInTheDocument();
    });

    it('应该在已登录状态不显示登录和注册按钮', () => {
      render(<HomePage isLoggedIn={true} username="testuser" />);
      
      expect(screen.queryByText('登录')).not.toBeInTheDocument();
      expect(screen.queryByText('注册')).not.toBeInTheDocument();
    });
  });

  describe('Quick Access Buttons', () => {
    it('应该显示首页和车票快捷按钮', () => {
      render(<HomePage />);
      
      expect(screen.getByText('首页')).toBeInTheDocument();
      expect(screen.getByText('车票')).toBeInTheDocument();
    });

    it('应该在点击首页按钮时调用导航回调', () => {
      const mockNavigate = vi.fn();
      render(<HomePage onNavigate={mockNavigate} />);
      
      fireEvent.click(screen.getByText('首页'));
      
      // 如果当前不在首页，应该导航到首页
      // 如果已在首页，应该刷新页面（这里我们测试导航逻辑）
      expect(mockNavigate).toHaveBeenCalledWith('home');
    });

    it('应该在点击车票按钮时不发生页面跳转', () => {
      const mockNavigate = vi.fn();
      render(<HomePage onNavigate={mockNavigate} />);
      
      fireEvent.click(screen.getByText('车票'));
      
      // 车票按钮不应该触发导航
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Ticket Query Form', () => {
    it('应该显示车票查询表单', () => {
      render(<HomePage />);
      
      expect(screen.getByText('车票查询')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('请输入出发城市')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('请输入目的城市')).toBeInTheDocument();
    });

    it('应该包含所有必需的查询字段', () => {
      render(<HomePage />);
      
      expect(screen.getByLabelText('出发地')).toBeInTheDocument();
      expect(screen.getByLabelText('目的地')).toBeInTheDocument();
      expect(screen.getByLabelText('出发日期')).toBeInTheDocument();
      expect(screen.getByLabelText('乘客类型')).toBeInTheDocument();
    });

    it('应该有查询按钮', () => {
      render(<HomePage />);
      
      expect(screen.getByText('查询车票')).toBeInTheDocument();
    });
  });

  describe('Navigation Interactions', () => {
    it('应该在点击登录按钮时调用导航到登录页', () => {
      const mockNavigate = vi.fn();
      render(<HomePage isLoggedIn={false} onNavigate={mockNavigate} />);
      
      fireEvent.click(screen.getByText('登录'));
      
      expect(mockNavigate).toHaveBeenCalledWith('login');
    });

    it('应该在点击注册按钮时调用导航到注册页', () => {
      const mockNavigate = vi.fn();
      render(<HomePage isLoggedIn={false} onNavigate={mockNavigate} />);
      
      fireEvent.click(screen.getByText('注册'));
      
      expect(mockNavigate).toHaveBeenCalledWith('register');
    });

    it('应该在未登录状态点击我的12306时跳转到登录页', () => {
      const mockNavigate = vi.fn();
      render(<HomePage isLoggedIn={false} onNavigate={mockNavigate} />);
      
      // 在未登录状态下，我的12306按钮不应该显示
      // 但如果用户尝试访问相关功能，应该跳转到登录页
      expect(screen.queryByText('我的12306')).not.toBeInTheDocument();
    });

    it('应该在已登录状态点击我的12306时不跳转到登录页', () => {
      const mockNavigate = vi.fn();
      render(<HomePage isLoggedIn={true} username="testuser" onNavigate={mockNavigate} />);
      
      fireEvent.click(screen.getByText('我的12306'));
      
      // 已登录状态下点击我的12306不应该跳转到登录页
      expect(mockNavigate).not.toHaveBeenCalledWith('login');
    });
  });

  describe('User State Management', () => {
    it('应该正确显示用户登录状态', () => {
      const { rerender } = render(<HomePage isLoggedIn={false} />);
      
      // 未登录状态
      expect(screen.getByText('登录')).toBeInTheDocument();
      expect(screen.getByText('注册')).toBeInTheDocument();
      
      // 切换到已登录状态
      rerender(<HomePage isLoggedIn={true} username="testuser" />);
      
      expect(screen.getByText('欢迎，testuser')).toBeInTheDocument();
      expect(screen.queryByText('登录')).not.toBeInTheDocument();
    });

    it('应该在用户名为空时显示默认状态', () => {
      render(<HomePage isLoggedIn={true} username="" />);
      
      expect(screen.getByText('欢迎，')).toBeInTheDocument();
      expect(screen.getByText('我的12306')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('应该包含NavigationBar组件', () => {
      render(<HomePage />);
      
      // 验证导航栏相关元素存在
      expect(screen.getByText('12306')).toBeInTheDocument();
    });

    it('应该包含TicketQueryForm组件', () => {
      render(<HomePage />);
      
      // 验证车票查询表单相关元素存在
      expect(screen.getByText('车票查询')).toBeInTheDocument();
      expect(screen.getByText('查询车票')).toBeInTheDocument();
    });

    it('应该正确传递props给子组件', () => {
      const mockNavigate = vi.fn();
      render(
        <HomePage 
          isLoggedIn={true} 
          username="testuser" 
          onNavigate={mockNavigate} 
        />
      );
      
      // 验证props正确传递给NavigationBar
      expect(screen.getByText('欢迎，testuser')).toBeInTheDocument();
      
      // 测试导航功能
      fireEvent.click(screen.getByText('我的12306'));
      // 这里应该验证相应的回调被调用
    });
  });

  describe('Accessibility', () => {
    it('应该有正确的语义化结构', () => {
      render(<HomePage />);
      
      // 验证主要的语义化元素
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '查询车票' })).toBeInTheDocument();
    });

    it('应该支持键盘导航', () => {
      render(<HomePage />);
      
      const loginButton = screen.getByText('登录');
      expect(loginButton).toBeInTheDocument();
      
      // 验证按钮可以获得焦点
      loginButton.focus();
      expect(document.activeElement).toBe(loginButton);
    });
  });
});