// frontend/test/pages/RegisterPage.test.tsx
import { render, screen } from '@testing-library/react';
import { test, expect, describe } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { RegisterPage } from '../../src/pages/RegisterPage';

describe('RegisterPage', () => {
  test('Given user navigates to the register page When the page loads Then it renders the main heading and the registration form', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: '用户注册' })).toBeInTheDocument();
    // The form itself doesn't have an accessible name, so we'll look for a key element within it.
    expect(screen.getByRole('button', { name: '下一步' })).toBeInTheDocument();
  });
});
