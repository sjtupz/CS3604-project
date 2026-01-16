import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../api/orders';
import OrderCancelConfirmModal from '../components/OrderCancelConfirmModal';
import { RefundConfirmModal } from '../components/RefundConfirmModal';

interface Order {
  orderId: string;
  trainNumber: string;
  startStation: string;
  endStation: string;
  passengerName: string;
  seatType: string;
  carriageNumber: string;
  seatNumber: string;
  price: number;
  status: string;
  // refundAmount is optional for refunded orders
  refundAmount?: number; 
  departureTime?: string;
}

const PersonalCenterOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCancel, setShowCancel] = useState(false);
  const [unfinishedOrders, setUnfinishedOrders] = useState<Order[]>([]);
  const [unusedOrders, setUnusedOrders] = useState<Order[]>([]);
  
  // Refund Modal State
  const [selectedRefundOrder, setSelectedRefundOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (!token) return;

        // Fetch Unfinished (Pending Payment)
        const pendingRes = (await getOrders({ status: '待支付' })) as { data?: { items?: Order[] }, items?: Order[] };
        if (pendingRes && pendingRes.data && pendingRes.data.items) {
             setUnfinishedOrders(pendingRes.data.items);
        } else if (pendingRes && pendingRes.items) {
             setUnfinishedOrders(pendingRes.items);
        }

        // Fetch Unused (Paid or Refunded)
        // 注意：根据后端接口 listOrders 逻辑，status=1 对应 ['已支付', '未出行']，但目前前端可能只传了 '已支付'
        // 为了确保能获取到所有未出行（包括已支付和已退票，如果业务定义如此），我们需要明确请求参数
        
        // 1. 获取已支付订单
        const paidRes = (await getOrders({ status: '已支付' })) as { data?: { items?: Order[] }, items?: Order[] };
        let paidItems: Order[] = [];
        if (paidRes && paidRes.data && paidRes.data.items) {
            paidItems = paidRes.data.items;
        } else if (paidRes && paidRes.items) {
            paidItems = paidRes.items;
        }

        // 2. 获取已退票订单
        const refundedRes = (await getOrders({ status: '已退票' })) as { data?: { items?: Order[] }, items?: Order[] };
        let refundedItems: Order[] = [];
        if (refundedRes && refundedRes.data && refundedRes.data.items) {
            refundedItems = refundedRes.data.items;
        } else if (refundedRes && refundedRes.items) {
            refundedItems = refundedRes.items;
        }

        console.log('Fetched orders:', { paid: paidItems, refunded: refundedItems });

        setUnusedOrders(() => {
            // 合并并去重
            const all = [...paidItems, ...refundedItems];
            const unique = new Map();
            all.forEach(item => {
                const processedItem = {
                    ...item,
                    orderId: item.orderId || (item as { id?: string }).id || ''
                };
                if (processedItem.orderId) {
                    unique.set(processedItem.orderId, processedItem);
                }
            });
            return Array.from(unique.values());
        });

      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    };

    fetchOrders();
  }, []);

  const handleRefundClick = (order: Order) => {
    console.log('Refund clicked for order:', order.orderId);
    if (!order.orderId) {
        console.error('Order ID is missing');
        alert('订单ID缺失，无法操作');
        return;
    }
    // 强制状态更新，确保 React 感知到变化
    setSelectedRefundOrder(null);
    setTimeout(() => {
        setSelectedRefundOrder(order);
    }, 0);
  };

  console.log('Rendering OrdersPage, selectedRefundOrder:', selectedRefundOrder);

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
          {unfinishedOrders.length > 0 ? (
            unfinishedOrders.map((order) => (
              <tr key={order.orderId}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.trainNumber} {order.startStation}-{order.endStation}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.passengerName}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.seatType} {order.carriageNumber}车 {order.seatNumber}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.price}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.status}</td>
              </tr>
            ))
          ) : (
            <tr>
               <td colSpan={5} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>暂无未完成订单</td>
            </tr>
          )}
        </tbody>
      </table>
      {unfinishedOrders.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '24px' }}>
            <button onClick={() => setShowCancel(true)} style={{ padding: '6px 16px', backgroundColor: '#fff', color: '#000', border: '1px solid #000' }}>取消订单</button>
            <button onClick={() => navigate('/payment')} style={{ padding: '6px 16px', backgroundColor: '#f60', color: '#fff', border: 'none' }}>去支付</button>
        </div>
      )}

      <div style={{ marginBottom: '16px', fontWeight: 700 }}>未出行订单</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}><span>车次</span><span>信息</span></th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}><span>旅客</span><span>信息</span></th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}><span>席位</span><span>信息</span></th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}><span>票</span><span>价</span></th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>订单状态</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>操作</th>
          </tr>
        </thead>
        <tbody>
           {unusedOrders.length > 0 ? (
            unusedOrders.map((order) => (
              <tr key={order.orderId}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.trainNumber} {order.startStation}-{order.endStation}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.passengerName}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.seatType} {order.carriageNumber}车 {order.seatNumber}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.price}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', color: order.status === '已支付' ? 'green' : '#999' }}>
                    {order.status}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {order.status === '已支付' && (
                        <div 
                            style={{ color: '#288BCC', cursor: 'pointer' }}
                            onClick={() => handleRefundClick(order)}
                        >
                            退票
                        </div>
                    )}
                    {order.status === '已退票' && (
                        <span style={{ color: '#999' }}></span>
                    )}
                </td>
              </tr>
            ))
           ) : (
             <tr>
                 <td colSpan={6} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>暂无未出行订单</td>
             </tr>
           )}
        </tbody>
      </table>

      {showCancel && (
        <OrderCancelConfirmModal
          onCancel={() => setShowCancel(false)}
          onConfirm={() => { setShowCancel(false); navigate('/tickets'); }}
        />
      )}
      
      {selectedRefundOrder && (
          <RefundConfirmModal
            orderId={selectedRefundOrder.orderId}
            onClose={() => setSelectedRefundOrder(null)}
            orderInfo={selectedRefundOrder}
          />
      )}
    </div>
  );
};

export default PersonalCenterOrdersPage;
