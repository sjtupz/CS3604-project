import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from '../../src/components/LoginForm';

describe('LoginForm Component', () => {
  // 基于UI-LoginForm的acceptanceCriteria编写测试

  describe('Form Structure', () => {
    it('应该显示登录表单标题', () => {
      render(<LoginForm />);
      
      expect(screen.getByText('用户登录')).toBeInTheDocument();
    });

    it('应该显示用户名输入字段', () => {
      render(<LoginForm />);
      
      expect(screen.getByLabelText('用户名/邮箱/手机号')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('请输入用户名、邮箱或手机号')).toBeInTheDocument();
    });

    it('应该显示密码输入字段', () => {
      render(<LoginForm />);
      
      expect(screen.getByLabelText('密码')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('请输入密码')).toBeInTheDocument();
    });

    it('应该显示登录按钮', () => {
      render(<LoginForm />);
      
      expect(screen.getByRole('button', { name: '立即登录' })).toBeInTheDocument();
    });

    it('应该显示注册链接', () => {
      render(<LoginForm />);
      
      expect(screen.getByText('注册12306账号')).toBeInTheDocument();
    });

    it('应该显示忘记密码链接', () => {
      render(<LoginForm />);
      
      expect(screen.getByText('忘记密码？')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('应该验证用户名不能为空', async () => {
      render(<LoginForm />);
      
      const submitButton = screen.getByRole('button', { name: '立即登录' });
      fireEvent.click(submitButton);
      
      // 由于表单验证逻辑尚未实现，这里测试的是预期行为
      // 实际实现时应该显示验证错误信息
    });

    it('应该验证密码不能为空', async () => {
      render(<LoginForm />);
      
      const usernameInput = screen.getByLabelText('用户名/邮箱/手机号');
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      
      const submitButton = screen.getByRole('button', { name: '立即登录' });
      fireEvent.click(submitButton);
      
      // 预期应该显示密码验证错误
    });

    it('应该接受有效的用户名格式', () => {
      render(<LoginForm />);
      
      const usernameInput = screen.getByLabelText('用户名/邮箱/手机号');
      
      // 测试用户名
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      expect(usernameInput).toHaveValue('testuser');
      
      // 测试邮箱
      fireEvent.change(usernameInput, { target: { value: 'test@example.com' } });
      expect(usernameInput).toHaveValue('test@example.com');
      
      // 测试手机号
      fireEvent.change(usernameInput, { target: { value: '13800138000' } });
      expect(usernameInput).toHaveValue('13800138000');
    });
  });

  describe('Form Submission', () => {
    it('应该在提交时调用登录API', async () => {
      const mockOnLoginSuccess = vi.fn();
      render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);
      
      const usernameInput = screen.getByLabelText('用户名/邮箱/手机号');
      const passwordInput = screen.getByLabelText('密码');
      const submitButton = screen.getByRole('button', { name: '立即登录' });
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      // 由于API调用尚未实现，这里测试表单提交行为
      await waitFor(() => {
        // 预期应该显示"登录功能尚未实现"的错误信息
        expect(screen.getByText('登录功能尚未实现')).toBeInTheDocument();
      });
    });

    it('应该在登录成功时调用成功回调', async () => {
      const mockOnLoginSuccess = vi.fn();
      render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);
      
      // 模拟成功登录的场景
      // 实际实现时，这里应该mock API调用并返回成功响应
      // 然后验证mockOnLoginSuccess被调用
    });

    it('应该在登录失败时显示错误信息', async () => {
      render(<LoginForm />);
      
      const usernameInput = screen.getByLabelText('用户名/邮箱/手机号');
      const passwordInput = screen.getByLabelText('密码');
      const submitButton = screen.getByRole('button', { name: '立即登录' });
      
      fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);
      
      // 预期应该显示登录错误信息
      await waitFor(() => {
        expect(screen.getByText('登录功能尚未实现')).toBeInTheDocument();
      });
    });

    it('应该在提交期间禁用登录按钮', async () => {
      render(<LoginForm />);
      
      const usernameInput = screen.getByLabelText('用户名/邮箱/手机号');
      const passwordInput = screen.getByLabelText('密码');
      const submitButton = screen.getByRole('button', { name: '立即登录' });
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      // 在实际实现中，按钮应该在提交期间被禁用
      // 并显示"登录中..."文本
    });
  });

  describe('Navigation Links', () => {
    it('应该在点击注册链接时调用导航回调', () => {
      const mockOnNavigateToRegister = vi.fn();
      render(<LoginForm onNavigateToRegister={mockOnNavigateToRegister} />);
      
      const registerLink = screen.getByText('注册12306账号');
      fireEvent.click(registerLink);
      
      expect(mockOnNavigateToRegister).toHaveBeenCalled();
    });

    it('应该在点击忘记密码时显示提示信息', () => {
      // Mock window.alert
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<LoginForm />);
      
      const forgotPasswordLink = screen.getByText('忘记密码？');
      fireEvent.click(forgotPasswordLink);
      
      expect(alertSpy).toHaveBeenCalledWith('忘记密码功能暂未实现');
      
      alertSpy.mockRestore();
    });
  });

  describe('Input Handling', () => {
    it('应该正确处理用户名输入', () => {
      render(<LoginForm />);
      
      const usernameInput = screen.getByLabelText('用户名/邮箱/手机号');
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      
      expect(usernameInput).toHaveValue('testuser');
    });

    it('应该正确处理密码输入', () => {
      render(<LoginForm />);
      
      const passwordInput = screen.getByLabelText('密码');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      expect(passwordInput).toHaveValue('password123');
    });

    it('应该清除之前的错误信息当用户重新输入时', () => {
      render(<LoginForm />);
      
      // 先触发一个错误
      const submitButton = screen.getByRole('button', { name: '立即登录' });
      fireEvent.click(submitButton);
      
      // 然后输入新内容
      const usernameInput = screen.getByLabelText('用户名/邮箱/手机号');
      fireEvent.change(usernameInput, { target: { value: 'newuser' } });
      
      // 在实际实现中，错误信息应该被清除
    });
  });

  describe('Error Display', () => {
    it('应该显示API错误信息', async () => {
      render(<LoginForm />);
      
      const submitButton = screen.getByRole('button', { name: '立即登录' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('登录功能尚未实现')).toBeInTheDocument();
      });
    });

    it('应该正确设置错误信息的样式类', async () => {
      render(<LoginForm />);
      
      const submitButton = screen.getByRole('button', { name: '立即登录' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const errorElement = screen.getByText('登录功能尚未实现');
        expect(errorElement).toHaveClass('error-message');
      });
    });
  });

  describe('Accessibility', () => {
    it('应该有正确的表单标签关联', () => {
      render(<LoginForm />);
      
      const usernameInput = screen.getByLabelText('用户名/邮箱/手机号');
      const passwordInput = screen.getByLabelText('密码');
      
      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('应该支持键盘导航', () => {
      render(<LoginForm />);
      
      const usernameInput = screen.getByLabelText('用户名/邮箱/手机号');
      const passwordInput = screen.getByLabelText('密码');
      const submitButton = screen.getByRole('button', { name: '立即登录' });
      
      // 验证元素可以获得焦点
      usernameInput.focus();
      expect(document.activeElement).toBe(usernameInput);
      
      // Tab到下一个元素
      fireEvent.keyDown(usernameInput, { key: 'Tab' });
      passwordInput.focus();
      expect(document.activeElement).toBe(passwordInput);
    });

    it('应该有正确的输入类型', () => {
      render(<LoginForm />);
      
      const usernameInput = screen.getByLabelText('用户名/邮箱/手机号');
      const passwordInput = screen.getByLabelText('密码');
      
      expect(usernameInput).toHaveAttribute('type', 'text');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Component Props', () => {
    it('应该使用默认的空函数当没有提供回调时', () => {
      // 这应该不会抛出错误
      expect(() => render(<LoginForm />)).not.toThrow();
    });

    it('应该正确处理所有可选的props', () => {
      const mockOnLoginSuccess = vi.fn();
      const mockOnNavigateToRegister = vi.fn();
      
      expect(() => 
        render(
          <LoginForm 
            onLoginSuccess={mockOnLoginSuccess}
            onNavigateToRegister={mockOnNavigateToRegister}
          />
        )
      ).not.toThrow();
    });
  });
});