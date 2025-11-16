import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// 每个测试后清理
afterEach(() => {
  cleanup();
});

// 为了兼容测试文件中使用的jest API，提供jest的polyfill
global.jest = {
  fn: vi.fn,
  clearAllMocks: vi.clearAllMocks,
  mock: vi.mock,
  unmock: vi.unmock,
  spyOn: vi.spyOn,
} as any;

// 扩展expect匹配器
expect.extend({
  // 可以在这里添加自定义匹配器
});

