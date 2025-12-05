import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { sendForgotCode, verifyForgotCode, resetPassword } from '../api/forgot';
import { validatePassword, validateConfirmPassword } from '../utils/validation';

type Step = 1 | 2 | 3 | 4;

const circle = (active: boolean) => ({
  width: 24,
  height: 24,
  borderRadius: 12,
  border: '2px solid #cfd8dc',
  backgroundColor: active ? '#3B99FC' : '#ffffff',
});

const bar = (active: boolean) => ({ height: 4, flex: 1, backgroundColor: active ? '#3B99FC' : '#e0e0e0' });

const label = (active: boolean) => ({ color: active ? '#000' : '#666', marginTop: 8 });

const stepLabels = ['填写账户信息', '获取验证码', '设置新密码', '完成'];

const Stepper: React.FC<{ step: Step }> = ({ step }) => {
  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={circle(step >= 1)} />
        <div style={bar(step >= 2)} />
        <div style={circle(step >= 2)} />
        <div style={bar(step >= 3)} />
        <div style={circle(step >= 3)} />
        <div style={bar(step >= 4)} />
        <div style={circle(step >= 4)} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {stepLabels.map((text, i) => (
          <div key={text} style={label(step >= (i + 1))}>{text}</div>
        ))}
      </div>
    </div>
  );
};

const inputRow: React.CSSProperties = { display: 'flex', alignItems: 'center', marginBottom: 16 };
const labelStyle: React.CSSProperties = { width: 100, color: '#000' };
const errorHint: React.CSSProperties = { color: '#ff8c00', marginLeft: 16 };

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ backgroundColor: '#fff', minHeight: 'calc(100vh - 60px)' }}>
    <div style={{ maxWidth: 960, margin: '0 auto' }}>{children}</div>
  </div>
);

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<Step>(1);

  const [countryCode, setCountryCode] = useState('+86');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [identityType, setIdentityType] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [error1, setError1] = useState('');

  const [code, setCode] = useState('');
  const [sendButtonState, setSendButtonState] = useState<'init' | 'enabled' | 'countdown'>('enabled');
  const [countdown, setCountdown] = useState(0);
  const [sendMessage, setSendMessage] = useState('');
  const [error2, setError2] = useState('');
  const timerRef = useRef<number | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error3, setError3] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      setSendButtonState('countdown');
    } else {
      setSendButtonState('enabled');
    }
  }, [countdown]);

  const handleSubmitStep1 = () => {
    if (!phoneNumber) {
      setError1('请输入手机号码');
      return;
    }
    if (!identityType) {
      setError1('请选择证件类型');
      return;
    }
    if (!identityNumber) {
      setError1('请输入证件号码');
      return;
    }
    setError1('');
    setStep(2);
  };

  const handleSendCode = async () => {
    if (sendButtonState !== 'enabled') return;
    try {
      await sendForgotCode({ phoneNumber, idLast4: identityNumber.slice(-4), countryCode });
      setSendMessage('验证码已发出，请注意查收短信，你可以在120秒后重新发送');
      setCountdown(120);
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            if (timerRef.current) window.clearInterval(timerRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (e) {
      setError2('请输入正确的用户信息！');
    }
  };

  const handleSubmitStep2 = async () => {
    if (!code) {
      setError2('请输入验证码');
      return;
    }
    if (code.length < 6) {
      setError2('请输入正确验证码');
      return;
    }
    try {
      await verifyForgotCode({ phoneNumber, code });
      setError2('');
      setStep(3);
    } catch (e) {
      setError2('验证码校验失败');
    }
  };

  const handleSubmitStep3 = async () => {
    const pwdErr = validatePassword(newPassword);
    if (pwdErr) {
      setError3(pwdErr);
      return;
    }
    const matchErr = validateConfirmPassword(newPassword, confirmPassword);
    if (matchErr) {
      setError3(matchErr);
      return;
    }
    try {
      await resetPassword({ phoneNumber, newPassword });
      setError3('');
      setStep(4);
    } catch (e) {
      setError3('重置密码失败');
    }
  };

  return (
    <div data-testid="forgot-password-page">
    <Container>
      <Stepper step={step} />

      {step === 1 && (
        <div style={{ padding: 24 }}>
          <div style={inputRow}>
            <span style={labelStyle}>手机号码：</span>
            <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} style={{ padding: 8, marginRight: 8 }}>
              <option value="+86">+86</option>
            </select>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="已通过核验的手机号码"
              style={{ padding: 8, width: 280 }}
            />
          </div>
          <div style={inputRow}>
            <span style={labelStyle}>证件类型：</span>
            <select value={identityType} onChange={(e) => setIdentityType(e.target.value)} style={{ padding: 8, width: 280 }}>
              <option value="">请选择证件类型</option>
              <option value="居民身份证">居民身份证</option>
            </select>
          </div>
          <div style={inputRow}>
            <span style={labelStyle}>证件号码：</span>
            <input
              value={identityNumber}
              onChange={(e) => setIdentityNumber(e.target.value)}
              placeholder="请输入证件号码"
              style={{ padding: 8, width: 280 }}
            />
          </div>
          {error1 && <div style={errorHint}>{error1}</div>}
          <div style={{ marginTop: 16 }}>
            <button onClick={handleSubmitStep1} style={{ background: '#ff8c00', color: '#fff', border: 0, padding: '8px 24px', borderRadius: 4 }}>提交</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ padding: 24 }}>
          <div style={inputRow}>
            <span style={labelStyle}>手机号：</span>
            <span>(+86) {phoneNumber}</span>
          </div>
          <div style={inputRow}>
            <span style={labelStyle}>请填写手机验证码：</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.slice(0, 6))}
              placeholder=""
              style={{ padding: 8, width: 280, marginRight: 8 }}
            />
            {sendButtonState === 'countdown' ? (
              <div style={{ padding: '8px 16px', color: '#666' }}>{sendMessage.replace('120', String(countdown))}</div>
            ) : (
              <button
                disabled={sendButtonState !== 'enabled'}
                onClick={handleSendCode}
                style={{ padding: '8px 16px' }}
              >{sendMessage && countdown === 0 ? '重新发送' : '获取手机验证码'}</button>
            )}
          </div>
          {error2 && <div style={errorHint}>{error2}</div>}
          <div style={{ marginTop: 16 }}>
            <button onClick={handleSubmitStep2} style={{ background: '#ff8c00', color: '#fff', border: 0, padding: '8px 24px', borderRadius: 4 }}>提交</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ padding: 24 }}>
          <div style={inputRow}>
            <span style={labelStyle}>新密码：</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="需包含字母、数字、下划线中不少于两种且长度不小于6"
              style={{ padding: 8, width: 320 }}
            />
          </div>
          <div style={inputRow}>
            <span style={labelStyle}>密码确认：</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入密码"
              style={{ padding: 8, width: 320 }}
            />
          </div>
          {error3 && <div style={errorHint}>{error3}</div>}
          <div style={{ marginTop: 16 }}>
            <button onClick={handleSubmitStep3} style={{ background: '#ff8c00', color: '#fff', border: 0, padding: '8px 24px', borderRadius: 4 }}>提交</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div style={{ padding: 24 }}>
          <div style={{ color: '#ff8c00' }}>新密码设置成功，您可以使用新密码登录系统! <Link to="/login" style={{ color: '#007bff' }}>登录系统</Link></div>
        </div>
      )}
    </Container>
    </div>
  );
};

export default ForgotPasswordPage;
