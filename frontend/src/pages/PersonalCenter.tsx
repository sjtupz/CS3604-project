// TODO: 实现个人中心页面
import React, { useState, useEffect } from 'react';
import PersonalCenterLayout from '../components/PersonalCenterLayout';

interface PersonalCenterProps {
  // TODO: 定义props类型
}

const PersonalCenter: React.FC<PersonalCenterProps> = () => {
  const [currentUser, setCurrentUser] = useState<{
    realName?: string;
    username?: string;
  } | null>(null);

  useEffect(() => {
    // TODO: 从API获取用户信息
    // 模拟用户数据
    setCurrentUser({
      realName: '张三',
      username: 'zhangsan'
    });
  }, []);

  const handleNavigate = (section: string) => {
    // TODO: 处理页面导航
    console.log('Navigate to:', section);
  };

  return (
    <div>
      <PersonalCenterLayout currentUser={currentUser || undefined} onNavigate={handleNavigate} />
    </div>
  );
};

export default PersonalCenter;
