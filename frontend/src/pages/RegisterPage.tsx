// frontend/src/pages/RegisterPage.tsx
import React from 'react';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage: React.FC = () => {
  const handleRegisterSuccess = () => {
    // 在这里处理注册成功后的逻辑，例如页面跳转
    console.log('Registration successful, navigating...');
  };

  return (
    <div data-testid="register-page">
      <h1 style={{ textAlign: 'center', margin: '16px 0' }}>用户注册</h1>
      <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
    </div>
  );
};
