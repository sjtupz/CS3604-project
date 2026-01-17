import '@testing-library/jest-dom'
import { toHaveValue as originalToHaveValue } from '@testing-library/jest-dom/matchers'

expect.extend({
  toHaveValue(received: any, expected: any) {
    const getVal = () => {
      if (received && 'value' in received) return received.value
      return received?.getAttribute?.('value') ?? undefined
    }

    if (expected && typeof expected.asymmetricMatch === 'function') {
      const actual = getVal()
      const pass = expected.asymmetricMatch(actual)
      return {
        pass,
        message: () =>
          pass
            ? `Expected element not to have value matching ${expected.toString()}`
            : `Expected element to have value matching ${expected.toString()}, received ${String(actual)}`,
      }
    }

    if (expected instanceof RegExp) {
      const actual = getVal()
      const pass = expected.test(String(actual))
      return {
        pass,
        message: () =>
          pass
            ? `Expected element not to have value matching ${expected.toString()}`
            : `Expected element to have value matching ${expected.toString()}, received ${String(actual)}`,
      }
    }

    // Fallback to original matcher behavior
    // @ts-ignore
    return originalToHaveValue(received, expected)
  },
})

// 保持前端测试默认未登录状态，避免影响导航用例

(globalThis as any).jest = (globalThis as any).vi
