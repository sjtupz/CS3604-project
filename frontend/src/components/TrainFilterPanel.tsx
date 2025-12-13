import React from 'react'

type Props = {
  trainTypes?: string
  departureStation?: string
  arrivalStation?: string
  seatTypes?: string
  onFiltersChange: (filters: Record<string, unknown>) => void
}

export const TrainFilterPanel: React.FC<Props> = ({ onFiltersChange }) => {
  const handleTrainTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onFiltersChange({ trainTypes: 'GC' })
    } else {
      onFiltersChange({ trainTypes: '' })
    }
  }

  const handleSeatTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onFiltersChange({ seatTypes: '一等座' })
    } else {
      onFiltersChange({ seatTypes: '' })
    }
  }

  const handleDepartSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ departureStation: e.target.value })
  }

  const handleArrivalSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ arrivalStation: e.target.value })
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <label>
        <input type="checkbox" aria-label="GC-高铁" onChange={handleTrainTypeChange} />
        GC-高铁
      </label>
      <label>
        <input type="checkbox" aria-label="一等座" onChange={handleSeatTypeChange} />
        一等座
      </label>
      <label>
        出发车站
        <select aria-label="出发车站" onChange={handleDepartSelect} defaultValue="">
          <option value="" disabled>请选择</option>
          <option value="上海虹桥">上海虹桥</option>
        </select>
      </label>
      <label>
        到达车站
        <select aria-label="到达车站" onChange={handleArrivalSelect} defaultValue="">
          <option value="" disabled>请选择</option>
          <option value="北京南">北京南</option>
        </select>
      </label>
    </div>
  )
}
