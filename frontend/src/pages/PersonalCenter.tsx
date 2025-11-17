// 实现个人中心页面
import React, { useState, useEffect } from 'react';
import PersonalCenterLayout from '../components/PersonalCenterLayout';
import apiClient from '../api/client';

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

const PersonalCenter: React.FC<PersonalCenterProps> = () => {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 设置测试token
    localStorage.setItem('authToken', 'test-token');
    
    // 从API获取用户信息
    const fetchUserInfo = async () => {
      try {
        const response = await apiClient.get('/api/user/info');
        const userInfo = response.data;
        // 保存完整的用户信息
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

    fetchUserInfo();
  }, []);

  const handleNavigate = (section: string) => {
    // TODO: 处理页面导航
    console.log('Navigate to:', section);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <PersonalCenterLayout 
        currentUser={currentUser || undefined} 
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default PersonalCenter;
