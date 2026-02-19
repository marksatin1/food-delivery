import express, { Request, Response } from 'express';
import cors from 'cors';
import restaurantRoutes from './routes/restaurants.js';
import menuRoutes from './routes/menu.js';
import usersRoutes from './routes/users.js';
import ordersRoutes from './routes/orders.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());    // Parses JSON request bodies

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/orders', ordersRoutes);

export default app;