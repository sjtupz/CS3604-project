import { test, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { QuickAccessMenu } from '../../src/components/QuickAccessMenu';

test('Given the QuickAccessMenu is rendered, Then it should display all the menu links', () => {
  render(<QuickAccessMenu />);
  expect(screen.getByText('首页')).toBeDefined();
  expect(screen.getByText('车票')).toBeDefined();
  expect(screen.getByText('团购服务')).toBeDefined();
  expect(screen.getByText('会员服务')).toBeDefined();
  expect(screen.getByText('站车服务')).toBeDefined();
  expect(screen.getByText('商旅服务')).toBeDefined();
  expect(screen.getByText('出行指南')).toBeDefined();
  expect(screen.getByText('信息查询')).toBeDefined();
});