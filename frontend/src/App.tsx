import React, { useState } from 'react';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import RegisterPage from './components/RegisterPage';
import './App.css';

type PageType = 'home' | 'login' | 'register';

interface User {
  id: string;
  username: string;
  realName: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleLoginSuccess = (userData: User) => {
    // TODO: 实现登录成功处理逻辑
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleRegisterSuccess = (userData: User) => {
    // TODO: 实现注册成功处理逻辑
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    // TODO: 实现退出登录逻辑
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigateToLogin={() => handleNavigate('login')}
            onNavigateToRegister={() => handleNavigate('register')}
            onNavigateToMyAccount={() => {
              // TODO: 实现我的账户页面
              console.log('Navigate to my account');
            }}
          />
        );
      case 'login':
        return (
          <LoginPage
            onNavigateToHome={() => handleNavigate('home')}
            onNavigateToRegister={() => handleNavigate('register')}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onNavigateToHome={() => handleNavigate('home')}
            onNavigateToLogin={() => handleNavigate('login')}
          />
        );
      default:
        return (
          <HomePage
            onNavigateToLogin={() => handleNavigate('login')}
            onNavigateToRegister={() => handleNavigate('register')}
            onNavigateToMyAccount={() => {
              console.log('Navigate to my account');
            }}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;