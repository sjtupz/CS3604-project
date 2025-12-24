import React from 'react'
import type { TrainListItem as TrainItem } from '../api/trains'
import { useNavigate } from 'react-router-dom'

type Props = {
  items: TrainItem[]
  onSortChange?: (key: 'trainNumber' | 'departureTime' | 'arrivalTime' | 'duration') => void
  onReserve?: (item: TrainItem) => void
  sortBy?: 'trainNumber' | 'departureTime' | 'arrivalTime' | 'duration'
  sortOrder?: 'asc' | 'desc'
}

export const TrainList: React.FC<Props> = ({ items, onSortChange, onReserve, sortBy, sortOrder }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 576
  const getNavigate = useNavigate

  const renderSeatStatus = (seatAvailability: Record<string, { remaining: number | null; backupOnly?: boolean; hasSeatType?: boolean }> | undefined) => {
    const entries = Object.entries(seatAvailability || {})
    return (
      <div className="seat-status">
        {entries.map(([name, info]) => {
          let display: React.ReactNode = null

          // Specific Column Rule: '其他' always '—'
          if (name === '其他') {
            display = <span className="status-none">—</span>
          }
          // Conflict Cleaning / Backup Rule: Priority to "候补"
          else if (info?.backupOnly) {
            display = <span className="status-backup">候补</span>
          }
          // Empty Value Rule: No info, or remaining is null, or hasSeatType false
          else if (!info || info.remaining === null || info.hasSeatType === false) {
            display = <span className="status-none">—</span>
          }
          // Ticket Availability Rule
          else {
            const count = info.remaining ?? 0
            if (count > 20) {
              // > 20: Display "有"
              display = <span className="status-has">有</span>
            } else if (count > 0) {
              // <= 20: Display number
              display = <span className="status-remain">{count}</span>
            } else {
              // 0: Display "—" (Unified dash)
              display = <span className="status-none">—</span>
            }
          }

          return (
            <span key={name} className="seat-type-item">{display}</span>
          )
        })}
      </div>
    )
  }

  const renderBusinessSpecialSeat = (seatAvailability: Record<string, { remaining: number | null; backupOnly?: boolean; hasSeatType?: boolean }> | undefined) => {
    const swz = seatAvailability?.['商务座']
    const tdz = seatAvailability?.['特等座']

    const getStatus = (info: { remaining: number | null; backupOnly?: boolean; hasSeatType?: boolean } | undefined) => {
      // Treat null/undefined/noSeatType OR 0 tickets (displayed as —) as "Empty" for merging purposes
      if (!info || info.remaining === null || info.hasSeatType === false) return null
      
      // Conflict Cleaning: Priority to Waitlist
      if (info.backupOnly) return { type: 'waitlist', content: <span className="status-backup">候补</span> }
      
      const count = info.remaining ?? 0
      if (count === 0) return null // Treat 0 as empty/dash for merging
      
      if (count > 20) return { type: 'has', content: <span className="status-has">有</span> }
      return { type: 'number', content: <span className="status-remain">{count}</span> }
    }

    const swzStatus = getStatus(swz)
    const tdzStatus = getStatus(tdz)
    
    const validStatuses = [swzStatus, tdzStatus].filter((s): s is NonNullable<typeof swzStatus> => !!s)

    // 1. Merge Empty States: Both empty -> Single Dash
    if (validStatuses.length === 0) {
      return <div className="cell-content"><span className="status-none">—</span></div>
    }

    // 2. Single Valid Status (Waitlist or Ticket) -> Render centered
    if (validStatuses.length === 1) {
      return <div className="cell-content">{validStatuses[0].content}</div>
    }

    // 3. Both Valid -> Stacked
    return (
      <div className="dual-line">
        <div className="line-top">{validStatuses[0].content}</div>
        <div className="line-bottom">{validStatuses[1].content}</div>
      </div>
    )
  }

  const seatColumns = ['一等座', '二等座', '软卧', '硬卧', '硬座', '无座', '其他']

  return (
    <div className="train-table">
      <div className="table-header">
        <button className={`cell col-train sort header-sort-btn${sortBy === 'trainNumber' ? (sortOrder === 'asc' ? ' sorted-asc' : ' sorted-desc') : ''}`} aria-sort={sortBy === 'trainNumber' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'} onClick={() => onSortChange?.('trainNumber')}>
          <div className="header-cell">
            <div className="single-line">车次</div>
            <div className="sort-icons" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 12 12"><path d="M6 3 L3 6 H9 Z" fill="#fff" /></svg>
              <svg width="10" height="10" viewBox="0 0 12 12"><path d="M3 6 H9 L6 9 Z" fill="#fff" /></svg>
            </div>
          </div>
        </button>
        <div className="cell col-station">
          <div className="dual-line">
            <div className="line-top">出发站</div>
            <div className="line-bottom">到达站</div>
          </div>
          <div style={{ position: 'absolute', left: -9999 }}>出发站/到达站</div>
        </div>
        <button className={`cell col-time sort header-sort-btn${sortBy === 'departureTime' ? (sortOrder === 'asc' ? ' sorted-asc' : ' sorted-desc') : ''}`} aria-sort={sortBy === 'departureTime' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'} onClick={() => onSortChange?.('departureTime')}>
          <div className="header-cell">
            <div className="dual-line">
              <div className="line-top">出发时间</div>
              <div className="line-bottom">到达时间</div>
            </div>
            <div className="sort-icons" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 12 12"><path d="M6 3 L3 6 H9 Z" fill="#fff" /></svg>
              <svg width="10" height="10" viewBox="0 0 12 12"><path d="M3 6 H9 L6 9 Z" fill="#fff" /></svg>
            </div>
          </div>
          <div style={{ position: 'absolute', left: -9999 }}>出发时间/到达时间</div>
        </button>
        <button className={`cell col-duration sort header-sort-btn${sortBy === 'duration' ? (sortOrder === 'asc' ? ' sorted-asc' : ' sorted-desc') : ''}`} aria-sort={sortBy === 'duration' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'} onClick={() => onSortChange?.('duration')}>
          <div className="header-cell">
            <div className="single-line">历时</div>
            <div className="sort-icons" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 12 12"><path d="M6 3 L3 6 H9 Z" fill="#fff" /></svg>
              <svg width="10" height="10" viewBox="0 0 12 12"><path d="M3 6 H9 L6 9 Z" fill="#fff" /></svg>
            </div>
          </div>
        </button>
        
        <div className="cell col-seat-wide">
          <div className="dual-line">
            <div className="line-top">商务座</div>
            <div className="line-bottom">特等座</div>
          </div>
        </div>
        {seatColumns.map((name) => (
          <div key={name} className={`cell ${name === '其他' ? 'col-other' : 'col-seat'}`}>{name}</div>
        ))}
        {!isMobile && <div className="cell cell-remark col-action">备注</div>}
      </div>
      <div className="table-body" role="table">
        {items.map((item, idx) => (
          <div key={idx} className="train-row" role="row">
            <div className="cell col-train">
              <span className="train-number-link" aria-label={`车次 ${item.trainNumber}`}>{String(item.trainNumber || '')}</span>
            </div>
            <div className="cell col-station">
              <div className="dual-line">
                <div className="line-top">{String(item.departureStation || '')}</div>
                <div className="line-bottom">{String(item.arrivalStation || '')}</div>
              </div>
            </div>
            <div className="cell col-time">
              <div className="dual-line">
                <div className="line-top">{String(item.departureTime || '')}</div>
                <div className="line-bottom">{String(item.arrivalTime || '')}{item.arrivalDayIndicator && <span className="arrival-indicator"> {String(item.arrivalDayIndicator)}</span>}</div>
              </div>
            </div>
            <div className="cell col-duration"><span>{String(item.duration || '')}</span></div>
            
            <div className="cell col-seat-wide col-seat-lg">
              {renderBusinessSpecialSeat(item.seatAvailability)}
            </div>
            {seatColumns.map((name) => (
              <div key={name} className={`cell ${name === '其他' ? 'col-other' : 'col-seat'}`}>
                {renderSeatStatus(item.seatAvailability && { [name]: item.seatAvailability[name] })}
              </div>
            ))}
            {!isMobile && (
              <div className="cell cell-remark col-action">
                <button className="reserve-btn" aria-label="预订" onClick={() => onReserve?.(item)}>预订</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
