// TODO: 实现乘车人列表组件
import React, { useState, useMemo } from 'react';

interface Passenger {
  passengerId: string;
  name: string;
  idType: string;
  idNumber: string;
  phone: string;
  verificationStatus: string;
}

interface PassengerListProps {
  passengers?: Passenger[];
  onAddPassenger?: () => void;
  onEditPassenger?: (passengerId: string) => void;
  onDeletePassenger?: (passengerId: string) => void;
  onBatchDeletePassengers?: (passengerIds: string[]) => void;
}

const PassengerList: React.FC<PassengerListProps> = ({
  passengers = [],
  onAddPassenger,
  onEditPassenger,
  onDeletePassenger,
  onBatchDeletePassengers
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPassengers, setSelectedPassengers] = useState<string[]>([]);

  const filteredPassengers = useMemo(() => {
    if (!searchTerm) {
      return passengers;
    }
    return passengers.filter(p => p.name.includes(searchTerm));
  }, [passengers, searchTerm]);

  const handleSelectPassenger = (passengerId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedPassengers(prev => [...prev, passengerId]);
    } else {
      setSelectedPassengers(prev => prev.filter(id => id !== passengerId));
    }
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedPassengers(passengers.map(p => p.passengerId));
    } else {
      setSelectedPassengers([]);
    }
  };

  const handleBatchDelete = () => {
    if (selectedPassengers.length > 0) {
      onBatchDeletePassengers?.(selectedPassengers);
      setSelectedPassengers([]);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>乘车人管理</h2>

      {/* 查询条和添加按钮 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="根据乘客姓名查询"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '300px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button
          onClick={onAddPassenger}
          style={{ padding: '10px 20px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          添加乘车人
        </button>
      </div>

      {/* 批量删除按钮 */}
      {selectedPassengers.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={handleBatchDelete}
            style={{ padding: '8px 15px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            批量删除 ({selectedPassengers.length})
          </button>
        </div>
      )}

      {/* 乘车人信息展示 */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>
              <input
                type="checkbox"
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={selectedPassengers.length === passengers.length && passengers.length > 0}
              />
            </th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>序号</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>姓名</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>证件类型</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>证件号码</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>手机/电话</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>核验状态</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredPassengers.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                暂无乘车人信息
              </td>
            </tr>
          ) : (
            filteredPassengers.map((p, index) => (
              <tr key={p.passengerId}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <input
                    type="checkbox"
                    checked={selectedPassengers.includes(p.passengerId)}
                    onChange={(e) => handleSelectPassenger(p.passengerId, e.target.checked)}
                  />
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.idType}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.idNumber}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.phone}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.verificationStatus}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => onEditPassenger?.(p.passengerId)}
                    style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    修改
                  </button>
                  <button
                    onClick={() => onDeletePassenger?.(p.passengerId)}
                    style={{ padding: '5px 10px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerList;
