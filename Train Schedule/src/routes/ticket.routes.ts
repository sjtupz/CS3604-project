/**
 * @fileoverview Ticket-related API routes.
 * @version 1.0.0
 */

import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { CityController } from '../controllers/city.controller';
// import { AuthMiddleware } from '../middlewares/auth.middleware'; // Placeholder for JWT auth
// import { ErrorMiddleware } from '../middlewares/error.middleware'; // Placeholder for error handling
// import { ValidationMiddleware } from '../middlewares/validation.middleware'; // Placeholder for validation
// import { GetTicketsDto } from '../dtos/ticket.dto'; // Placeholder for DTO

const router = Router();

/**
 * @swagger
 * /api/v1/tickets:
 *   get:
 *     summary: Retrieve a list of tickets based on search criteria
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromStation
 *         schema:
 *           type: string
 *         required: true
 *         description: Station code for the departure station.
 *       - in: query
 *         name: toStation
 *         schema:
 *           type: string
 *         required: true
 *         description: Station code for the arrival station.
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Departure date in YYYY-MM-DD format.
 *       - in: query
 *         name: trainTypes
 *         schema:
 *           type: string
 *         description: Comma-separated list of train types to filter (e.g., G,D).
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [departure_asc, duration_asc, price_asc]
 *         description: Sort order for the results.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page.
 *     responses:
 *       200:
 *         description: A paginated list of tickets.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketSearchResponse'
 *       400:
 *         description: Invalid input parameters.
 *       401:
 *         description: Unauthorized.
 */
router.get(
  '/v1/tickets',
  // AuthMiddleware.verifyToken, // TODO: Uncomment to enforce JWT authentication
  // ValidationMiddleware.validate(GetTicketsDto), // TODO: Uncomment for DTO-based validation
  TicketController.getTickets
);

// Alias route to support legacy path `/api/tickets/list`
router.get('/tickets/list', TicketController.getTickets);
router.get('/v1/tickets/list', TicketController.listWithAggregates);

// router.use(ErrorMiddleware.handle); // TODO: Register a global error handler for the ticket routes

export const ticketRoutes = router;

router.get('/v1/departures', CityController.getDepartures);
router.get('/v1/destinations', CityController.getDestinations);
router.get('/departures', CityController.getDepartures);
router.get('/destinations', CityController.getDestinations);