import React, { useState } from 'react';
import { StationDropdown } from './StationDropdown';
import { DatePicker } from './DatePicker';
import './TicketQueryForm.css';

const TicketQueryForm = () => {
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formValues, setFormValues] = useState({
    fromStation: '',
    toStation: '',
    selectedDate: getToday()
  });

  const [errors, setErrors] = useState({
    fromStation: '',
    toStation: '',
    selectedDate: ''
  });

  const handleSwap = () => {
    setFormValues(prev => ({
      ...prev,
      fromStation: prev.toStation,
      toStation: prev.fromStation
    }));
    setErrors(prev => ({ ...prev, fromStation: '', toStation: '' }));
  };

  const validate = () => {
    const newErrors = { fromStation: '', toStation: '', selectedDate: '' };
    let isValid = true;

    if (!formValues.fromStation) {
      newErrors.fromStation = '❗请输入出发地';
      isValid = false;
    }
    if (!formValues.toStation) {
      newErrors.toStation = '❗请输入到达地';
      isValid = false;
    }
    if (!formValues.selectedDate) {
      newErrors.selectedDate = '❗请输入出发日期';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleQuery = () => {
    if (!validate()) {
      return;
    }
    // Proceed with query
  };

  return (
    <div className="form-container">
      <div className="tabs">
        <div className="tab active">车票</div>
      </div>
      <div className="form-content">
        <div className="form-row-vertical">
          <label htmlFor="fromStation">出发地</label>
          <div className="input-group">
            <StationDropdown 
              id="fromStation"
              onSelectStation={(station) => setFormValues(prev => ({ ...prev, fromStation: station }))} 
              value={formValues.fromStation}
            />
            {errors.fromStation && <span className="error-span">{errors.fromStation}</span>}
          </div>
        </div>
        <div className="form-row-vertical">
          <label htmlFor="toStation">到达地</label>
          <div className="input-group">
            <StationDropdown 
              id="toStation"
              onSelectStation={(station) => setFormValues(prev => ({ ...prev, toStation: station }))} 
              value={formValues.toStation}
            />
            {errors.toStation && <span className="error-span">{errors.toStation}</span>}
          </div>
        </div>
        <div className="form-row-vertical">
          <label htmlFor="selectedDate">出发日期</label>
          <div className="input-group">
            <DatePicker 
              id="selectedDate"
              onDateSelect={(date) => setFormValues(prev => ({ ...prev, selectedDate: date }))} 
              defaultDate={formValues.selectedDate} 
            />
            {errors.selectedDate && <span className="error-span">{errors.selectedDate}</span>}
          </div>
        </div>
        <button onClick={handleSwap} className="swap-button" title="交换出发地和目的地">↔</button>
        <div className="form-row">
          <div className="checkbox-group">
            <label><input type="checkbox" /> 高铁/动车</label>
          </div>
        </div>
        <div className="form-row">
          <button onClick={handleQuery} className="query-button">查询</button>
        </div>
      </div>
    </div>
  );
};

export { TicketQueryForm };