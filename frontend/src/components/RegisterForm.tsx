// frontend/src/components/RegisterForm.tsx
import React from 'react';
import { useRegisterForm } from '../hooks/useRegisterForm';
import './RegisterForm.css'; // 引入样式文件
import { PasswordStrength } from './PasswordStrength';
import { IDENTITY_TYPE_OPTIONS, PASSENGER_TYPE_OPTIONS } from '../constants/registerForm';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const {
    state,
    handleInputChange,
    handleCheckboxChange,
    handleBlur,
    handleSubmit,
  } = useRegisterForm(onRegisterSuccess);

  return (
    <form onSubmit={handleSubmit} className="register-form" aria-label="注册表单">
      {state.errors.form && <div className="form-error">{state.errors.form}</div>}

      <div className="form-group">
        <label htmlFor="username">* 用户名</label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="用户名设置成功后不可更改"
          value={state.username}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        {state.errors.username && <span className="error-message">{state.errors.username}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">* 登录密码</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="6-20位字母、数字或符号"
          value={state.password}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        <PasswordStrength strength={state.passwordStrength} />
        {state.errors.password && <span className="error-message">{state.errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">* 确认密码</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="再次输入您的登录密码"
          value={state.confirmPassword}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        {state.errors.confirmPassword && <span className="error-message">{state.errors.confirmPassword}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="identityType">* 证件类型</label>
        <select
          id="identityType"
          name="identityType"
          value={state.identityType}
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
        <label htmlFor="fullName">* 姓名</label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          placeholder="请输入姓名"
          value={state.fullName}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        {state.errors.fullName && <span className="error-message">{state.errors.fullName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="identityNumber">* 证件号码</label>
        <input
          id="identityNumber"
          type="text"
          name="identityNumber"
          placeholder="请输入您的证件号码"
          value={state.identityNumber}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        {state.errors.identityNumber && <span className="error-message">{state.errors.identityNumber}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="passengerType">* 旅客类型</label>
        <select
          id="passengerType"
          name="passengerType"
          value={state.passengerType}
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
        <label htmlFor="phoneNumber">* 手机号码</label>
        <input
          id="phoneNumber"
          type="text"
          name="phoneNumber"
          placeholder="手机号码"
          value={state.phoneNumber}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        {state.errors.phoneNumber && <span className="error-message">{state.errors.phoneNumber}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">电子邮箱</label>
        <input
          id="email"
          type="text"
          name="email"
          placeholder="请输入邮箱"
          value={state.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        {state.errors.email && <span className="error-message">{state.errors.email}</span>}
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
          <a href="#" target="_blank" rel="noopener noreferrer">《中国铁路客户服务中心网站服务条款》</a>
          <a href="#" target="_blank" rel="noopener noreferrer">《隐私权政策》</a>
        </label>
        {state.errors.agreeToTerms && <div className="error-message">{state.errors.agreeToTerms}</div>}
      </div>

      <button type="submit" className="submit-button" disabled={state.isLoading}>
        {state.isLoading ? '注册中...' : '下一步'}
      </button>
    </form>
  );
};
