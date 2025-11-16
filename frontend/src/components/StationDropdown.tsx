import React, { useState, useEffect, useRef } from 'react';
import { getStations } from '../api/station';
import { Station } from '../types/station';

interface StationDropdownProps {
  value: string;
  onSelectStation: (stationName: string) => void;
  placeholder?: string;
}

const styles = {
  container: { position: 'relative' as const },
  input: { padding: '10px', width: '100%', boxSizing: 'border-box' },
  dropdown: { border: '1px solid #ccc', backgroundColor: 'white', position: 'absolute' as const, zIndex: 1, width: '100%' },
  dropdownItem: { padding: '10px', cursor: 'pointer' },
  noMatch: { padding: '10px', color: '#999' }
};

const StationDropdown: React.FC<StationDropdownProps> = ({ value, onSelectStation, placeholder }) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getStations();
        setStations(data);
      } catch (error) {
        console.error('Failed to fetch stations', error);
      }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setInputValue(term);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (term) {
        setFilteredStations(
          stations.filter(station =>
            station.name.toLowerCase().includes(term.toLowerCase()) ||
            station.pinyin.toLowerCase().includes(term.toLowerCase())
          )
        );
        setIsDropdownVisible(true);
      } else {
        setFilteredStations([]);
        setIsDropdownVisible(false);
      }
    }, 300);
  };

    const handleStationSelect = (station: Station) => {
    setInputValue(station.name);
    onSelectStation(station.name);
    setIsDropdownVisible(false);
  };

  const handleBlur = () => {
    const match = stations.find(station => station.name.toLowerCase() === inputValue.toLowerCase());
    if (!match) {
      setInputValue('');
      onSelectStation('');
    }
    setTimeout(() => setIsDropdownVisible(false), 200); // Delay to allow click
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsDropdownVisible(true)}
        onBlur={handleBlur}
        placeholder={placeholder || "出发地"}
        style={styles.input}
      />
      {isDropdownVisible && (
        <div style={styles.dropdown}>
          {filteredStations.length > 0 ? (
            filteredStations.map(station => (
              <div key={station.id} onMouseDown={() => handleStationSelect(station)} style={styles.dropdownItem}>
                {station.name}
              </div>
            ))
          ) : (
            <div style={styles.noMatch}>无法匹配任何站点</div>
          )}
        </div>
      )}
    </div>
  );
};

export { StationDropdown };