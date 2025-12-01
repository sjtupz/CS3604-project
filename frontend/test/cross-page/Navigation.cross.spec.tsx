import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../../src/App';

const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
};

describe('Cross-Page Navigation', () => {
  describe('From Home Page', () => {
    it('navigates to Login Page when "登录" is clicked', () => {
      renderWithRouter(['/']);
      fireEvent.click(screen.getByText('登录'));
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('navigates to Login Page when "我的12306" is clicked and user is not logged in', () => {
      renderWithRouter(['/']);
      fireEvent.click(screen.getByText('我的12306'));
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('navigates to Register Page when "注册" is clicked', () => {
      renderWithRouter(['/']);
      fireEvent.click(screen.getByText('注册'));
      expect(screen.getByTestId('register-page')).toBeInTheDocument();
    });
  });

  describe('From Register Page', () => {
    it('navigates to Login Page when "登录" is clicked in the header', () => {
      renderWithRouter(['/register']);
      fireEvent.click(screen.getByText('登录'));
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('navigates to Home Page when "首页" is clicked in the quick access menu', () => {
      renderWithRouter(['/register']);
      fireEvent.click(screen.getByText('首页'));
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  describe('From Login Page', () => {
    it('navigates to Register Page when clicking inline "注册12306账户" link', () => {
      renderWithRouter(['/login']);
      fireEvent.click(screen.getByText('注册12306账户'));
      expect(screen.getByTestId('register-page')).toBeInTheDocument();
    });
    it('navigates to Forgot Password Page when clicking "忘记密码？" link', () => {
      renderWithRouter(['/login']);
      fireEvent.click(screen.getByText('忘记密码？'));
      expect(screen.getByTestId('forgot-password-page')).toBeInTheDocument();
    });
  });
});
