import React, { useState } from 'react'

type Props = {
  groups?: { name: string; stations: string[] }[]
  onSelectStation: (name: string) => void
}

export const StationGroupSelector: React.FC<Props> = ({ groups = [], onSelectStation }) => {
  const [term, setTerm] = useState('')
  const hasStations = groups.some((g) => (g.stations?.length ?? 0) > 0)
  if (!hasStations) {
    return <div>无法匹配任何站点</div>
  }
  const filtered = term
    ? groups.map((g) => ({
        name: g.name,
        stations: (g.stations || []).filter((n) => n.includes(term)),
      }))
    : groups
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <input
          placeholder="搜索站点"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          style={{ padding: '6px 8px', border: '1px solid #d9d9d9', borderRadius: 4 }}
        />
      </div>
      {filtered.map((group) => {
        const stations = group.stations || []
        if (stations.length === 0) return null
        return (
          <div key={group.name}>
            <div>{group.name}</div>
            <div>
              {stations.map((name) => (
                <button key={name} onClick={() => onSelectStation(name)}>{name}</button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
