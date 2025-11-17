import React, { useEffect, useMemo, useState } from 'react'
import styles from './CitySelect.module.css'
import { useCitySearch, useCityHistory } from '../../hooks/useCitySearch'

type Props = {
  label: string
  value: string
  endpoint: 'departures'|'destinations'
  onConfirm: (cityName: string) => void
  disabledNames?: string[]
}

export const CitySelect: React.FC<Props> = ({ label, value, endpoint, onConfirm, disabledNames = [] }) => {
  const [open, setOpen] = useState(false)
  const { keyword, setKeyword, list, loading, error } = useCitySearch(endpoint, open)
  const { history, push } = useCityHistory()
  const [selected, setSelected] = useState<string>('')
  const invalid = useMemo(() => disabledNames.includes(selected), [disabledNames, selected])

  useEffect(() => { if (open) setKeyword('') }, [open])

  const confirm = () => {
    if (!selected || invalid) return
    onConfirm(selected)
    push(list.find(x => x.standard_name === selected) || { id: 0, standard_name: selected, pinyin: '', pinyin_initials: '', admin_code: '', lat: 0, lng: 0, is_hot: 0, rank: 0 })
    setOpen(false)
  }

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value} onClick={() => setOpen(v=>!v)}>{value}</span>
      {open && (
        <div className={styles.dropdown} role="dialog" aria-modal="true">
          <input className={styles.input} value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="输入中文或拼音首字母" />
          <div className={styles.list} aria-live="polite">
            {loading && <div>加载中...</div>}
            {error && <div className={styles.error}>请求失败：{error}</div>}
            {!loading && list.slice(0,10).map(item => (
              <div key={item.id} className={styles.item} onClick={() => setSelected(item.standard_name)} aria-selected={selected===item.standard_name}>
                <span>{item.standard_name}</span>
                <span style={{ color:'#6b7280', fontSize:12 }}>{item.pinyin_initials.toUpperCase()} · {item.area_code || ''}</span>
              </div>
            ))}
          </div>
          {history.length>0 && (
            <div className={styles.hot}>
              {history.map(h => (
                <span key={h.standard_name} className={styles.tag} onClick={()=>setSelected(h.standard_name)}>{h.standard_name}</span>
              ))}
            </div>
          )}
          {invalid && <div className={styles.error}>出发地与目的地不能相同</div>}
          <button className={styles.confirm} onClick={confirm} disabled={!selected || invalid}>确认</button>
        </div>
      )}
    </div>
  )
}