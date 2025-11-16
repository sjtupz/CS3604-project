import React from 'react';
import './QuickAccessMenu.css';

const QuickAccessMenu = () => {
  const menuItems = [
    { name: '首页', href: '#' },
    { name: '车票', href: '#' },
    { name: '团购服务', href: '#' },
    { name: '会员服务', href: '#' },
    { name: '站车服务', href: '#' },
    { name: '商旅服务', href: '#' },
    { name: '出行指南', href: '#' },
    { name: '信息查询', href: '#' },
  ];

  return (
    <div className="quick-access-menu">
      {menuItems.map((item, index) => (
        <a key={index} href={item.href} className="menu-item">
          {item.name}
        </a>
      ))}
    </div>
  );
};

export { QuickAccessMenu };