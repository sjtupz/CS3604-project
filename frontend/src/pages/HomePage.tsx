import React from 'react';
import ticketFormBg from '../assets/ticket-form-bg.png';
import { TopNavigationBar } from '../components/TopNavigationBar';
import { QuickAccessMenu } from '../components/QuickAccessMenu';
import { TicketQueryForm } from '../components/TicketQueryForm';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <TopNavigationBar />
      <QuickAccessMenu />
      <div className="main-content" style={{ backgroundImage: `url(${ticketFormBg})` }}>
        <TicketQueryForm />
      </div>
    </div>
  );
};

export default HomePage;