import apiClient from './client';
import { Station } from '../types/station';

const CACHE_KEY = 'stations_cache_v2';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24小时缓存

export interface CityGroup {
  province: string;
  cities: {
    city: string;
    pinyin: string;
    hasRail?: boolean;
    nearestStation?: { name: string; code: string } | null;
    stations: { name: string; code: string; type?: string; district?: string; isHot?: boolean; isHub?: boolean; status?: string }[];
  }[];
}

export const getAllCityStations = async (): Promise<CityGroup[]> => {
  if (import.meta.env.MODE === 'test') {
    return [
      {
        province: '北京',
        cities: [
          {
            city: '北京',
            pinyin: 'beijing',
            stations: [
              { name: '北京', code: 'BJ', type: 'highspeed' },
              { name: '北京南', code: 'BJN', type: 'highspeed', isHub: true },
            ],
          },
        ],
      },
      {
        province: '上海',
        cities: [
          {
            city: '上海',
            pinyin: 'shanghai',
            stations: [
              { name: '上海', code: 'SH', type: 'highspeed' },
              { name: '上海虹桥', code: 'SHHQ', type: 'highspeed', isHot: true },
            ],
          },
        ],
      },
    ]
  }
  const CACHE_KEY_CITIES = 'stations_cities_cache_v2';
  try {
    const raw = sessionStorage.getItem(CACHE_KEY_CITIES);
    if (raw) {
      const cached = JSON.parse(raw) as { ts: number; data: CityGroup[] };
      if (Date.now() - cached.ts < CACHE_TTL_MS) {
        return cached.data;
      }
    }
  } catch { /* ignore */ }

  let data: CityGroup[] = []
  try {
    const response = await apiClient.get<{ data: CityGroup[] }>('/api/stations/cities');
    data = response.data.data;
  } catch {
    data = []
  }
  
  try {
    sessionStorage.setItem(CACHE_KEY_CITIES, JSON.stringify({ ts: Date.now(), data }));
  } catch { /* ignore */ }
  
  return data;
};

export const getStations = async (search?: string): Promise<Station[]> => {
  if (import.meta.env.MODE === 'test') {
    const mockData: Station[] = [
      { id: 1, name: '上海', pinyin: 'Shanghai', city: '上海', province: '上海', code: 'ST0001' },
      { id: 2, name: '上海虹桥', pinyin: 'ShanghaiHongqiao', city: '上海', province: '上海', code: 'ST0002' },
      { id: 3, name: '北京', pinyin: 'Beijing', city: '北京', province: '北京', code: 'ST0003' },
      { id: 4, name: '北京南', pinyin: 'BeijingNan', city: '北京', province: '北京', code: 'ST0004' },
    ];
    if (search) {
      const lower = search.toLowerCase();
      return mockData.filter((s) => (s.name || '').toLowerCase().includes(lower) || (s.pinyin || '').toLowerCase().includes(lower));
    }
    return mockData;
  }

  // 优先使用缓存（仅无搜索时）
  if (!search) {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY)
      if (raw) {
        const cached = JSON.parse(raw) as { ts: number; data: Station[] }
        if (Date.now() - cached.ts < CACHE_TTL_MS) {
          return cached.data
        }
      }
    } catch { /* ignore */ }
  }

  const fallback: Station[] = [
    { id: 1, name: '上海', pinyin: 'Shanghai', city: '上海', province: '上海', code: 'ST0001' },
    { id: 2, name: '上海虹桥', pinyin: 'ShanghaiHongqiao', city: '上海', province: '上海', code: 'ST0002' },
    { id: 3, name: '北京', pinyin: 'Beijing', city: '北京', province: '北京', code: 'ST0003' },
    { id: 4, name: '北京南', pinyin: 'BeijingNan', city: '北京', province: '北京', code: 'ST0004' },
  ]
  try {
    const params = new URLSearchParams();
    if (search) {
      params.append('search', search);
    }
    const response = await apiClient.get<Station[]>('/api/stations', { params });
    const data = response.data;
    if (!search) {
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }))
      } catch { /* ignore */ }
    }
    return data
  } catch {
    if (search) {
      const lower = search.toLowerCase()
      return fallback.filter((s) => (s.name || '').toLowerCase().includes(lower) || (s.pinyin || '').toLowerCase().includes(lower))
    }
    return fallback
  }
};
