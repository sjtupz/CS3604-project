import React from 'react';

interface TrainInfoBoxProps {
  train: {
    trainNumber: string;
    date: string;
    fromStation: string;
    toStation: string;
    departureTime: string;
    arrivalTime: string;
    seats: Array<{
      type: string;
      count: string | number;
      price: number;
    }>;
  };
}

const TrainInfoBox: React.FC<TrainInfoBoxProps> = ({ train }) => {
  if (!train) return null;

  return (
    <div className="train-info-box" style={{ marginBottom: '20px', border: '1px solid #ddd' }}>
      <div style={{ 
        backgroundColor: '#3b99fc', 
        color: 'white', 
        padding: '10px 15px', 
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        列车信息（以下余票信息仅供参考）
      </div>
      <div style={{ padding: '20px', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', gap: '40px' }}>
          <div>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{train.date}</span>
            <span style={{ marginLeft: '10px', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{train.trainNumber}</span> 次
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{train.fromStation}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>{train.departureTime} 开</div>
            </div>
            <div style={{ fontSize: '24px', color: '#ccc' }}>——</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{train.toStation}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>{train.arrivalTime} 到</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          {train.seats.map((seat, index) => (
            <div key={index} style={{ fontSize: '14px' }}>
              <span style={{ color: '#666' }}>{seat.type}</span>
              <span style={{ color: '#f60', marginLeft: '5px' }}>({seat.count})</span>
              <span style={{ color: '#333', marginLeft: '5px' }}>￥{seat.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainInfoBox;
