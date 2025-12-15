import { LoginForm } from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/good_logo.png';
import './LoginPage.css';
import '../components/TopNavigationBar.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="page-login" data-testid="login-page">
      <div className="header-root" role="banner">
        <div className="header-inner" style={{height: '80px', justifyContent: 'flex-start', padding: '0 0px'}}>
          <div
            className="logo-wrap"
            role="button"
            aria-label="返回首页"
            tabIndex={0}
            onClick={() => navigate('/')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/') }}
          >
            <img src={logoImg} alt="12306 Logo" className="logo-img" style={{ height: 46 }} />
          </div>
          <div style={{ fontSize: '20px', color: '#333' }}>欢迎登录12306</div>
        </div>
      </div>
      <div className="login-panel">
        <div className="login-bg" />
        <div className="login-box">
          <LoginForm />
        </div>
      </div>

      <div className="footer">
        <div className="footer-inner">
          <div>
            友情链接
            <img src="/02_登录注册页/友情链接.png" alt="友情链接" className="footer-img" />
          </div>
          <div>
            官方平台二维码
            <img src="/02_登录注册页/官方平台二维码.png" alt="官方平台二维码" className="footer-img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
