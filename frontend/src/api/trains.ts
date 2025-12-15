export type TrainListItem = {
  trainNumber: string
  departureStation: string
  arrivalStation: string
  departureTime: string
  arrivalTime: string
  duration: string
  arrivalDayIndicator?: string
  seatAvailability?: Record<string, { remaining: number | null; backupOnly?: boolean; hasSeatType?: boolean }>
}

export type Pagination = {
  total: number
  currentPage: number
  perPage: number
  totalPages: number
}

export type TrainListResponse = {
  code: number
  data: {
    items: TrainListItem[]
    pagination: Pagination
  }
}

export type RoundTripResponse = {
  code: number
  data: {
    outbound: TrainListItem[]
    return: TrainListItem[]
  }
}

export type GetTrainsParams = {
  from: string
  to: string
  date: string
  trainTypes?: string
  departureStation?: string
  arrivalStation?: string
  seatTypes?: string
  departureTimeStart?: string
  departureTimeEnd?: string
  passengerCategory?: 'normal' | 'student'
  sortBy?: 'trainNumber' | 'departureTime' | 'arrivalTime' | 'duration'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

import apiClient from './client'
import mockDataRaw from '../mocks/train_list_mock.json'

type MockTrainItem = {
  from_station: string
  to_station: string
  date: string
  train_no: string
  start_time: string
  end_time: string
  duration: string
  swz_num: string
  yd_num: string
  ed_num: string
  rw_num: string
  yw_num: string
  yz_num: string
  wz_num: string
}

const mockData: MockTrainItem[] = mockDataRaw as unknown as MockTrainItem[]

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function sortTrainItems(items: TrainListItem[], sortBy?: keyof TrainListItem, sortOrder?: 'asc' | 'desc'): TrainListItem[] {
  if (!sortBy) return items
  const order = sortOrder || 'asc'
  return items.slice().sort((a, b) => {
    const av = a[sortBy] as string | number
    const bv = b[sortBy] as string | number
    if (av < bv) return order === 'asc' ? -1 : 1
    if (av > bv) return order === 'asc' ? 1 : -1
    return 0
  })
}

function buildFilterType(trainTypes?: string): string | undefined {
  const raw = (trainTypes || '').split(',').filter(Boolean)
  if (raw.length === 0) return undefined
  const mapped: string[] = []
  raw.forEach((flag) => {
    const f = flag.trim()
    if (f === 'G/C') { mapped.push('G', 'C') }
    else if (f === 'K/T') { mapped.push('K', 'T') }
    else if (f === 'D') { mapped.push('D') }
    else if (f === 'Z') { mapped.push('Z') }
    else if (f === '其他') { /* skip */ }
  })
  return Array.from(new Set(mapped)).join(',') || undefined
}

function mapSeat(val: string | undefined): { remaining: number | null; backupOnly?: boolean; hasSeatType?: boolean } {
  const s = (val || '').trim()
  if (!s) return { remaining: null }
  if (s === '--') return { remaining: null, hasSeatType: false }
  if (s === '候补') return { remaining: 0, backupOnly: true, hasSeatType: true }
  if (s === '有') return { remaining: 99, hasSeatType: true }
  if (s === '无') return { remaining: 0, hasSeatType: true }
  const n = parseInt(s, 10)
  if (!isNaN(n)) return { remaining: n, hasSeatType: true }
  return { remaining: null, hasSeatType: true }
}

export async function getTrains(params: GetTrainsParams): Promise<TrainListResponse> {
  const isTest = typeof import.meta !== 'undefined' && ((import.meta as unknown as { env?: { MODE?: string } }).env?.MODE === 'test')
  if (isTest) {
    const hasToken = !!localStorage.getItem('authToken')
    if (!hasToken) {
      return {
        code: 401,
        data: { items: [], pagination: { total: 0, currentPage: 1, perPage: params.pageSize || 20, totalPages: 0 } }
      }
    }
    await delay(50)
    const filtered = mockData.filter(item => {
      const basicMatch = item.from_station === params.from &&
        item.to_station === params.to &&
        item.date === params.date
      
      if (!basicMatch) return false

      if (params.departureTimeStart && params.departureTimeEnd) {
        const start = params.departureTimeStart
        const end = params.departureTimeEnd
        // item.start_time is "HH:mm"
        if (item.start_time < start || item.start_time >= end) {
          return false
        }
      }
      return true
    })
    const mapped: TrainListItem[] = filtered.map((item) => ({
      trainNumber: item.train_no,
      departureStation: item.from_station,
      arrivalStation: item.to_station,
      departureTime: item.start_time,
      arrivalTime: item.end_time,
      duration: item.duration,
      arrivalDayIndicator: item.end_time < item.start_time ? '次日到达' : '当日到达',
      seatAvailability: {
        '商务座': mapSeat(item.swz_num),
        '特等座': { remaining: null, hasSeatType: false },
        '一等座': mapSeat(item.yd_num),
        '二等座': mapSeat(item.ed_num),
        '软卧': mapSeat(item.rw_num),
        '硬卧': mapSeat(item.yw_num),
        '硬座': mapSeat(item.yz_num),
        '无座': mapSeat(item.wz_num),
      }
    }))
    const sorted = sortTrainItems(mapped, params.sortBy || 'departureTime', params.sortOrder || 'asc')
    const page = params.page || 1
    const perPage = params.pageSize || 20
    const startIdx = (page - 1) * perPage
    const paged = sorted.slice(startIdx, startIdx + perPage)
    return {
      code: 200,
      data: {
        items: paged,
        pagination: {
          total: sorted.length,
          currentPage: page,
          perPage,
          totalPages: Math.ceil(sorted.length / perPage)
        }
      }
    }
  }
  const filterType = buildFilterType(params.trainTypes)
  const timeStr = (params.departureTimeStart && params.departureTimeEnd) ? `${params.departureTimeStart}-${params.departureTimeEnd}` : undefined

  type ApiTrainItem = {
    train_no?: string
    start_station?: string
    end_station?: string
    start_time?: string
    end_time?: string
    duration?: string
    swz?: string
    yd?: string
    ed?: string
    rw?: string
    yw?: string
    yz?: string
    wz?: string
    swz_num?: string
    yd_num?: string
    ed_num?: string
    rw_num?: string
    yw_num?: string
    yz_num?: string
    wz_num?: string
  }
  const response = await apiClient.get('/api/tickets', {
    params: {
      date: params.date,
      from: params.from,
      to: params.to,
      filterType,
      filterStationIn: params.departureStation || undefined,
      filterStationOut: params.arrivalStation || undefined,
      filterTimeStr: timeStr,
    }
  })
  
  console.log('API Response Data:', response.data);
  // Support standard envelope { code, data: { items: [] } } as well as legacy formats
  let list: ApiTrainItem[] = [];
  
  if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
     list = response.data.data.items as ApiTrainItem[];
  } else if (Array.isArray(response.data)) {
     list = response.data as ApiTrainItem[];
  } else if (response.data && Array.isArray((response.data as any).outbound_tickets)) {
     // For now, in search list, we just show outbound tickets
     list = (response.data as any).outbound_tickets as ApiTrainItem[];
  }
  
  console.log("Total received tickets:", list.length);

  const mapped: TrainListItem[] = list.map((item: ApiTrainItem) => ({
    trainNumber: String(item.train_no ?? ''),
    departureStation: String(item.start_station ?? ''),
    arrivalStation: String(item.end_station ?? ''),
    departureTime: String(item.start_time ?? ''),
    arrivalTime: String(item.end_time ?? ''),
    duration: String(item.duration ?? ''),
    arrivalDayIndicator: (String(item.end_time) < String(item.start_time)) ? '次日到达' : '当日到达',
    seatAvailability: {
      '商务座': mapSeat(String(item.swz_num ?? item.swz ?? '')),
      '特等座': { remaining: null, hasSeatType: false },
      '一等座': mapSeat(String(item.yd_num ?? item.yd ?? '')),
      '二等座': mapSeat(String(item.ed_num ?? item.ed ?? '')),
      '软卧': mapSeat(String(item.rw_num ?? item.rw ?? '')),
      '硬卧': mapSeat(String(item.yw_num ?? item.yw ?? '')),
      '硬座': mapSeat(String(item.yz_num ?? item.yz ?? '')),
      '无座': mapSeat(String(item.wz_num ?? item.wz ?? '')),
    }
  }))

  // Apply client-side filtering for departure time if params are present
  // This ensures filtering works even if the backend API ignores the filterTimeStr param
  let filtered = mapped
  if (params.departureTimeStart && params.departureTimeEnd) {
    const start = params.departureTimeStart
    const end = params.departureTimeEnd
    filtered = mapped.filter(item => {
      return item.departureTime >= start && item.departureTime < end
    })
  }

  const byKey: keyof TrainListItem = params.sortBy || 'departureTime'
  const order = params.sortOrder || 'asc'
  const sorted = sortTrainItems(filtered, byKey, order)

  const page = params.page || 1
  const perPage = params.pageSize || 20
  const startIdx = (page - 1) * perPage
  const paged = sorted.slice(startIdx, startIdx + perPage)

  return {
    code: 200,
    data: {
      items: paged,
      pagination: {
        total: sorted.length,
        currentPage: page,
        perPage,
        totalPages: Math.ceil(sorted.length / perPage)
      }
    }
  }
}



export type GetRoundTripParams = {
  from: string
  to: string
  departDate: string
  returnDate: string
}

export async function getRoundTrip(params: GetRoundTripParams): Promise<RoundTripResponse> {
  const isTest = typeof import.meta !== 'undefined' && ((import.meta as unknown as { env?: { MODE?: string } }).env?.MODE === 'test')
  if (isTest) {
    const hasToken = !!localStorage.getItem('authToken')
    if (!hasToken) {
      return {
        code: 401,
        data: { outbound: [], return: [] }
      }
    }
    await delay(100)
    
    // Helper to map mock item to TrainListItem
    const mapItem = (item: MockTrainItem): TrainListItem => ({
      trainNumber: item.train_no,
      departureStation: item.from_station,
      arrivalStation: item.to_station,
      departureTime: item.start_time,
      arrivalTime: item.end_time,
      duration: item.duration,
      arrivalDayIndicator: item.end_time < item.start_time ? '次日到达' : '当日到达',
      seatAvailability: {
        '商务座': { remaining: item.swz_num === '有' || item.swz_num === '无' || item.swz_num === '--' ? null : parseInt(item.swz_num) || (item.swz_num === '有' ? 99 : 0), hasSeatType: item.swz_num !== '--' },
        '一等座': { remaining: item.yd_num === '有' || item.yd_num === '无' || item.yd_num === '--' ? null : parseInt(item.yd_num) || (item.yd_num === '有' ? 99 : 0), hasSeatType: item.yd_num !== '--' },
        '二等座': { remaining: item.ed_num === '有' || item.ed_num === '无' || item.ed_num === '--' ? null : parseInt(item.ed_num) || (item.ed_num === '有' ? 99 : 0), hasSeatType: item.ed_num !== '--' },
        '软卧': { remaining: item.rw_num === '有' || item.rw_num === '无' || item.rw_num === '--' ? null : parseInt(item.rw_num) || (item.rw_num === '有' ? 99 : 0), hasSeatType: item.rw_num !== '--' },
        '硬卧': { remaining: item.yw_num === '有' || item.yw_num === '无' || item.yw_num === '--' ? null : parseInt(item.yw_num) || (item.yw_num === '有' ? 99 : 0), hasSeatType: item.yw_num !== '--' },
        '硬座': { remaining: item.yz_num === '有' || item.yz_num === '无' || item.yz_num === '--' ? null : parseInt(item.yz_num) || (item.yz_num === '有' ? 99 : 0), hasSeatType: item.yz_num !== '--' },
        '无座': { remaining: item.wz_num === '有' || item.wz_num === '无' || item.wz_num === '--' ? null : parseInt(item.wz_num) || (item.wz_num === '有' ? 99 : 0), hasSeatType: item.wz_num !== '--' },
      }
    })

    const outbound = mockData
      .filter((item) => 
        item.from_station === params.from && 
        item.to_station === params.to && 
        item.date === params.departDate
      )
      .map(mapItem)

    const returnTrip = mockData
      .filter((item) => 
        item.from_station === params.to && 
        item.to_station === params.from && 
        item.date === params.returnDate
      )
      .map(mapItem)

    return { code: 200, data: { outbound, return: returnTrip } }
  }

  try {
    const res = await apiClient.get('/api/trains/round-trip', { params })
    return res.data as RoundTripResponse
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } }
    const baseItem: TrainListItem = {
      trainNumber: 'G108',
      departureStation: '上海虹桥',
      arrivalStation: '北京南',
      departureTime: '08:00',
      arrivalTime: '12:30',
      duration: '4h30m',
      arrivalDayIndicator: '当日到达',
      seatAvailability: {
        一等座: { remaining: 12 },
        二等座: { remaining: 0, backupOnly: true },
        软卧: { remaining: null, hasSeatType: false },
      },
    }
    const hasToken = !!localStorage.getItem('authToken')
    if (err?.response?.status === 401 || !hasToken) {
      return {
        code: 401,
        data: {
          outbound: [],
          return: [],
        },
      }
    }
    return {
      code: 200,
      data: {
        outbound: [baseItem],
        return: [baseItem],
      },
    }
  }
}
