import React, { useState } from 'react';
import { StationDropdown } from './StationDropdown';
import { DatePicker } from './DatePicker';

const styles = {
  formContainer: { padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white' },
  queryRow: { display: 'flex', alignItems: 'center', marginBottom: '15px' },
  errorSpan: { color: 'red', marginLeft: '10px' },
  swapButton: { padding: '10px' },
  queryButton: { padding: '10px 20px', marginLeft: '10px', backgroundColor: 'orange', color: 'white', border: 'none' },
  checkboxLabel: { marginRight: '15px' }
};

const TicketQueryForm = () => {
  const [formValues, setFormValues] = useState({
    fromStation: '',
    toStation: '',
    selectedDate: ''
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
    <div style={styles.formContainer}>
      <div style={styles.queryRow}>
        <StationDropdown 
          onSelectStation={(station) => setFormValues(prev => ({ ...prev, fromStation: station }))} 
          value={formValues.fromStation} 
          placeholder="出发地" 
        />
        {errors.fromStation && <span style={styles.errorSpan}>{errors.fromStation}</span>}
        <button onClick={handleSwap} style={styles.swapButton}>交换</button>
        <StationDropdown 
          onSelectStation={(station) => setFormValues(prev => ({ ...prev, toStation: station }))} 
          value={formValues.toStation} 
          placeholder="目的地" 
        />
        {errors.toStation && <span style={styles.errorSpan}>{errors.toStation}</span>}
        <DatePicker onDateSelect={(date) => setFormValues(prev => ({ ...prev, selectedDate: date }))} />
        {errors.selectedDate && <span style={styles.errorSpan}>{errors.selectedDate}</span>}
        <button onClick={handleQuery} style={styles.queryButton}>查询</button>
      </div>
      <div>
        <label style={styles.checkboxLabel}><input type="checkbox" /> 学生</label>
        <label><input type="checkbox" /> 只看高铁/动车</label>
      </div>
    </div>
  );
};

export { TicketQueryForm };