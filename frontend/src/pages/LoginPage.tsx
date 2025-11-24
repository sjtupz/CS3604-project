import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <div>
      <h1>登录页面</h1>
      <p>还没有账户？ <Link to="/register">立即注册</Link></p>
    </div>
  );
};

export default LoginPage;
