import { Routes, Route, Outlet } from 'react-router-dom';
import { TopNavigationBar } from './components/TopNavigationBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

const AppLayout = () => {
  const isLoggedIn = false; // 示例状态

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
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="profile" element={<UserProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
