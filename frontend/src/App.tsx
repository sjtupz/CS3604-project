import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { TopNavigationBar } from './components/TopNavigationBar';
import { Footer } from './components/Footer';
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
import { TrainListPage } from './pages/TrainListPage';
import DataPreviewPage from './pages/DataPreviewPage';
import LogoExportPage from './pages/LogoExportPage';

const AppLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const [currentUser, setCurrentUser] = useState<{ realName?: string; username?: string } | undefined>(undefined);
  const location = useLocation();

  const fetchUser = useCallback(async () => {
    if (localStorage.getItem('authToken')) {
      try {
        const info = await getUserInfo();
        setCurrentUser(info);
      } catch (e) {
        console.error('Failed to fetch user info:', e);
      }
    } else {
      setCurrentUser(undefined);
    }
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      const loggedIn = !!localStorage.getItem('authToken');
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        void fetchUser();
      } else {
        setCurrentUser(undefined);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [fetchUser]);

  useEffect(() => {
    if (isLoggedIn) {
      void fetchUser();
    } else {
      setCurrentUser(undefined);
    }
  }, [isLoggedIn, fetchUser]);

  return (
    <>
      {location.pathname !== '/login' && (
        <TopNavigationBar isLoggedIn={isLoggedIn} currentUser={currentUser} />
      )}
      <Outlet />
      <Footer />
    </>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="tickets" element={<TrainListPage />} />
        <Route path="preview-data" element={<DataPreviewPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="register/verify" element={<RegisterVerificationPage />} />
        <Route path="register/success" element={<RegisterSuccessPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="profile" element={<PersonalCenter />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="logo-export" element={<LogoExportPage />} />
      </Route>
    </Routes>
  );
}

export default App;
