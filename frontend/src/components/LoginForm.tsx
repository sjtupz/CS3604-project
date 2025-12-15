import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SMSVerificationModal } from './SMSVerificationModal';
import './LoginForm.css';

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
    <div className="login-form">
      <div className="tabs">
        <div className="tab active">账号登录</div>
        <div className="tab-divider" />
        <div className="tab">扫码登录</div>
      </div>

      <div className="input-row">
        <div className="icon user" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" fill="#bbb"/>
            <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#bbb" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <input
          className="input"
          placeholder="用户名/邮箱/手机号"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
      </div>

      <div className="input-row">
        <div className="icon lock" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="10" width="16" height="10" rx="2" stroke="#bbb" strokeWidth="2" fill="none"/>
            <path d="M8 10V7a4 4 0 118 0v3" stroke="#bbb" strokeWidth="2"/>
          </svg>
        </div>
        <input
          className="input"
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <div className="form-error">{error}</div>}

      <button className="submit" onClick={handleSubmit}>立即登录</button>

      <div className="links">
        <Link to="/register" className="link-primary">注册12306账户</Link>
        <span className="link-sep">|</span>
        <Link to="/forgot-password" className="link-secondary">忘记密码？</Link>
      </div>

      {showSmsModal && (
        <div className="modal-container">
          <SMSVerificationModal identifier={identifier} password={password} onClose={() => setShowSmsModal(false)} onVerified={() => navigate('/profile')} />
        </div>
      )}
      <div className="service-note">铁路12306每日5:00至次日1:00（周二为5:00至24:00）提供购票、改签、变更到站业务办理， 全天均可办理退票等其他服务。</div>
    </div>
  );
};
