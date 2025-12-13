
import React, { useState, useMemo } from 'react';
import { useTicketContext } from '../../context/TicketContext';
import { TrainTicket, TicketSeat } from '../../services/ticketService';
import './TicketList.css';

const PAGE_SIZE = 10;
const ALL_SEAT_TYPES = ['商务座', '特等座', '一等座', '二等座', '软卧', '硬卧', '硬座', '无座', '其他'];

const TicketList: React.FC = () => {
  const { tickets, loading, error } = useTicketContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure' | null>(null);

  // Sorting Logic
  const sortedTickets = useMemo(() => {
    if (!sortBy) return tickets;
    const sorted = [...tickets];
    sorted.sort((a, b) => {
      if (sortBy === 'price') {
        // Compare lowest price available
        const getMinPrice = (t: TrainTicket) => {
           const prices = t.tickets.map(s => s.price);
           return prices.length ? Math.min(...prices) : Infinity;
        };
        return getMinPrice(a) - getMinPrice(b);
      } else if (sortBy === 'duration') {
        // Duration string "HH:mm" to minutes
        const toMins = (d: string) => {
          const [h, m] = d.split(':').map(Number);
          return h * 60 + m;
        };
        return toMins(a.duration) - toMins(b.duration);
      } else if (sortBy === 'departure') {
        return a.departureTime.localeCompare(b.departureTime);
      }
      return 0;
    });
    return sorted;
  }, [tickets, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedTickets.length / PAGE_SIZE);
  const currentTickets = sortedTickets.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (loading) return <div className="loading">加载中...</div>;
  if (error) return <div className="error">{error}</div>;
  if (tickets.length === 0) return <div className="no-data">暂无车次信息</div>;

  return (
    <div className="ticket-list-container">
      <div className="sort-controls">
        <span>排序：</span>
        <button onClick={() => setSortBy('departure')} className={sortBy === 'departure' ? 'active' : ''}>发车时间</button>
        <button onClick={() => setSortBy('price')} className={sortBy === 'price' ? 'active' : ''}>价格</button>
        <button onClick={() => setSortBy('duration')} className={sortBy === 'duration' ? 'active' : ''}>耗时</button>
      </div>

      <div className="ticket-list">
        {currentTickets.map(ticket => (
          <div key={ticket.trainId} className="ticket-card">
            <div className="train-info">
              <div className="train-number">{ticket.trainNumber} <span className="train-type">{ticket.type}</span></div>
              <div className="route-info">
                <div className="station from">
                  <div className="time">{ticket.departureTime}</div>
                  <div className="name">{ticket.fromStation}</div>
                </div>
                <div className="duration-arrow">
                  <div className="duration">{ticket.duration}</div>
                  <div className="arrow">--------&gt;</div>
                </div>
                <div className="station to">
                  <div className="time">{ticket.arrivalTime}</div>
                  <div className="name">{ticket.toStation}</div>
                </div>
              </div>
            </div>
            <div className="seat-list">
              {(() => {
                const unknown = ticket.tickets.filter(s => !ALL_SEAT_TYPES.includes(s.seatType) && s.seatType !== '其他');
                const otherAgg: TicketSeat | null = unknown.length > 0 ? {
                  seatType: '其他',
                  price: Math.min(...unknown.map(u => u.price)),
                  count: unknown.reduce((acc, u) => acc + (u.count || 0), 0)
                } : null;
                const getSeatForType = (type: string): TicketSeat | null => {
                  if (type === '其他' && otherAgg) return otherAgg;
                  return ticket.tickets.find(t => t.seatType === type) || null;
                };
                return ALL_SEAT_TYPES.map(type => {
                  const seat = getSeatForType(type);
                  if (!seat) {
                    return (
                      <div key={type} className="seat-item disabled">
                        <div className="seat-type">{type}</div>
                        <div className="seat-price">--</div>
                        <div className="seat-count">--</div>
                      </div>
                    );
                  }
                  let countDisplay = '';
                  let statusClass = '';
                  if (seat.count === 0) {
                    countDisplay = '无';
                    statusClass = 'no-stock';
                  } else if (seat.count > 20) {
                    countDisplay = '有';
                    statusClass = 'available';
                  } else {
                    countDisplay = `余票：${seat.count}张`;
                    statusClass = 'low-stock';
                  }
                  return (
                    <div key={type} className={`seat-item ${statusClass}`}>
                      <div className="seat-type">{type}</div>
                      <div className="seat-price">¥{seat.price}</div>
                      <div className="seat-count">{countDisplay}</div>
                    </div>
                  );
                });
              })()}
              <button className="book-btn" disabled={!ticket.tickets.some(t => t.count > 0)}>预订</button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>上一页</button>
          <span>{currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>下一页</button>
        </div>
      )}
    </div>
  );
};

export default TicketList;
