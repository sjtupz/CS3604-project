// TODO: 实现查看个人信息组件
import React, { useState, useEffect } from 'react';

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
  studentQualification?: { school?: string; studentId?: string };
}

interface UserInfoViewProps {
  userInfo?: UserInfo;
  onEditContact?: () => void;
  onEditDiscountType?: () => void; // Keep this for now if used elsewhere, but we might rely on internal state
  onNavigateToPhoneVerification?: () => void;
  onUpdateDiscountType?: (discountType: string, studentQualification?: { school?: string; studentId?: string }) => Promise<boolean>;
}

const UserInfoView: React.FC<UserInfoViewProps> = ({
  userInfo,
  onEditContact,
  onEditDiscountType,
  onNavigateToPhoneVerification,
  onUpdateDiscountType
}) => {
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingDiscountType, setIsEditingDiscountType] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentDiscountType, setCurrentDiscountType] = useState(userInfo?.discountType || '');

  useEffect(() => {
    if (userInfo?.discountType) {
      setCurrentDiscountType(userInfo.discountType);
    }
  }, [userInfo?.discountType]);

  const handleSaveDiscountType = async () => {
    if (onUpdateDiscountType) {
      // If switching to Student type and qualification is missing, provide a default empty object
      // to satisfy backend validation or allow initial save.
      let qualification = userInfo?.studentQualification;
      if (currentDiscountType === '学生' && !qualification) {
        qualification = { school: '', studentId: '' };
      }

      const success = await onUpdateDiscountType(currentDiscountType, qualification);
      if (success) {
        setShowSuccessModal(true);
      } else {
        alert('保存失败，请重试');
      }
    } else {
      setIsEditingDiscountType(false);
    }
  };

  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    setIsEditingDiscountType(false);
    // window.location.reload(); // Removed per user request
  };

  // Data masking
  const maskedIdNumber = userInfo?.idNumber 
    ? userInfo.idNumber.substring(0, 4) + '***********' + userInfo.idNumber.substring(15) 
    : '-';
    
  const maskedPhoneNumber = userInfo?.phoneNumber
    ? userInfo.phoneNumber.substring(0, 3) + '****' + userInfo.phoneNumber.substring(7)
    : '-';

  return (
    <div style={{ padding: '20px' }}>
      {/* 基本信息板块 */}
      <div style={{ marginBottom: '30px', border: '1px solid #eee', padding: '15px', borderRadius: '4px' }}>
        <h3 style={{ textAlign: 'left' }}>基本信息</h3>
        <div style={{ textAlign: 'center' }}>
          <p>用户名: {userInfo?.username || '-'}</p>
          <p>姓名: {userInfo?.realName || '-'}</p>
          <p>国家/地区: {userInfo?.country || '-'}</p>
          <p>证件类型: {userInfo?.idType || '-'}</p>
          <p>证件号码: {maskedIdNumber}</p>
          <p>
            核验状态: 
            <span style={{ color: userInfo?.verificationStatus === '已通过' ? '#ff8c00' : 'inherit', marginLeft: '5px' }}>
              {userInfo?.verificationStatus || '-'}
            </span>
          </p>
        </div>
      </div>

      {/* 联系方式板块 */}
      <div style={{ marginBottom: '30px', border: '1px solid #eee', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>联系方式</h3>
          <button onClick={() => { setIsEditingContact(!isEditingContact); onEditContact?.(); }} style={{ padding: '5px 10px' }}>
            {isEditingContact ? '完成' : '编辑'}
          </button>
        </div>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          手机号: {maskedPhoneNumber}
          {userInfo?.phoneVerified && <span style={{ color: '#ff8c00', marginLeft: '10px', fontSize: '14px' }}>已通过核验</span>}
        </p>
        {isEditingContact && userInfo?.phoneVerified && (
          <div style={{ marginTop: '10px' }}>
            <button onClick={onNavigateToPhoneVerification} style={{ padding: '5px 10px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              去手机核验修改
            </button>
          </div>
        )}
        <p>邮箱: {userInfo?.email || '-'}</p>
      </div>

      {/* 优惠类型板块 */}
      <div style={{ marginBottom: '30px', border: '1px solid #eee', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>优惠(待)类型</h3>
          <button 
            onClick={() => { 
              if (isEditingDiscountType) {
                handleSaveDiscountType();
              } else {
                setIsEditingDiscountType(true); 
                onEditDiscountType?.(); 
              }
            }} 
            style={{ padding: '5px 10px' }}
          >
            {isEditingDiscountType ? '保存' : '编辑'}
          </button>
        </div>
        {isEditingDiscountType ? (
          <div style={{ marginTop: '10px' }}>
            <label style={{ marginRight: '10px' }}>优惠(待)类型:</label>
            <select
              value={currentDiscountType}
              onChange={(e) => setCurrentDiscountType(e.target.value)}
              style={{ padding: '5px', marginRight: '10px' }}
            >
              <option value="成人">成人</option>
              <option value="儿童">儿童</option>
              <option value="学生">学生</option>
              <option value="残疾军人">残疾军人</option>
            </select>
          </div>
        ) : (
          <p>优惠(待)类型: {userInfo?.discountType || '-'}</p>
        )}

        {/* 学生资质查询板块 - only show if SAVED type is student */}
        {userInfo?.discountType === '学生' && (
          <div style={{ marginTop: '20px', borderTop: '1px dashed #eee', paddingTop: '15px' }}>
            <h4>学生资质查询</h4>
            <button style={{ marginRight: '10px', padding: '5px 10px' }}>刷新</button>
            <button style={{ padding: '5px 10px' }}>查询</button>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '300px', textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <div style={{ fontSize: '18px', marginBottom: '20px', fontWeight: 'bold' }}>保存成功</div>
            <button onClick={handleModalConfirm} style={{
              backgroundColor: '#ff8c00', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '4px', cursor: 'pointer', fontSize: '16px'
            }}>
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfoView;
