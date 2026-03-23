import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { errorHandler, notFound } from './middlewares/error.middleware';

import authRoutes from './routes/auth.routes';
import serviceRoutes from './routes/service.routes';
// import bookingRoutes from './routes/booking.routes';
// import categoryRoutes from './routes/category.routes';

const app = express();

// Security middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.DEV_CLIENT_URL,
    credentials: true,
  })
);

// Rate limiting on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/services', serviceRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/categories', categoryRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ message: 'Happora API is running'});
});

//error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
