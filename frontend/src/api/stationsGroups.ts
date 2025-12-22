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
        { name: 'ABCDE', stations: ['安庆', '保定', '北京南', '成都'] },
        { name: 'FGHIJ', stations: ['福州', '广州南', '杭州东', '济南西'] },
        { name: 'KLMNO', stations: ['昆明南', '兰州西', '南京南'] },
        { name: 'PQRST', stations: ['青岛北', '上海虹桥', '深圳北'] },
        { name: 'UVWXYZ', stations: ['乌鲁木齐南', '武汉', '西安北', '扬州', '郑州东'] },
      ],
    }
  }
  const res = await apiClient.get('/api/stations/groups')
  return res.data as StationGroupsResponse
}
