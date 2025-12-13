import React from 'react'

type Props = {
  groups?: { name: string; stations: string[] }[]
  onSelectStation: (name: string) => void
}

export const StationGroupSelector: React.FC<Props> = ({ groups = [], onSelectStation }) => {
  const hasStations = groups.some((g) => (g.stations?.length ?? 0) > 0)
  if (!hasStations) {
    return <div>无法匹配任何站点</div>
  }
  return (
    <div>
      {groups.map((group) => {
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
