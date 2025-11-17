/**
 * @fileoverview The main component for the Ticket List page.
 * @version 1.0.0
 */

import React, { useState } from 'react';
// import { QuerySummary } from '../../components/TicketList/QuerySummary/QuerySummary';
import { FilterPanel } from '../../components/TicketList/FilterPanel/FilterPanel';
import { TicketCard } from '../../components/TicketList/TicketCard/TicketCard';
import { useTicketSearch } from '../../hooks/useTicketSearch';
import { TicketCardSkeletonList } from '../../components/TicketList/TicketCard/TicketCardSkeleton';
import { EmptyState } from '../../components/TicketList/EmptyState/EmptyState';
import styles from './TicketList.module.css';
import { DatePickerBar } from '../../components/TicketList/DatePickerBar/DatePickerBar';
import { SortBar } from '../../components/TicketList/SortBar/SortBar';
import { TicketTable } from '../../components/TicketList/TicketTable/TicketTable';
import { CitySelect } from '../../components/CitySelect/CitySelect';
// import { Pagination } from '../../components/common/Pagination'; // Placeholder for pagination component
// import { api } from '../../services/api'; // Placeholder for API client

// --- Type Definitions (as per tech spec) ---

export interface SeatInfo {
  type: string;
  status: '有' | '候补' | number | '-';
  price: number | null;
}

export interface Ticket {
  trainNo: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  arrivalType: '当日到达' | '次日到达';
  seats: SeatInfo[];
}

export interface TicketsState {
  isLoading: boolean;
  error: string | null;
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  tickets: Ticket[];
}

const initialTicketsState: TicketsState = {
  isLoading: false,
  error: null,
  meta: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  },
  tickets: [],
};

/**
 * TicketList Page Component
 * @returns {React.ReactElement} The rendered component.
 */
export const TicketList: React.FC = () => {
  const { filters, state, agg, update, retry, setPage } = useTicketSearch();
  const fromCity = filters.fromStation || '北京';
  const toCity = filters.toStation || '上海';
  const date = filters.date || new Date().toISOString().slice(0, 10);
  const rangeLabel = (() => {
    const r = filters.departureTimeRange;
    if (!r) return '00:00-24:00';
    const end = r[1] === '23:59' ? '24:00' : r[1];
    return `${r[0]}-${end}`;
  })();
  const toRange = (label?: string): [string,string] | undefined => {
    switch(label){
      case '00:00-06:00': return ['00:00','06:00'];
      case '06:00-12:00': return ['06:00','12:00'];
      case '12:00-18:00': return ['12:00','18:00'];
      case '18:00-24:00': return ['18:00','23:59'];
      case '00:00-24:00': return undefined;
      default: return undefined;
    }
  };

  return (
    <>
      <div className={styles.main}>
      <div className={styles.selectorBar}>
        <CitySelect label="出发地" value={fromCity} endpoint="departures" onConfirm={(name) => {
          if (name === toCity) return;
          update({ fromStation: name });
        }} disabledNames={[toCity]} />
        <button aria-label="互换出发地和目的地" onClick={() => update({ fromStation: toCity, toStation: fromCity })} style={{ width:32, height:32, borderRadius:16, border:'1px solid #e5e7eb', background:'#f8fafc', cursor:'pointer' }}>↔</button>
        <CitySelect label="目的地" value={toCity} endpoint="destinations" onConfirm={(name) => {
          if (name === fromCity) return;
          update({ toStation: name });
        }} disabledNames={[fromCity]} />
      </div>
      <div style={{ height: 12 }} />
      <DatePickerBar value={date} onChange={(d) => update({ date: d })} rangeLabel={rangeLabel} onRangeChange={(label) => update({ departureTimeRange: toRange(label) })} />
      <div style={{ height: 12 }} />
      <SortBar value={filters.sortBy} onChange={(v) => update({ sortBy: v }, false)} />
      <div style={{ height: 12 }} />
      <FilterPanel departureStations={agg.filters?.departureStations || []} arrivalStations={agg.filters?.arrivalStations || []} seatTypes={agg.filters?.seatTypes || []} onChange={(v) => {
        const types = v.types.includes('全部') ? [] : v.types;
        const seatTypes = v.seat && v.seat !== '全部' ? [v.seat] : undefined;
        const depStations = v.depStations && !v.depStations.includes('全部') ? v.depStations : undefined;
        const arrStations = v.arrStations && !v.arrStations.includes('全部') ? v.arrStations : undefined;
        update({ trainTypes: types, filterSeatTypes: seatTypes, filterStationsFrom: depStations, filterStationsTo: arrStations });
      }} />
      <div style={{ height: 12 }} />
      {state.loading && <TicketCardSkeletonList />}
      {state.error && (
        <div className={styles.error} aria-live="polite">
          <span>请求失败：{state.error}</span>
          <button onClick={retry}>重试</button>
        </div>
      )}
      {!state.loading && !state.error && (
        <>
          {(agg.tickets.length === 0) ? (
            <EmptyState />
          ) : (
            <TicketTable data={agg.tickets as any} />
          )}
          <div className={styles.pager}>
            <button disabled={(filters.page || 1) <= 1} onClick={() => setPage((filters.page || 1) - 1)}>上一页</button>
            <span>{agg.meta.currentPage}/{agg.meta.totalPages}</span>
            <button disabled={agg.meta.currentPage >= agg.meta.totalPages} onClick={() => setPage((filters.page || 1) + 1)}>下一页</button>
          </div>
        </>
      )}
      </div>
    </>
  );
};