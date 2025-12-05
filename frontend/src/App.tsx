import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { TopNavigationBar } from './components/TopNavigationBar';
import { getUserInfo } from './api/personal_user';
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
  const [currentUser, setCurrentUser] = useState<{ realName?: string; username?: string } | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem('authToken')) {
        try {
          const info = await getUserInfo();
          setCurrentUser(info);
        } catch (e) {
          console.error('Failed to fetch user info:', e);
          // Optional: if token is invalid, maybe logout? But for now just log error.
        }
      } else {
        setCurrentUser(undefined);
      }
    };

    const handleAuthChange = () => {
      const loggedIn = !!localStorage.getItem('authToken');
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        fetchUser();
      } else {
        setCurrentUser(undefined);
      }
    };

    // Initial fetch
    if (isLoggedIn) {
      fetchUser();
    }

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
      <TopNavigationBar isLoggedIn={isLoggedIn} currentUser={currentUser} />
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
