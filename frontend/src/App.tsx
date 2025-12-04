import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { TopNavigationBar } from './components/TopNavigationBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import PersonalCenter from './pages/PersonalCenter';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { RegisterVerificationPage } from './pages/RegisterVerificationPage';
import { RegisterSuccessPage } from './pages/RegisterSuccessPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

const AppLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem('authToken'));
    };

    window.addEventListener('auth-change', handleAuthChange);
    // Also listen to storage event for cross-tab updates
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  return (
    <>
      <TopNavigationBar isLoggedIn={isLoggedIn} />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="register/verify" element={<RegisterVerificationPage />} />
        <Route path="register/success" element={<RegisterSuccessPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="profile" element={<PersonalCenter />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
      </Route>
    </Routes>
  );
}

export default App;
