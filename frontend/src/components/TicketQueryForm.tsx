import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StationDropdown } from './StationDropdown';
import { DatePicker } from './DatePicker';
import './TicketQueryForm.css';

interface FormValues {
  fromStation: string;
  toStation: string;
  selectedDate: string;
  tripType: 'one-way' | 'round-trip';
  returnDate: string;
}

interface FormErrors {
  fromStation: string;
  toStation: string;
  selectedDate: string;
  returnDate: string;
}

type TicketQueryFormProps = {
  initialDate?: string;
};

export const TicketQueryForm: React.FC<TicketQueryFormProps> = ({ initialDate }) => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<FormValues>({
    fromStation: '',
    toStation: '',
    selectedDate: initialDate ?? '',
    tripType: 'one-way',
    returnDate: initialDate ?? '',
  });

  const [errors, setErrors] = useState<FormErrors>({ 
    fromStation: '',
    toStation: '',
    selectedDate: '',
    returnDate: ''
  });

  const handleSwap = () => {
    setFormValues((prev: FormValues) => ({
      ...prev,
      fromStation: prev.toStation,
      toStation: prev.fromStation,
    }));
    setErrors((prev: FormErrors) => ({ ...prev, fromStation: '', toStation: '' }));
  };

  const validate = () => {
    const newErrors: FormErrors = { fromStation: '', toStation: '', selectedDate: '', returnDate: '' };
    let isValid = true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formValues.fromStation) {
      newErrors.fromStation = '❗请输入出发地';
      isValid = false;
    }
    if (!formValues.toStation) {
      newErrors.toStation = '❗请输入到达地';
      isValid = false;
    }
    if (formValues.fromStation && formValues.toStation && formValues.fromStation === formValues.toStation) {
      newErrors.toStation = '❗出发地和目的地不能相同';
      isValid = false;
    }

    if (!formValues.selectedDate) {
      newErrors.selectedDate = '❗请输入出发日期';
      isValid = false;
    } else {
       const selected = new Date(formValues.selectedDate);
       selected.setHours(0, 0, 0, 0);
       if (selected < today) {
         newErrors.selectedDate = '❗无效日期：早于当前日期';
         isValid = false;
       }
    }

    if (formValues.tripType === 'round-trip' && !formValues.returnDate) {
      newErrors.returnDate = '❗请输入返程日期';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleQuery = () => {
    if (!validate()) {
      return;
    }
    
    const params = new URLSearchParams();
    params.set('from', formValues.fromStation);
    params.set('to', formValues.toStation);
    params.set('date', formValues.selectedDate);
    
    if (formValues.tripType === 'round-trip') {
      params.set('returnDate', formValues.returnDate);
    }
    
    navigate(`/tickets?${params.toString()}`);
  };

  return (
    <div className="form-container">
      <div className="tabs">
        <div className="tab active">车票</div>
      </div>
      <div className="form-content">
        <div className="form-row" style={{ marginBottom: '15px' }}>
           <label style={{ marginRight: '15px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
             <input 
               type="radio" 
               name="tripType" 
               checked={formValues.tripType === 'one-way'} 
               onChange={() => setFormValues(prev => ({ ...prev, tripType: 'one-way' }))}
               style={{ marginRight: '5px' }}
             /> 单程
           </label>
           <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
             <input 
               type="radio" 
               name="tripType" 
               checked={formValues.tripType === 'round-trip'} 
               onChange={() => setFormValues(prev => ({ ...prev, tripType: 'round-trip' }))}
               style={{ marginRight: '5px' }}
             /> 往返
           </label>
        </div>
        <div className="form-row-vertical">
          <label htmlFor="fromStation">出发地</label>
          <div className="input-group">
            <StationDropdown
              id="fromStation"
              selectCityAsFinal
              onSelectStation={(station) => {
                setFormValues((prev: FormValues) => ({ ...prev, fromStation: station }));
                setErrors((prev: FormErrors) => ({ ...prev, fromStation: '' }));
              }}
              onInputChange={(term) => {
                setFormValues((prev: FormValues) => ({ ...prev, fromStation: term }));
                setErrors((prev: FormErrors) => ({ ...prev, fromStation: '' }));
              }}
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
              selectCityAsFinal
              onSelectStation={(station) => {
                setFormValues((prev: FormValues) => ({ ...prev, toStation: station }));
                setErrors((prev: FormErrors) => ({ ...prev, toStation: '' }));
              }}
              onInputChange={(term) => {
                setFormValues((prev: FormValues) => ({ ...prev, toStation: term }));
                setErrors((prev: FormErrors) => ({ ...prev, toStation: '' }));
              }}
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
              onDateSelect={(date) =>
                setFormValues((prev: FormValues) => {
                   const updates: Partial<FormValues> = { selectedDate: date };
                   if (prev.tripType === 'round-trip' && date > prev.returnDate) {
                     updates.returnDate = date;
                   }
                   return { ...prev, ...updates };
                })
              }
              value={formValues.selectedDate}
            />
            {errors.selectedDate && <span className="error-span">{errors.selectedDate}</span>}
          </div>
        </div>
        {formValues.tripType === 'round-trip' && (
          <div className="form-row-vertical">
            <label htmlFor="returnDate">返程日期</label>
            <div className="input-group">
              <DatePicker
                id="returnDate"
                onDateSelect={(date) =>
                  setFormValues((prev: FormValues) => ({ ...prev, returnDate: date }))
                }
                value={formValues.returnDate}
                minDate={formValues.selectedDate}
              />
              {errors.returnDate && <span className="error-span">{errors.returnDate}</span>}
            </div>
          </div>
        )}
        <button onClick={handleSwap} className="swap-button" title="交换出发地和目的地">
          ↔
        </button>
        <div className="form-row">
          <div className="checkbox-group">
            <label>
              <input type="checkbox" /> 高铁/动车
            </label>
          </div>
        </div>
        <div className="form-row">
          <button onClick={handleQuery} className="query-button">
            查询
          </button>
        </div>
      </div>
    </div>
  );
};
