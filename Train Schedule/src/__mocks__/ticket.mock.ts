// d:/Project/Final/CS3604-project/src/__mocks__/ticket.mock.ts
// Expected Result: This is a mock data file, not a test. It should not fail.
import { TicketInfo, SearchResult } from '../services/ticket.service';

export const mockTickets: TicketInfo[] = [
  {
    trainNo: 'G101',
    fromStation: 'BEIJING',
    toStation: 'SHANGHAI',
    departureTime: '08:00',
    arrivalTime: '12:30',
    duration: '4小时30分钟',
    arrivalType: '当日到达',
    seats: [
        { type: 'Business Class', status: 5, price: 1748 },
        { type: 'First Class', status: 10, price: 933 },
        { type: 'Second Class', status: '有', price: 553 },
    ],
  },
  {
    trainNo: 'D321',
    fromStation: 'BEIJING',
    toStation: 'SHANGHAI',
    departureTime: '09:00',
    arrivalTime: '20:45',
    duration: '11小时45分钟',
    arrivalType: '当日到达',
    seats: [
        { type: 'Sleeper', status: 15, price: 600 },
        { type: 'Second Class', status: '有', price: 350 },
    ],
  },
  {
    trainNo: 'K55',
    fromStation: 'BEIJING',
    toStation: 'SHANGHAI',
    departureTime: '19:30',
    arrivalTime: '08:15',
    duration: '12小时45分钟',
    arrivalType: '次日到达',
    seats: [
        { type: 'Hard Sleeper', status: '候补', price: 320 },
        { type: 'Hard Seat', status: '有', price: 190 },
    ],
  },
];

export const mockSearchResult: SearchResult = {
  data: mockTickets,
  meta: {
    totalItems: mockTickets.length,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  },
};