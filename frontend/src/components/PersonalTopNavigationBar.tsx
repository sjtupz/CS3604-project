// 顶部导航栏组件
import React, { useState } from 'react';

interface TopNavigationBarProps {
  currentUser?: {
    realName?: string;
    username?: string;
  };
  onNavigate?: (target: string) => void;
  onLogout?: () => void;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  currentUser,
  onNavigate,
  onLogout
}) => {
  const [searchValue, setSearchValue] = useState('');

  // 蓝色导航栏菜单项
  const blueNavItems = [
    '首页',
    '车票',
    '团购服务',
    '会员服务',
    '站车服务',
    '商旅服务',
    '出行指南',
    '信息查询'
  ];

  const handleSearch = () => {
    // TODO: 实现搜索功能
    console.log('搜索:', searchValue);
  };

  const handleBlueNavClick = (item: string) => {
    if (item === '首页') {
      onNavigate?.('查询页');
    } else if (item === '车票') {
      onNavigate?.('车次列表页');
    } else {
      // 其他菜单项暂时不处理
      console.log('点击菜单:', item);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e8e8e8' }}>
      {/* 顶部主导航栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {/* 左侧logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => onNavigate?.('首页')}
        >
          <img
            src="/assets/12306logo.png"
            alt="12306 Logo"
            style={{
              height: '50px'
            }}
          />
        </div>

        {/* 中间搜索栏 */}
        <div
          style={{
            flex: 1,
            maxWidth: '500px',
            margin: '0 40px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="搜索车票、餐饮、常旅客、相关规章"
            style={{
              flex: 1,
              padding: '8px 15px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px 0 0 4px',
              fontSize: '14px',
              outline: 'none'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '8px 20px',
              backgroundColor: '#1890ff',
              border: 'none',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.5 10L9.5 8M10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.51472 10.5 1.5 8.48528 1.5 6C1.5 3.51472 3.51472 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6Z"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 右侧功能按键 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            fontSize: '14px'
          }}
        >
          <span
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={() => console.log('无障碍')}
          >
            无障碍
          </span>
          <span style={{ color: '#999' }}>|</span>
          <span
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={() => console.log('敬老版')}
          >
            敬老版
          </span>
          <span style={{ color: '#999' }}>|</span>
          <span
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={() => console.log('English')}
          >
            English
          </span>
          <span style={{ color: '#999' }}>|</span>
          <span
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={() => onNavigate?.('个人中心')}
          >
            我的12306
          </span>
          {currentUser?.username && (
            <>
              <span style={{ color: '#999' }}>|</span>
              <span>
                <span style={{ color: '#000' }}>您好，</span>
                <span
                  style={{ color: '#1890ff', cursor: 'pointer' }}
                  onClick={() => onNavigate?.('个人中心')}
                >
                  {currentUser.realName || currentUser.username}
                </span>
              </span>
            </>
          )}
          <span style={{ color: '#999' }}>|</span>
          <span
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={() => {
              onLogout?.();
              onNavigate?.('登录页');
            }}
          >
            退出
          </span>
        </div>
      </div>

      {/* 蓝色导航栏 */}
      <div
        style={{
          backgroundColor: '#1890ff',
          paddingLeft: '400px',
          paddingRight: '200px'
        }}
      >
        <div
          style={{
            maxWidth: 'calc(100% - 520px)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '60px',
            whiteSpace: 'nowrap'
          }}
        >
          {blueNavItems.map((item) => (
            <div
              key={item}
              onClick={() => handleBlueNavClick(item)}
              style={{
                padding: '12px 0',
                color: 'white',
                fontSize: '15px',
                cursor: 'pointer',
                borderBottom: '2px solid transparent',
                transition: 'border-color 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderBottomColor = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderBottomColor = 'transparent';
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopNavigationBar;

