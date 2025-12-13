import React from 'react'

export const SeatStatusLegend: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <span>灰色横杠=无此席别</span>
      <span>橙色候补=无票</span>
      <span>{'绿色有=余票>20'}</span>
      <span>{'黑色数字=余票<20'}</span>
    </div>
  )
}
