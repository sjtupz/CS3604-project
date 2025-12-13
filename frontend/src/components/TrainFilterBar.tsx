import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { getStations } from '../api/station'
import { DepartureTimeFilter } from './DepartureTimeFilter'

const cityStationMap: Record<string, string[]> = {
  上海: ['上海虹桥', '上海南', '上海', '上海西', '金山北'],
  北京: ['北京南', '北京', '北京西', '北京北', '北京朝阳'],
  杭州: ['杭州东', '杭州', '杭州南', '杭州西'],
  广州: ['广州南', '广州', '广州东', '广州白云'],
  深圳: ['深圳北', '深圳', '福田'],
}

type Props = {
  selectedDate: string
  timeRange: string
  onDateChange: (d: string) => void
  onTimeRangeChange: (r: string) => void
  selectedTrainTypes?: string[]
  onTrainTypesChange?: (v: string[]) => void
  selectedSeatTypes?: string[]
  onSeatTypesChange?: (v: string[]) => void
  fromStation?: string
  toStation?: string
  onFromStationChange?: (name: string) => void
  onToStationChange?: (name: string) => void
}

export const TrainFilterBar: React.FC<Props> = ({ selectedDate, timeRange, onDateChange, onTimeRangeChange, selectedTrainTypes = [], onTrainTypesChange, selectedSeatTypes = [], onSeatTypesChange, fromStation, toStation, onFromStationChange, onToStationChange }) => {

  const ALL_TRAIN_TYPES = ['GC', 'D', 'Z', 'KT', 'Other']
  const ALL_SEAT_TYPES = ['商务座', '一等座', '二等座', '软卧', '硬卧', '硬座', '无座', '其他']

  const getCityName = useCallback((stationName: string) => {
    if (!stationName) return ''
    if (cityStationMap[stationName]) return stationName
    const city = Object.keys(cityStationMap).find((c) => (cityStationMap[c] || []).includes(stationName))
    return city || stationName
  }, [])

  const findStationsFor = useCallback((place?: string): string[] => {
    const name = (place || '').trim()
    if (!name) return []
    if (cityStationMap[name]) return cityStationMap[name]
    const city = Object.keys(cityStationMap).find((c) => (cityStationMap[c] || []).includes(name))
    return city ? cityStationMap[city] : []
  }, [])

  const resolveStations = useCallback(async (place?: string): Promise<string[]> => {
    const mapped = findStationsFor(place)
    if (mapped.length > 0) return mapped
    try {
      const list = await getStations(place)
      return Array.from(new Set(list.map((s) => s.name)))
    } catch {
      return []
    }
  }, [findStationsFor])
  const toDateStr = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${dd}`
  }

  const todayStr = useMemo(() => {
    const t = new Date()
    return toDateStr(t)
  }, [])

  const endStr = useMemo(() => {
    const t = new Date()
    const d = new Date(t)
    d.setDate(t.getDate() + 15)
    return toDateStr(d)
  }, [])
  const dateList = useMemo(() => {
    const start = new Date(todayStr.replace(/-/g, '/'))
    const arr: string[] = []
    for (let i = 0; i <= 15; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      arr.push(toDateStr(d))
    }
    return arr
  }, [todayStr])

  const formatTabLabel = (iso: string) => {
    const d = new Date(iso.replace(/-/g, '/'))
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const wk = ['周日','周一','周二','周三','周四','周五','周六'][d.getDay()]
    return `${mm}-${dd} ${wk}`
  }

  const toggleType = (flag: string) => {
    if (selectedTrainTypes.includes(flag)) {
      onTrainTypesChange?.(selectedTrainTypes.filter(t => t !== flag))
    } else {
      onTrainTypesChange?.([...selectedTrainTypes, flag])
    }
  }

  const handleSelectAllTypes = () => {
    onTrainTypesChange?.(ALL_TRAIN_TYPES)
  }

  const isAllTypesSelected = ALL_TRAIN_TYPES.every(t => selectedTrainTypes.includes(t))

  const toggleSeat = (flag: string) => {
    if (selectedSeatTypes.includes(flag)) {
      onSeatTypesChange?.(selectedSeatTypes.filter(t => t !== flag))
    } else {
      onSeatTypesChange?.([...selectedSeatTypes, flag])
    }
  }

  const handleSelectAllSeats = () => {
    onSeatTypesChange?.(ALL_SEAT_TYPES)
  }

  const isAllSeatsSelected = ALL_SEAT_TYPES.every(t => selectedSeatTypes.includes(t))

  const [depStations, setDepStations] = useState<string[]>([])
  const [arrStations, setArrStations] = useState<string[]>([])
  const [loadingDep, setLoadingDep] = useState(false)
  const [loadingArr, setLoadingArr] = useState(false)
  const [depError, setDepError] = useState<string | null>(null)
  const [arrError, setArrError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoadingDep(true)
      setDepError(null)
      try {
        const names = await resolveStations(fromStation)
        if (mounted) {
          setDepStations(names)
          if (names.length === 0) {
            // 映射为空且API失败时才显示错误
            try {
              const list = await getStations(fromStation)
              setDepStations(Array.from(new Set(list.map((s) => s.name))))
            } catch {
              setDepStations([])
              setDepError('加载失败')
            }
          }
        }
      } finally {
        if (mounted) setLoadingDep(false)
      }
    }
    void load()
    return () => { mounted = false }
  }, [fromStation, resolveStations])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoadingArr(true)
      setArrError(null)
      try {
        const names = await resolveStations(toStation)
        if (mounted) {
          setArrStations(names)
          if (names.length === 0) {
            try {
              const list = await getStations(toStation)
              setArrStations(Array.from(new Set(list.map((s) => s.name))))
            } catch {
              setArrStations([])
              setArrError('加载失败')
            }
          }
        }
      } finally {
        if (mounted) setLoadingArr(false)
      }
    }
    void load()
    return () => { mounted = false }
  }, [toStation, resolveStations])

  return (
    <div className="filter-bar quick-search-box-lg" role="group" aria-label="筛选" data-time-range={timeRange} data-has-time-change={!!onTimeRangeChange}>
      <div className="date-range" aria-label="日期选择" data-range-start={todayStr} data-range-end={endStr}>
        <ul className="date-tabs">
          {dateList.map((d) => {
            const isActive = selectedDate === d
            return (
              <li key={d} style={{ listStyle: 'none' }}>
                <button
                  type="button"
                  className={`tab${isActive ? ' active' : ''}`}
                  aria-pressed={isActive}
                  aria-label={d}
                  onClick={() => onDateChange(d)}
                >
                  {formatTabLabel(d)}
                </button>
              </li>
            )
          })}
        </ul>
        <div style={{fontSize: 12, color: '#666', marginTop: 6}}>可选日期范围：{todayStr}至{endStr}</div>
      </div>
      <DepartureTimeFilter selectedTimeRange={timeRange} onSelect={onTimeRangeChange} />
      <div className="t-switch" aria-label="车次筛选">
        <div className="switch-row">
          <div className="row-label">车次类型</div>
          <button type="button" className={`btn-all${isAllTypesSelected ? ' active' : ''}`} onClick={handleSelectAllTypes}>全部</button>
          <div className="row-options">
            <label className="checkbox-item"><input type="checkbox" checked={selectedTrainTypes.includes('GC')} onChange={() => toggleType('GC')} />GC-高铁/城际</label>
            <label className="checkbox-item"><input type="checkbox" checked={selectedTrainTypes.includes('D')} onChange={() => toggleType('D')} />D-动车</label>
            <label className="checkbox-item"><input type="checkbox" checked={selectedTrainTypes.includes('Z')} onChange={() => toggleType('Z')} />Z-直达</label>
            <label className="checkbox-item"><input type="checkbox" checked={selectedTrainTypes.includes('KT')} onChange={() => toggleType('KT')} />K/T-快特</label>
            <label className="checkbox-item"><input type="checkbox" checked={selectedTrainTypes.includes('Other')} onChange={() => toggleType('Other')} />其他</label>
          </div>
        </div>
        <div className="switch-row">
          <div className="row-label">出发车站</div>
          <button type="button" className={`btn-all${fromStation === getCityName(fromStation || '') ? ' active' : ''}`} onClick={() => onFromStationChange?.(getCityName(fromStation || ''))}>全部</button>
          <div className="row-options">
            {loadingDep ? (
              <span style={{fontSize: 12, color: '#999'}}>加载中...</span>
            ) : depError ? (
              <span style={{fontSize: 12, color: '#c00'}}>
                {depError}
                <button type="button" style={{marginLeft: 8}} onClick={() => { void (async () => { setDepError(null); setLoadingDep(true); try { const list = await getStations(fromStation); setDepStations(Array.from(new Set(list.map(s => s.name)))) } catch { setDepStations([]); setDepError('加载失败') } finally { setLoadingDep(false) } })() }}>重试</button>
              </span>
            ) : depStations.length === 0 ? (
              <span style={{fontSize: 12, color: '#999'}}>暂无匹配车站</span>
            ) : (
              depStations.map((name) => (
                <label key={`from-${name}`} className="checkbox-item">
                  <input type="checkbox" checked={fromStation === name} onChange={(e) => { if (e.target.checked) onFromStationChange?.(name) }} />{name}
                </label>
              ))
            )}
          </div>
        </div>
        <div className="switch-row">
          <div className="row-label">到达车站</div>
          <button type="button" className={`btn-all${toStation === getCityName(toStation || '') ? ' active' : ''}`} onClick={() => onToStationChange?.(getCityName(toStation || ''))}>全部</button>
          <div className="row-options">
            {loadingArr ? (
              <span style={{fontSize: 12, color: '#999'}}>加载中...</span>
            ) : arrError ? (
              <span style={{fontSize: 12, color: '#c00'}}>
                {arrError}
                <button type="button" style={{marginLeft: 8}} onClick={() => { void (async () => { setArrError(null); setLoadingArr(true); try { const list = await getStations(toStation); setArrStations(Array.from(new Set(list.map(s => s.name)))) } catch { setArrStations([]); setArrError('加载失败') } finally { setLoadingArr(false) } })() }}>重试</button>
              </span>
            ) : arrStations.length === 0 ? (
              <span style={{fontSize: 12, color: '#999'}}>暂无匹配车站</span>
            ) : (
              arrStations.map((name) => (
                <label key={`to-${name}`} className="checkbox-item">
                  <input type="checkbox" checked={toStation === name} onChange={(e) => { if (e.target.checked) onToStationChange?.(name) }} />{name}
                </label>
              ))
            )}
          </div>
        </div>
        <div className="switch-row">
          <div className="row-label">车次席别</div>
          <button type="button" className={`btn-all${isAllSeatsSelected ? ' active' : ''}`} onClick={handleSelectAllSeats}>全部</button>
          <div className="row-options">
            <label className="checkbox-item"><input type="checkbox" checked={selectedSeatTypes.includes('商务座')} onChange={() => toggleSeat('商务座')} />商务座</label>
            <label className="checkbox-item"><input type="checkbox" checked={selectedSeatTypes.includes('一等座')} onChange={() => toggleSeat('一等座')} />一等座</label>
            <label className="checkbox-item"><input type="checkbox" checked={selectedSeatTypes.includes('二等座')} onChange={() => toggleSeat('二等座')} />二等座</label>
            <label className="checkbox-item"><input type="checkbox" checked={selectedSeatTypes.includes('软卧')} onChange={() => toggleSeat('软卧')} />软卧</label>
            <label className="checkbox-item"><input type="checkbox" checked={selectedSeatTypes.includes('硬卧')} onChange={() => toggleSeat('硬卧')} />硬卧</label>
            <label className="checkbox-item"><input type="checkbox" checked={selectedSeatTypes.includes('硬座')} onChange={() => toggleSeat('硬座')} />硬座</label>
            <label className="checkbox-item"><input type="checkbox" checked={selectedSeatTypes.includes('无座')} onChange={() => toggleSeat('无座')} />无座</label>
            <label className="checkbox-item"><input type="checkbox" checked={selectedSeatTypes.includes('其他')} onChange={() => toggleSeat('其他')} />其他</label>
          </div>
        </div>
      </div>
    </div>
  )
}
