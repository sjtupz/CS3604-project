import React from 'react';
import { TopNavigationBar } from '../components/TopNavigationBar';
import { QuickAccessMenu } from '../components/QuickAccessMenu';
import { TicketQueryForm } from '../components/TicketQueryForm';

const HomePage = () => {
  return (
    <div style={{ backgroundColor: 'white' }}>
      <TopNavigationBar />
      <QuickAccessMenu />
      <div style={{ backgroundImage: `url(/requirements/01_首页/车票查询表单背景.png)`, backgroundSize: 'cover', padding: '20px' }}>
        <TicketQueryForm />
      </div>
    </div>
  );
};

export default HomePage;