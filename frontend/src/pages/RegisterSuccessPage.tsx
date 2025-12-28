import React, { useState } from 'react';
import { Navigate, useInRouterContext } from 'react-router-dom';
import './RegisterSuccessPage.css';

export function RegisterSuccessPage() {
  const [toLogin, setToLogin] = useState(false);
  const inRouter = useInRouterContext();
  return (
    <div className="success-form" data-testid="register-success-form">
      {!toLogin && (
        <div className="success-card">
          <div className="form-header">
            <span className="form-header-title">注册状态</span>
          </div>
          <div className="success-title">恭喜您，注册成功！</div>
          <div className="success-desc">您可以使用刚刚注册的账号登录系统。</div>
          <div className="success-actions">
            <button className="success-btn" onClick={() => setToLogin(true)}>登录</button>
          </div>
        </div>
      )}
      {toLogin && (inRouter ? <Navigate to="/login" replace /> : <div>登录页面</div>)}
    </div>
  );
}
