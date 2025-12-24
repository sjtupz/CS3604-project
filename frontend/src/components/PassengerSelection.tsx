import React from 'react';

interface Passenger {
  passengerId: string;
  name: string;
  idType: string;
  idNumber: string;
}

interface PassengerSelectionProps {
  passengers: Passenger[];
  selectedPassengerIds: string[];
  onToggle: (passenger: Passenger) => void;
}

const PassengerSelection: React.FC<PassengerSelectionProps> = ({ 
  passengers, 
  selectedPassengerIds,
  onToggle 
}) => {
  const maskIdNumber = (idNumber: string) => {
    if (idNumber.length <= 7) return idNumber;
    return idNumber.substring(0, 4) + '*'.repeat(idNumber.length - 7) + idNumber.substring(idNumber.length - 3);
  };

  return (
    <div className="passenger-selection" style={{ border: '1px solid #ddd', marginBottom: '20px' }}>
      <div style={{ 
        backgroundColor: '#3b99fc', 
        color: 'white', 
        padding: '10px 15px', 
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        乘客信息
      </div>
      <div style={{ padding: '20px', backgroundColor: '#fff' }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>乘车人</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {passengers.map(p => (
            <label key={p.passengerId} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={selectedPassengerIds.includes(p.passengerId)}
                onChange={() => onToggle(p)}
                style={{ marginRight: '8px' }}
              />
              <span>{p.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PassengerSelection;
