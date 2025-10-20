import React, { useState } from 'react';

interface LoginFormProps {
  onLoginSuccess?: (userData: any) => void;
  onNavigateToRegister?: () => void;
}

interface LoginData {
  username: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess = () => {},
  onNavigateToRegister = () => {}
}) => {
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的错误信息
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 验证用户名
    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名、邮箱或手机号';
    }

    // 验证密码
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度至少6位';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // 登录成功
        if (result.token) {
          localStorage.setItem('token', result.token);
        }
        
        // 调用成功回调
        onLoginSuccess(result.user || { username: formData.username });
        
        // 清空表单
        setFormData({ username: '', password: '' });
        
      } else {
        // 登录失败
        if (result.error) {
          setErrors({ general: result.error });
        } else {
          setErrors({ general: '登录失败，请检查用户名和密码' });
        }
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      setErrors({ general: '网络错误，请稍后重试' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    onNavigateToRegister();
  };

  const handleForgotPassword = () => {
    alert('忘记密码功能暂未实现');
  };

  return (
    <div className="login-form">
      <div className="form-header">
        <h2>用户登录</h2>
        <p>欢迎回到中国铁路12306</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">用户名/邮箱/手机号</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="请输入用户名、邮箱或手机号"
            disabled={isLoading}
            required
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="请输入密码"
            disabled={isLoading}
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        
        {errors.general && <div className="error-message">{errors.general}</div>}
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="login-button"
        >
          {isLoading ? '登录中...' : '登录'}
        </button>
      </form>
      
      <div className="form-links">
        <button 
          type="button" 
          onClick={handleRegisterClick}
          className="link-button"
          disabled={isLoading}
        >
          还没有账户？立即注册
        </button>
        
        <button 
          type="button" 
          onClick={handleForgotPassword}
          className="link-button"
          disabled={isLoading}
        >
          忘记密码？
        </button>
      </div>
    </div>
  );
};

export default LoginForm;