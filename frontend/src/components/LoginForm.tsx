import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SMSVerificationModal } from './SMSVerificationModal';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSmsModal, setShowSmsModal] = useState(false);

  const handleSubmit = () => {
    if (!identifier) {
      setError('❗请输入用户名！');
      return;
    }
    if (!password) {
      setError('❗请输入密码！');
      return;
    }
    if (password.length < 6) {
      setError('❗密码长度不能小于6位！');
      return;
    }
    setError('');
    setShowSmsModal(true);
  };

  return (
    <div>
      <div>
        <input placeholder="用户名/邮箱/手机号" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
      </div>
      <div>
        <input type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleSubmit}>立即登录</button>
      <div>
        <Link to="/register">注册12306账户</Link> | <Link to="/forgot-password">忘记密码？</Link>
      </div>
      {error && <div>{error}</div>}
      {showSmsModal && (
        <div>
          <SMSVerificationModal onClose={() => setShowSmsModal(false)} onVerified={() => navigate('/profile')} />
        </div>
      )}
    </div>
  );
};
