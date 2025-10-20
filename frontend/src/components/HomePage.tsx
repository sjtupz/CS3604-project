import React, { useState, useEffect } from 'react';

interface HomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  onNavigateToMyAccount: () => void;
}

interface User {
  id: string;
  username: string;
  realName: string;
}

const HomePage: React.FC<HomePageProps> = ({
  onNavigateToLogin,
  onNavigateToRegister,
  onNavigateToMyAccount,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [departureDate, setDepartureDate] = useState('2025-10-19');
  const [passengerType, setPassengerType] = useState('成人/儿童');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.data);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    console.log('搜索车票:', { departureCity, arrivalCity, departureDate, passengerType });
  };

  const swapCities = () => {
    const temp = departureCity;
    setDepartureCity(arrivalCity);
    setArrivalCity(temp);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        加载中...
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      fontFamily: 'Microsoft YaHei, Arial, sans-serif',
      minWidth: '1200px',
      width: '100%'
    }}>
      {/* 顶部白色导航栏 */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        padding: '0',
        width: '100%'
      }}>
        <div style={{
            width: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 20px'
          }}>
          {/* 左侧12306 logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#e74c3c',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px'
            }}>
              <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>中</span>
            </div>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              中国铁路12306
            </span>
            <span style={{ 
              fontSize: '12px', 
              color: '#999',
              marginLeft: '8px'
            }}>
              12306 CHINA RAILWAY
            </span>
          </div>

          {/* 右侧导航链接 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            {/* 小尺寸搜车票搜索框 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                placeholder="搜车票"
                style={{
                  padding: '4px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '0',
                  fontSize: '12px',
                  width: '200px'
                }}
              />
              <button style={{
                backgroundColor: '#4a90e2',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '0',
                cursor: 'pointer',
                fontSize: '12px'
              }}>
                🔍
              </button>
            </div>

            <span style={{ fontSize: '14px', color: '#666' }}>无障碍</span>
            <span style={{ fontSize: '14px', color: '#666' }}>敬老版</span>
            <span style={{ fontSize: '14px', color: '#666' }}>English</span>
            <span style={{ fontSize: '14px', color: '#666' }}>我的12306</span>
            {isLoggedIn ? (
              <span style={{ fontSize: '14px', color: '#666', cursor: 'pointer' }} onClick={onNavigateToMyAccount}>
                {user?.username}
              </span>
            ) : (
              <>
                <span 
                  style={{ fontSize: '14px', color: '#0066cc', cursor: 'pointer' }}
                  onClick={onNavigateToLogin}
                >
                  登录
                </span>
                <span 
                  style={{ fontSize: '14px', color: '#0066cc', cursor: 'pointer' }}
                  onClick={onNavigateToRegister}
                >
                  注册
                </span>
              </>
            )}
          </div>
        </div>

      </header>

        {/* 蓝色功能快捷入口 */}
        <nav style={{
          backgroundColor: '#4a90e2',
          padding: '0',
          width: '100%'
        }}>
          <div style={{
            width: '1200px',
            margin: '0 auto',
            display: 'flex',
            padding: '0 20px'
          }}>
            <button style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              fontSize: '14px',
              cursor: 'pointer',
              borderBottom: '2px solid white'
            }}>
              首页
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              车票
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              团体购票
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              全部服务
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              站车服务
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              商旅服务
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              出行指南
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              信息查询
            </button>
          </div>
        </nav>

        {/* 主体内容区域 */}
      <main style={{
        backgroundImage: 'url(/example5.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '500px',
        position: 'relative'
      }}>
        <div className="main-content" style={{
          width: '1200px',
          margin: '0 auto',
          display: 'flex',
          padding: '40px 20px',
          gap: '40px',
          minHeight: '500px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* 左侧车票查询表单 */}
          <div className="ticket-form" style={{
            backgroundColor: 'white',
            borderRadius: '0',
            padding: '30px',
            width: '520px',
            minWidth: '520px',
            maxWidth: '520px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            height: 'fit-content',
            position: 'absolute',
            left: '20px',
            top: '40px'
          }}>
            {/* 查询类型选项卡 */}
            <div style={{ 
              display: 'flex', 
              marginBottom: '20px',
              borderBottom: '1px solid #eee'
            }}>
              <button style={{
                backgroundColor: 'transparent',
                border: 'none',
                padding: '10px 20px',
                fontSize: '14px',
                color: '#4a90e2',
                borderBottom: '2px solid #4a90e2',
                cursor: 'pointer'
              }}>
                🎫 单程
              </button>
              <button style={{
                backgroundColor: 'transparent',
                border: 'none',
                padding: '10px 20px',
                fontSize: '14px',
                color: '#666',
                cursor: 'pointer'
              }}>
                ↩️ 往返
              </button>
              <button style={{
                backgroundColor: 'transparent',
                border: 'none',
                padding: '10px 20px',
                fontSize: '14px',
                color: '#666',
                cursor: 'pointer'
              }}>
                📍 中转换乘
              </button>
              <button style={{
                backgroundColor: 'transparent',
                border: 'none',
                padding: '10px 20px',
                fontSize: '14px',
                color: '#666',
                cursor: 'pointer'
              }}>
                🎯 接续换乘
              </button>
            </div>

            {/* 出发地和目的地 */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                    出发地
                  </label>
                  <input
                    type="text"
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                    placeholder="请输入出发地"
                    style={{
                       width: '100%',
                       padding: '10px',
                       border: '1px solid #ddd',
                       borderRadius: '0',
                       fontSize: '14px'
                     }}
                  />
                </div>
                <button 
                  onClick={swapCities}
                  style={{
                     backgroundColor: '#f0f0f0',
                     border: '1px solid #ddd',
                     borderRadius: '0',
                     width: '32px',
                     height: '32px',
                     cursor: 'pointer',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     marginTop: '20px'
                   }}
                >
                  ⇄
                </button>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                    到达地
                  </label>
                  <input
                    type="text"
                    value={arrivalCity}
                    onChange={(e) => setArrivalCity(e.target.value)}
                    placeholder="请输入目的地"
                    style={{
                       width: '100%',
                       padding: '10px',
                       border: '1px solid #ddd',
                       borderRadius: '0',
                       fontSize: '14px'
                     }}
                  />
                </div>
              </div>
            </div>

            {/* 出发日期和乘客类型 */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  出发日期
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  style={{
                     width: '100%',
                     padding: '10px',
                     border: '1px solid #ddd',
                     borderRadius: '0',
                     fontSize: '14px'
                   }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  学生
                </label>
                <select
                  value={passengerType}
                  onChange={(e) => setPassengerType(e.target.value)}
                  style={{
                     width: '100%',
                     padding: '10px',
                     border: '1px solid #ddd',
                     borderRadius: '0',
                     fontSize: '14px'
                   }}
                >
                  <option value="成人/儿童">成人/儿童</option>
                  <option value="学生">学生</option>
                </select>
              </div>
            </div>

            {/* 查询按钮 */}
            <button
              onClick={handleSearch}
              style={{
                width: '100%',
                backgroundColor: '#ff6600',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '0',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              查 询
            </button>
          </div>

          {/* 右侧广告宣传区域 */}
          <div style={{ 
            flex: 1, 
            position: 'relative',
            minWidth: '0'
          }}>
            {/* 保持空白，让背景图片完全显示 */}
          </div>
        </div>
      </main>

      {/* 四个模块区域 */}
      <section style={{
        backgroundColor: '#f5f5f5',
        padding: '40px 0'
      }}>
        <div style={{
          width: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          padding: '0 20px'
        }}>
          {/* 会员服务模块 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            height: '140px'
          }}>
            <div style={{
              flex: 1,
              padding: '20px',
              background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                会员服务
              </h3>
              <p style={{
                margin: '0 0 4px 0',
                fontSize: '12px',
                opacity: 0.9
              }}>
                铁路畅行 享受体验
              </p>
              <p style={{
                margin: '0',
                fontSize: '11px',
                opacity: 0.8
              }}>
                12306铁路会员积分服务
              </p>
            </div>
            <div style={{
              width: '140px',
              background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '32px' }}>🎫</span>
              </div>
            </div>
          </div>

          {/* 餐饮·特产模块 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            height: '140px'
          }}>
            <div style={{
              flex: 1,
              padding: '20px',
              background: 'linear-gradient(135deg,rgb(187, 241, 187) 0%, #32CD32 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                餐饮·特产
              </h3>
              <p style={{
                margin: '0 0 4px 0',
                fontSize: '12px',
                opacity: 0.9
              }}>
                带有温度的旅途配餐
              </p>
              <p style={{
                margin: '0',
                fontSize: '11px',
                opacity: 0.8
              }}>
                享受星级的体验和更多的味道
              </p>
            </div>
            <div style={{
              width: '140px',
              background: 'linear-gradient(135deg, #98FB98 0%, #32CD32 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '32px' }}>🍽️</span>
              </div>
            </div>
          </div>

          {/* 铁路保险模块 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            height: '140px'
          }}>
            <div style={{
              flex: 1,
              padding: '20px',
              background: 'linear-gradient(135deg, #87CEFA 0%, #4169E1 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                铁路保险
              </h3>
              <p style={{
                margin: '0 0 4px 0',
                fontSize: '12px',
                opacity: 0.9
              }}>
                用心呵护 放心出行
              </p>
              <p style={{
                margin: '0',
                fontSize: '11px',
                opacity: 0.8
              }}>
                12306铁路保险出行安全
              </p>
            </div>
            <div style={{
              width: '140px',
              background: 'linear-gradient(135deg, #87CEFA 0%, #4169E1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '32px' }}>🛡️</span>
              </div>
            </div>
          </div>

          {/* 计次·定期票模块 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            height: '140px'
          }}>
            <div style={{
              flex: 1,
              padding: '20px',
              background: 'linear-gradient(135deg, #ADD8E6 0%, #4682B4 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                计次·定期票
              </h3>
              <p style={{
                margin: '0 0 4px 0',
                fontSize: '12px',
                opacity: 0.9
              }}>
                预约购票 省时省力便捷
              </p>
              <p style={{
                margin: '0',
                fontSize: '11px',
                opacity: 0.8
              }}>
                为您提供全新的自助购票出行体验
              </p>
            </div>
            <div style={{
              width: '140px',
              background: 'linear-gradient(135deg, #ADD8E6 0%, #4682B4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '32px' }}>🚄</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;