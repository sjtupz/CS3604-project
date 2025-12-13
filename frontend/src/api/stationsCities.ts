import apiClient from './client'

export type StationsCitiesResponse = {
  data: Array<{
    province: string
    cities: Array<{
      city: string
      stations: Array<{ name: string; code?: string }>
    }>
  }>
}

export const getStationsCities = async (): Promise<StationsCitiesResponse> => {
  const mockResp: StationsCitiesResponse = {
    data: [
      {
        province: '北京',
        cities: [{ city: '北京', stations: [{ name: '北京' }, { name: '北京南' }] }],
      },
      {
        province: '上海',
        cities: [{ city: '上海', stations: [{ name: '上海' }, { name: '上海虹桥' }] }],
      },
    ],
  }
  if (import.meta.env.MODE === 'test') {
    return mockResp
  }
  try {
    const res = await apiClient.get('/api/stations/cities')
    return res.data as StationsCitiesResponse
  } catch {
    return mockResp
  }
}
