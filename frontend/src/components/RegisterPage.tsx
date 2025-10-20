import React, { useState, useEffect } from 'react';

interface RegisterPageProps {
  onNavigateToHome: () => void;
  onNavigateToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateToHome,
  onNavigateToLogin,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    realName: '',
    idType: '居民身份证',
    idNumber: '',
    phoneNumber: '',
    email: '',
    passengerType: '成人'
  });

  // 监听浏览器后退按钮
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      onNavigateToHome();
    };

    // 添加历史记录条目
    window.history.pushState({ page: 'register' }, '', '');
    
    // 监听后退事件
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onNavigateToHome]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register attempt:', formData);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 顶部导航栏 */}
      <div style={{
        height: '60px',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        {/* 左侧Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer'
        }} onClick={onNavigateToHome}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#e74c3c',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '8px'
          }}>
            <span style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>中</span>
          </div>
          <span style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333'
          }}>中国铁路12306</span>
        </div>

        {/* 搜索框 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center'
        }}>
          <input
            type="text"
            placeholder="路线查询、车次查询、站点查询"
            style={{
              width: '300px',
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px 0 0 4px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer'
          }}>
            搜索
          </button>
        </div>

        {/* 右侧链接 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          fontSize: '14px'
        }}>
          <span style={{ color: '#666' }}>登录</span>
          <span style={{ color: '#666' }}>注册</span>
          <span style={{ color: '#666' }}>English</span>
          <span style={{ color: '#666' }}>繁體中文</span>
          <span style={{ color: '#666' }}>客服</span>
          <span style={{ color: '#666' }}>网站地图</span>
          <span style={{ color: '#666' }}>帮助</span>
        </div>
      </div>

      {/* 蓝色导航栏 */}
      <div style={{
        height: '50px',
        backgroundColor: '#4a90e2',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px'
      }}>
        <div style={{
          display: 'flex',
          gap: '30px'
        }}>
          <span style={{ color: 'white', fontSize: '14px', cursor: 'pointer' }} onClick={onNavigateToHome}>首页</span>
          <span style={{ color: 'white', fontSize: '14px' }}>车票</span>
          <span style={{ color: 'white', fontSize: '14px' }}>订餐服务</span>
          <span style={{ color: 'white', fontSize: '14px' }}>会员服务</span>
          <span style={{ color: 'white', fontSize: '14px' }}>站车服务</span>
          <span style={{ color: 'white', fontSize: '14px' }}>高铁服务</span>
          <span style={{ color: 'white', fontSize: '14px' }}>出行指南</span>
          <span style={{ color: 'white', fontSize: '14px' }}>信息查询</span>
        </div>
      </div>

      {/* 面包屑导航 */}
      <div style={{
        padding: '10px 40px',
        backgroundColor: 'white',
        fontSize: '12px',
        color: '#666',
        borderBottom: '1px solid #e0e0e0'
      }}>
        当前位置：首页 &gt; 注册 &gt; 个人注册
      </div>

      {/* 主要内容区域 */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '20px',
        backgroundColor: '#f5f5f5'
      }}>
        {/* 注册表单容器 */}
        <div style={{
          width: '800px',
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '4px'
        }}>
          {/* 表单标题 */}
          <div style={{
            backgroundColor: '#4a90e2',
            color: 'white',
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            账户注册
          </div>

          {/* 表单内容 */}
          <div style={{
            padding: '30px'
          }}>
            <form onSubmit={handleRegister}>
              {/* 用户名 */}
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', marginRight: '5px' }}>*</span>
                <label style={{ width: '100px', fontSize: '14px', color: '#333' }}>用户名：</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  style={{
                    width: '200px',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    marginRight: '20px'
                  }}
                />
                <div style={{ fontSize: '12px', color: '#999' }}>
                  支持中文、英文、数字及"_"、"-"
                </div>
              </div>

              {/* 登录密码 */}
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', marginRight: '5px' }}>*</span>
                <label style={{ width: '100px', fontSize: '14px', color: '#333' }}>登录密码：</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    width: '200px',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* 确认密码 */}
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', marginRight: '5px' }}>*</span>
                <label style={{ width: '100px', fontSize: '14px', color: '#333' }}>确认密码：</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="请再次输入登录密码"
                  style={{
                    width: '200px',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* 证件类型 */}
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', marginRight: '5px' }}>*</span>
                <label style={{ width: '100px', fontSize: '14px', color: '#333' }}>证件类型：</label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleInputChange}
                  style={{
                    width: '200px',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="居民身份证">居民身份证</option>
                  <option value="港澳居民来往内地通行证">港澳居民来往内地通行证</option>
                  <option value="台湾居民来往大陆通行证">台湾居民来往大陆通行证</option>
                </select>
              </div>

              {/* 证件号码 */}
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', marginRight: '5px' }}>*</span>
                <label style={{ width: '100px', fontSize: '14px', color: '#333' }}>证件号码：</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  style={{
                    width: '200px',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    marginRight: '20px'
                  }}
                />
                <div style={{ fontSize: '12px', color: '#999' }}>
                  请填写证件上的真实姓名
                </div>
              </div>

              {/* 真实姓名 */}
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', marginRight: '5px' }}>*</span>
                <label style={{ width: '100px', fontSize: '14px', color: '#333' }}>真实姓名：</label>
                <input
                  type="text"
                  name="realName"
                  value={formData.realName}
                  onChange={handleInputChange}
                  style={{
                    width: '200px',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* 旅客类型 */}
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', marginRight: '5px' }}>*</span>
                <label style={{ width: '100px', fontSize: '14px', color: '#333' }}>旅客类型：</label>
                <select
                  name="passengerType"
                  value={formData.passengerType}
                  onChange={handleInputChange}
                  style={{
                    width: '100px',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="成人">成人</option>
                  <option value="儿童">儿童</option>
                  <option value="学生">学生</option>
                </select>
              </div>

              {/* 备注 */}
              <div style={{ marginBottom: '20px', fontSize: '12px', color: '#666' }}>
                备注：请准确填写乘车人信息
              </div>

              {/* 手机号码 */}
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', marginRight: '5px' }}>*</span>
                <label style={{ width: '100px', fontSize: '14px', color: '#333' }}>手机号码：</label>
                <select style={{
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none',
                  width: '80px',
                  marginRight: '5px'
                }}>
                  <option value="+86">+86</option>
                </select>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="手机号码"
                  style={{
                    width: '150px',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    marginRight: '20px'
                  }}
                />
                <div style={{ fontSize: '12px', color: '#999' }}>
                  中国大陆地区请填写11位手机号码，其他地区请填写：国际区号+电话号码
                </div>
              </div>

              {/* 协议复选框 */}
              <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'flex-start' }}>
                <input
                  type="checkbox"
                  id="agreement"
                  style={{ marginRight: '8px', marginTop: '2px' }}
                />
                <label htmlFor="agreement" style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                  我已阅读并同意 <a href="#" style={{ color: '#1890ff' }}>《中国铁路客户服务中心网站服务条款》</a>、
                  <a href="#" style={{ color: '#1890ff' }}>《客运记名式车票实名制管理办法》</a> 和 
                  <a href="#" style={{ color: '#1890ff' }}>《铁路互联网购票身份核验须知》</a>
                </label>
              </div>

              {/* 注册按钮 */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  style={{
                    width: '120px',
                    padding: '12px',
                    backgroundColor: '#ff6600',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  注册
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;