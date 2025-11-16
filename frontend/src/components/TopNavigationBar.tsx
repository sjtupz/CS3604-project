import React from 'react';

const TopNavigationBar = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/src/assets/logo.png" alt="中国铁路12306" style={{ height: '40px', marginRight: '10px' }} data-testid="logo" />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>中国铁路12306</div>
          <div style={{ color: 'grey', fontSize: '12px' }}>12306 CHINA RAILWAY</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input type="text" placeholder="搜索车票、餐饮、常旅客、相关规章" style={{ width: '300px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        <button style={{ marginLeft: '10px', padding: '8px 12px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px' }}>搜索</button>
      </div>
      <div>
        <a href="#" style={{ color: 'blue', marginRight: '15px', textDecoration: 'none' }}>我的12306</a>
        <a href="#" style={{ color: 'black', marginRight: '15px', textDecoration: 'none' }}>登录</a>
        <a href="#" style={{ color: 'black', textDecoration: 'none' }}>注册</a>
      </div>
    </div>
  );
};

export { TopNavigationBar };