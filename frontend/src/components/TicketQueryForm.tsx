import React, { useState } from 'react';

interface TicketQueryData {
  departure: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengerType: string;
}

interface TicketQueryFormProps {
  onQuerySubmit?: (queryData: TicketQueryData) => void;
}

const TicketQueryForm: React.FC<TicketQueryFormProps> = ({
  onQuerySubmit = () => {}
}) => {
  const [queryData, setQueryData] = useState<TicketQueryData>({
    departure: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengerType: 'adult'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQueryData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的错误信息
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 验证必填字段
    if (!queryData.departure.trim()) {
      newErrors.departure = '请输入出发地';
    }

    if (!queryData.destination.trim()) {
      newErrors.destination = '请输入目的地';
    }

    if (!queryData.departureDate) {
      newErrors.departureDate = '请选择出发日期';
    }

    // 验证出发地和目的地不能相同
    if (queryData.departure.trim() && queryData.destination.trim() && 
        queryData.departure.trim() === queryData.destination.trim()) {
      newErrors.destination = '出发地和目的地不能相同';
    }

    // 验证出发日期不能是过去的日期
    if (queryData.departureDate) {
      const departureDate = new Date(queryData.departureDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (departureDate < today) {
        newErrors.departureDate = '出发日期不能是过去的日期';
      }
    }

    // 验证返程日期
    if (queryData.returnDate && queryData.departureDate) {
      const departureDate = new Date(queryData.departureDate);
      const returnDate = new Date(queryData.returnDate);
      
      if (returnDate < departureDate) {
        newErrors.returnDate = '返程日期不能早于出发日期';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 调用查询回调
      await onQuerySubmit(queryData);
    } catch (error) {
      console.error('Query submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwapStations = () => {
    setQueryData(prev => ({
      ...prev,
      departure: prev.destination,
      destination: prev.departure
    }));
    
    // 清除相关错误信息
    setErrors(prev => ({
      ...prev,
      departure: '',
      destination: ''
    }));
  };

  return (
    <div className="ticket-query-form">
      <h3>车票查询</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="departure">出发地</label>
            <input
              type="text"
              id="departure"
              name="departure"
              value={queryData.departure}
              onChange={handleInputChange}
              placeholder="请输入出发城市"
              disabled={isSubmitting}
              required
            />
            {errors.departure && <span className="error">{errors.departure}</span>}
          </div>
          
          <button 
            type="button" 
            className="swap-button"
            onClick={handleSwapStations}
            disabled={isSubmitting}
            title="交换出发地和目的地"
          >
            ⇄
          </button>
          
          <div className="form-group">
            <label htmlFor="destination">目的地</label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={queryData.destination}
              onChange={handleInputChange}
              placeholder="请输入目的城市"
              disabled={isSubmitting}
              required
            />
            {errors.destination && <span className="error">{errors.destination}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="departureDate">出发日期</label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={queryData.departureDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              disabled={isSubmitting}
              required
            />
            {errors.departureDate && <span className="error">{errors.departureDate}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="trainType">车次类型</label>
            <select
              id="trainType"
              name="trainType"
              value={queryData.passengerType}
              onChange={handleInputChange}
              disabled={isSubmitting}
            >
              <option value="">全部</option>
              <option value="G">高速动车组(G)</option>
              <option value="D">动车组(D)</option>
              <option value="C">城际动车组(C)</option>
              <option value="Z">直达特快(Z)</option>
              <option value="T">特快(T)</option>
              <option value="K">快速(K)</option>
            </select>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="query-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? '查询中...' : '查询车票'}
        </button>
      </form>
    </div>
  );
};

export default TicketQueryForm;