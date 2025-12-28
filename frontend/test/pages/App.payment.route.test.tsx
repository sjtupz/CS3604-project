import { render, screen } from '@testing-library/react';
import { describe, test } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../src/App';

describe('App routes - Payment', () => {
  test('Given 路由为/payment When 渲染 Then 显示倒计时与橙色加粗时间', () => {
    render(
      <MemoryRouter initialEntries={['/payment']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/\d+分\d{2}秒/)).toBeInTheDocument();
  });
});

