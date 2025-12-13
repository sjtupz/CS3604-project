import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RoundTripToggle } from '../../src/components/RoundTripToggle'

test('Given 初始为单程 When 切换为双程 Then 启用返程日并调用回调', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()
  render(<RoundTripToggle tripType="one-way" onTripTypeChange={onChange} />)
  const roundTripRadio = screen.getByRole('radio', { name: '双程' })
  await user.click(roundTripRadio)
  expect(onChange).toHaveBeenCalledWith('round-trip')
  screen.getByLabelText('返程日')
})
