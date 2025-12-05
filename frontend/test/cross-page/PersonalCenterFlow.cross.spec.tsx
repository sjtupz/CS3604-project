import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from '../../src/App';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
};

describe('Personal Center Navigation Flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('navigates to Personal Center when "我的12306" is clicked and user IS logged in', async () => {
    localStorage.setItem('authToken', 'fake-token');
    renderWithRouter(['/']);
    
    // "我的12306" is in the top navigation bar
    fireEvent.click(screen.getByText('我的12306'));
    
    // Expect to see something from Personal Center
    await waitFor(() => {
       expect(screen.getByText(/欢迎您登录中国铁路客户服务中心网站/i)).toBeInTheDocument();
    });
  });

  it('navigates to Home Page when "首页" is clicked in Personal Center', async () => {
    localStorage.setItem('authToken', 'fake-token');
    renderWithRouter(['/profile']);
    
    // Wait for Personal Center to load
    await waitFor(() => {
        expect(screen.getByText(/欢迎您登录中国铁路客户服务中心网站/i)).toBeInTheDocument();
    });

    // Click "首页" in blue nav bar.
    // There might be multiple "首页". Top nav logo has aria-label "首页" but also text?
    // The blue nav item is a div with text "首页".
    // Let's try to find by text.
    const homeButtons = screen.getAllByText('首页');
    // Click the last one (likely the blue nav one or the one in the menu)
    fireEvent.click(homeButtons[homeButtons.length - 1]);
    
    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  it('navigates to Login Page when "退出" is clicked', async () => {
    localStorage.setItem('authToken', 'fake-token');
    renderWithRouter(['/profile']);
    
    // Wait for Personal Center to load
    await waitFor(() => {
        expect(screen.getByText(/欢迎您登录中国铁路客户服务中心网站/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('退出'));
    
    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
    expect(localStorage.getItem('authToken')).toBeNull();
  });
});
