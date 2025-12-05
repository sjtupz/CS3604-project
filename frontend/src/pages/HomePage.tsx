 
import ticketFormBg from '../assets/ticket-form-bg.png';
import { TicketQueryForm } from '../components/TicketQueryForm';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page" data-testid="home-page">
      <div className="main-content" style={{ backgroundImage: `url(${ticketFormBg})` }}>
        <TicketQueryForm />
      </div>
    </div>
  );
};

export default HomePage;
