import { useState } from 'react';

interface DatePickerProps {
  onDateSelect: (date: string) => void;
  defaultDate?: string;
  id?: string;
  value?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateSelect, defaultDate, id, value }) => {
  const [selectedDate, setSelectedDate] = useState<string>(value ?? defaultDate ?? '');

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    onDateSelect(newDate);
  };

  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <input
      type="date"
      value={selectedDate}
      onChange={handleDateChange}
      min={getToday()}
      style={{ padding: '10px' }}
      data-testid="date-picker-input"
      id={id}
    />
  );
};

export { DatePicker };
