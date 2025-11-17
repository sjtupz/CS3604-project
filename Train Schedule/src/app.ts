import express, { Request, Response, NextFunction } from 'express';
import { ticketRoutes } from './routes/ticket.routes';

const app = express();
app.use(express.json());

// Register the routes
app.use('/api', ticketRoutes);

// Basic error handler for tests
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
});

export default app;