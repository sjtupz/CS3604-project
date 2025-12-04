import { useEffect, useRef, useState } from 'react';
import { sendLoginCode, verifyLogin } from '../api/auth';

interface Props {
  onClose: () => void;
  onVerified: () => void;
  identifier?: string;
  password?: string;
}

export const SMSVerificationModal: React.FC<Props> = ({ onClose: _onClose, onVerified: _onVerified, identifier: _identifier, password: _password }) => {
  const [idLast4, setIdLast4] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [sendButtonState, setSendButtonState] = useState<'init' | 'enabled' | 'countdown'>('init');
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<number | null>(null);
  const identifier = _identifier ?? 'user';
  const password = _password ?? 'password';

  useEffect(() => {
    const finished = typeof window !== 'undefined' && window.localStorage.getItem('login_code_countdown_finished') === 'true';
    if (countdown === 0 && finished) {
      setSendButtonState('enabled');
      return;
    }
    if (countdown > 0) {
      setSendButtonState('countdown');
      return;
    }
    if (idLast4.length === 4) {
      setSendButtonState('enabled');
    } else {
      setSendButtonState('init');
    }
  }, [idLast4, countdown]);

  const handleIdChange = (val: string) => {
    const next = val.slice(0, 4);
    setIdLast4(next);
  };

  const handleCodeChange = (val: string) => {
    const next = val.slice(0, 6);
    setCode(next);
  };

  const handleSendCode = async () => {
    if (sendButtonState !== 'enabled') return;
    try {
      const res = await sendLoginCode(identifier, idLast4);
      setMessage(res.message);
      setCountdown(60);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('login_code_countdown_finished', 'true');
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = window.setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      const msg = e.response?.data?.error || '请输入正确的用户信息！';
      setMessage(msg);
    }
  };

  const handleConfirm = async () => {
    if (idLast4.length !== 4) {
      setMessage('请输入登录账号绑定的证件号后4位');
      return;
    }
    if (!code) {
      setMessage('请输入验证码');
      return;
    }
    if (code.length < 6) {
      setMessage('请输入正确验证码');
      return;
    }
    try {
      const { token } = await verifyLogin(identifier, idLast4, code, password);
      localStorage.setItem('authToken', token);
      window.dispatchEvent(new Event('auth-change')); // Trigger event for App to update
      _onVerified();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      const msg = e.response?.data?.error || '验证码校验失败';
      setMessage(msg);
    }
  };

  const containerStyle: React.CSSProperties = {
    width: 390,
    maxWidth: 'calc(100% - 48px)',
    backgroundColor: '#fff',
    borderRadius: 0,
    boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
    padding: 24,
  };
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '-24px -24px 16px',
    padding: '12px 16px',
    backgroundColor: '#f5f7fa',
    color: '#333',
    fontSize: 14,
    fontFamily: 'SimSun, 宋体',
  };
  const titleStyle: React.CSSProperties = {
    color: '#1e6ad6',
    fontWeight: 600,
    fontSize: 16,
    margin: '0 0 16px',
    textAlign: 'center',
    fontFamily: 'SimSun, 宋体',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 44,
    border: '1px solid #d9d9d9',
    borderRadius: 4,
    padding: '0 10px',
    fontSize: 14,
    outline: 'none',
  };
  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  };
  const sendEnabledStyle: React.CSSProperties = {
    width: 120,
    height: 44,
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #d9d9d9',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 14,
  };
  const sendDisabledStyle: React.CSSProperties = {
    width: 120,
    height: 44,
    backgroundColor: '#eeeeee',
    color: '#999',
    border: '1px solid #dddddd',
    borderRadius: 4,
    cursor: 'not-allowed',
    fontSize: 14,
  };
  const confirmStyle: React.CSSProperties = {
    width: '100%',
    marginTop: 24,
    height: 44,
    backgroundColor: '#ff8c00',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 16,
    fontFamily: 'SimSun, 宋体',
  };
  const messageStyle: React.CSSProperties = {
    marginTop: 12,
    color: '#e53935',
    fontSize: 12,
  };
  const closeBtnStyle: React.CSSProperties = {
    border: 'none',
    background: 'transparent',
    fontSize: 20,
    lineHeight: 1,
    cursor: 'pointer',
    color: '#666',
  };

  const sendLabel = sendButtonState === 'countdown' ? `重新发送（${countdown}秒）` : '获取验证码';

  return (
    <div role="dialog" aria-modal="true" style={containerStyle} className="sms-modal">
      <div style={headerStyle}>
        <span>选择验证方式</span>
        <button aria-label="关闭" onClick={_onClose} style={closeBtnStyle}>×</button>
      </div>
      <div style={titleStyle}>短信验证</div>
      <div>
        <input
          placeholder="请输入登录账号绑定的证件号后4位"
          value={idLast4}
          onChange={(e) => handleIdChange(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={rowStyle}>
        <input
          placeholder="输入验证码"
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          style={{ ...inputStyle, flex: 1 }}
        />
        <button
          disabled={sendButtonState !== 'enabled'}
          onClick={handleSendCode}
          style={sendButtonState === 'enabled' ? sendEnabledStyle : sendDisabledStyle}
        >
          {sendLabel}
        </button>
      </div>
      {message && <div style={messageStyle}>{message}</div>}
      <button onClick={handleConfirm} style={confirmStyle}>确定</button>
    </div>
  );
};
