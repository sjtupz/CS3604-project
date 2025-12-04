import { test, expect, describe } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { TopNavigationBar } from '../../src/components/TopNavigationBar';

describe('TopNavigationBar', () => {
  test('renders logo, search bar, and navigation links', () => {
    render(
      <MemoryRouter>
        <TopNavigationBar />
      </MemoryRouter>
    );

    // Check logo
    expect(screen.getByAltText('12306 Logo')).toBeInTheDocument();

    // Check search bar
    expect(screen.getByPlaceholderText('搜索车票、餐饮、常旅客、相关规章')).toBeInTheDocument();

    // Check standard links (when not logged in)
    expect(screen.getByText('登录')).toBeInTheDocument();
    expect(screen.getByText('注册')).toBeInTheDocument();
    expect(screen.queryByText('我的12306')).not.toBeInTheDocument();
    
    // Check blue nav items
    expect(screen.getByText('车票')).toBeInTheDocument();
    expect(screen.getByText('团购服务')).toBeInTheDocument();
  });

  test('shows user info when logged in', () => {
    const currentUser = { username: 'testuser', realName: 'Test User' };
    render(
      <MemoryRouter>
        <TopNavigationBar isLoggedIn={true} currentUser={currentUser} />
      </MemoryRouter>
    );

    expect(screen.getByText('我的12306')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('退出')).toBeInTheDocument();
    expect(screen.queryByText('登录')).not.toBeInTheDocument();
  });
});
