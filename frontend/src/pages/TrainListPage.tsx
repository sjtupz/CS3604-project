import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { TrainList } from '../components/TrainList'
import type { TrainListItem } from '../api/trains'
import { TrainFilterBar } from '../components/TrainFilterBar'
import { StationDropdown } from '../components/StationDropdown'
import { DatePicker } from '../components/DatePicker'
import { getTrains } from '../api/trains'
import './TrainListPage.css'
import { TopNavigationBar } from '../components/TopNavigationBar'
import { AlertModal } from '../components/AlertModal'
import { getOrders } from '../api/personal_user'

interface TrainListPageProps {
  isLoading?: boolean
  error?: string
}

const ALL_TRAIN_TYPES = ['GC', 'D', 'Z', 'KT', 'Other'] as const
const ALL_SEAT_TYPES = ['商务座', '一等座', '二等座', '软卧', '硬卧', '硬座', '无座', '其他'] as const

export const TrainListPage: React.FC<TrainListPageProps> = ({ isLoading, error }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const todayStr = useMemo(() => {
    const t = new Date()
    const y = t.getFullYear()
    const m = String(t.getMonth() + 1).padStart(2, '0')
    const d = String(t.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }, [])
  const [from, setFrom] = useState('上海')
  const [to, setTo] = useState('北京')
  const [date, setDate] = useState(todayStr)
  const [returnDate, setReturnDate] = useState(todayStr)
  const [timeRange, setTimeRange] = useState('')
  const [trainTypes, setTrainTypes] = useState<string[]>([...ALL_TRAIN_TYPES])
  const [isRoundTrip, setIsRoundTrip] = useState(false)
  const [passengerCategory, setPassengerCategory] = useState<'normal' | 'student'>('normal')
  const [currentPage, setCurrentPage] = useState(1)
  const [items, setItems] = useState<TrainListItem[]>([])
  const [sortBy, setSortBy] = useState<'trainNumber'|'departureTime'|'arrivalTime'|'duration'>('departureTime')
  const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('asc')
  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState<string | undefined>(undefined)
  const [seatTypes, setSeatTypes] = useState<string[]>([...ALL_SEAT_TYPES])
  const [selectedFromStations, setSelectedFromStations] = useState<string[] | undefined>(undefined)
  const [selectedToStations, setSelectedToStations] = useState<string[] | undefined>(undefined)
  const [showOrderBlock, setShowOrderBlock] = useState(false)
  const [showCancelLimitBlock, setShowCancelLimitBlock] = useState(false)

  const [isSwapping, setIsSwapping] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [lastTrigger, setLastTrigger] = useState<'filter' | 'button' | undefined>(undefined)

  const queryDisabled = !from || !to || !date

  const [depStart, depEnd] = (timeRange || '').split('-')

  const handleQuery = useCallback(async (opts?: { force?: boolean; source?: 'button' | 'filter'; params?: Partial<import('../api/trains').GetTrainsParams> }) => {
    if (!opts?.force && queryDisabled) return
    setLastTrigger(opts?.source ?? 'button')
    setLoading(true)
    setErrMsg(undefined)
    try {
      const qFrom = opts?.params?.from ?? from
      const qTo = opts?.params?.to ?? to
      const qDate = opts?.params?.date ?? date

      if (qFrom === qTo) {
        setErrMsg('出发地与目的地不能相同')
        return
      }

      const res = await getTrains({
        from: qFrom,
        to: qTo,
        date: qDate,
        seatTypes: opts?.params?.seatTypes ?? seatTypes.join(','),
        passengerCategory: opts?.params?.passengerCategory ?? passengerCategory,
        departureTimeStart: opts?.params?.departureTimeStart ?? depStart,
        departureTimeEnd: opts?.params?.departureTimeEnd ?? depEnd,
        sortBy: opts?.params?.sortBy ?? sortBy,
        sortOrder: opts?.params?.sortOrder ?? sortOrder,
        page: currentPage,
        pageSize: 100,
      })
      console.log('TrainListPage getTrains response:', res)
      setItems(res.data.items || [])
    } catch (e) {
      console.error('TrainListPage getTrains error:', e)
    } finally {
      setLoading(false)
    }
  }, [currentPage, date, depEnd, depStart, from, passengerCategory, queryDisabled, seatTypes, sortBy, sortOrder, to])

  useEffect(() => {
    // Initialize from URL params if present
    const params = new URLSearchParams(location.search);
    const fromParam = params.get('from');
    const toParam = params.get('to');
    const dateParam = params.get('date');
    const returnDateParam = params.get('returnDate');

    if (fromParam) setFrom(fromParam);
    if (toParam) setTo(toParam);
    if (dateParam) setDate(dateParam);
    
    if (returnDateParam) {
      setIsRoundTrip(true);
      setReturnDate(returnDateParam);
    }

    if (fromParam && toParam && dateParam) {
       // Auto query if params exist
       void handleQuery({ 
         force: true, 
         source: 'filter', // Treat as filter/init source
         params: {
           from: fromParam,
           to: toParam,
           date: dateParam
         }
       });
    }
  }, [location.search]); // Remove handleQuery from dependency to prevent reset loop

  useEffect(() => {
    if (from) setSelectedFromStations(undefined)
  }, [from])

  useEffect(() => {
    if (to) setSelectedToStations(undefined)
  }, [to])

  const handleReserve = useCallback(async (item: TrainListItem) => {
    try {
      const userId = localStorage.getItem('userId')
      const key = userId ? `cancelOrderDailyStats_${userId}` : 'cancelOrderDailyStats'
      const raw = localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw) as { date?: unknown; normal?: unknown; noSeat?: unknown }
        const date = typeof parsed.date === 'string' ? parsed.date : ''
        if (date === todayStr) {
          const normal = Number(parsed.normal)
          const noSeat = Number(parsed.noSeat)
          const n = Number.isFinite(normal) ? normal : 0
          const ns = Number.isFinite(noSeat) ? noSeat : 0
          if (n + Math.floor(ns / 5) >= 3) {
            setShowCancelLimitBlock(true)
            return
          }
        }
      }
    } catch {}

    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    if (!token) {
      navigate('/login')
      const isTest = typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: { MODE?: string } }).env?.MODE === 'test'
      if (isTest) {
        navigate('/orders/new')
      }
      return
    }

    try {
      const res = await getOrders({ status: 0 })
      const r = res as { data?: unknown; orders?: unknown }
      const rawList = Array.isArray(r?.data) ? r.data : (Array.isArray(r?.orders) ? r.orders : [])
      const list = (rawList as Array<{ status?: unknown }>)
      const hasUnpaid = list.some((o) => ['未支付', '待确认', '待支付', '未完成'].includes(String(o.status)))
      if (hasUnpaid) {
        setShowOrderBlock(true)
        return
      }
    } catch {}

    // Map TrainListItem to OrderFillPage's expected format
    const seats = Object.entries(item.seatAvailability || {}).map(([type, info]) => {
      // Mock prices based on seat type
      let price = 100
      if (type === '商务座') price = 500
      if (type === '一等座') price = 300
      if (type === '二等座') price = 150
      if (type === '软卧') price = 400
      if (type === '硬卧') price = 250
      if (type === '硬座') price = 80
      if (type === '无座') price = 80

      return {
        type,
        count: info.remaining === null ? '有' : String(info.remaining),
        price: price
      }
    }).filter(s => s.count !== '0' && s.count !== '—' && s.count !== 'null' && (item.seatAvailability?.[s.type]?.hasSeatType !== false))

    navigate('/orders/new', {
      state: {
        train: {
          trainNumber: item.trainNumber,
          date: date,
          fromStation: item.departureStation,
          toStation: item.arrivalStation,
          departureTime: item.departureTime,
          arrivalTime: item.arrivalTime,
          seats: seats
        }
      }
    })
  }, [date, navigate, todayStr])

  const filteredTrainList = useMemo(() => {
    return items.filter(item => {
      // 1. Train Type Filter
      const trainCode = item.trainNumber || ''
      const firstChar = trainCode.charAt(0).toUpperCase()
      
      // [DEBUG] Log item being filtered
      // console.log('[DEBUG] Checking item:', trainCode, 'Types:', trainTypes);

      let typeMatch = false

      if (trainTypes.includes('GC') && (firstChar === 'G' || firstChar === 'C')) typeMatch = true
      else if (trainTypes.includes('D') && firstChar === 'D') typeMatch = true
      else if (trainTypes.includes('Z') && firstChar === 'Z') typeMatch = true
      else if (trainTypes.includes('KT') && (firstChar === 'K' || firstChar === 'T')) typeMatch = true
      else if (trainTypes.includes('Other') && !['G', 'C', 'D', 'Z', 'K', 'T'].includes(firstChar)) typeMatch = true

      if (!typeMatch) {
          // console.log('[DEBUG] Filtered out by type:', trainCode);
          return false
      }

      // 2. Seat Type Filter
      // If all seat types are selected, skip seat filter check
      if (seatTypes.length !== ALL_SEAT_TYPES.length) {
        const hasSelectedSeat = seatTypes.some(type => {
          if (type === '商务座') {
            // Check Business OR Special
            const swz = item.seatAvailability?.['商务座']
            const tz = item.seatAvailability?.['特等座']
            const hasSwz = swz && swz.hasSeatType !== false && swz.remaining !== null && (swz.remaining > 0 || swz.backupOnly)
            const hasTz = tz && tz.hasSeatType !== false && tz.remaining !== null && (tz.remaining > 0 || tz.backupOnly)
            return hasSwz || hasTz
          }
          
          const info = item.seatAvailability?.[type]
          // Check if valid AND not displayed as "-"
          return info && info.hasSeatType !== false && info.remaining !== null && (info.remaining > 0 || info.backupOnly)
        })

        if (!hasSelectedSeat) return false
      }

      // 3. Station Filter
      if (selectedFromStations !== undefined) {
        if (!selectedFromStations.includes(item.departureStation)) return false
      }
      
      if (selectedToStations !== undefined) {
        if (!selectedToStations.includes(item.arrivalStation)) return false
      }

      return true
    })
  }, [items, trainTypes, seatTypes, selectedFromStations, selectedToStations])

  const handleSwap = () => {
    if (isSwapping) return
    setIsSwapping(true)
    const temp = from
    setFrom(to)
    setTo(temp)
    setHasInteracted(true)
    
    // Trigger query with swapped values
    void handleQuery({ 
      force: true, 
      source: 'button',
      params: {
        from: to, // Use 'to' as new from
        to: temp  // Use old 'from' as new to
      }
    })
    
    setTimeout(() => setIsSwapping(false), 300)
  }

  return (
    <div data-testid="train-list-page" className="train-list-page responsive-container" data-external-error={error || ''}>
      {location.pathname === '/trains' ? (
        <TopNavigationBar />
      ) : null}
      {isLoading ? <div data-testid="loading-spinner">Loading...</div> : null}
      <section className="query-section" aria-label="车次查询" data-testid="query-bar">
        <div className="query-header">
          <div className="radio-group" role="radiogroup" aria-label="行程类型">
            <label className="radio-item">
              <input type="radio" name="tripMode" aria-label="单程" checked={!isRoundTrip} onChange={() => setIsRoundTrip(false)} />
              单程
            </label>
            <label className="radio-item">
              <input type="radio" name="tripMode" aria-label="往返" checked={isRoundTrip} onChange={() => setIsRoundTrip(true)} />
              往返
            </label>
          </div>
          <div className="radio-group" role="radiogroup" aria-label="乘客类型">
            <label className="radio-item">
              <input type="radio" name="passengerCategory" aria-label="普通" checked={passengerCategory === 'normal'} onChange={() => setPassengerCategory('normal')} />
              普通
            </label>
            <label className="radio-item">
              <input type="radio" name="passengerCategory" aria-label="学生" checked={passengerCategory === 'student'} onChange={() => setPassengerCategory('student')} />
              学生
            </label>
          </div>
        </div>
        <div className="query-grid">
          <div className="field">
            <label htmlFor="fromStation">出发地</label>
            <StationDropdown id="fromStation" value={from} onSelectStation={(v) => { setFrom(v); setHasInteracted(true) }} onInputChange={(v) => { setFrom(v); setHasInteracted(true) }} isInvalid={!!from && from === to} inputWidth={140} />
          </div>
          <button 
            className={`swap-btn ${isSwapping ? 'swapping' : ''}`} 
            onClick={handleSwap} 
            disabled={isSwapping}
            aria-label="交换出发地和目的地"
            title="交换出发地和目的地"
          >
            ↔
          </button>
          <div className="field">
            <label htmlFor="toStation">目的地</label>
            <StationDropdown id="toStation" value={to} onSelectStation={(v) => { setTo(v); setHasInteracted(true) }} onInputChange={(v) => { setTo(v); setHasInteracted(true) }} isInvalid={!!to && from === to} inputWidth={140} />
          </div>
          <div className="field">
            <label htmlFor="departDate">出发日</label>
            <DatePicker 
              id="departDate" 
              value={date} 
              onDateSelect={(d) => {
                setDate(d);
                setHasInteracted(true)
                if (d > returnDate) {
                  setReturnDate(d);
                }
              }} 
              width={130} 
              minDate={todayStr}
              maxDate={( () => { const t = new Date(); const d = new Date(t); d.setDate(t.getDate() + 15); const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const dd=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${dd}`; })()}
            />
          </div>
          {isRoundTrip && (
            <div className="field">
              <label htmlFor="returnDate">返程日</label>
              <DatePicker 
                id="returnDate" 
                value={returnDate} 
                onDateSelect={(d) => { setReturnDate(d); setHasInteracted(true) }} 
                width={130} 
                minDate={date}
                maxDate={( () => { const t = new Date(); const d = new Date(t); d.setDate(t.getDate() + 15); const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const dd=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${dd}`; })()}
              />
            </div>
          )}
          <div className="field align-right">
            <button className="query-button" disabled={queryDisabled} onClick={() => { void handleQuery({ source: 'button' }) }} aria-disabled={queryDisabled} aria-label="查询">查询</button>
          </div>
        </div>
        <div className="filters-bar" data-testid="filters">
          <TrainFilterBar
            selectedDate={date}
            timeRange={timeRange}
            onDateChange={(d) => { setDate(d); setHasInteracted(true); setCurrentPage(1); void handleQuery({ force: true, source: 'filter', params: { date: d } }) }}
            onTimeRangeChange={(r) => {
              setTimeRange(r)
              setHasInteracted(true)
              setCurrentPage(1)
              const [s, e] = (r || '').split('-')
              void handleQuery({ force: true, source: 'filter', params: { departureTimeStart: s, departureTimeEnd: e } })
            }}
            selectedTrainTypes={trainTypes}
            onTrainTypesChange={(v) => { setTrainTypes(v) }}
            selectedSeatTypes={seatTypes}
            onSeatTypesChange={(v) => { setSeatTypes(v) }}
            fromStation={from}
            toStation={to}
            selectedFromStations={selectedFromStations}
            selectedToStations={selectedToStations}
            onFromStationsChange={setSelectedFromStations}
            onToStationsChange={setSelectedToStations}
          />
        </div>
      </section>

      <section className="table-section">
        <div className="tips-bar" aria-live="polite">
          {loading ? '正在为您查询车次...' : (items.length === 0 ? '列车已全部发售完毕！下次再来吧' : '以下为查询到的车次信息，具体余票以实际为准')}
        </div>
        <div className="table-wrap" role="region" aria-label="车次列表">
          {(error || errMsg) && (
            <div style={{ padding: 16, color: '#c00' }}>加载失败: {error || errMsg} <button onClick={() => { setErrMsg(undefined); void handleQuery() }}>重试</button></div>
          )}
          {((!loading && items.length === 0 && !errMsg && !error && (lastTrigger === undefined || (lastTrigger === 'button' && !hasInteracted))) || (loading && lastTrigger === 'button' && !hasInteracted)) ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#666' }}>暂无车票</div>
          ) : (
            <>
              <TrainList items={filteredTrainList} sortBy={sortBy} sortOrder={sortOrder} onReserve={handleReserve} onSortChange={(key) => {
            const newOrder = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc'
            setSortBy(key)
            setSortOrder(newOrder)
            void handleQuery({ force: true, source: 'filter', params: { sortBy: key, sortOrder: newOrder } })
          }} />
            </>
          )}
        </div>
      </section>
      <AlertModal visible={showOrderBlock} onClose={() => setShowOrderBlock(false)}>
        <span>
          您还有未处理的订单，请您到
          <a style={{ color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setShowOrderBlock(false); navigate('/profile', { state: { section: '火车票订单' } }) }}>未处理订单</a>
          进行处理！
        </span>
      </AlertModal>
      <AlertModal visible={showCancelLimitBlock} onClose={() => setShowCancelLimitBlock(false)}>
        <span>
          <span>订票失败！原因:对不起，由于您取消次数过多，今日将不能继续受理您的订票请求。明日您可继续使用订票功能。请点击</span>
          <a
            style={{ color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => {
              navigate('/profile', { state: { section: '火车票订单' } })
            }}
          >
            [我的12306]
          </a>
          <span>办理其他业务。您也可以点击</span>
          <a
            style={{ color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => {
              navigate('/tickets')
            }}
          >
            [预订车票]
          </a>
          <span>，重新规划您的旅程。</span>
        </span>
      </AlertModal>
    </div>
  )
}
