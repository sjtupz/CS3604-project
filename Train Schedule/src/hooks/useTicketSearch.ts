import { useEffect, useMemo, useRef, useState } from 'react';

type Filters = {
  fromStation?: string;
  toStation?: string;
  date?: string;
  trainTypes?: string[];
  sortBy?: 'departure_asc' | 'duration_asc' | 'price_asc';
  departureTimeRange?: [string, string];
  arrivalTimeRange?: [string, string];
  seatType?: string;
  filterStationsFrom?: string[];
  filterStationsTo?: string[];
  filterSeatTypes?: string[];
  page?: number;
  pageSize?: number;
};

type SeatInfo = { type: string; status: '有' | '候补' | number | '-'; price: number | null };
type Ticket = { trainNo: string; fromStation: string; toStation: string; departureTime: string; arrivalTime: string; duration: string; arrivalType: '当日到达' | '次日到达'; seats: SeatInfo[] };

type Meta = { totalItems: number; totalPages: number; currentPage: number; pageSize: number };

type State = { loading: boolean; error: string | null; data: Ticket[]; meta: Meta };

type MatrixDetail = { price: number | null; stock: '有' | '候补' | number | '-' };
type SeatMatrix = {
  business_seat?: MatrixDetail;
  first_seat?: MatrixDetail;
  second_seat?: MatrixDetail;
  soft_berth?: MatrixDetail;
  hard_berth?: MatrixDetail;
  soft_seat?: MatrixDetail;
  hard_seat?: MatrixDetail;
  none_seat?: MatrixDetail;
};
type AggTicket = { trainNo: string; from: string; to: string; date: string; departureTime: string; arrivalTime: string; duration: string; seats: SeatMatrix };
type AggFilters = { departureStations: string[]; arrivalStations: string[]; seatTypes: string[] };
type AggState = { loading: boolean; error: string | null; tickets: AggTicket[]; filters: AggFilters; meta: Meta };

const parseInitial = (): Filters => {
  const sp = new URLSearchParams(window.location.search);
  const trainTypes = sp.get('trainTypes') ? sp.get('trainTypes')!.split(',').filter(Boolean) : undefined;
  const page = sp.get('page') ? parseInt(sp.get('page')!) : undefined;
  const pageSize = sp.get('pageSize') ? parseInt(sp.get('pageSize')!) : undefined;
  return {
    fromStation: sp.get('fromStation') || undefined,
    toStation: sp.get('toStation') || undefined,
    date: sp.get('date') || undefined,
    trainTypes,
    sortBy: (sp.get('sortBy') as Filters['sortBy']) || undefined,
    page,
    pageSize,
  };
};

const buildQuery = (f: Filters) => {
  const sp = new URLSearchParams();
  if (f.fromStation) sp.set('fromStation', f.fromStation);
  if (f.toStation) sp.set('toStation', f.toStation);
  if (f.date) sp.set('date', f.date);
  if (f.trainTypes && f.trainTypes.length) sp.set('trainTypes', f.trainTypes.join(','));
  if (f.sortBy) sp.set('sortBy', f.sortBy);
  if (f.departureTimeRange) { sp.set('depStart', f.departureTimeRange[0]); sp.set('depEnd', f.departureTimeRange[1]); }
  if (f.arrivalTimeRange) { sp.set('arrStart', f.arrivalTimeRange[0]); sp.set('arrEnd', f.arrivalTimeRange[1]); }
  if (f.seatType) sp.set('seatType', f.seatType);
  if (f.page) sp.set('page', String(f.page));
  if (f.pageSize) sp.set('pageSize', String(f.pageSize));
  return sp.toString();
};

export function useTicketSearch() {
  const [filters, setFilters] = useState<Filters>(() => {
    const init = parseInitial();
    const defaults: Filters = {
      fromStation: '北京',
      toStation: '上海',
      date: '2025-11-20',
    };
    const initClean = Object.fromEntries(Object.entries(init).filter(([_, v]) => v !== undefined)) as Filters;
    return { page: init.page || 1, pageSize: init.pageSize || 10, ...defaults, ...initClean };
  });
  const [state, setState] = useState<State>({ loading: false, error: null, data: [], meta: { totalItems: 0, totalPages: 0, currentPage: 1, pageSize: 10 } });
  const [agg, setAgg] = useState<AggState>({ loading: false, error: null, tickets: [], filters: { departureStations: [], arrivalStations: [], seatTypes: [] }, meta: { totalItems: 0, totalPages: 0, currentPage: 1, pageSize: 10 } });
  const abortRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, { data: Ticket[]; meta: Meta }>>(new Map());

  const key = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    const t = setTimeout(() => {
      const qs = buildQuery(filters);
      window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
      if (cacheRef.current.has(key)) {
        const cached = cacheRef.current.get(key)!;
        setState({ loading: false, error: null, data: cached.data, meta: cached.meta });
        return;
      }
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setState(prev => ({ ...prev, loading: true, error: null }));
      const timeoutMs = 8000;
      const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('网络超时')), timeoutMs));
      Promise.race([
        fetch(`/api/v1/tickets?${qs}`, { signal: abortRef.current.signal }),
        timeout,
      ])
        .then(async r => {
          const res = r as Response;
          if (!res.ok) {
            try {
              const body = await res.json();
              const msg = body?.error?.message || `HTTP ${res.status}`;
              throw new Error(msg);
            } catch (_) {
              throw new Error(`HTTP ${res.status}`);
            }
          }
          return res.json();
        })
        .then(json => {
          if (!json || !json.meta || !Array.isArray(json.data)) throw new Error('数据格式错误');
          const meta: Meta = json.meta;
          const data: Ticket[] = json.data || [];
          setState({ loading: false, error: null, data, meta });
          cacheRef.current.set(key, { data, meta });

          const buildAggQuery = (f: Filters) => {
            const sp = new URLSearchParams();
            if (f.fromStation) sp.set('from', f.fromStation);
            if (f.toStation) sp.set('to', f.toStation);
            if (f.date) sp.set('date', f.date);
            if (f.trainTypes && f.trainTypes.length) sp.set('filter_type', f.trainTypes.join(','));
            const seatList = f.filterSeatTypes && f.filterSeatTypes.length ? f.filterSeatTypes : (f.seatType && f.seatType !== '全部' ? [f.seatType] : []);
            if (seatList.length) sp.set('filter_seat', seatList.join(','));
            if (f.filterStationsFrom && f.filterStationsFrom.length) sp.set('filter_stations_from', f.filterStationsFrom.join(','));
            if (f.filterStationsTo && f.filterStationsTo.length) sp.set('filter_stations_to', f.filterStationsTo.join(','));
            if (f.sortBy) {
              const m = f.sortBy === 'price_asc' ? '价格' : (f.sortBy === 'departure_asc' ? '出发时间' : (f.sortBy === 'duration_asc' ? '历时' : ''));
              if (m) sp.set('sort_by', m);
            }
            if (f.departureTimeRange && f.departureTimeRange.length === 2) {
              sp.set('depStart', f.departureTimeRange[0]);
              sp.set('depEnd', f.departureTimeRange[1]);
            }
            if (f.page) sp.set('page', String(f.page));
            if (f.pageSize) sp.set('pageSize', String(f.pageSize));
            return sp.toString();
          };

          const aqs = buildAggQuery(filters);
          setAgg(prev => ({ ...prev, loading: true, error: null }));
          fetch(`/api/v1/tickets/list?${aqs}`)
            .then(r => r.json())
            .then((j) => {
              const metaAgg: Meta = j.meta || { totalItems: 0, totalPages: 0, currentPage: 1, pageSize: filters.pageSize || 10 };
              const filtersAgg: AggFilters = j.filters || { departureStations: [], arrivalStations: [], seatTypes: [] };
              const ticketsAgg: AggTicket[] = j.tickets || [];
              setAgg({ loading: false, error: null, tickets: ticketsAgg, filters: filtersAgg, meta: metaAgg });
            })
            .catch(() => {
              setAgg(prev => ({ ...prev, loading: false, error: '聚合数据加载失败' }));
            });
        })
        .catch(async err => {
          if (err.name === 'AbortError') return;
          try {
            const mock = await fetch('/mock/tickets.json').then(m => m.json());
            const meta: Meta = mock.meta || { totalItems: mock.data.length, totalPages: 1, currentPage: 1, pageSize: mock.data.length };
            const data: Ticket[] = mock.data || [];
            setState({ loading: false, error: null, data, meta });
            cacheRef.current.set(key, { data, meta });
          } catch (_) {
            setState(prev => ({ ...prev, loading: false, error: err.message || '请求失败' }));
          }
        });
    }, 300);
    return () => clearTimeout(t);
  }, [key]);

  const retry = () => setFilters({ ...filters });
  const update = (partial: Partial<Filters>, resetPage = true) => {
    setFilters(prev => ({ ...prev, ...(resetPage ? { page: 1 } : {}), ...partial }));
  };
  const setPage = (page: number) => setFilters(prev => ({ ...prev, page }));

  return { filters, state, agg, update, retry, setPage };
}