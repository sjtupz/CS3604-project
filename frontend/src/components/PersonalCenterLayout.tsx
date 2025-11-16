// TODO: 实现个人中心页面布局组件
import React, { useState } from 'react';
import TopNavigationBar from './TopNavigationBar';
import PersonalCenterHome from './PersonalCenterHome';
import OrderTabs from './OrderTabs';
import UncompletedOrders from './UncompletedOrders';
import UpcomingOrders from './UpcomingOrders';
import HistoryOrders from './HistoryOrders';
import UserInfoView from './UserInfoView';
import PassengerList from './PassengerList';

interface PersonalCenterLayoutProps {
  currentUser?: {
    realName?: string;
    username?: string;
  };
  onNavigate?: (section: string) => void;
  onLogout?: () => void;
}

const PersonalCenterLayout: React.FC<PersonalCenterLayoutProps> = ({
  currentUser,
  onNavigate,
  onLogout
}) => {
  const [currentSection, setCurrentSection] = useState<string>('个人中心');
  const [orderTab, setOrderTab] = useState<string>('未完成订单'); // For OrderTabs internal state

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
    setCurrentSection(section);
    onNavigate?.(section);
  };

  const renderContent = () => {
    switch (currentSection) {
      case '个人中心':
        return <PersonalCenterHome userInfo={currentUser} />;
      case '火车票订单':
        return (
          <div>
            <OrderTabs activeTab={orderTab} onTabChange={setOrderTab} />
            {orderTab === '未完成订单' && (
              <UncompletedOrders orders={[]} /> // TODO: Pass actual orders
            )}
            {orderTab === '未出行订单' && (
              <UpcomingOrders orders={[]} /> // TODO: Pass actual orders
            )}
            {orderTab === '历史订单' && (
              <HistoryOrders orders={[]} /> // TODO: Pass actual orders
            )}
          </div>
        );
      case '查看个人信息':
        return <UserInfoView userInfo={currentUser} />; // TODO: Pass actual user info
      case '乘车人':
        return <PassengerList passengers={[]} />; // TODO: Pass actual passengers
      default:
        return <PersonalCenterHome userInfo={currentUser} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'white' }}>
      {/* 顶部导航栏 */}
      <TopNavigationBar
        currentUser={currentUser}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* 主体内容区域 */}
      <div style={{ display: 'flex', flex: 1, backgroundColor: 'white' }}>
        {/* 左侧导航栏 */}
        <div
          style={{
            width: '200px',
            backgroundColor: 'white',
            padding: '20px 0',
            marginLeft: '200px',
            marginTop: '20px',
            marginBottom: '20px',
            borderRight: '1px solid #ddd',
            borderRadius: '4px 0 0 4px'
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
          flex: 1, 
          padding: '30px 40px',
          marginRight: '200px',
          marginTop: '20px',
          marginBottom: '20px',
          backgroundColor: 'white',
          border: '1px solid #e8e8e8',
          borderRadius: '4px',
          maxWidth: 'calc(100% - 520px)'
        }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PersonalCenterLayout;
