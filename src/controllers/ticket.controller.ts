/**
 * @fileoverview Controller for handling ticket-related requests.
 * @version 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { TicketService } from '../services/ticket.service';
import { SearchParams } from '../services/ticket.service'; // Assuming interfaces are exported from service

// DTOs would typically be in their own files, e.g., src/dtos/ticket.dto.ts
// For simplicity, we define the expected query structure here.
interface GetTicketsQuery {
  fromStation: string;
  toStation: string;
  date: string;
  trainTypes?: string;
  sortBy?: 'departure_asc' | 'duration_asc' | 'price_asc';
  page?: string;
  pageSize?: string;
}

export class TicketController {
  /**
   * Handles the request to search and filter tickets.
   * Applies validation and calls the service layer.
   * @param req Express request object.
   * @param res Express response object.
   * @param next Express next function.
   */
  // @ExceptionDecorator() // Placeholder for a decorator that handles exceptions
  // @ValidationDecorator(GetTicketsDto) // Placeholder for a decorator that validates DTO
  public static async getTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Input validation and sanitization (a decorator or middleware is preferred)
      const query = req.query as GetTicketsQuery;
      const params: SearchParams = {
        fromStation: query.fromStation,
        toStation: query.toStation,
        date: query.date,
        trainTypes: query.trainTypes?.split(','),
        sortBy: query.sortBy,
        page: query.page ? parseInt(query.page, 10) : 1,
        pageSize: query.pageSize ? parseInt(query.pageSize, 10) : 10,
      };

      // TODO: Add robust validation logic here or via middleware/decorators.
      if (!params.fromStation || !params.toStation || !params.date) {
        res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'Missing required query parameters.' } });
        return;
      }

      // 2. Call the service layer with validated parameters
      const result = await TicketService.searchAndFilter(params);

      // 3. Format and send the successful response
      res.status(200).json(result);
    } catch (error) {
      // 4. Pass errors to the centralized error-handling middleware
      next(error);
    }
  }
}