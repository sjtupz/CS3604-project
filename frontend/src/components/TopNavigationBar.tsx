import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TopNavigationBar.css';

interface TopNavigationBarProps {
  isLoggedIn?: boolean;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({ isLoggedIn = false }) => {
  const { pathname } = useLocation();

  if (pathname === '/login') {
    return (
      <div className="nav-bar login">
        <div className="logo-container">
          <Link to="/" aria-label="首页">
            <img src="/src/assets/logo.png" alt="中国铁路12306" className="logo-img" data-testid="logo" />
          </Link>
          <div className="logo-text-container">
            <div className="logo-title">中国铁路12306</div>
            <div className="logo-subtitle">12306 CHINA RAILWAY</div>
          </div>
        </div>
        <div className="header-welcome">欢迎登录12306</div>
      </div>
    );
  }

  return (
    <div className="nav-bar">
      <div className="logo-container">
        <Link to="/" aria-label="首页">
          <img src="/src/assets/logo.png" alt="中国铁路12306" className="logo-img" data-testid="logo" />
        </Link>
        <div className="logo-text-container">
          <div className="logo-title">中国铁路12306</div>
          <div className="logo-subtitle">12306 CHINA RAILWAY</div>
        </div>
      </div>
      <div className="search-container">
        <input type="text" placeholder="搜索车票、餐饮、常旅客、相关规章" className="search-input" />
        <button className="search-button">搜索</button>
      </div>
      <div className="user-actions">
        <Link to={isLoggedIn ? "/profile" : "/login"} className="action-my12306">我的12306</Link>
        <Link to="/login" className="action-login">登录</Link>
        <Link to="/register" className="action-register">注册</Link>
      </div>
    </div>
  );
};

export { TopNavigationBar };
