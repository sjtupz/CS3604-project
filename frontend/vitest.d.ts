/// <reference types="vitest" />
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// 扩展vitest以支持jest API
declare global {
  const jest: {
    fn: typeof vi.fn;
    clearAllMocks: typeof vi.clearAllMocks;
    mock: typeof vi.mock;
    unmock: typeof vi.unmock;
    spyOn: typeof vi.spyOn;
  };
}

// 为了兼容测试文件中使用的jest API，我们需要在setup.ts中提供jest的polyfill
export {};

