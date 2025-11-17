import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TicketList } from './TicketList'

vi.mock('../../hooks/useCitySearch', async () => {
  const mod = await vi.importActual<typeof import('../../hooks/useCitySearch')>('../../hooks/useCitySearch')
  return {
    ...mod,
    useCitySearch: (endpoint: 'departures'|'destinations', enabled: boolean = false) => {
      const list = [
        { id: 1, standard_name: '北京', pinyin: 'beijing', pinyin_initials: 'bj', admin_code: '110000', area_code: '010', postal_code: '100000', lat: 39, lng: 116, is_hot: 1, rank: 100 },
        { id: 2, standard_name: '广州', pinyin: 'guangzhou', pinyin_initials: 'gz', admin_code: '440100', area_code: '020', postal_code: '510000', lat: 23, lng: 113, is_hot: 1, rank: 95 },
        { id: 3, standard_name: '深圳', pinyin: 'shenzhen', pinyin_initials: 'sz', admin_code: '440300', area_code: '0755', postal_code: '518000', lat: 22, lng: 114, is_hot: 1, rank: 95 }
      ]
      return { keyword: '', setKeyword: () => {}, page: 1, setPage: () => {}, list: enabled ? list : [], loading: false, error: null }
    }
  }
})

const okMeta = { totalItems: 2, totalPages: 1, currentPage: 1, pageSize: 10 }
const okData = [
  { trainNo: 'G801', fromStation: '广州', toStation: '深圳', departureTime: '08:00', arrivalTime: '09:10', duration: '1小时10分钟', arrivalType: '当日到达', seats: [{ type: '二等座', status: '有', price: 80 }]},
  { trainNo: 'D802', fromStation: '广州', toStation: '深圳', departureTime: '10:00', arrivalTime: '11:20', duration: '1小时20分钟', arrivalType: '当日到达', seats: [{ type: '二等座', status: 23, price: 60 }]},
]

describe('城市筛选与车次显示', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.history.replaceState(null, '', '/')
  })

  it('单独查询非北京上海城市', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ meta: okMeta, data: okData }) } as any)
    render(<TicketList />)
    const depLabel = await screen.findByText('出发地')
    const depValue = depLabel.nextSibling as HTMLElement
    await user.click(depValue)
    const gzItem = await screen.findByText('广州')
    await user.click(gzItem)
    const confirm1 = await screen.findByRole('button', { name: '确认' })
    await user.click(confirm1)
    const arrLabel = await screen.findByText('目的地')
    const arrValue = arrLabel.nextSibling as HTMLElement
    await user.click(arrValue)
    const szItem = await screen.findByText('深圳')
    await user.click(szItem)
    const confirm2 = await screen.findByRole('button', { name: '确认' })
    await user.click(confirm2)
    await new Promise(r => setTimeout(r, 800))
    expect(fetchSpy).toHaveBeenCalled()
    const url = String((fetchSpy.mock.calls.at(-1) as any[])[0])
    expect(url.includes('fromStation=%E5%B9%BF%E5%B7%9E')).toBe(true)
    expect(url.includes('toStation=%E6%B7%B1%E5%9C%B3')).toBe(true)
    expect(await screen.findByText('G801')).toBeTruthy()
  })

  it('混合查询包含北京和其他城市', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ meta: okMeta, data: okData }) } as any)
    window.history.replaceState(null, '', encodeURI('?fromStation=北京&toStation=广州&date=2025-11-20'))
    render(<TicketList />)
    await new Promise(r => setTimeout(r, 800))
    expect(fetchSpy).toHaveBeenCalled()
    const url = String((fetchSpy.mock.calls.at(-1) as any[])[0])
    expect(url.includes('fromStation=%E5%8C%97%E4%BA%AC')).toBe(true)
    expect(url.includes('toStation=%E5%B9%BF%E5%B7%9E')).toBe(true)
  })

  it('边界情况无车次时显示空状态', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ meta: { totalItems: 0, totalPages: 1, currentPage: 1, pageSize: 10 }, data: [] }) } as any)
    render(<TicketList />)
    await new Promise(r => setTimeout(r, 800))
    expect(await screen.findByText('未查询到符合条件的车次')).toBeTruthy()
  })
})