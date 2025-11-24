 
import ticketFormBg from '../assets/ticket-form-bg.png';
import { QuickAccessMenu } from '../components/QuickAccessMenu';
import { TicketQueryForm } from '../components/TicketQueryForm';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page" data-testid="home-page">
      <QuickAccessMenu />
      <div className="main-content" style={{ backgroundImage: `url(${ticketFormBg})` }}>
        <TicketQueryForm />
      </div>
    </div>
  );
};

export default HomePage;
