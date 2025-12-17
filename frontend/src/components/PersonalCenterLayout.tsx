// TODO: 实现个人中心页面布局组件
import React, { useState, useEffect, useMemo } from 'react';
import PersonalCenterHome from './PersonalCenterHome';
import OrderTabs from './OrderTabs';
import UncompletedOrders from './UncompletedOrders';
import UpcomingOrders from './UpcomingOrders';
import HistoryOrders from './HistoryOrders';
import UserInfoView from './UserInfoView';
import PassengerList from './PassengerList';
import PassengerForm from './PassengerForm';
import { createPassenger, updatePassenger, getPassengerById } from '../api/passengers';

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

interface PersonalCenterLayoutProps {
  currentUser?: UserInfo;
  orders?: Order[];
  passengers?: Passenger[];
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  onNavigate?: (section: string) => void;
  onLogout?: () => void;
  onNavigateToService?: (service: string) => void;
  onNavigateToPayment?: (orderId: string) => void;
  onNavigateToBooking?: () => void;
  onRefund?: (orderId: string) => void;
  onModify?: (orderId: string) => void;
  onPrintInfo?: (orderId: string) => void;
  onNavigateToPhoneVerification?: () => void;
  onUpdateDiscountType?: (discountType: string, studentQualification?: { school?: string; studentId?: string }) => Promise<boolean>;
  onRefreshPassengers?: () => void;
}

const PersonalCenterLayout: React.FC<PersonalCenterLayoutProps> = ({
  currentUser,
  activeSection,
  onSectionChange,
  onNavigate,
  onNavigateToService,
  onNavigateToPayment,
  onNavigateToBooking,
  onRefund,
  onModify,
  onPrintInfo,
  onNavigateToPhoneVerification,
  onUpdateDiscountType,
  onRefreshPassengers,
  passengers,
  orders
}) => {
  const [internalSection, setInternalSection] = useState<string>('个人中心');
  const currentSection = activeSection !== undefined ? activeSection : internalSection;
  const [orderTab, setOrderTab] = useState<string>('未完成订单'); // For OrderTabs internal state
  const [passengerView, setPassengerView] = useState<'list' | 'form'>('list');
  const [editingPassenger, setEditingPassenger] = useState<Passenger | undefined>(undefined);

  const handleAddPassenger = () => {
    setEditingPassenger(undefined);
    setPassengerView('form');
  };

  const handleEditPassenger = async (id: string) => {
    try {
      const p = await getPassengerById(id);
      if (p) {
        setEditingPassenger(p as unknown as Passenger);
        setPassengerView('form');
      }
    } catch (error) {
      console.error('Failed to load passenger:', error);
    }
  };

  const handlePassengerSubmit = async (data: any) => {
    try {
      if (data.passengerId && !data.passengerId.startsWith('new_')) {
        await updatePassenger(data.passengerId, data);
      } else {
        await createPassenger(data);
      }
      // Refresh passenger list after successful save
      if (onRefreshPassengers) {
        await onRefreshPassengers();
      }
      setPassengerView('list');
    } catch (error) {
      console.error('Failed to save passenger:', error);
      alert('保存失败，请重试');
    }
  };

  const implementedSections = useMemo(() => ['个人中心', '火车票订单', '查看个人信息', '乘车人'], []);
  const [contentSection, setContentSection] = useState<string>(
    implementedSections.includes(currentSection) ? currentSection : '个人中心'
  );

  useEffect(() => {
    if (implementedSections.includes(currentSection)) {
      setContentSection(currentSection);
    }
  }, [currentSection, implementedSections]);

  const sidebarItems = [
    { id: '个人中心', label: '个人中心', subsections: [] },
    {
      id: '订票中心',
      label: '订票中心',
      subsections: ['火车票订单', '候补车票', '计次/定期票订单', '约号订单', '雪具快运订单', '餐饮特产', '保险订单', '电子发票']
    },
    { id: '本人车票', label: '本人车票', subsections: [] },
    { id: '会员中心', label: '会员中心', subsections: [] },
    {
      id: '个人信息',
      label: '个人信息',
      subsections: ['查看个人信息', '账号安全', '手机核验', '账号注销']
    },
    {
      id: '常用信息管理',
      label: '常用信息管理',
      subsections: ['乘车人', '地址管理']
    },
    { id: '温馨提示', label: '温馨提示', subsections: [] },
    { id: '投诉和建议', label: '投诉和建议', subsections: [] }
  ];

  const handleSectionClick = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    } else {
      setInternalSection(section);
    }
    onNavigate?.(section);
  };

  const renderContent = () => {
    switch (contentSection) {
      case '个人中心':
        return <PersonalCenterHome userInfo={currentUser} onNavigateToService={onNavigateToService} />;
      case '火车票订单':
        return (
          <div>
            <OrderTabs activeTab={orderTab} onTabChange={setOrderTab} />
            {orderTab === '未完成订单' && (
              <UncompletedOrders 
                orders={[]} 
                onNavigateToPayment={onNavigateToPayment}
                onNavigateToBooking={onNavigateToBooking}
              />
            )}
            {orderTab === '未出行订单' && (
              <UpcomingOrders 
                orders={[]} 
                onRefund={onRefund}
                onModify={onModify}
                onNavigateToBooking={onNavigateToBooking}
              />
            )}
            {orderTab === '历史订单' && (
              <HistoryOrders 
                orders={[]} 
                onPrintInfo={onPrintInfo}
                onNavigateToBooking={onNavigateToBooking}
              />
            )}
          </div>
        );
      case '查看个人信息':
        return (
          <UserInfoView 
            userInfo={currentUser} 
            onNavigateToPhoneVerification={onNavigateToPhoneVerification}
            onUpdateDiscountType={onUpdateDiscountType}
          />
        );
      case '乘车人':
        if (passengerView === 'form') {
          return (
            <PassengerForm 
              passenger={editingPassenger as any} 
              onSubmit={handlePassengerSubmit}
              onCancel={() => setPassengerView('list')}
            />
          );
        }
        return (
          <PassengerList 
            passengers={passengers} 
            onAdd={handleAddPassenger} 
            onEdit={handleEditPassenger} 
          />
        );
      default:
        return <PersonalCenterHome userInfo={currentUser} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'white' }}>
      {/* 主体内容区域：左侧栏固定宽度，右侧内容自适应 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr',
        columnGap: '24px',
        alignItems: 'start',
        flex: 1,
        backgroundColor: 'white',
        padding: '20px 140px',
        marginLeft: '80px',
      }}>
        {/* 左侧导航栏（不随右侧内容变化） */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px 0',
            borderRight: '1px solid #ddd',
            borderRadius: '4px 0 0 4px',
            position: 'sticky',
            top: 0
          }}
        >
          {sidebarItems.map((item) => (
            <div key={item.id}>
              <div
                onClick={() => handleSectionClick(item.id)}
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: currentSection === item.id ? 'bold' : 'normal',
                  backgroundColor: currentSection === item.id ? '#e6f7ff' : 'transparent',
                  borderLeft: currentSection === item.id ? '3px solid #1890ff' : '3px solid transparent'
                }}
              >
                {item.label}
              </div>
              {item.subsections.length > 0 && (
                <div style={{ paddingLeft: '20px' }}>
                  {item.subsections.map((sub) => (
                    <div
                      key={sub}
                      onClick={() => handleSectionClick(sub)}
                      style={{
                        padding: '8px 20px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: currentSection === sub ? '#1890ff' : '#666',
                        backgroundColor: currentSection === sub ? '#e6f7ff' : 'transparent'
                      }}
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 主内容区域 */}
        <div style={{ 
          padding: '30px 40px',
          backgroundColor: 'white',
          border: '1px solid #e8e8e8',
          borderRadius: '4px',
          minHeight: 'calc(100vh - 40px)',
          maxWidth: '1000px',
          width: '100%'
        }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PersonalCenterLayout;
