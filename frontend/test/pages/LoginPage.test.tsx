import { test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import LoginPage from '../../src/pages/LoginPage';

test('Given user enters login page When page loads Then shows welcome banner and fixed layout', () => {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
  expect(screen.getByText('欢迎登录12306')).toBeInTheDocument();
  expect(screen.getByText('友情链接')).toBeInTheDocument();
});
