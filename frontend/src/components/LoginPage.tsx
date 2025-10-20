import React, { useState, useEffect } from 'react';

interface LoginPageProps {
  onNavigateToHome: () => void;
  onNavigateToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToHome,
  onNavigateToRegister,
}) => {
  const [activeTab, setActiveTab] = useState('account');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 监听浏览器后退按钮
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      onNavigateToHome();
    };

    // 添加历史记录条目
    window.history.pushState({ page: 'login' }, '', '');
    
    // 监听后退事件
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onNavigateToHome]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // 登录逻辑
    console.log('Login attempt:', { username, password });
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#73A1F7',
      /*backgroundImage: 'url(/example6.jpg)',*/
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundBlendMode: 'overlay'
    }}>
      {/* 顶部导航栏 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        zIndex: 10
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

        {/* 右侧欢迎文字 */}
        <div style={{
          fontSize: '16px',
          color: '#666'
        }}>
          欢迎登录12306
        </div>
      </div>

      {/* 右侧登录表单容器 */}
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '80px',
        transform: 'translateY(-50%)',
        width: '380px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '8px',
        padding: '40px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* 登录标签页 */}
        <div style={{
          display: 'flex',
          marginBottom: '30px',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <button
            style={{
              flex: 1,
              padding: '12px 0',
              border: 'none',
              background: 'none',
              fontSize: '16px',
              color: activeTab === 'scan' ? '#1890ff' : '#666',
              borderBottom: activeTab === 'scan' ? '2px solid #1890ff' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('scan')}
          >
            扫码登录
          </button>
          <button
            style={{
              flex: 1,
              padding: '12px 0',
              border: 'none',
              background: 'none',
              fontSize: '16px',
              color: activeTab === 'account' ? '#1890ff' : '#666',
              borderBottom: activeTab === 'account' ? '2px solid #1890ff' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('account')}
          >
            账号登录
          </button>
        </div>

        {/* 扫码登录内容 */}
        {activeTab === 'scan' && (
          <div style={{
            textAlign: 'center',
            padding: '20px 0'
          }}>
            <div style={{
              width: '200px',
              height: '200px',
              backgroundColor: '#f5f5f5',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e0e0e0',
              borderRadius: '8px'
            }}>
              <span style={{
                color: '#999',
                fontSize: '14px'
              }}>二维码区域</span>
            </div>
            <p style={{
              color: '#666',
              fontSize: '14px',
              margin: '0 0 10px 0'
            }}>
              请使用铁路12306手机客户端扫码登录
            </p>
          </div>
        )}

        {/* 账号登录内容 */}
        {activeTab === 'account' && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="用户名/邮箱/手机号"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#ff6600',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              立即登录
            </button>
          </form>
        )}

        {/* 底部链接 */}
        <div style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#666',
          lineHeight: '1.5'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <span>没有12306账号？</span>
            <button
              onClick={onNavigateToRegister}
              style={{
                background: 'none',
                border: 'none',
                color: '#1890ff',
                cursor: 'pointer',
                fontSize: '12px',
                textDecoration: 'underline'
              }}
            >
              立即注册
            </button>
          </div>
          <div>
            <span>登录即表示您已阅读并同意</span>
            <a href="#" style={{ color: '#1890ff', textDecoration: 'none' }}>《用户协议》</a>
            <span>和</span>
            <a href="#" style={{ color: '#1890ff', textDecoration: 'none' }}>《隐私政策》</a>
          </div>
        </div>
      </div>

      {/* 左侧内容区域 */}
      <div style={{
        position: 'absolute',
        left: '80px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'white',
        zIndex: 5
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          margin: '0 0 20px 0',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          铁路12306 - 中国铁路官方APP
        </h1>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 'normal',
          margin: '0 0 40px 0',
          color: '#ffd700',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          尽享精彩出行服务
        </h2>
        
        {/* 功能特色列表 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
          }}>
            <span style={{ marginRight: '10px' }}>✓</span>
            个人行程提醒
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
          }}>
            <span style={{ marginRight: '10px' }}>✓</span>
            积分兑换
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
          }}>
            <span style={{ marginRight: '10px' }}>✓</span>
            餐饮·特产
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
          }}>
            <span style={{ marginRight: '10px' }}>✓</span>
            车站大屏
          </div>
        </div>

        {/* 二维码区域 */}
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            backgroundColor: 'white',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '20px'
          }}>
            <span style={{
              color: '#666',
              fontSize: '12px'
            }}>二维码</span>
          </div>
          <div>
            <p style={{
              fontSize: '18px',
              margin: '0 0 5px 0',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
            }}>
              扫描左侧二维码
            </p>
            <p style={{
              fontSize: '18px',
              margin: '0',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
            }}>
              安装 铁路12306
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;