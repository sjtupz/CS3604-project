import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';
import OrderCancelConfirmModal from '../components/OrderCancelConfirmModal';

const PersonalCenterOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) return;
    apiClient.get('/api/orders', { params: { status: '待支付' } }).catch(() => {});
    apiClient.get('/api/orders', { params: { status: '已支付' } }).catch(() => {});
  }, []);

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff' }}>
      <div style={{ marginBottom: '16px', fontWeight: 700 }}>未完成订单</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>车次信息</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>旅客信息</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>席位信息</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>票价</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>车票状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>G108 上海虹桥-北京南</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>张三</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>二等座 01车 10A</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>待支付</td>
          </tr>
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => setShowCancel(true)} style={{ padding: '6px 16px', backgroundColor: '#fff', color: '#000', border: '1px solid #000' }}>取消订单</button>
        <button onClick={() => navigate('/payment')} style={{ padding: '6px 16px', backgroundColor: '#f60', color: '#fff', border: 'none' }}>去支付</button>
      </div>

      <div style={{ marginBottom: '16px', fontWeight: 700 }}>未出行订单</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}><span>车次</span><span>信息</span></th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}><span>旅客</span><span>信息</span></th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}><span>席位</span><span>信息</span></th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}><span>票</span><span>价</span></th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>订单状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>G108 上海虹桥-北京南</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>张三</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>二等座 01车 10A</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td>
            <td style={{ border: '1px solid #ddd', padding: '8px', color: 'green' }}>已支付</td>
          </tr>
        </tbody>
      </table>
      <div style={{ color: '#288BCC' }}>退票</div>

      {showCancel && (
        <OrderCancelConfirmModal
          onCancel={() => setShowCancel(false)}
          onConfirm={() => { setShowCancel(false); navigate('/tickets'); }}
        />
      )}
    </div>
  );
};

export default PersonalCenterOrdersPage;
