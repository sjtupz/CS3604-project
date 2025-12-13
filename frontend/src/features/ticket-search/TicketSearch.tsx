
import React from 'react';
import { TicketProvider } from '../../context/TicketContext';
import SearchForm from './SearchForm';
import TicketList from './TicketList';
import FilterBar from './FilterBar';
import './TicketSearch.css';

const TicketSearch: React.FC = () => {
  return (
    <TicketProvider>
      <div className="ticket-search-page">
        <h1>车票查询</h1>
        <div className="search-section">
          <SearchForm />
        </div>
        <div className="filter-section">
          <FilterBar />
        </div>
        <div className="result-section">
          <TicketList />
        </div>
      </div>
    </TicketProvider>
  );
};

export default TicketSearch;
