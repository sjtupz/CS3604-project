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
import { createPassenger, updatePassenger, getPassengerById, type Passenger as ApiPassenger } from '../api/passengers';

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

interface PersonalCenterLayoutProps {
  currentUser?: UserInfo;
  orders?: Order[];
  passengers?: ApiPassenger[];
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  onNavigate?: (section: string) => void;
  onLogout?: () => void;
  onNavigateToService?: (service: string) => void;
  onNavigateToPayment?: (orderId: string) => void;
  onNavigateToBooking?: () => void;
  onCancelOrder?: (orderId: string, hasNoSeat?: boolean) => void | Promise<void>;
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
  onCancelOrder,
  onRefund,
  onModify,
  onPrintInfo,
  onNavigateToPhoneVerification,
  onUpdateDiscountType,
  onRefreshPassengers,
  passengers: _passengers,
  orders: _orders
}) => {
  const [internalSection, setInternalSection] = useState<string>('个人中心');
  const currentSection = activeSection !== undefined ? activeSection : internalSection;
  const [orderTab, setOrderTab] = useState<string>('未完成订单'); // For OrderTabs internal state
  const [passengerView, setPassengerView] = useState<'list' | 'form'>('list');
  const [editingPassenger, setEditingPassenger] = useState<ApiPassenger | undefined>(undefined);
  const [passengerListVersion, setPassengerListVersion] = useState(0);

  const handleAddPassenger = () => {
    setEditingPassenger(undefined);
    setPassengerView('form');
  };

  const handleEditPassenger = (id: string) => {
    void (async () => {
      try {
        const p = await getPassengerById(id);
        if (p) {
          setEditingPassenger(p);
          setPassengerView('form');
        }
      } catch (error) {
        console.error('Failed to load passenger:', error);
      }
    })();
  };

  type PassengerSubmitData = {
    passengerId?: string
    name?: string
    idType?: string
    idNumber?: string
    phone?: string
    discountType?: string
    expiryDate?: string
    birthDate?: string
  }

  const handlePassengerSubmit = async (data: PassengerSubmitData) => {
    try {
      if (data.passengerId && !data.passengerId.startsWith('new_')) {
        const { passengerId, ...updateData } = data;
        await updatePassenger(passengerId, updateData);
      } else {
        await createPassenger({
          name: data.name ?? '',
          idType: data.idType ?? '居民身份证',
          idNumber: data.idNumber ?? '',
          phone: data.phone ?? '',
          discountType: data.discountType ?? '',
          expiryDate: data.expiryDate,
          birthDate: data.birthDate,
        });
      }
      if (onRefreshPassengers) {
        await onRefreshPassengers();
      }
      setPassengerView('list');
      setPassengerListVersion((v) => v + 1);
    } catch (error: any) {
      console.error('Failed to save passenger:', error);
      // Propagate error to PassengerForm
      // Axios error handling to extract message
      const message = error.response?.data?.error || error.response?.data?.message || error.message || '保存失败';
      throw new Error(message);
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
            {(() => {
              type PassengerItem = { name?: string };
              type TrainInfoItem = {
                travelDate?: string;
                date?: string;
                fromStation?: string;
                toStation?: string;
                fromStationId?: string;
                toStationId?: string;
                departureTime?: string;
                startTime?: string;
              } | undefined;
              type RawOrder = {
                id?: string;
                orderId?: string;
                orderNumber?: string;
                orderNo?: string;
                trainNumber?: string;
                passengerInfo?: PassengerItem[] | unknown;
                passengerName?: string;
                createdAt?: string;
                travelDate?: string;
                trainInfo?: TrainInfoItem | unknown;
                seatInfo?: string;
                price?: number;
                status?: string;
              };

              const rawOrders = Array.isArray(_orders) ? (_orders as RawOrder[]) : [];
              const parseMaybeJson = (v: unknown): unknown => {
                if (typeof v !== 'string') return undefined;
                try {
                  return JSON.parse(v) as unknown;
                } catch {
                  return undefined;
                }
              };
              const normalized = rawOrders.map((o) => {
                const passengerInfoParsed = Array.isArray(o.passengerInfo)
                  ? o.passengerInfo
                  : (Array.isArray(parseMaybeJson(o.passengerInfo)) ? (parseMaybeJson(o.passengerInfo) as PassengerItem[]) : []);
                const passengerList = passengerInfoParsed;
                const passengerName = passengerList.length > 0
                  ? passengerList.map((p) => p?.name ?? '').filter(Boolean).join('、')
                  : (o.passengerName ?? undefined);
                const bookingDate = typeof o.createdAt === 'string' ? o.createdAt.slice(0, 10) : undefined;
                const trainInfoParsed = (o.trainInfo && typeof o.trainInfo === 'object')
                  ? o.trainInfo
                  : parseMaybeJson(o.trainInfo);
                const tInfo = (trainInfoParsed && typeof trainInfoParsed === 'object') ? (trainInfoParsed as TrainInfoItem) : undefined;
                const tInfoRecord = (tInfo && typeof tInfo === 'object') ? (tInfo as unknown as Record<string, unknown>) : null;
                const travelDate = (tInfo && (tInfo.travelDate || tInfo.date)) ? String(tInfo.travelDate || tInfo.date) : (o.travelDate ?? undefined);
                const fromStation = (tInfo && (tInfo.fromStation || tInfo.fromStationId)) ? String(tInfo.fromStation || tInfo.fromStationId) : undefined;
                const toStation = (tInfo && (tInfo.toStation || tInfo.toStationId)) ? String(tInfo.toStation || tInfo.toStationId) : undefined;
                const departureTimeValue = tInfoRecord
                  ? (tInfoRecord.departureTime
                    ?? tInfoRecord.startTime
                    ?? tInfoRecord.departure_time
                    ?? tInfoRecord.start_time
                    ?? tInfoRecord.departTime
                    ?? tInfoRecord.depart_time)
                  : undefined;
                const departureTime = (typeof departureTimeValue === 'string' || typeof departureTimeValue === 'number')
                  ? String(departureTimeValue)
                  : undefined;
                const passengerIdTypes = passengerInfoParsed.length > 0
                  ? passengerInfoParsed.map((p) => (p as { idType?: string })?.idType ?? '').filter(Boolean).join('、')
                  : undefined;
                const hasNoSeat = typeof o.seatInfo === 'string' ? o.seatInfo.includes('无座') : undefined;
                const rawStatus = String(o.status ?? '');
                const status = rawStatus === '未支付' || rawStatus === '待确认' ? '待支付' : rawStatus;
                return {
                  orderId: o.id ?? o.orderId ?? '',
                  orderNumber: o.orderNumber ?? o.orderNo,
                  trainNumber: o.trainNumber ?? '',
                  passengerName,
                  bookingDate,
                  travelDate,
                  fromStation,
                  toStation,
                  departureTime,
                  seatInfo: o.seatInfo,
                  price: o.price ?? 0,
                  status,
                  ticketType: '成人票',
                  passengerIdTypes,
                  hasNoSeat,
                };
              });

              const uncompleted = normalized.filter((x) => ['待支付'].includes(String(x.status)));
              const upcoming = normalized.filter((x) => ['已支付', '未出行'].includes(String(x.status)));
              const history = normalized.filter((x) => ['已完成', '已退票', '已取消', '历史订单'].includes(String(x.status)));

              return (
                <>
                  {orderTab === '未完成订单' && (
                    <UncompletedOrders 
                      orders={uncompleted}
                      onNavigateToPayment={onNavigateToPayment}
                      onNavigateToBooking={onNavigateToBooking}
                      onCancelOrder={onCancelOrder}
                    />
                  )}
                  {orderTab === '未出行订单' && (
                    <UpcomingOrders 
                      orders={upcoming}
                      onRefund={onRefund}
                      onModify={onModify}
                      onNavigateToBooking={onNavigateToBooking}
                    />
                  )}
                  {orderTab === '历史订单' && (
                    <HistoryOrders 
                      orders={history}
                      onPrintInfo={onPrintInfo}
                      onNavigateToBooking={onNavigateToBooking}
                    />
                  )}
                </>
              );
            })()}
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
              passenger={editingPassenger} 
              onSubmit={handlePassengerSubmit}
              onCancel={() => setPassengerView('list')}
            />
          );
        }
        return (
          <PassengerList 
            key={passengerListVersion}
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
