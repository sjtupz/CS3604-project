 
import ticketFormBg from '../assets/ticket-form-bg.png';
import homeVisualMain from '../assets/home-visual-main.png';
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
      <div className="visual-content">
        <img 
          src={homeVisualMain} 
          alt="首页视觉展示" 
          style={{ width: '100%', height: 'auto', display: 'block' }} 
        />
      </div>
    </div>
  );
};

export default HomePage;
