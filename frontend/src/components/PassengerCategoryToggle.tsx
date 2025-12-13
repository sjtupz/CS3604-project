import React, { useState } from 'react'

export type PassengerCategory = 'normal' | 'student'

type Props = {
  passengerCategory: PassengerCategory
  onPassengerCategoryChange: (c: PassengerCategory) => void
}

export const PassengerCategoryToggle: React.FC<Props> = ({ passengerCategory, onPassengerCategoryChange }) => {
  const [selected, setSelected] = useState<PassengerCategory>(passengerCategory)

  const handleChange = (c: PassengerCategory) => {
    setSelected(c)
    onPassengerCategoryChange(c)
  }

  return (
    <div>
      <label>
        <input
          type="radio"
          name="passengerCategory"
          value="normal"
          checked={selected === 'normal'}
          onChange={() => handleChange('normal')}
        />
        普通
      </label>
      <label>
        <input
          type="radio"
          name="passengerCategory"
          value="student"
          checked={selected === 'student'}
          onChange={() => handleChange('student')}
        />
        学生
      </label>
    </div>
  )
}
