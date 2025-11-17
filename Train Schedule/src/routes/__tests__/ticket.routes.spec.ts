// d:/Project/Final/CS3604-project/src/routes/__tests__/ticket.routes.spec.ts
// Expected Result: FAIL (Red Phase)
import request from 'supertest';
import app from '../../app';
import { TicketService } from '../../services/ticket.service';
import { mockTickets, mockSearchResult } from '../../__mocks__/ticket.mock';

// Mock the service layer. This will replace the actual TicketService with a mock constructor.


describe('Ticket Routes: GET /api/v1/tickets', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('[Happy Path] Basic Functionality', () => {
    it('should return 200 OK with a list of tickets for a valid query', async () => {
      const searchAndFilterSpy = jest.spyOn(TicketService, 'searchAndFilter').mockResolvedValue(mockSearchResult);

      // Act: Make the API request
      const response = await request(app)
        .get('/api/v1/tickets?fromStation=BEIJING&toStation=SHANGHAI&date=2025-11-20');

      // Assert: Check the response
      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.meta).toHaveProperty('totalItems');
      expect(response.body.data.length).toBeGreaterThan(0);
      
      expect(searchAndFilterSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          fromStation: '北京',
          toStation: '上海',
          date: '2025-11-20',
        })
      );
    });
  });

  describe('[Happy Path] Filtering and Sorting', () => {
    it('should return only G and D type trains when trainTypes=G,D', async () => {
        // Arrange
        const filteredTickets = mockTickets.filter(t => t.trainNo.startsWith('G') || t.trainNo.startsWith('D'));
        const searchAndFilterSpy = jest.spyOn(TicketService, 'searchAndFilter').mockResolvedValue({...mockSearchResult, data: filteredTickets});

        // Act
        const response = await request(app).get('/api/v1/tickets?fromStation=BEIJING&toStation=SHANGHAI&date=2025-11-20&trainTypes=G,D');

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.data.every((t: any) => t.trainNo.startsWith('G') || t.trainNo.startsWith('D'))).toBe(true);
        expect(searchAndFilterSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                trainTypes: ['G', 'D']
            })
        );
    });

    it('should call the service with sortBy=durationAsc', async () => {
        // Arrange
        const searchAndFilterSpy = jest.spyOn(TicketService, 'searchAndFilter').mockResolvedValue(mockSearchResult);

        // Act
        const response = await request(app).get('/api/v1/tickets?fromStation=BEIJING&toStation=SHANGHAI&date=2025-11-20&sortBy=durationAsc');

        // Assert
        expect(response.status).toBe(200);
        expect(searchAndFilterSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                sortBy: 'durationAsc'
            })
        );
    });
  });

  describe('[Sad Path] Zero Stock and Edge Cases', () => {
    it('should return tickets with has_ticket: false if onlyShowAvailable is false', async () => {
        // Arrange
        const ticketsWithNoStock = mockTickets.map(t => ({...t, has_ticket: false }));
        jest.spyOn(TicketService, 'searchAndFilter').mockResolvedValue({...mockSearchResult, data: ticketsWithNoStock});

        // Act
        const response = await request(app).get('/api/v1/tickets?fromStation=BEIJING&toStation=SHANGHAI&date=2025-11-20&onlyShowAvailable=false');

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.data.some((t: any) => t.has_ticket === false)).toBe(true);
    });

     it('should return an empty list if onlyShowAvailable is true and no tickets have stock', async () => {
        // Arrange
        jest.spyOn(TicketService, 'searchAndFilter').mockResolvedValue({...mockSearchResult, data: []});

        // Act
        const response = await request(app).get('/api/v1/tickets?fromStation=BEIJING&toStation=SHANGHAI&date=2025-11-20&onlyShowAvailable=true');

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([]);
    });
  });

  describe('[Happy Path] Caching', () => {
    it('should hit the cache on the second identical request', async () => {
      // Arrange: Spy on console.log to check for cache hit/miss messages
      // We need to unmock the service for this test to hit the actual cache logic.
      jest.restoreAllMocks(); 
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const query = '/api/v1/tickets?fromStation=BEIJING&toStation=SHANGHAI&date=2025-11-20';

      // Act 1: First request, should be a cache miss
      const response1 = await request(app).get(query);

      // Assert 1
      expect(response1.status).toBe(200);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[Cache MISS]'));
      
      // Clear mock history for the next assertion
      consoleLogSpy.mockClear();

      // Act 2: Second request, should be a cache hit
      const response2 = await request(app).get(query);

      // Assert 2
      expect(response2.status).toBe(200);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[Cache HIT]'));
      expect(response1.body).toEqual(response2.body); // Ensure data is consistent

      // Cleanup
      consoleLogSpy.mockRestore();
    });
  });

  describe('[Sad Path] Invalid Input and Errors', () => {
    // This test assumes a validation layer (e.g., express-validator, decorators) is in place.
    // Since the skeleton might not have it, this test will likely fail because the request
    // will reach the service, which will then throw a "Not Implemented" error, resulting in a 500.
    // This is acceptable for the RED phase.
    it('should return 400 Bad Request if date is missing', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/tickets?fromStation=BEIJING&toStation=SHANGHAI');
      // Assert
      expect(response.status).toBe(400);
    });

    it('should return 400 Bad Request for invalid date format', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/tickets?fromStation=BEIJING&toStation=SHANGHAI&date=2025/11/20');
      // Assert
      expect(response.status).toBe(400);
    });

    it('should return 500 Internal Server Error and silence console.error', async () => {
      // Arrange: Mock the service to throw an error and silence console
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const errorMessage = 'Database connection lost';
      jest.spyOn(TicketService, 'searchAndFilter').mockRejectedValue(new Error(errorMessage));

      // Act
      const response = await request(app)
        .get('/api/v1/tickets?fromStation=BEIJING&toStation=SHANGHAI&date=2025-11-20');

      // Assert
      expect(response.status).toBe(500);

      // Cleanup
      consoleErrorSpy.mockRestore();
    });
  });
});