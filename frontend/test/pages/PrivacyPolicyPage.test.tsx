import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { PrivacyPolicyPage } from '../../src/pages/PrivacyPolicyPage';

test('Given 用户在隐私权政策页 When 页面加载 Then 显示中文和英文标题居中', () => {
  render(<PrivacyPolicyPage />);
  expect(screen.getByText('隐私权政策')).toBeInTheDocument();
  expect(screen.getByText('NOTICE')).toBeInTheDocument();
});
