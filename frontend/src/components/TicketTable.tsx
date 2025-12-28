import React from 'react';

type TicketRow = {
  ticketType: string;
  seatType: string;
  name: string;
  idType: string;
  idNumber: string;
};

interface TicketTableProps {
  rows: TicketRow[];
  onSeatTypeChange?: (index: number, seatType: string) => void;
}

const TicketTable: React.FC<TicketTableProps> = ({ rows, onSeatTypeChange }) => {
  return (
    <table className="ticket-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ color: '#666', fontSize: '14px', backgroundColor: '#f5f5f5' }}>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>票种</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>席别</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>姓名</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>证件类型</th>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>证件号码</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              <select defaultValue={row.ticketType} disabled style={{ padding: '5px' }}>
                <option value="成人票">成人票</option>
              </select>
            </td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              <label style={{ display: 'none' }} htmlFor={`seat-type-${index}`}>席别</label>
              <select 
                id={`seat-type-${index}`}
                aria-label="席别"
                value={row.seatType} 
                onChange={(e) => onSeatTypeChange?.(index, e.target.value)}
                style={{ padding: '5px' }}
              >
                <option value="一等座">一等座</option>
                <option value="二等座">二等座</option>
                <option value="软卧">软卧</option>
                <option value="硬卧">硬卧</option>
              </select>
            </td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              <input type="text" readOnly value={row.name} style={{ border: 'none', background: 'none' }} />
            </td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.idType}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              <input type="text" readOnly value={row.idNumber} style={{ border: 'none', background: 'none' }} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TicketTable;
