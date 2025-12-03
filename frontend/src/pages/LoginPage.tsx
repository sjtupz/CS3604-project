import { LoginForm } from '../components/LoginForm';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  return (
    <div className="page-login" data-testid="login-page">
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
