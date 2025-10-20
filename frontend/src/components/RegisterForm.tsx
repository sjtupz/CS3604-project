import React, { useState } from 'react';

interface RegisterFormProps {
  onRegisterSuccess?: (userData: any) => void;
  onNavigateToLogin?: () => void;
}

interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
  realName: string;
  idNumber: string;
  phoneNumber: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess = () => {},
  onNavigateToLogin = () => {}
}) => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    password: '',
    confirmPassword: '',
    realName: '',
    idNumber: '',
    phoneNumber: ''
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
      newErrors.username = '请输入用户名';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名长度至少3位';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = '用户名只能包含字母、数字和下划线';
    }

    // 验证密码
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度至少6位';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '密码必须包含字母和数字';
    }

    // 验证确认密码
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    // 验证真实姓名
    if (!formData.realName.trim()) {
      newErrors.realName = '请输入真实姓名';
    } else if (!/^[\u4e00-\u9fa5]{2,10}$/.test(formData.realName.trim())) {
      newErrors.realName = '请输入2-10位中文姓名';
    }

    // 验证身份证号码
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = '请输入身份证号码';
    } else if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(formData.idNumber)) {
      newErrors.idNumber = '请输入有效的身份证号码';
    }

    // 验证手机号码
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = '请输入手机号码';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = '请输入有效的手机号码';
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
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
          realName: formData.realName.trim(),
          idNumber: formData.idNumber.trim(),
          phoneNumber: formData.phoneNumber.trim()
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // 注册成功
        onRegisterSuccess(result.user || { username: formData.username });
        
        // 清空表单
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          realName: '',
          idNumber: '',
          phoneNumber: ''
        });
        
        alert('注册成功！请登录您的账号。');
        
      } else {
        // 注册失败
        if (result.error) {
          setErrors({ general: result.error });
        } else {
          setErrors({ general: '注册失败，请稍后重试' });
        }
      }
    } catch (error) {
      console.error('注册请求失败:', error);
      setErrors({ general: '网络错误，请稍后重试' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    onNavigateToLogin();
  };

  return (
    <div className="register-form">
      <div className="form-header">
        <h2>用户注册</h2>
        <p>创建您的12306账户</p>
      </div>
      
      {errors.general && <div className="error-message">{errors.general}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="请输入用户名"
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
        
        <div className="form-group">
          <label htmlFor="confirmPassword">确认密码</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="请再次输入密码"
            disabled={isLoading}
            required
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="realName">真实姓名</label>
          <input
            type="text"
            id="realName"
            name="realName"
            value={formData.realName}
            onChange={handleInputChange}
            placeholder="请输入真实姓名"
            disabled={isLoading}
            required
          />
          {errors.realName && <span className="error">{errors.realName}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="idNumber">身份证号</label>
          <input
            type="text"
            id="idNumber"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleInputChange}
            placeholder="请输入身份证号"
            disabled={isLoading}
            required
          />
          {errors.idNumber && <span className="error">{errors.idNumber}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phoneNumber">手机号</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="请输入手机号"
            disabled={isLoading}
            required
          />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        </div>
        
        <button 
          type="submit" 
          className="register-button"
          disabled={isLoading}
        >
          {isLoading ? '注册中...' : '立即注册'}
        </button>
      </form>
      
      <div className="form-links">
        <button 
          type="button" 
          className="link-button"
          onClick={handleLoginClick}
          disabled={isLoading}
        >
          已有账户？立即登录
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;