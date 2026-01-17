import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getAllCityStations, CityGroup, getStations } from '../api/station';

interface StationDropdownProps {
  value: string;
  onSelectStation: (stationName: string) => void;
  placeholder?: string;
  onInputChange?: (term: string) => void;
  id?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  inputWidth?: number;
  selectCityAsFinal?: boolean;
}

interface StationItem {
  name: string;
  code: string;
  type?: string;
  isHot?: boolean;
  isHub?: boolean;
  status?: string;
  district?: string;
}

interface CityItem {
  name: string;
  pinyin: string;
  initial: string;
  stations: StationItem[];
  hasRail?: boolean;
  nearestStation?: { name: string; code: string } | null;
}

interface ProvinceItem {
  name: string;
  cities: CityItem[];
}

interface SearchResult {
  name: string;
  pinyin: string;
  type: 'city' | 'station';
  cityName?: string;
  stationData?: StationItem;
  cityData?: CityItem;
}

const HOT_CITY_NAMES = [
  '北京', '上海', '广州', '深圳', '杭州', '南京', '武汉', '长沙', '成都', '重庆',
  '西安', '苏州', '天津', '郑州', '济南', '青岛', '厦门', '福州', '沈阳', '哈尔滨'
];

// Step 1: Define explicit tab to letter mapping
// Removed letter mapping as we are removing letter tabs
// const TAB_MAPPING: Record<string, string[]> = { ... };

// tabs removed; using filter bar per requirements

export const StationDropdown: React.FC<StationDropdownProps> = ({
  value,
  onSelectStation,
  placeholder,
  onInputChange,
  id,
  disabled,
  isInvalid,
  inputWidth,
  selectCityAsFinal
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const [isVisible, setIsVisible] = useState(import.meta.env.MODE === 'test');
  // legacy tab state removed; using filterKey exclusively
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState<'domestic' | 'international'>('domestic');
  const [filterKey, setFilterKey] = useState<'hot' | 'ABCDE' | 'FGHIJ' | 'KLMNO' | 'PQRST' | 'UVWXYZ' | 'LAOS'>('hot');
  
  // Two-level selection state
  const [view, setView] = useState<'province' | 'city' | 'station'>('city');
  const [selectedCity, setSelectedCity] = useState<CityItem | null>(null);
  // province view removed in optimized UI

  const containerRef = useRef<HTMLDivElement>(null);
  const selectingRef = useRef(false);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const groups: CityGroup[] = await getAllCityStations();
        const flatCities: CityItem[] = [];
        const provs: ProvinceItem[] = groups.map((g) => ({
          name: g.province,
          cities: g.cities.map((c) => ({
            name: c.city,
            pinyin: c.pinyin || '',
            initial: (c.pinyin || '').charAt(0).toLowerCase(),
            stations: c.stations.map((s) => ({ name: s.name, code: s.code, type: s.type, isHot: s.isHot, isHub: s.isHub, status: s.status, district: s.district })),
            hasRail: c.hasRail,
            nearestStation: c.nearestStation || null,
          })),
        }));
        provs.forEach((p) => p.cities.forEach((c) => flatCities.push(c)));
        setCities(flatCities);
        setError(null);
      } catch (err) {
        setError("加载失败，请重试");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsVisible(false);
        // Reset view when closing
        setView('city');
        setSelectedCity(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    const handleOpenEvent = (e: Event) => {
      try {
        const detail = (e as CustomEvent<string | undefined>).detail;
        if (id && detail && detail !== id) {
          setIsVisible(false);
        }
      } catch { /* noop */ }
    };
    window.addEventListener('station-dropdown-open', handleOpenEvent);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('station-dropdown-open', handleOpenEvent);
    };
  }, [id]);

  // Search Logic
  const [remoteResults, setRemoteResults] = useState<SearchResult[]>([]);
  const [hasTyped, setHasTyped] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const run = async () => {
      const term = inputValue.trim();
      if (!term) {
        setRemoteResults([]);
        return;
      }
      try {
        const list = await getStations(term);
        const shaped: SearchResult[] = list.map((s) => ({
          name: s.name,
          pinyin: s.pinyin || '',
          type: 'station',
          cityName: s.city,
          stationData: { name: s.name, code: s.code || '' }
        }));
        setRemoteResults(shaped);
      } catch {
        setRemoteResults([]);
      }
    };
    run();
  }, [inputValue]);
  const searchResults = useMemo(() => {
    if (!inputValue) return [];
    const term = (inputValue || '').toLowerCase();
    const abbr = (s: string) => s.replace(/(sh|ch|zh)/g, (m) => m[0]).split(/[^a-zA-Z]+/).map((w) => w[0] || '').join('').toLowerCase();
    const results: SearchResult[] = [];
    // 本地城市/车站匹配
    cities.forEach((city) => {
      const hitCity = city.name.includes(term) || (city.pinyin || '').toLowerCase().includes(term) || (city.initial || '').toLowerCase().includes(term) || abbr(city.pinyin).includes(term);
      if (hitCity) {
        results.push({ name: city.name, pinyin: city.pinyin, type: 'city', cityData: city });
      }
      city.stations.forEach((station) => {
        if (station.name.includes(term) || (station.code || '').toLowerCase().includes(term)) {
          results.push({ name: station.name, pinyin: city.pinyin, type: 'station', cityName: city.name, stationData: station });
        }
      });
    });
    // 远端结果过滤策略：英文/拼音输入时严格过滤，中文输入时不过滤
    const isLatin = /[a-z]/i.test(term);
    const remote = isLatin
      ? remoteResults.filter((r) => (r.name || '').toLowerCase().includes(term) || (r.pinyin || '').toLowerCase().includes(term))
      : remoteResults;
    const merged = [...results, ...remote];
    const unique = new Map<string, SearchResult>();
    merged.forEach((item) => { if (!unique.has(item.name)) unique.set(item.name, item); });
    return Array.from(unique.values()).slice(0, 20);
  }, [inputValue, cities, remoteResults]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setHasTyped(true);
    onInputChange?.(val);
    setIsVisible(true);
    setView('city'); // Reset to city view when searching
    setSelectedCity(null);
  };

  const handleSelectCity = (city: CityItem) => {
    if (selectingRef.current) return;
    selectingRef.current = true;
    
    
    if (!city.hasRail && city.nearestStation) {
      selectingRef.current = false;
      handleSelectStation({ name: city.nearestStation.name, code: city.nearestStation.code });
      return;
    }

    // Task 2 Fix: If 'hot' tab is active and not searching, force selection and close modal
    const isHotTab = filterKey === 'hot' && !hasTyped;
    
    if (city.stations.length === 1 || selectCityAsFinal || isHotTab) {
      setInputValue(city.name);
      onSelectStation(city.name);
      onInputChange?.(city.name);
      setIsVisible(false);
      setView('city');
      setSelectedCity(null);
    } else {
      // Otherwise, if multiple stations and not hot tab/final mode, show stations
      setSelectedCity(city);
      setView('station');
      setHasTyped(false);
    }
    setTimeout(() => { selectingRef.current = false }, 0);
  };

  // province selection removed in optimized UI

  const handleSelectStation = (station: StationItem) => {
    if (selectingRef.current) return;
    selectingRef.current = true;
    
    setInputValue(station.name);
    onSelectStation(station.name);
    onInputChange?.(station.name);
    setIsVisible(false);
    setView('city');
    setSelectedCity(null);
    setTimeout(() => { selectingRef.current = false }, 0);
  };

  const handleSearchResultClick = (item: SearchResult) => {
    if (item.type === 'station' && item.stationData) {
      handleSelectStation(item.stationData);
    } else if (item.type === 'city' && item.cityData) {
      handleSelectCity(item.cityData);
    }
  };

  const getTabContent = () => {
    if (region === 'international') {
      if (filterKey === 'LAOS') {
        const fromBackend = cities.filter((c) => c.name === '老挝' || (c.pinyin || '').toLowerCase() === 'laowo');
        if (fromBackend.length > 0) return fromBackend;
        return [{ name: '老挝', pinyin: 'laowo', initial: 'l', stations: [] } as CityItem];
      }
      return [];
    }
    if (filterKey === 'hot') {
      return HOT_CITY_NAMES.map((name) => {
        const city = cities.find((c) => c.name === name);
        if (city) return city;
        return {
          name,
          pinyin: '',
          initial: '',
          stations: [{ name, code: name.slice(0, 2).toUpperCase() }],
          hasRail: true,
          nearestStation: null,
        } as CityItem;
      });
    }
    return [];
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: { position: 'relative', width: inputWidth ? undefined : '100%', flexShrink: 0 },
    input: {
      width: inputWidth ? `${inputWidth}px` : '100%',
      padding: '8px 12px',
      border: `1px solid ${isInvalid ? '#ff4d4f' : '#d9d9d9'}`,
      borderRadius: '4px',
      outline: 'none',
      backgroundColor: disabled ? '#f5f5f5' : '#fff',
      cursor: disabled ? 'not-allowed' : 'text',
      fontSize: '14px',
      flexShrink: 0,
    },
    popup: {
      position: 'absolute',
      top: '100%',
      left: 0,
      width: '560px',
      height: '265px',
      backgroundColor: '#fff',
      border: '1px solid #d9d9d9',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1050,
      marginTop: '4px',
      borderRadius: '4px',
      display: isVisible ? 'block' : 'none',
      fontSize: '12px',
      overflow: 'hidden',
    },
    header: {
      padding: '8px 12px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f9f9f9'
    },
    backBtn: {
      cursor: 'pointer',
      color: '#437ff7',
      marginRight: '8px',
      fontWeight: 'bold'
    },
    stationList: {
      padding: '6px',
      maxHeight: '200px',
      overflowY: 'auto'
    },
    stationItem: {
      padding: '8px 12px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '1px solid #f0f0f0',
      color: '#666'
    },
    tabBar: { display: 'flex', borderBottom: '1px solid #e8e8e8', backgroundColor: '#f5f5f5' },
    tabItem: { padding: '8px 12px', cursor: 'pointer', borderRight: '1px solid #e8e8e8', color: '#666' },
    activeTab: { backgroundColor: '#fff', color: '#437ff7', fontWeight: 'bold', borderBottom: '2px solid #437ff7', marginBottom: '-1px' },
    content: { padding: '8px', flex: 1, overflowY: 'auto' },
    cityGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: '16px', rowGap: '6px' },
    cityItem: { padding: '3px 6px', cursor: 'pointer', borderRadius: '2px', minWidth: '52px', textAlign: 'center' as const, color: '#666' },
    cityItemHover: { color: '#437ff7', backgroundColor: '#f0f7ff' },
    searchList: { maxHeight: '300px', overflowY: 'auto' },
    searchItem: { padding: '8px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' },
    layout: { display: 'flex', height: '100%' },
    sidebar: { width: '88px', borderRight: '1px solid #eee', padding: '8px 6px', backgroundColor: '#f7f7f7', height: '100%' },
    sideBtn: { display: 'block', padding: '8px 10px', marginBottom: '8px', borderRadius: '4px', backgroundColor: '#f0f0f0', color: '#000', cursor: 'pointer', textAlign: 'center' as const },
    sideBtnActive: { backgroundColor: '#437ff7', color: '#fff' },
    rightPane: { flex: 1, display: 'flex', flexDirection: 'column', height: '100%' },
    hintBar: { padding: '6px 10px', color: '#8c8c8c', borderBottom: '1px solid #eee' },
    filterBar: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', alignItems: 'stretch', justifyItems: 'stretch', borderBottom: '1px solid #e8e8e8', backgroundColor: '#f5f5f5', height: '28px' },
    filterBtn: { cursor: 'pointer', color: '#666', textAlign: 'center' as const, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset -1px 0 0 #e8e8e8' },
    filterBtnActive: { backgroundColor: 'transparent', color: '#437ff7', fontWeight: 'bold', boxShadow: 'inset 0 -2px 0 #437ff7, inset -1px 0 0 #e8e8e8' },
    letterRow: { display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '4px 0', borderBottom: '1px solid #f0f0f0' },
    letterCell: { width: '16px', fontWeight: 700, color: '#333' },
    letterList: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: '16px', rowGap: '6px', flex: 1 },
  };

  const isLetterRangeActive = region === 'domestic' && ['ABCDE','FGHIJ','KLMNO','PQRST','UVWXYZ'].includes(filterKey);
  const popupStyle: React.CSSProperties = { ...styles.popup, height: isLetterRangeActive ? '318px' : '265px' };

  return (
    <div ref={containerRef} style={styles.container}>
      <input
        id={id}
        type="text"
        value={inputValue}
        onChange={handleInput}
        onBlur={() => {
          if (selectingRef.current) return;
          const term = inputValue.trim()
          const hasMatch = searchResults.some(r => r.name === term)
          if (term && !hasMatch) {
            setInputValue('')
            onInputChange?.('')
          }
          setIsVisible(false)
          setHasTyped(false)
        }}
        onFocus={() => {
          if (!disabled) {
            setIsVisible(true)
            try { window.dispatchEvent(new CustomEvent('station-dropdown-open', { detail: id })) } catch { /* noop */ }
          }
        }}
        placeholder={placeholder || "请输入城市/拼音"}
        disabled={disabled}
        style={styles.input}
        autoComplete="off"
      />
      
      {isVisible && (
        <div style={popupStyle}>
          {loading ? (
             <div style={{padding: '20px', textAlign: 'center', color: '#999'}}>
               加载中...
             </div>
          ) : hasTyped ? (
            searchResults.length > 0 ? (
              // Search Results Mode
              <div style={styles.searchList}>
                {searchResults.map((item, idx) => (
                  <div 
                    key={`${item.name}-${idx}`}
                    style={styles.searchItem}
                    onMouseDown={(e) => { e.preventDefault(); handleSearchResultClick(item); }}
                    className="hover-bg-blue"
                  >
                    <span>
                      <span style={{color: '#666'}}>
                        {item.name}
                      </span>
                      {item.type === 'station' && <span style={{fontSize: '12px', color: '#999', marginLeft: '4px'}}>({item.cityName})</span>}
                    </span>
                    <span style={{color: '#ccc', fontSize: '12px'}}>{item.pinyin}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{padding: '20px', textAlign: 'center', color: '#999'}}>
                无法匹配任何站点
              </div>
            )
          ) : view === 'station' && selectedCity ? (
            // Station Selection Mode
            <div>
              <div style={styles.header}>
                <span style={styles.backBtn} onClick={() => setView('city')}>&lt; 返回</span>
                <span>选择 {selectedCity.name} 的车站</span>
              </div>
              <div style={styles.stationList}>
                {selectedCity.stations.map(station => (
                  <div 
                    key={station.code}
                    style={styles.stationItem}
                    onMouseDown={(e) => { e.preventDefault(); handleSelectStation(station); }}
                    className="hover-bg-blue"
                  >
                    <span>{station.name}{station.district ? `（${station.district}）` : ''}</span>
                    <span style={{
                      backgroundColor: '#e6f7ff', 
                      color: '#1890ff', 
                      padding: '2px 6px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {station.code}
                    </span>
                    {station.type && (
                      <span style={{
                        backgroundColor: '#fef3c7',
                        color: '#c07a00',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        marginLeft: '6px'
                      }}>
                        {station.type}
                      </span>
                    )}
                    {station.isHot && (
                      <span style={{
                        backgroundColor: '#fde68a',
                        color: '#92400e',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        marginLeft: '6px'
                      }}>
                        热门
                      </span>
                    )}
                    {station.isHub && (
                      <span style={{
                        backgroundColor: '#c7d2fe',
                        color: '#1e3a8a',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        marginLeft: '6px'
                      }}>
                        枢纽
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
             <div style={{padding: '20px', textAlign: 'center', color: '#ff4d4f'}}>
               {error} <button onClick={() => window.location.reload()} style={{marginLeft: 8}}>重试</button>
             </div>
          ) : (
            <div style={styles.layout}>
              <div style={styles.sidebar}>
                <div
                  style={{ ...styles.sideBtn, ...(region === 'domestic' ? styles.sideBtnActive : {}) }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { selectingRef.current = true; setRegion('domestic'); setFilterKey('hot'); setView('city'); setSelectedCity(null); setTimeout(() => { selectingRef.current = false }, 0); }}
                >
                  国内站点
                </div>
                <div
                  style={{ ...styles.sideBtn, ...(region === 'international' ? styles.sideBtnActive : {}) }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { selectingRef.current = true; setRegion('international'); setFilterKey('LAOS'); setView('city'); setSelectedCity(null); setTimeout(() => { selectingRef.current = false }, 0); }}
                >
                  国际站点
                </div>
              </div>
              <div style={styles.rightPane}>
                <div style={styles.hintBar}>拼音支持首字母输入</div>
                <div style={styles.filterBar}>
                  {region === 'domestic' ? (
                    <>
                      {(['热门', 'ABCDE', 'FGHIJ', 'KLMNO', 'PQRST', 'UVWXYZ'] as const).map((label) => (
                        <div
                          key={label}
                          style={{
                            ...styles.filterBtn,
                            ...(filterKey === (label === '热门' ? 'hot' : label) ? styles.filterBtnActive : {}),
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { selectingRef.current = true; setFilterKey(label === '热门' ? 'hot' : label); setTimeout(() => { selectingRef.current = false }, 0); }}
                        >
                          {label}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div
                      style={{
                        ...styles.filterBtn,
                        ...(filterKey === 'LAOS' ? styles.filterBtnActive : {}),
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { selectingRef.current = true; setFilterKey('LAOS'); setTimeout(() => { selectingRef.current = false }, 0); }}
                    >
                      老挝
                    </div>
                  )}
                </div>
                <div style={styles.content} ref={contentRef} data-scroll-container>
                  {region === 'domestic' ? (
                    filterKey === 'hot' ? (
                      <div style={styles.cityGrid}>
                        {getTabContent().map((city) => (
                          <div
                            key={city.name}
                            style={styles.cityItem}
                            onMouseDown={(e) => { e.preventDefault(); handleSelectCity(city); }}
                            onClick={() => { handleSelectCity(city); }}
                            className="hover-text-blue"
                          >
                            {city.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        {(() => {
                          const ranges: Record<'ABCDE' | 'FGHIJ' | 'KLMNO' | 'PQRST' | 'UVWXYZ', string[]> = {
                            ABCDE: ['A', 'B', 'C', 'D', 'E'],
                            FGHIJ: ['F', 'G', 'H', 'J'], // 跳过 I
                            KLMNO: ['K', 'L', 'M', 'N'],   // 跳过 O
                            PQRST: ['P', 'Q', 'R', 'S', 'T'],
                            UVWXYZ: ['W', 'X', 'Y', 'Z'],  // 跳过 U、V
                          };
                          const letters = ranges[filterKey as 'ABCDE' | 'FGHIJ' | 'KLMNO' | 'PQRST' | 'UVWXYZ'] || [];
                          const allStations = cities
                            .filter(c => c.name !== '老挝' && (c.pinyin || '').toLowerCase() !== 'laowo')
                            .flatMap((c) => c.stations);
                          return letters.map((L) => {
                            const list = allStations
                              .filter((s) => String(s.code || '').charAt(0).toUpperCase() === L)
                              .sort((a, b) => (a.name.localeCompare(b.name)));
                            return (
                              <div key={L} style={styles.letterRow}>
                                <div style={styles.letterCell}>{L}</div>
                                <div style={styles.letterList}>
                                  {list.map((station) => (
                                    <div
                                      key={`${L}-${station.name}`}
                                      style={styles.cityItem}
                                      onMouseDown={(e) => { e.preventDefault(); handleSelectStation(station); }}
                                      onClick={() => { handleSelectStation(station); }}
                                      className="hover-text-blue"
                                    >
                                      {station.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )
                  ) : (
                    <div>
                      {getTabContent().length === 0 ? (
                        <div style={{ color: '#999', width: '100%', textAlign: 'center', padding: '20px' }}>暂无数据</div>
                      ) : (
                    getTabContent().map((city) => (
                          <div key={city.name}>
                            <div style={styles.stationList}>
                              {city.stations.map((st) => (
                                <div
                                  key={st.name}
                                  style={styles.stationItem}
                                  onMouseDown={(e) => { e.preventDefault(); handleSelectStation(st); }}
                                  onClick={() => { handleSelectStation(st); }}
                                >
                                  <span style={{ color: '#666' }}>{st.name}</span>
                                  <span style={{ backgroundColor: '#e6f7ff', color: '#1890ff', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>{st.code}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <style>{`
        .hover-bg-blue:hover { background-color: #f0f7ff; color: #437ff7; }
        .hover-text-blue:hover { color: #437ff7; background-color: #f0f7ff; }
      `}</style>
    </div>
  );
};
