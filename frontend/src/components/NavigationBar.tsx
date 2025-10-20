import React from 'react';

interface NavigationBarProps {
  isLoggedIn: boolean;
  username?: string;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onMyAccount: () => void;
  onHomeClick: () => void;
  onTicketClick: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  isLoggedIn,
  username,
  onLogin,
  onRegister,
  onLogout,
  onMyAccount,
  onHomeClick,
  onTicketClick
}) => {
  const handleLogin = () => {
    onLogin();
  };

  const handleRegister = () => {
    onRegister();
  };

  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      onLogout();
    }
  };

  const handleMyAccount = () => {
    onMyAccount();
  };

  const handleHomeClick = () => {
    onHomeClick();
  };

  const handleTicketClick = () => {
    onTicketClick();
  };

  return (
    <nav className="navigation-bar">
      <div className="nav-container">
        <div className="nav-left">
          <div className="logo" onClick={handleHomeClick}>
            <span className="logo-icon">🚄</span>
            <span className="logo-text">中国铁路12306</span>
          </div>
          
          <div className="nav-links">
            <button className="nav-link" onClick={handleHomeClick}>
              首页
            </button>
            <button className="nav-link" onClick={handleTicketClick}>
              车票查询
            </button>
          </div>
        </div>
        
        <div className="nav-right">
          {isLoggedIn ? (
            <div className="user-section">
              <span className="username">欢迎，{username}</span>
              <button className="nav-button secondary" onClick={handleMyAccount}>
                我的账户
              </button>
              <button className="nav-button secondary" onClick={handleLogout}>
                退出登录
              </button>
            </div>
          ) : (
            <div className="auth-section">
              <button className="nav-button secondary" onClick={handleLogin}>
                登录
              </button>
              <button className="nav-button primary" onClick={handleRegister}>
                注册
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;