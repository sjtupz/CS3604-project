import { useEffect, useRef, useState } from 'react';
import { sendLoginCode, verifyLogin } from '../api/auth';

interface Props {
  onClose: () => void;
  onVerified: () => void;
}

export const SMSVerificationModal: React.FC<Props> = ({ onClose: _onClose, onVerified: _onVerified }) => {
  const [idLast4, setIdLast4] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [sendButtonState, setSendButtonState] = useState<'init' | 'enabled' | 'countdown'>('init');
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<number | null>(null);

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
      const res = await sendLoginCode('user', idLast4);
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
      await verifyLogin('user', idLast4, code, 'password');
      _onVerified();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      const msg = e.response?.data?.error || '验证码校验失败';
      setMessage(msg);
    }
  };

  return (
    <div>
      <h3>短信验证</h3>
      <input placeholder="请输入登录账号绑定的证件号后4位" value={idLast4} onChange={(e) => handleIdChange(e.target.value)} />
      <input placeholder="输入验证码" value={code} onChange={(e) => handleCodeChange(e.target.value)} />
      <button disabled={sendButtonState !== 'enabled'} onClick={handleSendCode}>获取验证码</button>
      <button onClick={handleConfirm}>确定</button>
      {message && <div>{message}</div>}
    </div>
  );
};
