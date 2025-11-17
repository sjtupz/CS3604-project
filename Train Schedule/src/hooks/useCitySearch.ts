import { useEffect, useMemo, useRef, useState } from 'react'

export type CityItem = {
  id: number
  standard_name: string
  pinyin: string
  pinyin_initials: string
  admin_code: string
  lat: number
  lng: number
  is_hot: number
  rank: number
}

export function useCitySearch(endpoint: 'departures'|'destinations', enabled: boolean = false) {
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [list, setList] = useState<CityItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const cacheRef = useRef<Map<string, CityItem[]>>(new Map())
  const abortRef = useRef<AbortController|null>(null)

  const key = useMemo(() => `${endpoint}:${keyword}:${page}`, [endpoint, keyword, page])

  useEffect(() => {
    const t = setTimeout(() => {
      if (!enabled) return
      if (cacheRef.current.has(key)) { setList(cacheRef.current.get(key) || []); return }
      abortRef.current?.abort(); abortRef.current = new AbortController()
      setLoading(true); setError(null)
      const qs = new URLSearchParams()
      if (keyword) qs.set('keyword', keyword)
      qs.set('page', String(page))
      qs.set('pageSize', '10')
      const urlV1 = `/api/v1/${endpoint}?${qs.toString()}`
      const urlLegacy = `/api/${endpoint}?${qs.toString()}`
      const run = async () => {
        try {
          const r1 = await fetch(urlV1, { signal: abortRef.current!.signal })
          if (r1.status === 404) {
            const r2 = await fetch(urlLegacy, { signal: abortRef.current!.signal })
            if (!r2.ok) throw new Error(`HTTP ${r2.status}`)
            const j2 = await r2.json(); const data = (j2.data || []) as CityItem[]; setList(data); cacheRef.current.set(key, data); return
          }
          if (!r1.ok) throw new Error(`HTTP ${r1.status}`)
          const j1 = await r1.json(); const data = (j1.data || []) as CityItem[]; setList(data); cacheRef.current.set(key, data)
        } catch (e: any) {
          if (e?.name === 'AbortError') return
          let tries = 2; let delay = 200
          while (tries-- > 0) {
            await new Promise(res => setTimeout(res, delay)); delay *= 2
            try {
              const r = await fetch(urlV1, { signal: abortRef.current!.signal })
              if (r.ok) { const j = await r.json(); const data = (j.data || []) as CityItem[]; setList(data); cacheRef.current.set(key, data); return }
            } catch {}
          }
          setError(e?.message || '请求失败')
        } finally { setLoading(false) }
      }
      run()
    }, 300)
    return () => clearTimeout(t)
  }, [key, enabled])

  return { keyword, setKeyword, page, setPage, list, loading, error }
}

export function useCityHistory() {
  const [history, setHistory] = useState<CityItem[]>(() => {
    try { const raw = localStorage.getItem('city_history') || '[]'; return JSON.parse(raw) } catch { return [] }
  })
  const push = (item: CityItem) => {
    const next = [item, ...history.filter(h => h.standard_name !== item.standard_name)]
    const sliced = next.slice(0, 5)
    setHistory(sliced)
    try { localStorage.setItem('city_history', JSON.stringify(sliced)) } catch {}
  }
  return { history, push }
}