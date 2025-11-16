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
  studentQualification?: any; // TODO: 定义学生资质类型
}

interface UserInfoViewProps {
  userInfo?: UserInfo;
  onEditContact?: () => void;
  onEditDiscountType?: () => void;
  onNavigateToPhoneVerification?: () => void;
}

const UserInfoView: React.FC<UserInfoViewProps> = ({
  userInfo,
  onEditContact,
  onEditDiscountType,
  onNavigateToPhoneVerification
}) => {
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingDiscountType, setIsEditingDiscountType] = useState(false);
  const [currentDiscountType, setCurrentDiscountType] = useState(userInfo?.discountType || '');

  useEffect(() => {
    if (userInfo?.discountType) {
      setCurrentDiscountType(userInfo.discountType);
    }
  }, [userInfo?.discountType]);

  const handleSaveDiscountType = () => {
    // TODO: 调用API保存优惠类型
    setIsEditingDiscountType(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>查看个人信息</h2>

      {/* 基本信息板块 */}
      <div style={{ marginBottom: '30px', border: '1px solid #eee', padding: '15px', borderRadius: '4px' }}>
        <h3>基本信息</h3>
        <p><strong>用户名:</strong> {userInfo?.username || '-'}</p>
        <p><strong>姓名:</strong> {userInfo?.realName || '-'}</p>
        <p><strong>国家/地区:</strong> {userInfo?.country || '-'}</p>
        <p><strong>证件类型:</strong> {userInfo?.idType || '-'}</p>
        <p><strong>证件号码:</strong> {userInfo?.idNumber || '-'}</p>
        <p><strong>核验状态:</strong> {userInfo?.verificationStatus || '-'}</p>
      </div>

      {/* 联系方式板块 */}
      <div style={{ marginBottom: '30px', border: '1px solid #eee', padding: '15px', borderRadius: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>联系方式</h3>
          <button onClick={() => setIsEditingContact(!isEditingContact)} style={{ padding: '5px 10px' }}>
            {isEditingContact ? '完成' : '编辑'}
          </button>
        </div>
        <p><strong>手机号:</strong> {userInfo?.phoneNumber || '-'}</p>
        {userInfo?.phoneVerified && <span style={{ color: 'green', fontSize: '14px' }}>已通过核验</span>}
        {isEditingContact && userInfo?.phoneVerified && (
          <div style={{ marginTop: '10px' }}>
            <button onClick={onNavigateToPhoneVerification} style={{ padding: '5px 10px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              去手机核验修改
            </button>
          </div>
        )}
        <p><strong>邮箱:</strong> {userInfo?.email || '-'}</p>
      </div>

      {/* 优惠类型板块 */}
      <div style={{ marginBottom: '30px', border: '1px solid #eee', padding: '15px', borderRadius: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>优惠类型</h3>
          <button onClick={() => setIsEditingDiscountType(!isEditingDiscountType)} style={{ padding: '5px 10px' }}>
            {isEditingDiscountType ? '保存' : '编辑'}
          </button>
        </div>
        {isEditingDiscountType ? (
          <div style={{ marginTop: '10px' }}>
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
            <button onClick={handleSaveDiscountType} style={{ padding: '5px 10px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              保存
            </button>
          </div>
        ) : (
          <p><strong>当前优惠类型:</strong> {userInfo?.discountType || '-'}</p>
        )}

        {/* 学生资质查询板块 */}
        {currentDiscountType === '学生' && (
          <div style={{ marginTop: '20px', borderTop: '1px dashed #eee', paddingTop: '15px' }}>
            <h4>学生资质查询</h4>
            <button style={{ marginRight: '10px', padding: '5px 10px' }}>刷新</button>
            <button style={{ padding: '5px 10px' }}>查询</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoView;
