import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PassengerCategoryToggle } from '../../src/components/PassengerCategoryToggle'

test('Given 默认普通 When 切换学生 Then 回调携带student用于查询', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()
  render(<PassengerCategoryToggle passengerCategory="normal" onPassengerCategoryChange={onChange} />)
  const studentRadio = screen.getByRole('radio', { name: '学生' })
  await user.click(studentRadio)
  expect(onChange).toHaveBeenCalledWith('student')
})

