import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { TopNavigationBar } from '../../src/components/TopNavigationBar';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock useLocation and useNavigate
const mockNavigate = vi.fn();
let mockLocation = { pathname: '/' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

describe('TopNavigationBar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLocation = { pathname: '/' };
  });

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <TopNavigationBar {...props} />
      </BrowserRouter>
    );
  };

  it('renders simplified header on login page', () => {
    mockLocation = { pathname: '/login' };
    renderComponent();
    expect(screen.getByText('欢迎登录12306')).toBeInTheDocument();
    expect(screen.queryByText('我的12306')).not.toBeInTheDocument();
    // Should not show QuickAccessMenu items
    expect(screen.queryByText('车票')).not.toBeInTheDocument();
  });

  it('renders standard header on homepage (unauthenticated)', () => {
    mockLocation = { pathname: '/' };
    renderComponent({ isLoggedIn: false });
    
    expect(screen.getByText('我的12306')).toBeInTheDocument();
    expect(screen.getByText('登录')).toBeInTheDocument();
    expect(screen.getByText('注册')).toBeInTheDocument();
    expect(screen.queryByText('您好，请')).not.toBeInTheDocument(); // Should not be on homepage
    expect(screen.queryByText('退出')).not.toBeInTheDocument();
    
    // Should show QuickAccessMenu items
    expect(screen.getByText('车票')).toBeInTheDocument();
    expect(screen.getByText('团购服务')).toBeInTheDocument();
  });

  it('renders register page header (unauthenticated)', () => {
    mockLocation = { pathname: '/register' };
    renderComponent({ isLoggedIn: false });

    expect(screen.getByText('您好，请')).toBeInTheDocument();
    expect(screen.getByText('登录')).toBeInTheDocument();
    expect(screen.getByText('注册')).toBeInTheDocument();
  });

  it('renders authenticated header', () => {
    mockLocation = { pathname: '/' };
    const user = { realName: '张三' };
    renderComponent({ isLoggedIn: true, currentUser: user });

    expect(screen.getByText('您好，')).toBeInTheDocument();
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('退出')).toBeInTheDocument();
    expect(screen.queryByText('登录')).not.toBeInTheDocument();
  });

  it('navigates to login when clicking "我的12306" if unauthenticated', () => {
    mockLocation = { pathname: '/' };
    renderComponent({ isLoggedIn: false });

    fireEvent.click(screen.getByText('我的12306'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to profile when clicking "我的12306" if authenticated', () => {
    mockLocation = { pathname: '/' };
    renderComponent({ isLoggedIn: true });

    fireEvent.click(screen.getByText('我的12306'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('navigates to profile when clicking user name', () => {
    mockLocation = { pathname: '/' };
    const user = { realName: '张三' };
    renderComponent({ isLoggedIn: true, currentUser: user });

    fireEvent.click(screen.getByText('张三'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('handles logout', () => {
    mockLocation = { pathname: '/' };
    const onLogout = vi.fn();
    renderComponent({ isLoggedIn: true, onLogout });

    fireEvent.click(screen.getByText('退出'));
    expect(onLogout).toHaveBeenCalled();
  });
});
