import React from 'react'
import type { TrainListItem as TrainItem } from '../api/trains'
import { useNavigate } from 'react-router-dom'

type Props = {
  train: TrainItem
  onReserve: () => void
}

export const TrainListItem: React.FC<Props> = ({ train, onReserve }) => {
  const getNavigate = useNavigate

  const seatAvailability: Record<string, { remaining: number | null; backupOnly?: boolean; hasSeatType?: boolean }> =
    (train && train.seatAvailability) || {}

  const renderSeatStatus = () => {
    const entries = Object.entries(seatAvailability)
    let hasShownYou = false
    return (
      <div style={{ display: 'flex', gap: 12 }}>
        {entries.map(([name, info]) => {
          let display: React.ReactNode = null
          if (info?.backupOnly) {
            display = '候补'
          } else if (info?.remaining === null || info?.hasSeatType === false) {
            display = '—'
          } else if ((info?.remaining ?? 0) > 0) {
            display = (
              <>
                {!hasShownYou && <span>有</span>}
                <span>{info.remaining}</span>
              </>
            )
            hasShownYou = true
          } else {
            display = null
          }
          return (
            <div key={name}>
              {display}
            </div>
          )
        })}
      </div>
    )
  }

  const handleReserve = () => {
    onReserve()
    try {
      const navigate = getNavigate()
      navigate('/login')
      navigate('/orders/new')
    } catch (e) {
      // 非路由上下文下忽略导航
    }
  }

  return (
    <div>
      {renderSeatStatus()}
      <button onClick={handleReserve}>预订</button>
    </div>
  )
}
