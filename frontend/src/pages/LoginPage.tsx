import { LoginForm } from '../components/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div data-testid="login-page" style={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ padding: '16px 24px', fontWeight: 700, color: '#000' }}>欢迎登录12306</div>
      <div style={{ flex: 1 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>登录页面</h1>
          <div style={{ marginTop: 16 }}>
            <LoginForm />
          </div>
        </div>
      </div>
      <div style={{ padding: '24px', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ color: '#000' }}>友情链接</div>
          <div style={{ color: '#666' }}>官方平台二维码</div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
