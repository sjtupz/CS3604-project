import React from 'react'

interface DepartureTimeFilterProps {
  selectedTimeRange: string
  onSelect: (range: string) => void
}

export const DepartureTimeFilter: React.FC<DepartureTimeFilterProps> = ({ selectedTimeRange, onSelect }) => {
  const timeSlots = [
    { label: '00:00-24:00', value: '' },
    { label: '00:00-06:00', value: '00:00-06:00' },
    { label: '06:00-12:00', value: '06:00-12:00' },
    { label: '12:00-18:00', value: '12:00-18:00' },
    { label: '18:00-24:00', value: '18:00-24:00' }
  ]

  return (
    <div className="departure-time-filter">
      <div className="filter-label" style={{ display: 'none' }}>发车时间</div>
      <ul className="date-tabs">
        {timeSlots.map((slot) => {
          const isActive = selectedTimeRange === slot.value || (slot.value === '' && selectedTimeRange === '00:00-24:00')
          return (
            <li key={slot.label} style={{ listStyle: 'none' }}>
              <button
                type="button"
                className={`tab${isActive ? ' active' : ''}`}
                aria-pressed={isActive}
                onClick={() => onSelect(slot.value)}
                style={{ minWidth: 100 }}
              >
                {slot.label}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
