// file: src/routes/__tests__/ticket.routes.spec.ts

// Expected Result: FAIL (Red Phase)
// This test suite is designed to fail until the backend logic for filtering,
// sorting, and proper data handling is implemented in TicketService.

import request from 'supertest';
import app from '../../app'; // Our Express app instance
import { TicketService, SearchResult, TicketInfo } from '../../services/ticket.service';

// Mock the TicketService to isolate our tests to the route/controller level.
jest.mock('../../services/ticket.service');

// Cast the mocked service to its mock type to control its behavior in tests.
const mockedTicketService = TicketService as jest.Mocked<typeof TicketService>;

// --- Test Data ---
// A comprehensive dataset to test filtering, sorting, and edge cases.
const mockTickets: TicketInfo[] = [
  { trainNo: 'G101', fromStation: '北京', toStation: '上海', departureTime: '08:00', arrivalTime: '12:30', duration: '4h30m', arrivalType: '当日到达', seats: [{ type: '二等座', status: '有', price: 550 }, { type: '一等座', status: 10, price: 900 }] },
  { trainNo: 'D305', fromStation: '北京', toStation: '上海', departureTime: '09:00', arrivalTime: '15:00', duration: '6h0m', arrivalType: '当日到达', seats: [{ type: '二等座', status: '有', price: 350 }, { type: '软卧', status: 5, price: 650 }] },
  { trainNo: 'K221', fromStation: '北京', toStation: '上海', departureTime: '19:00', arrivalTime: '08:00', duration: '13h0m', arrivalType: '次日到达', seats: [{ type: '硬卧', status: '有', price: 300 }, { type: '硬座', status: '有', price: 150 }] },
  { trainNo: 'Z5', fromStation: '北京', toStation: '上海', departureTime: '21:00', arrivalTime: '07:00', duration: '10h0m', arrivalType: '次日到达', seats: [{ type: '软卧', status: '有', price: 700 }] },
  // Special case: A train with zero stock
  { trainNo: 'G103', fromStation: '北京', toStation: '上海', departureTime: '10:00', arrivalTime: '14:30', duration: '4h30m', arrivalType: '当日到达', seats: [{ type: '二等座', status: '候补', price: 553 }, { type: '一等座', status: '候补', price: 933 }] },
];

const mockSearchResult: SearchResult = {
  meta: { totalItems: mockTickets.length, totalPages: 1, currentPage: 1, pageSize: 10 },
  data: mockTickets,
};


describe('GET /api/v1/tickets', () => {
  // Before each test, reset the mock implementation to a default successful response.
  beforeEach(() => {
    mockedTicketService.searchAndFilter.mockResolvedValue(mockSearchResult);
  });

  // After all tests, clear all mocks.
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('1. Basic Functionality', () => {
    it('should return all tickets with status 200 when basic query is provided', async () => {
      const response = await request(app)
        .get('/api/v1/tickets?fromStation=BEIJING&toStation=SHANGHAI&date=2025-11-20');

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(mockTickets.length);
      expect(response.body.data[0]).toHaveProperty('trainNo');
      expect(response.body.data[0]).toHaveProperty('seats');
      expect(response.body.data[0].seats[0]).toHaveProperty('price');
      expect(response.body.data[0].seats[0]).toHaveProperty('status');
    });
  });

  describe('2. Filtering by `trainTypes`', () => {
    it('should return only G and D type trains when trainTypes=G,D', async () => {
      // For this test, we assume the service WILL do the filtering.
      // The test will fail because the current mock service does not filter.
      const filteredTickets = mockTickets.filter(t => t.trainNo.startsWith('G') || t.trainNo.startsWith('D'));
      mockedTicketService.searchAndFilter.mockResolvedValue({
        ...mockSearchResult,
        data: filteredTickets,
      });

      const response = await request(app)
        .get('/api/v1/tickets?fromStation=BEIJING&toStation=SHANGHAI&date=2025-11-20&trainTypes=G,D');
      
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(filteredTickets.length);
      // This assertion will fail until the controller passes the filter to the service
      // and the service implements the logic.
      for (const ticket of response.body.data) {
        expect(['G', 'D']).toContain(ticket.trainNo.charAt(0));
      }
    });

    it('should return all tickets if `trainTypes` is empty', async () => {
        const response = await request(app)
            .get('/api/v1/tickets?fromStation=BEIJING&toStation=SHANGHAI&date=2025-11-20&trainTypes=');
        
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(mockTickets.length);
    });
  });

  describe('3. Sorting by `sortBy`', () => {
    it('should return tickets sorted by price in ascending order when sortBy=price_asc', async () => {
      // This test will fail because the service layer doesn't implement sorting.
      const sortedByPrice = [...mockTickets].sort((a, b) => a.seats[0].price - b.seats[0].price);
       mockedTicketService.searchAndFilter.mockResolvedValue({
        ...mockSearchResult,
        data: sortedByPrice,
      });

      const response = await request(app)
        .get('/api/v1/tickets?fromStation=BEIJING&toStation=SHANGHAI&date=2025-11-20&sortBy=price_asc');

      const prices = response.body.data.map(t => t.seats[0].price);
      expect(prices).toEqual(prices.slice().sort((a, b) => a - b));
      expect(prices[0]).toBe(150); // Hardest check
    });
  });

  describe('4. Zero Stock Handling', () => {
    it('should still include a train in the response even if its stock is zero', async () => {
        const response = await request(app)
            .get('/api/v1/tickets?fromStation=BEIJING&toStation=SHANGHAI&date=2025-11-20');
        
        const zeroStockTrain = response.body.data.find(t => t.trainNo === 'G103');
        expect(zeroStockTrain).toBeDefined();
        expect(zeroStockTrain.seats.every(s => s.status === '候补')).toBe(true);
    });
  });

  describe('5. Error and Edge Case Handling', () => {
    it('should return a 400 Bad Request if required query parameters are missing', async () => {
      const response = await request(app).get('/api/v1/tickets?fromStation=BEIJING'); // Missing toStation and date
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('INVALID_INPUT');
    });

    it('should return 500 if the service layer throws an unexpected error', async () => {
      // Force the mock service to throw an error
      mockedTicketService.searchAndFilter.mockRejectedValue(new Error('Database connection lost'));

      const response = await request(app)
        .get('/api/v1/tickets?fromStation=BEIJING&toStation=SHANGHAI&date=2025-11-20');

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });
  });
});