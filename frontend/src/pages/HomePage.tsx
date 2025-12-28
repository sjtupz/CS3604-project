 
import ticketFormBg from '../assets/ticket-form-bg.png';
import { TicketQueryForm } from '../components/TicketQueryForm';
import './HomePage.css';

const HomePage = () => {
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  return (
    <div className="home-page" data-testid="home-page">
      <div className="main-content" style={{ backgroundImage: `url(${ticketFormBg})` }}>
        <TicketQueryForm initialDate={getToday()} />
      </div>
    </div>
  );
};

export default HomePage;
