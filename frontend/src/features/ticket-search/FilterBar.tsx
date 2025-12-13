import React, { useState, useEffect, useCallback } from 'react';
import { useTicketContext } from '../../context/TicketContext';
import './FilterBar.css';

const TRAIN_TYPES = ['G', 'D', 'Z', 'T', 'K'];
const TIME_PERIODS = [
  { label: '凌晨 (00-06)', min: '00:00', max: '06:00' },
  { label: '上午 (06-12)', min: '06:00', max: '12:00' },
  { label: '下午 (12-18)', min: '12:00', max: '18:00' },
  { label: '晚上 (18-24)', min: '18:00', max: '24:00' }
];

const FilterBar: React.FC = () => {
  const { searchParams, searchTickets } = useTicketContext();
  
  // Local state to manage UI controls before applying
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(''); // Single selection for simplicity first, or multi? User said "Departure Time (Morning/Afternoon...)"
  // Let's support multiple periods? The backend supports one range.
  // If user selects "Morning" AND "Afternoon", backend needs to handle multiple ranges or we just map to min=06, max=18.
  // Let's assume single selection for time period to match backend "min/max" simple logic, or logic to merge.
  // If I select Morning and Afternoon, min=06:00, max=18:00.
  // I will use a set of selected indices.

  const [priceMin, setPriceMin] = useState<number>(50);
  const [priceMax, setPriceMax] = useState<number>(1500);
  const [durationMax, setDurationMax] = useState<number>(12);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  const handleApply = useCallback(() => {
    // Construct params
    const params = { ...searchParams };
    
    // Train Type
    if (selectedTypes.length > 0) {
      params.train_type = selectedTypes.join(',');
    } else {
      delete params.train_type;
    }

    // Only Available
    if (onlyAvailable) {
      params.only_available = true;
    } else {
      delete params.only_available;
    }

    // Time Period
    // Logic: If multiple selected, find global min and max? 
    // Or just pass the specific period logic. 
    // For simplicity, let's say we support selecting ONE period or a custom range.
    // Actually, merging ranges is fine: 06-12 + 12-18 = 06-18.
    // What if 06-12 + 18-24? 06-24? That includes afternoon.
    // Backend supports simple min/max.
    // I'll stick to single period selection for now, or just send min/max of the selected option.
    if (selectedPeriod) {
      const period = TIME_PERIODS.find(p => p.label === selectedPeriod);
      if (period) {
        params.dep_time_min = period.min;
        params.dep_time_max = period.max;
      }
    } else {
      delete params.dep_time_min;
      delete params.dep_time_max;
    }

    // Price
    params.price_min = priceMin;
    params.price_max = priceMax;

    // Duration
    params.duration_max = durationMax;

    searchTickets(params);
  }, [searchParams, selectedTypes, selectedPeriod, priceMin, priceMax, durationMax, onlyAvailable, searchTickets]);

  // Debounce apply
  const applyFilters = useCallback(() => {
    handleApply();
  }, [handleApply]);

  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 500);
    return () => clearTimeout(timer);
  }, [applyFilters, selectedTypes, selectedPeriod, priceMin, priceMax, durationMax, onlyAvailable]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <h3>车座类型</h3>
        <div className="checkbox-group">
          {TRAIN_TYPES.map(type => (
            <label key={type}>
              <input 
                type="checkbox" 
                checked={selectedTypes.includes(type)}
                onChange={() => toggleType(type)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>出发时段</h3>
        <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
          <option value="">不限</option>
          {TIME_PERIODS.map(p => (
            <option key={p.label} value={p.label}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <h3>价格区间 (¥{priceMin} - ¥{priceMax})</h3>
        <div className="range-inputs">
           <input 
             type="range" 
             min="50" 
             max="1500" 
             value={priceMin} 
             onChange={(e) => setPriceMin(Number(e.target.value))}
           />
           <input 
             type="range" 
             min="50" 
             max="1500" 
             value={priceMax} 
             onChange={(e) => setPriceMax(Number(e.target.value))}
           />
        </div>
      </div>

      <div className="filter-group">
        <h3>最大历时 ({durationMax}小时)</h3>
        <input 
          type="range" 
          min="1" 
          max="12" 
          value={durationMax} 
          onChange={(e) => setDurationMax(Number(e.target.value))}
        />
      </div>

      <div className="filter-group checkbox-single">
        <label>
          <input 
            type="checkbox" 
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          只看有票
        </label>
      </div>
    </div>
  );
};

export default FilterBar;
