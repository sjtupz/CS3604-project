// 实现个人中心页面
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalCenterLayout from '../components/PersonalCenterLayout';
import apiClient from '../api/personal_client';
import { getOrders, getPassengers } from '../api/personal_user';

interface PersonalCenterProps {
  // TODO: 定义props类型
}

interface UserInfo {
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

interface Order {
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
}

interface Passenger {
  passengerId: string;
  name: string;
  idType: string;
  idNumber: string;
  phone?: string;
  verificationStatus?: string;
  discountType?: string;
  expiryDate?: string;
  birthDate?: string;
}

const PersonalCenter: React.FC<PersonalCenterProps> = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('个人中心');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // 从API获取用户信息、订单和乘车人
    const fetchData = async () => {
      try {
        // Fetch User Info
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

        // Fetch Orders
        try {
          const ordersData = await getOrders();
          setOrders(ordersData.orders || []);
        } catch (error) {
          console.error('Error fetching orders:', error);
          setOrders([]);
        }

        // Fetch Passengers
        try {
          const passengersData = await getPassengers();
          setPassengers(passengersData.passengers || []);
        } catch (error) {
          console.error('Error fetching passengers:', error);
          setPassengers([]);
        }

      } catch (error) {
        console.error('Error fetching user info:', error);
        // 如果API调用失败，使用默认值
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
  }, [navigate]);

  const handleNavigate = (section: string) => {
    console.log('Navigate to:', section);
    if (section === 'home' || section === '查询页') {
      navigate('/');
    } else if (section === 'ticket' || section === '车次列表页') {
      // Assuming ticket query is on home page or a specific ticket page
      navigate('/'); 
    } else if (section === '登录页') {
      navigate('/login');
    } else if (section === '个人中心') {
      setActiveSection('个人中心');
    }
  };

  const handleNavigateToService = (service: string) => {
    console.log('Navigate to service:', service);
    if (service === '车票服务' || service === '会员服务') {
      navigate('/');
    }
  };

  const handleNavigateToPayment = (orderId: string) => {
    console.log('Navigate to payment:', orderId);
    navigate('/payment');
  };

  const handleNavigateToBooking = () => {
    navigate('/');
  };

  const handleRefund = (orderId: string) => {
    console.log('Refund order:', orderId);
  };

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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
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
        onRefund={handleRefund}
        onModify={handleModify}
        onPrintInfo={handlePrintInfo}
        onNavigateToPhoneVerification={handleNavigateToPhoneVerification}
      />
    </div>
  );
};

export default PersonalCenter;
