/**
 * @fileoverview A reusable filter bar component for the ticket list page.
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';

// --- Type Definitions ---

/**
 * @interface FilterState
 * @description Defines the shape of the filter data.
 */
export interface FilterState {
  fromStation?: string;
  toStation?: string;
  date?: string;
  trainTypes?: string[];
  sortBy?: string;
}

/**
 * @interface FilterBarProps
 * @description Props for the FilterBar component.
 */
interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
}

/**
 * FilterBar Component
 * @param {FilterBarProps} props The component props.
 * @returns {React.ReactElement} The rendered component.
 */
export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({});

  // Effect to notify parent component of filter changes
  useEffect(() => {
    // Debounce the callback to avoid excessive re-renders
    const handler = setTimeout(() => {
      onFilterChange(filters);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filters, onFilterChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      <input
        type="text"
        name="fromStation"
        placeholder="出发站"
        onChange={handleChange}
      />
      <input
        type="text"
        name="toStation"
        placeholder="到达站"
        onChange={handleChange}
      />
      <input
        type="date"
        name="date"
        onChange={handleChange}
      />
      {/* TODO: Add more complex filter controls like multi-select for train types */}
      <select name="sortBy" onChange={handleChange}>
        <option value="departure_asc">出发时间升序</option>
        <option value="duration_asc">历时升序</option>
        <option value="price_asc">价格升序</option>
      </select>
    </div>
  );
};