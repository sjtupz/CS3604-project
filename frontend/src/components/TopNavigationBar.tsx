// 顶部导航栏组件
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QuickAccessMenu } from './QuickAccessMenu';
import logoImg from '../assets/logo_12306.jpg';
import './TopNavigationBar.css';

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
      <div className="header-root" role="banner">
        <div className="header-inner" style={{ height: '80px' }}>
          <div className="logo-wrap" role="button" aria-label="返回首页" tabIndex={0} onClick={() => navigate('/')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/') }}>
            <img src={logoImg} alt="12306 Logo" className="logo-img" />
          </div>
          <div style={{ fontSize: '20px', color: '#333' }}>欢迎登录12306</div>
        </div>
      </div>
    );
  }

  return (
    <div className="header-root" role="banner">
      <div className="header-top">
        <div className="header-inner">
        {/* 左侧logo */}
        <div className="logo-wrap" role="button" aria-label="返回首页" tabIndex={0} onClick={() => navigate('/')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/') }}>
          <img src={logoImg} alt="12306 Logo" className="logo-img" />
        </div>

        {/* 中间搜索栏 - Keeping existing */}
        <div className="search-wrap">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="搜索车票、餐饮、常旅客、相关规章"
            className="search-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="search-button"
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
          <span style={{ color: '#333', cursor: 'pointer' }}>无障碍</span>
          <span style={{ color: '#333' }}>|</span>
          <span style={{ color: '#333', cursor: 'pointer' }}>敬老版</span>
          <span style={{ color: '#333' }}>|</span>
          <span style={{ color: '#333', cursor: 'pointer' }}>English</span>
          <span style={{ color: '#333', marginLeft: '5px' }}> </span>
          <span style={{ color: '#333' }}>|</span>
          
          <span 
            style={{ color: '#333', cursor: 'pointer' }}
            onClick={handleMy12306Click}
          >
            我的12306
          </span>
          
          {/* Dynamic Content */}
          <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
            {location.pathname === '/register' ? (
              // 注册页：始终显示“您好，请 登录 注册”以引导用户登录或注册
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#333' }}>您好，请</span>
                <span 
                  style={{ color: '#333', cursor: 'pointer', marginLeft: '5px' }}
                  onClick={() => navigate('/login')}
                >
                  登录
                </span>
                <span 
                  style={{ color: '#333', cursor: 'pointer', marginLeft: '10px' }}
                  onClick={() => navigate('/register')}
                >
                  注册
                </span>
              </span>
            ) : isLoggedIn ? (
              // 已登录：显示“您好，用户名 | 退出”
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#333' }}>您好，</span>
                <span 
                  style={{ color: '#333', cursor: 'pointer' }}
                  onClick={() => navigate('/profile')}
                >
                  {currentUser?.realName || currentUser?.username || '用户'}
                </span>
                <span style={{ color: '#333', margin: '0 5px' }}> | </span>
                <span 
                  style={{ color: '#333', cursor: 'pointer' }}
                  onClick={handleLogout}
                >
                  退出
                </span>
              </span>
            ) : (
              // 未登录（首页等）：显示“登录 注册”入口
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span 
                  style={{ color: '#333', cursor: 'pointer' }}
                  onClick={() => navigate('/login')}
                >
                  登录
                </span>
                <span 
                  style={{ color: '#333', cursor: 'pointer', marginLeft: '10px' }}
                  onClick={() => navigate('/register')}
                >
                  注册
                </span>
              </span>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Blue Main Navigation Bar */}
      {location.pathname !== '/login' && (
        <div className="nav-main">
          <QuickAccessMenu />
        </div>
      )}
    </div>
  );
};
