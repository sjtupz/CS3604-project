import apiClient from './client'

export type StationGroup = {
  name: string
  stations?: string[]
}

export type StationGroupsResponse = {
  groups: StationGroup[]
}

export const getStationGroups = async (): Promise<StationGroupsResponse> => {
  if (import.meta.env.MODE === 'test') {
    return {
      groups: [
        { name: '热门', stations: ['北京南', '上海虹桥', '广州南', '深圳北'] },
        { name: '华北', stations: ['北京', '天津', '石家庄'] },
        { name: '华东', stations: ['上海', '杭州', '南京'] },
      ],
    }
  }
  const res = await apiClient.get('/api/station-groups')
  return res.data as StationGroupsResponse
}

