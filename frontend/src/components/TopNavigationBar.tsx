import React from 'react';
import './TopNavigationBar.css';

const TopNavigationBar = () => {
  return (
    <div className="nav-bar">
      <div className="logo-container">
        <img src="/src/assets/logo.png" alt="中国铁路12306" className="logo-img" data-testid="logo" />
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
        <a href="#" className="action-my12306">我的12306</a>
        <a href="#" className="action-login">登录</a>
        <a href="#" className="action-register">注册</a>
      </div>
    </div>
  );
};

export { TopNavigationBar };