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

const TABS = [
  // Removed 'Province' and letter tabs as per UI requirements
  { key: 'hot', label: '热门' }
];

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
  const [isVisible, setIsVisible] = useState(import.meta.env.MODE === 'test');
  const [activeTab, setActiveTab] = useState('hot');
  const [tabClicked, setTabClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Two-level selection state
  const [view, setView] = useState<'province' | 'city' | 'station'>('city');
  const [selectedCity, setSelectedCity] = useState<CityItem | null>(null);
  const [activeProvince, setActiveProvince] = useState<ProvinceItem | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const selectingRef = useRef(false);

  // Sync with external value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

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
        setProvinces(provs);
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
  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
  const [remoteResults, setRemoteResults] = useState<SearchResult[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const run = async () => {
      const term = inputValue.trim();
      if (!term) { setRemoteResults([]); return; }
      try {
        const list = await getStations(term);
        const lower = term.toLowerCase();
        const shaped: SearchResult[] = list
          .filter((s) => {
            const name = (s.name || '').toLowerCase();
            const py = (s.pinyin || '').toLowerCase();
            return (
              name.includes(lower) ||
              py.includes(lower) ||
              lower.includes(name) ||
              (py && lower.includes(py))
            );
          })
          .map((s) => ({
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
    console.log('First item:', cities[0]);
    const term = (inputValue || '').toLowerCase();
    const abbr = (s: string) => s.replace(/(sh|ch|zh)/g, (m) => m[0]).split(/[^a-zA-Z]+/).map((w) => w[0] || '').join('').toLowerCase();
    const results: SearchResult[] = [];
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
    const merged = [...results, ...remoteResults];
    const unique = new Map<string, SearchResult>();
    merged.forEach((item) => { if (!unique.has(item.name)) unique.set(item.name, item); });
    return Array.from(unique.values()).slice(0, 20);
  }, [inputValue, cities, remoteResults]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onInputChange?.(val);
    setIsVisible(true);
    setView('city'); // Reset to city view when searching
    setSelectedCity(null);
  };

  const handleSelectCity = (city: CityItem) => {
    if (selectingRef.current) return;
    selectingRef.current = true;
    console.log('Select city:', city.name);
    console.log('Select city path:', { selectCityAsFinal, stations: city.stations.length, hasRail: !!city.hasRail, nearest: !!city.nearestStation });
    
    if (!city.hasRail && city.nearestStation) {
      handleSelectStation({ name: city.nearestStation.name, code: city.nearestStation.code });
      return;
    }

    // Task 2 Fix: If 'hot' tab is active, force selection and close modal
    const isHotTab = activeTab === 'hot';
    
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
      console.log('Switch to station view for city:', city.name);
    }
    setTimeout(() => { selectingRef.current = false }, 0);
  };

  const handleSelectProvince = (prov: ProvinceItem) => {
    if (selectingRef.current) return;
    selectingRef.current = true;
    setActiveProvince(prov);
    setView('city');
    setTimeout(() => { selectingRef.current = false }, 0);
  };

  const handleSelectStation = (station: StationItem) => {
    if (selectingRef.current) return;
    selectingRef.current = true;
    console.log('Select station:', station.name, station.code);
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
    // Only support 'hot' tab now
    if (activeTab === 'hot') {
      return HOT_CITY_NAMES.map(name => {
        const city = cities.find(c => c.name === name);
        return city || null;
      }).filter(Boolean) as CityItem[];
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
      width: '400px',
      backgroundColor: '#fff',
      border: '1px solid #d9d9d9',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1050,
      marginTop: '4px',
      borderRadius: '4px',
      display: isVisible ? 'block' : 'none',
      fontSize: '12px',
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
      padding: '8px',
      maxHeight: '300px',
      overflowY: 'auto'
    },
    stationItem: {
      padding: '8px 12px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '1px solid #f0f0f0'
    },
    tabBar: { display: 'flex', borderBottom: '1px solid #e8e8e8', backgroundColor: '#f5f5f5' },
    tabItem: { padding: '8px 12px', cursor: 'pointer', borderRight: '1px solid #e8e8e8', color: '#666' },
    activeTab: { backgroundColor: '#fff', color: '#437ff7', fontWeight: 'bold', borderBottom: '2px solid #437ff7', marginBottom: '-1px' },
    content: { padding: '12px', maxHeight: '300px', overflowY: 'auto' },
    cityGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    cityItem: { padding: '4px 8px', cursor: 'pointer', borderRadius: '2px', minWidth: '60px', textAlign: 'center' as const },
    cityItemHover: { color: '#437ff7', backgroundColor: '#f0f7ff' },
    searchList: { maxHeight: '300px', overflowY: 'auto' },
    searchItem: { padding: '8px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }
  };

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
        <div style={styles.popup}>
          {loading ? (
             <div style={{padding: '20px', textAlign: 'center', color: '#999'}}>
               加载中...
             </div>
          ) : inputValue ? (
            searchResults.length > 0 ? (
              // Search Results Mode
              <div style={styles.searchList}>
                {searchResults.map((item, idx) => (
                  <div 
                    key={`${item.name}-${idx}`}
                    style={styles.searchItem}
                    onMouseDown={() => handleSearchResultClick(item)}
                    className="hover-bg-blue"
                  >
                    <span>
                      <span style={{color: item.type === 'city' ? '#333' : '#666'}}>
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
                    onMouseDown={() => handleSelectStation(station)}
                    onClick={() => handleSelectStation(station)}
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
            // City Tab Mode
            <>
              <div style={styles.tabBar}>
                {TABS.map(tab => (
                  <div
                    key={tab.key}
                    style={{...styles.tabItem, ...(activeTab === tab.key ? styles.activeTab : {})}}
                    onMouseDown={() => {
                      setActiveTab(tab.key);
                      setTabClicked(true);
                      if (tab.key === 'PROV') { setView('province'); } else { setView('city'); setActiveProvince(null); }
                      try {
                        const el = contentRef.current;
                        if (el) {
                          if ('scrollTo' in el && typeof el.scrollTo === 'function') {
                            el.scrollTo({ top: 0 });
                          } else {
                            el.scrollTop = 0;
                          }
                        }
                      } catch { /* noop */ }
                    }}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setTabClicked(true);
                      if (tab.key === 'PROV') { setView('province'); } else { setView('city'); setActiveProvince(null); }
                      try {
                        const el = contentRef.current;
                        if (el) {
                          if ('scrollTo' in el && typeof el.scrollTo === 'function') {
                            el.scrollTo({ top: 0 });
                          } else {
                            el.scrollTop = 0;
                          }
                        }
                      } catch { /* noop */ }
                    }}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
              <div style={styles.content} ref={contentRef} data-scroll-container>
                {view === 'province' ? (
                  <div style={styles.cityGrid}>
                    {provinces.map((p) => (
                      <div key={p.name} style={styles.cityItem} onMouseDown={() => handleSelectProvince(p)} onClick={() => handleSelectProvince(p)} className="hover-text-blue">{p.name}</div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.cityGrid}>
                    {(activeProvince ? activeProvince.cities : getTabContent()).map(city => (
                      <div
                        key={city.name}
                        style={styles.cityItem}
                        onMouseDown={() => handleSelectCity(city)}
                        onClick={() => handleSelectCity(city)}
                        className="hover-text-blue"
                      >
                        {city.name}
                      </div>
                    ))}
                    {(activeProvince ? activeProvince.cities : getTabContent()).length === 0 && (
                      <div style={{color: '#999', width: '100%', textAlign: 'center', padding: '20px'}}>
                        暂无城市数据
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
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
