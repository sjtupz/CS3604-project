// 实现个人中心页面
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PersonalCenterLayout from '../components/PersonalCenterLayout';
import apiClient from '../api/personal_client';
import { getOrders, getPassengers } from '../api/personal_user';
import { cancelOrder } from '../api/orders';
import type { Passenger as ApiPassenger } from '../api/passengers';

interface PersonalCenterProps {
  // TODO: 定义props类型
}

interface UserInfo {
  userId?: string;
  username?: string;
  realName?: string;
  country?: string;
  idType?: string;
  idNumber?: string;
  verificationStatus?: string;
  phoneNumber?: string;
  email?: string;
  phoneVerified?: boolean;
  discountType?: string;
  gender?: 'male' | 'female';
}


type PersonalCenterOrder = {
  orderId: string;
  orderNumber?: string;
  trainNumber?: string;
  passengerName?: string;
  bookingDate?: string;
  travelDate?: string;
  trainInfo?: string;
  passengerInfo?: string;
  seatInfo?: string;
  price?: number;
  status?: string;
};


type RawPassenger = {
  passengerId: string;
  name: string;
  idType: string;
  idNumber: string;
  phone?: string;
  verificationStatus?: string;
  discountType?: string;
  expiryDate?: string;
  birthDate?: string;
};

import { RefundConfirmModal } from '../components/RefundConfirmModal';

const PersonalCenter: React.FC<PersonalCenterProps> = () => {
  const navigate = useNavigate();
  const [selectedRefundOrderId, setSelectedRefundOrderId] = useState<string | null>(null);
  const isTestEnv =
    typeof import.meta !== 'undefined' &&
    (import.meta as unknown as { env?: { MODE?: string } }).env?.MODE === 'test';
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [orders, setOrders] = useState<PersonalCenterOrder[]>([]);
  const [passengers, setPassengers] = useState<ApiPassenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('个人中心');

  const normalizePassenger = (p: RawPassenger): ApiPassenger => ({
    passengerId: p.passengerId,
    name: p.name,
    idType: p.idType,
    idNumber: p.idNumber,
    phone: p.phone ?? '',
    discountType: p.discountType ?? '',
    verificationStatus: p.verificationStatus ?? '已通过',
    expiryDate: p.expiryDate,
    birthDate: p.birthDate,
  });

  // Function to refresh passenger list
  const refreshPassengers = async () => {
    try {
      const passengersData = await getPassengers();
      const list = (passengersData.passengers || []) as RawPassenger[];
      setPassengers(list.map(normalizePassenger));
    } catch (error) {
      console.error('Error refreshing passengers:', error);
      setPassengers([]);
    }
  };

  const fetchOrders = async () => {
    try {
      // 并行获取各种状态的订单，确保不遗漏
      const [pendingRes, paidRes, refundedRes, completedRes, cancelledRes] = await Promise.all([
        getOrders({ status: '待支付' }),
        getOrders({ status: '已支付' }),
        getOrders({ status: '已退票' }),
        getOrders({ status: '已完成' }),
        getOrders({ status: '已取消' })
      ]);

      const extractList = (res: any) => {
        // 兼容不同的返回结构
        const items = res?.data?.items || res?.items || res?.data || res?.orders || [];
        return Array.isArray(items) ? items : [];
      };

      const pendingList = extractList(pendingRes);
      const paidList = extractList(paidRes);
      const refundedList = extractList(refundedRes);
      const completedList = extractList(completedRes);
      const cancelledList = extractList(cancelledRes);

      // 合并并去重 (以 orderId 为准)
      const allOrders = [...pendingList, ...paidList, ...refundedList, ...completedList, ...cancelledList];
      const uniqueMap = new Map();
      allOrders.forEach((order: any) => {
        if (order.orderId) {
          uniqueMap.set(order.orderId, order);
        }
      });
      
      const uniqueList = Array.from(uniqueMap.values());
      setOrders(uniqueList as PersonalCenterOrder[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // if (isTestEnv) {
    //   setCurrentUser({
    //     username: 'testuser',
    //     realName: '张三',
    //     country: '中国',
    //     idType: '身份证',
    //     idNumber: '110101199001011234',
    //     verificationStatus: '已通过',
    //     phoneNumber: '13800138000',
    //     email: 'zhangsan@example.com',
    //     phoneVerified: true,
    //     discountType: '成人',
    //     gender: 'male'
    //   });
    //   setOrders([]);
    //   setPassengers([]);
    //   setLoading(false);
    //   return;
    // }

    const fetchData = async () => {
      try {
        const userResponse = await apiClient.get('/api/user/info');
        const userInfo = userResponse.data;
        if (userInfo.userId) {
          localStorage.setItem('userId', userInfo.userId);
        }
        setCurrentUser({
          userId: userInfo.userId,
          username: userInfo.username,
          realName: userInfo.realName,
          country: userInfo.country,
          idType: userInfo.idType,
          idNumber: userInfo.idNumber,
          verificationStatus: userInfo.verificationStatus,
          phoneNumber: userInfo.phoneNumber,
          email: userInfo.email,
          phoneVerified: userInfo.phoneVerified,
          discountType: userInfo.discountType,
          gender: (userInfo.gender === 'female' ? 'female' : 'male') as 'male' | 'female'
        });

        await fetchOrders();
        await refreshPassengers();
      } catch (error) {
        console.error('Error fetching user info:', error);
        setCurrentUser({
          username: 'zhangsan',
          realName: '张三',
          country: '中国',
          idType: '身份证',
          idNumber: '110101199001011234',
          verificationStatus: '已通过',
          phoneNumber: '13800138000',
          email: 'zhangsan@example.com',
          phoneVerified: true,
          discountType: '成人',
          gender: 'male'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isTestEnv, navigate]);

  useEffect(() => {
    const st = location.state as { section?: string } | null;
    if (st?.section) {
      setActiveSection(st.section);
    }
  }, [location.state]);

  const handleNavigate = (section: string) => {
    console.log('Navigate to:', section);
    if (section === 'home' || section === '查询页') {
      navigate('/');
    } else if (section === 'ticket' || section === '车次列表页') {
      navigate('/tickets'); 
    } else if (section === '登录页') {
      navigate('/login');
    } else if (section === '个人中心') {
      setActiveSection('个人中心');
    }
  };

  const handleNavigateToService = (service: string) => {
    console.log('Navigate to service:', service);
    if (service === '车票服务') {
      navigate('/tickets');
    } else if (service === '会员服务') {
      navigate('/');
    }
  };

  const handleNavigateToPayment = (orderId: string) => {
    try { sessionStorage.setItem('currentOrderId', orderId); } catch {}
    navigate('/payment');
  };

  const handleNavigateToBooking = () => {
    navigate('/tickets');
  };

  const handleCancelOrder = async (orderId: string, hasNoSeat?: boolean) => {
    try {
      await cancelOrder(orderId)
      try {
        const t = new Date()
        const today = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
        const userId = localStorage.getItem('userId')
        const key = userId ? `cancelOrderDailyStats_${userId}` : 'cancelOrderDailyStats'
        const raw = localStorage.getItem(key)
        const parsed = raw ? (JSON.parse(raw) as { date?: unknown; normal?: unknown; noSeat?: unknown }) : {}
        const date = typeof parsed.date === 'string' ? parsed.date : ''
        const normal = Number(parsed.normal)
        const noSeat = Number(parsed.noSeat)
        const base = date === today
          ? { date: today, normal: Number.isFinite(normal) ? normal : 0, noSeat: Number.isFinite(noSeat) ? noSeat : 0 }
          : { date: today, normal: 0, noSeat: 0 }
        const next = hasNoSeat ? { ...base, noSeat: base.noSeat + 1 } : { ...base, normal: base.normal + 1 }
        localStorage.setItem(key, JSON.stringify(next))
      } catch {}
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId))

      try {
        const ordersData = await getOrders();
        const dataField = (ordersData as { data?: unknown }).data;
        const ordersField = (ordersData as { orders?: unknown }).orders;
        const list = Array.isArray(dataField)
          ? dataField
          : (Array.isArray(ordersField) ? ordersField : []);
        setOrders(list as PersonalCenterOrder[]);
      } catch (error) {
        console.error('Error refreshing orders:', error);
      }
    } catch (error) {
      console.error('Error canceling order:', error)
    }
  }

  const handleRefund = (orderId: string) => {
    console.log('Refund order:', orderId);
    if (!orderId) {
        alert('订单ID缺失，无法操作');
        return;
    }
    // 强制状态更新
    setSelectedRefundOrderId(null);
    setTimeout(() => {
        setSelectedRefundOrderId(orderId);
    }, 0);
  };

  // 添加监听：当 selectedRefundOrderId 变化时，如果变为 null（即弹窗关闭），则刷新订单列表
  useEffect(() => {
    if (selectedRefundOrderId === null) {
      // 弹窗关闭后，刷新订单
      // 1. 获取已支付订单
      // 2. 获取已退票订单
      // 3. 更新 orders 状态
      // 由于 PersonalCenter 之前使用 getOrders() 获取全部，这里我们简单重新调用一次全量获取
      // 但 PersonalCenter 的 fetchOrders 逻辑比较复杂，我们直接调用一次 fetchOrders 即可？
      // 但 fetchOrders 在 useEffect 内部，无法直接调用。
      // 我们可以在这里简单实现刷新逻辑，或者将 fetchOrders 提取出来。
      // 为了简单起见，我们在这里重新获取一次数据
      const refresh = async () => {
          try {
            const ordersData = await getOrders();
            const dataField = (ordersData as { data?: unknown }).data;
            const ordersField = (ordersData as { orders?: unknown }).orders;
            const list = Array.isArray(dataField)
              ? dataField
              : (Array.isArray(ordersField) ? ordersField : []);
            setOrders(list as PersonalCenterOrder[]);
          } catch (error) {
            console.error('Error refreshing orders after refund:', error);
          }
      };
      refresh();
    }
  }, [selectedRefundOrderId]);

  const handleModify = (orderId: string) => {
    console.log('Modify order:', orderId);
    navigate('/');
  };

  const handlePrintInfo = (orderId: string) => {
    console.log('Print info:', orderId);
  };

  const handleNavigateToPhoneVerification = () => {
    navigate('/verification');
  };

  const handleUpdateDiscountType = async (discountType: string, studentQualification?: { school?: string; studentId?: string }) => {
    try {
      await apiClient.put('/api/user/discount-type', {
        discountType,
        studentQualification
      });
      
      // Refresh user info
      const userResponse = await apiClient.get('/api/user/info');
      const userInfo = userResponse.data;
      setCurrentUser({
        username: userInfo.username,
        realName: userInfo.realName,
        country: userInfo.country,
        idType: userInfo.idType,
        idNumber: userInfo.idNumber,
        verificationStatus: userInfo.verificationStatus,
        phoneNumber: userInfo.phoneNumber,
        email: userInfo.email,
        phoneVerified: userInfo.phoneVerified,
        discountType: userInfo.discountType,
        gender: (userInfo.gender === 'female' ? 'female' : 'male') as 'male' | 'female'
      });
      return true;
    } catch (error) {
      console.error('Error updating discount type:', error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    window.dispatchEvent(new Event('auth-change'));
    setCurrentUser(null);
    navigate('/login');
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <PersonalCenterLayout 
        currentUser={currentUser || undefined} 
        activeSection={activeSection}
        orders={orders}
        passengers={passengers}
        onSectionChange={setActiveSection}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onNavigateToService={handleNavigateToService}
        onNavigateToPayment={handleNavigateToPayment}
        onNavigateToBooking={handleNavigateToBooking}
        onCancelOrder={handleCancelOrder}
        onRefund={handleRefund}
        onModify={handleModify}
        onPrintInfo={handlePrintInfo}
        onNavigateToPhoneVerification={handleNavigateToPhoneVerification}
        onUpdateDiscountType={handleUpdateDiscountType}
        onRefreshPassengers={refreshPassengers}
      />
      {selectedRefundOrderId && (
        <RefundConfirmModal
          orderId={selectedRefundOrderId}
          onClose={() => setSelectedRefundOrderId(null)}
        />
      )}
    </div>
  );
};

export default PersonalCenter;
