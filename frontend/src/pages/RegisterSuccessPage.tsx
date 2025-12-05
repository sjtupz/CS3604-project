import React, { useState } from 'react';
import { Navigate, useInRouterContext } from 'react-router-dom';

export function RegisterSuccessPage() {
  const [toLogin, setToLogin] = useState(false);
  const inRouter = useInRouterContext();
  return (
    <div>
      {!toLogin && (
        <div>
          <h1 style={{ textAlign: 'center' }}>恭喜您，注册成功！</h1>
          <button onClick={() => setToLogin(true)}>登录</button>
        </div>
      )}
      {toLogin && (inRouter ? <Navigate to="/login" replace /> : <div>登录页面</div>)}
    </div>
  );
}
