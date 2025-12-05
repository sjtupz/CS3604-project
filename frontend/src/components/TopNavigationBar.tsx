// 顶部导航栏组件
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QuickAccessMenu } from './QuickAccessMenu';

interface TopNavigationBarProps {
  currentUser?: {
    realName?: string;
    username?: string;
  };
  isLoggedIn?: boolean;
  onNavigate?: (target: string) => void;
  onLogout?: () => void;
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  currentUser,
  isLoggedIn,
  onNavigate,
  onLogout
}) => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = () => {
    // TODO: 实现搜索功能
    console.log('搜索:', searchValue);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('authToken');
      window.dispatchEvent(new Event('auth-change'));
      // The requirement says: "在登陆后，点击退出前保持账号登录状态". 
      // "点击后退出当前账号的登录状态" - After clicking, logout.
      // Usually logout redirects or refreshes. Here we just update state.
      // We might want to navigate to home or login, but requirement doesn't explicitly say.
      // I'll navigate to login to be safe/standard.
      navigate('/login');
    }
  };

  const handleMy12306Click = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  // Special case for Login Page: Render simplified header or nothing?
  // Requirement: "最顶部右侧导航栏中...在除登陆页面中全都存在"
  // This implies on Login page, this specific nav bar is NOT present.
  // The existing code rendered a simplified header. I will keep that behavior.
  if (location.pathname === '/login') {
    return (
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e8e8e8' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            height: '80px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            <img
              src="/assets/personal_center/12306logo.png"
              alt="12306 Logo"
              style={{
                height: '50px'
              }}
            />
          </div>
          <div style={{ fontSize: '20px', color: '#333' }}>欢迎登录12306</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e8e8e8' }}>
      {/* 顶部主导航栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {/* 左侧logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          <img
            src="/assets/personal_center/12306logo.png"
            alt="12306 Logo"
            style={{
              height: '50px'
            }}
          />
        </div>

        {/* 中间搜索栏 - Keeping existing */}
        <div
          style={{
            flex: 1,
            maxWidth: '500px',
            margin: '0 40px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="搜索车票、餐饮、常旅客、相关规章"
            style={{
              flex: 1,
              padding: '8px 15px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px 0 0 4px',
              fontSize: '14px',
              outline: 'none'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '8px 20px',
              backgroundColor: '#1890ff',
              border: 'none',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.5 10L9.5 8M10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.51472 10.5 1.5 8.48528 1.5 6C1.5 3.51472 3.51472 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6Z"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 右侧功能按键 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px', // Reduced gap slightly to fit content
            fontSize: '14px'
          }}
        >
          {/* Static Links */}
          <span style={{ color: '#1890ff', cursor: 'pointer' }}>无障碍</span>
          <span style={{ color: '#1890ff' }}>|</span>
          <span style={{ color: '#1890ff', cursor: 'pointer' }}>敬老版</span>
          <span style={{ color: '#1890ff' }}>|</span>
          <span style={{ color: '#1890ff', cursor: 'pointer' }}>English</span>
          <span style={{ color: '#1890ff', marginLeft: '5px' }}> </span>{/* Space after English? "English |" */}
          <span style={{ color: '#1890ff' }}>|</span>
          
          <span 
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={handleMy12306Click}
          >
            我的12306
          </span>
          
          {/* Dynamic Content */}
          <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
            {isLoggedIn ? (
              // Authenticated State
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'black' }}>您好，</span>
                <span 
                  style={{ color: '#1890ff', cursor: 'pointer' }}
                  onClick={() => navigate('/profile')}
                >
                  {currentUser?.realName || currentUser?.username || '用户'}
                </span>
                <span style={{ color: 'black', margin: '0 5px' }}> | </span>
                <span 
                  style={{ color: 'black', cursor: 'pointer' }}
                  onClick={handleLogout}
                >
                  退出
                </span>
              </span>
            ) : location.pathname === '/register' ? (
              // Register Page State
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'black' }}>您好，请</span>
                <span 
                  style={{ color: 'black', cursor: 'pointer', marginLeft: '5px' }}
                  onClick={() => navigate('/login')}
                >
                  登录
                </span>
                <span 
                  style={{ color: 'black', cursor: 'pointer', marginLeft: '10px' }}
                  onClick={() => navigate('/register')}
                >
                  注册
                </span>
              </span>
            ) : (
              // Default Unauthenticated (e.g. Homepage)
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span 
                  style={{ color: 'black', cursor: 'pointer' }}
                  onClick={() => navigate('/login')}
                >
                  登录
                </span>
                <span 
                  style={{ color: 'black', cursor: 'pointer', marginLeft: '10px' }}
                  onClick={() => navigate('/register')}
                >
                  注册
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Blue Main Navigation Bar */}
      {location.pathname !== '/login' && (
        <QuickAccessMenu />
      )}
    </div>
  );
};
