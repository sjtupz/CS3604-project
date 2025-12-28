import { useState } from 'react';

interface DatePickerProps {
  onDateSelect: (date: string) => void;
  defaultDate?: string;
  id?: string;
  value?: string;
  width?: number;
  minDate?: string;
  maxDate?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateSelect, defaultDate, value, id, width, minDate, maxDate }) => {
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(value ?? defaultDate ?? getToday());

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    onDateSelect(newDate);
  };

  return (
    <input
      id={id}
      type="date"
      value={value !== undefined ? value : selectedDate}
      onChange={handleDateChange}
      min={minDate ?? getToday()}
      max={maxDate}
      style={{ padding: '10px', width: width ? `${width}px` : undefined, flexShrink: 0 }}
      data-testid="date-picker-input"
    />
  );
};

export { DatePicker };
