
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useTicketContext } from '../../context/TicketContext';
import { TicketSearchParams } from '../../services/ticketService';
import './SearchForm.css'; // Will create this css

// Mock station list for autocomplete
const STATION_LIST = ['上海', '上海虹桥', '北京', '北京南', '杭州', '南京', '广州'];

const SearchForm: React.FC = () => {
  const { searchTickets, searchParams } = useTicketContext();
  const [fromStation, setFromStation] = useState(searchParams.from_station || '上海');
  const [toStation, setToStation] = useState(searchParams.to_station || '北京');
  const [date, setDate] = useState<Date>(searchParams.date ? new Date(searchParams.date) : new Date());

  const handleStationChange = (val: string, type: 'from' | 'to') => {
    if (type === 'from') {
      setFromStation(val);
    } else {
      setToStation(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: TicketSearchParams = {
      from_station: fromStation,
      to_station: toStation,
      date: date.toISOString().split('T')[0],
      // Preserve existing filters or reset? 
      // Usually "Search" button implies new search, so reset filters.
      // But we removed train_type inputs from here, so we don't send them.
      // If we want to keep filters, we merge.
      // But usually changing From/To implies reset.
      // So we just send From/To/Date.
    };
    searchTickets(params);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="from-station-input">出发地</label>
        <input 
          id="from-station-input"
          type="text" 
          value={fromStation} 
          onChange={(e) => handleStationChange(e.target.value, 'from')}
          list="from-stations"
        />
        <datalist id="from-stations">
          {STATION_LIST.map(s => <option key={s} value={s} />)}
        </datalist>
      </div>

      <div className="form-group">
        <label htmlFor="to-station-input">目的地</label>
        <input 
          id="to-station-input"
          type="text" 
          value={toStation} 
          onChange={(e) => handleStationChange(e.target.value, 'to')}
          list="to-stations"
        />
        <datalist id="to-stations">
          {STATION_LIST.map(s => <option key={s} value={s} />)}
        </datalist>
      </div>

      <div className="form-group">
        <label>出发日期</label>
        <DatePicker selected={date} onChange={(date: Date | null) => date && setDate(date)} dateFormat="yyyy-MM-dd" />
      </div>

      <button type="submit" className="search-btn">查询</button>
    </form>
  );
};

export default SearchForm;
