import React, { useState } from 'react'

export type TripType = 'one-way' | 'round-trip'

type Props = {
  tripType: TripType
  onTripTypeChange: (t: TripType) => void
}

export const RoundTripToggle: React.FC<Props> = ({ tripType, onTripTypeChange }) => {
  const [selected, setSelected] = useState<TripType>(tripType)

  const handleChange = (t: TripType) => {
    setSelected(t)
    onTripTypeChange(t)
  }

  return (
    <div>
      <label>
        <input
          type="radio"
          name="tripType"
          value="one-way"
          checked={selected === 'one-way'}
          onChange={() => handleChange('one-way')}
        />
        单程
      </label>
      <label>
        <input
          type="radio"
          name="tripType"
          value="round-trip"
          checked={selected === 'round-trip'}
          onChange={() => handleChange('round-trip')}
        />
        双程
      </label>
      {selected === 'round-trip' && (
        <div>
          <label htmlFor="returnDate">返程日</label>
          <input id="returnDate" type="date" />
        </div>
      )}
    </div>
  )
}
