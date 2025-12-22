// frontend/src/components/RegisterForm.tsx
import React, { useState } from 'react';
import { Navigate, useInRouterContext, Link } from 'react-router-dom';
import { useRegisterForm } from '../hooks/useRegisterForm';
import './RegisterForm.css'; // 引入样式文件
import { PasswordStrength } from './PasswordStrength';
import { IDENTITY_TYPE_OPTIONS, PASSENGER_TYPE_OPTIONS, USERNAME_RULE_HINT, USERNAME_RULE_SUCCESS, PLACEHOLDERS, LIMITS, HINT_MESSAGES, MODAL_MESSAGES, ERROR_MESSAGES } from '../constants/registerForm';
import { AlertModal } from './AlertModal';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const inRouter = useInRouterContext();
  const [submitted, setSubmitted] = useState(false);
  const onSuccess = () => {
    setSubmitted(true);
    onRegisterSuccess();
  };
  const {
    state,
    handleInputChange,
    handleCheckboxChange,
    handleBlur,
    handleSubmit,
    clearFormError,
  } = useRegisterForm(onSuccess);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSubmitWithModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.phoneNumber) {
      setModalMessage(MODAL_MESSAGES.PHONE_REQUIRED);
      setModalVisible(true);
    } else if (!state.agreeToTerms) {
      setModalMessage(MODAL_MESSAGES.CONFIRM_TERMS);
      setModalVisible(true);
    }
    handleSubmit(e);
  };

  return (
    <form onSubmit={handleSubmitWithModal} className="register-form" aria-label="注册表单">
      <div className="form-header">
        <span className="form-header-title">账户信息</span>
      </div>
      {submitted && inRouter && (
        <Navigate
          to={`/register/verify?phone=${encodeURIComponent(state.phoneNumber)}&username=${encodeURIComponent(state.username)}&password=${encodeURIComponent(state.password)}&identityType=${encodeURIComponent(state.identityType)}&fullName=${encodeURIComponent(state.fullName)}&identityNumber=${encodeURIComponent(state.identityNumber)}&passengerType=${encodeURIComponent(state.passengerType)}&email=${encodeURIComponent(state.email || '')}`}
          replace
        />
      )}
      
      {}

      <div className="form-group">
        <label htmlFor="username">用户名</label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder={PLACEHOLDERS.USERNAME}
          value={state.username}
          onChange={handleInputChange}
          onBlur={handleBlur}
          maxLength={LIMITS.MAX_USERNAME_LENGTH}
        />
        {!state.usernameAvailable && (
          <span className="hint-message">{USERNAME_RULE_HINT}</span>
        )}
        {state.usernameAvailable && (
          <span className="success-message">{USERNAME_RULE_SUCCESS}</span>
        )}
        {state.errors.username && <span className="error-message">{state.errors.username}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">登录密码</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder={PLACEHOLDERS.PASSWORD}
          value={state.password}
          onChange={handleInputChange}
          onBlur={handleBlur}
          maxLength={LIMITS.MAX_PASSWORD_LENGTH}
        />
        <PasswordStrength strength={state.passwordStrength} />
        {state.errors.password && <span className="error-message">{state.errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">确认密码</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder={PLACEHOLDERS.CONFIRM_PASSWORD}
          value={state.confirmPassword}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        {!state.errors.confirmPassword && state.confirmPassword && state.password === state.confirmPassword && (
          <span className="success-message">✅</span>
        )}
        {state.errors.confirmPassword && <span className="error-message">{state.errors.confirmPassword}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="identityType">证件类型</label>
        <select
          id="identityType"
          name="identityType"
          value={state.identityType || '居民身份证'}
          onChange={handleInputChange}
        >
          <option value="">请选择</option>
          {IDENTITY_TYPE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {state.errors.identityType && <span className="error-message">{state.errors.identityType}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="fullName">姓名</label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          placeholder={PLACEHOLDERS.FULL_NAME}
          value={state.fullName}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        <span className="hint-message">{HINT_MESSAGES.IDENTITY_VERIFICATION}</span>
        {state.errors.fullName && <span className="error-message">{state.errors.fullName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="identityNumber">证件号码</label>
        <input
          id="identityNumber"
          type="text"
          name="identityNumber"
          placeholder={PLACEHOLDERS.IDENTITY_NUMBER}
          value={state.identityNumber}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        <span className="hint-message">{HINT_MESSAGES.IDENTITY_VERIFICATION}</span>
        {state.errors.identityNumber && <span className="error-message">{state.errors.identityNumber}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="passengerType">旅客类型</label>
        <select
          id="passengerType"
          name="passengerType"
          value={state.passengerType || '成人'}
          onChange={handleInputChange}
        >
          <option value="">请选择</option>
          {PASSENGER_TYPE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {state.errors.passengerType && <span className="error-message">{state.errors.passengerType}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">手机号码</label>
        <input
          id="phoneNumber"
          type="text"
          name="phoneNumber"
          placeholder={PLACEHOLDERS.PHONE_NUMBER}
          value={state.phoneNumber}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        <span className="hint-message">{HINT_MESSAGES.PHONE_VERIFICATION}</span>
        {state.errors.phoneNumber && <span className="error-message">{state.errors.phoneNumber}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">电子邮箱</label>
        <input
          id="email"
          type="text"
          name="email"
          placeholder={PLACEHOLDERS.EMAIL}
          value={state.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        {state.errors.email && <span className="error-message">{state.errors.email}</span>}
        {state.errors.email && <span className="error-message">{ERROR_MESSAGES.INVALID_EMAIL_ADDRESS_ALT}</span>}
      </div>

      <div className="form-group-checkbox">
        <input
          id="agreeToTerms"
          type="checkbox"
          name="agreeToTerms"
          checked={state.agreeToTerms}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="agreeToTerms">
          我已同意
          {inRouter ? (
            <Link to="/terms">《中国铁路客户服务中心网站服务条款》</Link>
          ) : (
            <a href="#" target="_blank" rel="noopener noreferrer">《中国铁路客户服务中心网站服务条款》</a>
          )}
          {inRouter ? (
            <Link to="/privacy">《隐私权政策》</Link>
          ) : (
            <a href="#" target="_blank" rel="noopener noreferrer">《隐私权政策》</a>
          )}
        </label>
        {state.errors.agreeToTerms && <div className="error-message">{state.errors.agreeToTerms}</div>}
      </div>

      <button type="submit" className="submit-button" disabled={state.isLoading}>
        {state.isLoading ? '注册中...' : '下一步'}
      </button>
      <AlertModal
        visible={modalVisible || !!state.errors.form}
        message={modalVisible ? modalMessage : state.errors.form || ''}
        onClose={() => {
          setModalVisible(false);
          clearFormError();
        }}
      />
    </form>
  );
};
