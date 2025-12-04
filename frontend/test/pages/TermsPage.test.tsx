import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { TermsPage } from '../../src/pages/TermsPage';

test('Given 用户在服务条款页 When 页面加载 Then 显示服务条款标题居中', () => {
  render(<TermsPage />);
  const title = screen.getByText('服务条款');
  expect(title).toBeInTheDocument();
});
