import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrains, TrainListItem } from '../api/trains';
import './DataPreviewPage.css';

const DataPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [shToSzTrains, setShToSzTrains] = useState<TrainListItem[]>([]);
  const [szToShTrains, setSzToShTrains] = useState<TrainListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'departureTime' | 'price'>('departureTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [currentRoute, setCurrentRoute] = useState<{from: string, to: string}>({ from: '上海', to: '苏州' });
  
  const PRESET_ROUTES = [
    { from: '上海', to: '苏州', label: '上海 ⇌ 苏州' },
    { from: '北京', to: '上海', label: '北京 ⇌ 上海' },
    { from: '广州', to: '深圳', label: '广州 ⇌ 深圳' },
    { from: '成都', to: '西安', label: '成都 ⇌ 西安' },
    { from: '杭州', to: '上海', label: '杭州 ⇌ 上海' },
    { from: '武汉', to: '广州', label: '武汉 ⇌ 广州' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];

        const [shRes, szRes] = await Promise.all([
          getTrains({ from: currentRoute.from, to: currentRoute.to, date: dateStr }),
          getTrains({ from: currentRoute.to, to: currentRoute.from, date: dateStr })
        ]);

        if (shRes.code === 200) {
          setShToSzTrains(shRes.data.items);
        } else {
          throw new Error(`Failed to fetch ${currentRoute.from} -> ${currentRoute.to} trains`);
        }

        if (szRes.code === 200) {
          setSzToShTrains(szRes.data.items);
        } else {
          throw new Error(`Failed to fetch ${currentRoute.to} -> ${currentRoute.from} trains`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentRoute]);

  const getLowestPrice = (train: TrainListItem): number => {
    const price = (train as unknown as Record<string, unknown>).price
    return typeof price === 'number' ? price : 0
  };

  const sortTrains = (trains: TrainListItem[]) => {
    return [...trains].sort((a, b) => {
      if (sortBy === 'departureTime') {
        return sortOrder === 'asc' 
          ? a.departureTime.localeCompare(b.departureTime)
          : b.departureTime.localeCompare(a.departureTime);
      } else {
        const priceA = getLowestPrice(a);
        const priceB = getLowestPrice(b);
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      }
    });
  };

  const handleBook = (train: TrainListItem) => {
    // Navigate to tickets page with pre-filled filters
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    navigate(`/tickets?from=${train.departureStation}&to=${train.arrivalStation}&date=${dateStr}`);
  };

  const handleGoToFullList = (from: string, to: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    navigate(`/tickets?from=${from}&to=${to}&date=${dateStr}`);
  };

  const renderTrainList = (title: string, trains: TrainListItem[], isReturn: boolean = false) => (
    <div className="train-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{title}</h3>
        <button 
          className="book-btn" 
          style={{ background: '#28a745', fontSize: '0.8em', padding: '4px 8px' }}
          onClick={() => handleGoToFullList(
              isReturn ? currentRoute.to : currentRoute.from, 
              isReturn ? currentRoute.from : currentRoute.to
          )}
        >
          在车次列表页查看 &gt;
        </button>
      </div>
      <div className="train-list">
        {sortTrains(trains).map((train) => (
          <div key={train.trainNumber} className="train-card">
            <div className="train-header">
              <span className="train-number">{train.trainNumber}</span>
              <span className="train-route">
                {train.departureStation} <span className="arrow">→</span> {train.arrivalStation}
              </span>
            </div>
            <div className="train-times">
              <div className="time-block">
                <span className="time">{train.departureTime}</span>
                <span className="label">出发</span>
              </div>
              <div className="duration">
                <span className="duration-line"></span>
                <span>{train.duration}</span>
              </div>
              <div className="time-block">
                <span className="time">{train.arrivalTime}</span>
                <span className="label">到达</span>
              </div>
            </div>
            <div className="train-seats">
              {Object.entries(train.seatAvailability || {}).map(([type, info]) => {
                const basePrice = getLowestPrice(train)
                const priceText = (() => {
                  if (!basePrice) return ''
                  if (type === '二等座') return `¥${basePrice}`
                  if (type === '一等座') return `¥${Math.ceil(basePrice * 1.6)}`
                  if (type === '商务座') return `¥${Math.ceil(basePrice * 3.0)}`
                  if (type === '无座') return `¥${basePrice}`
                  return ''
                })()

                return (
                 info.hasSeatType && (
                  <div key={type} className="seat-item">
                    <span className="seat-type">{type}</span>
                    <span className={`seat-count ${info.remaining === 0 ? 'no-stock' : ''}`}>
                      {info.remaining === null ? '有票' : `${info.remaining}张`}
                    </span>
                    <span className="seat-price">
                        {priceText}
                    </span>
                  </div>
                 )
                )
              })}
            </div>
            <div className="train-action">
              <button className="book-btn" onClick={() => handleBook(train)}>立即预订</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="data-preview-page">
      <div className="page-header">
        <h1>车票数据预览</h1>
        <div className="controls">
          <label style={{ marginRight: '20px' }}>
            选择路线: 
            <select 
              value={`${currentRoute.from}-${currentRoute.to}`} 
              onChange={(e) => {
                  const [f, t] = e.target.value.split('-');
                  setCurrentRoute({ from: f, to: t });
              }}
              style={{ marginLeft: '5px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {PRESET_ROUTES.map(r => (
                  <option key={`${r.from}-${r.to}`} value={`${r.from}-${r.to}`}>{r.label}</option>
              ))}
            </select>
          </label>

          <label>
            排序方式: 
            <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value === 'price' ? 'price' : 'departureTime')}
                style={{ marginLeft: '5px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '5px' }}
            >
              <option value="departureTime">发车时间</option>
              <option value="price">票价</option>
            </select>
          </label>
          <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            {sortOrder === 'asc' ? '升序' : '降序'}
          </button>
        </div>
      </div>

      {loading && <div className="loading">加载数据中...</div>}
      {error && <div className="error">错误: {error}</div>}

      {!loading && !error && (
        <div className="content-container">
          {renderTrainList(`${currentRoute.from} → ${currentRoute.to}`, shToSzTrains, false)}
          {renderTrainList(`${currentRoute.to} → ${currentRoute.from}`, szToShTrains, true)}
        </div>
      )}
    </div>
  );
};

export default DataPreviewPage;
