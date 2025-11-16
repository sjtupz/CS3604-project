import React from 'react';

const QuickAccessMenu = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', backgroundColor: '#f5f5f5' }}>
      <a href="#" style={{ margin: '0 15px', textDecoration: 'none', color: 'black' }}>首页</a>
      <a href="#" style={{ margin: '0 15px', textDecoration: 'none', color: 'black' }}>车票</a>
      <a href="#" style={{ margin: '0 15px', textDecoration: 'none', color: 'black' }}>团购服务</a>
      <a href="#" style={{ margin: '0 15px', textDecoration: 'none', color: 'black' }}>会员服务</a>
      <a href="#" style={{ margin: '0 15px', textDecoration: 'none', color: 'black' }}>站车生活</a>
      <a href="#" style={{ margin: '0 15px', textDecoration: 'none', color: 'black' }}>商旅服务</a>
      <a href="#" style={{ margin: '0 15px', textDecoration: 'none', color: 'black' }}>出行指南</a>
      <a href="#" style={{ margin: '0 15px', textDecoration: 'none', color: 'black' }}>信息查询</a>
    </div>
  );
};

export { QuickAccessMenu };