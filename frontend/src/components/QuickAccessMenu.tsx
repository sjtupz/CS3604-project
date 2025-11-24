import React from 'react';
import { Link } from 'react-router-dom';
import './QuickAccessMenu.css';

const QuickAccessMenu = () => {
  const menuItems = [
    { name: '首页', to: '/' },
    { name: '车票', to: '/tickets' }, // 示例路径，后续需要根据实际路由调整
    { name: '团购服务', to: '/group-service' },
    { name: '会员服务', to: '/membership' },
    { name: '站车服务', to: '/station-service' },
    { name: '商旅服务', to: '/business-travel' },
    { name: '出行指南', to: '/travel-guide' },
    { name: '信息查询', to: '/info-query' },
  ];

  return (
    <div className="quick-access-menu">
      {menuItems.map((item, index) => (
        <Link key={index} to={item.to} className="menu-item">
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export { QuickAccessMenu };