import { Routes, Route, Outlet } from 'react-router-dom';
import { TopNavigationBar } from './components/TopNavigationBar';
import HomePage from './pages/HomePage';
import CateringSpecialties from './pages/CateringSpecialties';
import MerchantStore from './pages/MerchantStore';
import CateringSearchPage from './pages/CateringSearchPage';
import LoginPage from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';

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
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="catering/search" element={<CateringSearchPage />} />
        <Route path="catering" element={<CateringSpecialties />} />
        <Route path="catering/merchant/:id" element={<MerchantStore />} />
      </Route>
    </Routes>
  );
}

export default App;
