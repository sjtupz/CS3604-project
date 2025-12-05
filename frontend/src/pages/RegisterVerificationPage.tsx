import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useInRouterContext } from 'react-router-dom';
import { useCountdown } from '../hooks/useCountdown';
import { sendRegisterCode, verifyRegister } from '../api/register';
import { REGISTER_CODE_DURATION, MSG_GET_CODE_SUCCESS, MSG_ERROR_EMPTY_CODE, MSG_ERROR_INVALID_CODE, MSG_SUCCESS_REGISTER } from '../constants/registerVerification';

export function RegisterVerificationPage() {
  const [code, setCode] = useState('');
  const { secondsLeft: countdown, isDisabled: sendDisabled, reset } = useCountdown(REGISTER_CODE_DURATION);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inRouter = useInRouterContext();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const saved = typeof window !== 'undefined' ? window.localStorage.getItem('register_payload') : null;
  const savedPayload = saved ? (() => { try { return JSON.parse(saved) as Record<string, string>; } catch { return null; } })() : null;
  const phone = searchParams.get('phone') || (savedPayload?.phoneNumber ?? '');
  const username = searchParams.get('username') || (savedPayload?.username ?? '');
  const password = searchParams.get('password') || (savedPayload?.password ?? '');
  const identityType = searchParams.get('identityType') || (savedPayload?.identityType ?? '');
  const fullName = searchParams.get('fullName') || (savedPayload?.fullName ?? '');
  const identityNumber = searchParams.get('identityNumber') || (savedPayload?.identityNumber ?? '');
  const passengerType = searchParams.get('passengerType') || (savedPayload?.passengerType ?? '');
  const email = searchParams.get('email') || (savedPayload?.email ?? '');
  const didSendRef = useRef(false);

  useEffect(() => {
    setMessage(MSG_GET_CODE_SUCCESS);
    if (didSendRef.current) {
      return;
    }
    didSendRef.current = true;
    if (inRouter && phone) {
      sendRegisterCode(phone).then((res) => {
        setMessage(res.message);
      }).catch(() => {
        // 保持默认提示
      });
    }
  }, [inRouter, phone]);

  const handleResend = () => {
    setMessage(MSG_GET_CODE_SUCCESS);
    reset();
    if (inRouter && phone) {
      sendRegisterCode(phone).then((res) => {
        setMessage(res.message);
      }).catch(() => {
        // ignore error, keep default message
      });
    }
  };

  const handleNext = async () => {
    setError('');
    if (!code) {
      setError(MSG_ERROR_EMPTY_CODE);
      return;
    }
    try {
      await verifyRegister({
        phoneNumber: phone,
        code,
        username,
        password,
        identityType,
        fullName,
        identityNumber,
        passengerType,
        email,
      });
      if (typeof window !== 'undefined') {
        try { window.localStorage.removeItem('register_payload'); } catch {}
      }
      setSuccess(true);
    } catch (e) {
      const err = e as { response?: { status?: number; data?: { error?: string } } };
      const status = err.response?.status;
      const apiError = err.response?.data?.error;
      if (status === 400) {
        setError(MSG_ERROR_EMPTY_CODE);
      } else if (status === 401 || apiError === '验证码校验失败') {
        setError(MSG_ERROR_INVALID_CODE);
      } else if (status === 422) {
        setError(apiError || '请输入正确的用户信息！');
      } else {
        setError(apiError || MSG_ERROR_INVALID_CODE);
      }
    }
  };

  return (
    <div>
      {!success && (
        <div>
          <input
            placeholder="请输入短信验证码"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={handleResend} disabled={sendDisabled}>重新发送验证码</button>
          {countdown > 0 && <div>{countdown}秒后重新发送</div>}
          {message && <div>{message}</div>}
          {error && <div>{error}</div>}
          <button onClick={handleNext}>下一步</button>
        </div>
      )}
      {success && (
        inRouter ? (
          <Navigate to="/register/success" replace />
        ) : (
          <div>{MSG_SUCCESS_REGISTER}</div>
        )
      )}
    </div>
  );
}
